import { Event, IGroup, ICanvas, IShape } from '@antv/g-base';
import { get, size, assign, each, isNumber } from '@antv/util';
import { ext } from '@antv/matrix-util';
import Handler from './handler';
import { ShapeStyle, IAbstractGraph as IGraph } from '@antv/g6-core';
import {
  VALUE_CHANGE,
  TIMELINE_START,
  TIMEBAR_CONFIG_CHANGE,
  PLAY_PAUSE_BTN,
  NEXT_STEP_BTN,
  PRE_STEP_BTN,
  TIMELINE_END,
} from './constant';

const transform = ext.transform;

/**
 * 一些默认的样式配置
 */

export const BACKGROUND_STYLE = {
  fill: '#416180',
  opacity: 0.05,
};

export const FOREGROUND_STYLE = {
  fill: '#5B8FF9',
  opacity: 0.3,
  cursor: 'grab',
};

export const DEFAULT_HANDLER_WIDTH = 2;

export const HANDLER_STYLE = {
  width: DEFAULT_HANDLER_WIDTH,
  height: 24,
};

export const TEXT_STYLE = {
  textBaseline: 'middle',
  fill: '#000',
  opacity: 0.45,
};

export const TICK_LABEL_STYLE = {
  textAlign: 'center',
  textBaseline: 'top',
  fill: '#607889',
  opacity: 0.35,
};
export const TICK_LINE_STYLE = {
  lineWidth: 1,
  stroke: '#ccc',
};

export type SliderOption = Partial<{
  readonly width?: number;
  readonly height?: number;
  readonly blockHeight?: number;
  readonly backgroundStyle?: ShapeStyle;
  readonly foregroundStyle?: ShapeStyle;
  // 滑块样式
  readonly handlerStyle?: {
    width?: number;
    height?: number;
    style?: ShapeStyle;
  };
  readonly textStyle?: ShapeStyle;
  // 初始位置
  readonly start: number;
  readonly end: number;
  // 滑块文本
  readonly minText: string;
  readonly maxText: string;
}>;

export type TickCfg = {
  readonly ticks?: {
    date: string;
    value: string;
  }[];
  readonly tickLabelStyle?: ShapeStyle;
  readonly tickLineStyle?: ShapeStyle;
};

interface TrendTimeBarConfig extends SliderOption {
  readonly graph: IGraph;
  readonly canvas: ICanvas;
  readonly group: IGroup;
  // position size
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly padding: number;
  readonly type: 'trend' | 'simple';
  // style
  readonly backgroundStyle?: ShapeStyle;
  readonly foregroundStyle?: ShapeStyle;
  readonly tick?: TickCfg;

  // 自定义标签格式化函数
}

export default class TrendTimeBar {
  private group: IGroup;

  private graph: IGraph;

  private canvas: ICanvas;

  // 位置大小配置
  public x: number;

  public y: number;

  public width: number;

  public height: number;

  public blockHeight: number;

  private padding: number;

  // 样式配置
  private backgroundStyle: any;

  private foregroundStyle: any;

  /* 前景框，选中的区域 */
  private foregroundShape: IShape;

  // 交互相关的数据信息
  private start: number;

  private end: number;

  private currentHandler: Handler | IShape;

  private prevY: number = 0;

  private centerX: number = 0;
  private centerY: number = 0;

  constructor(cfg: TrendTimeBarConfig) {
    const {
      x = 0,
      y = 0,
      width = 100,
      height,
      blockHeight,
      padding = 10,
      backgroundStyle = {},
      foregroundStyle = {},
      // 缩略轴的初始位置
      start = 0,
      end = 1,
      group,
      graph,
      canvas,
    } = cfg;
    console.log('cfg: ', cfg);

    this.graph = graph;
    this.canvas = canvas;
    this.group = group;
    this.blockHeight = blockHeight;
    // position size
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.padding = padding;
    // style
    this.backgroundStyle = { ...BACKGROUND_STYLE, ...backgroundStyle };

    this.foregroundStyle = { ...FOREGROUND_STYLE, ...foregroundStyle };

    // 初始信息
    this.start = start;
    this.end = end;

    this.renderSlider();
  }

  /**
   * 更新配置
   * @param cfg
   */
  public update(cfg: Partial<TrendTimeBarConfig>) {
    const { x, y, width, height, minText, maxText, start, end } = cfg;

    // start、end 只能是 0~1 范围
    this.start = Math.min(1, Math.max(start, 0));
    this.end = Math.min(1, Math.max(end, 0));

    // 如果传了则更新，没有传则不更新
    // @ts-ignore
    assign(this, {
      x,
      y,
      width,
      height,
      minText,
      maxText,
    });

    // 更新 ui，不自动绘制
    this.updateUI();
  }

  /**
   * 初始化组件结构
   * @private
   */
  private renderSlider() {
    const { width, height } = this;
    const sliderGroup = this.group.addGroup({
      name: 'slider-group',
    });

    // 1. 背景
    sliderGroup.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height: this.height,
        ...this.backgroundStyle,
      },
      name: 'background',
    });

    // 3. 前景 选中背景框
    this.foregroundShape = this.group.addGroup().addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height: this.blockHeight,
        ...this.foregroundStyle,
      },
      name: 'foreground-shape',
    });
    this.foregroundShape.on('mousedown', e => {
      e.target.attr('cursor', 'grabbing');
    });
    this.foregroundShape.on('mouseup', e => {
      e.target.attr('cursor', this.foregroundStyle.cursor || 'grab');
    });

    // 初始化 minText 和 maxText，方便计算它们的 bbox
    this.updateStartEnd(0);

    // 根据 start end 更新 ui 的位置信息
    this.updateUI();

    // 移动到对应的位置
    sliderGroup.move(this.x, this.y);

    // 绑定事件鼠标事件
    this.bindEvents();
  }

  /**
   * 绑定事件：
   *  - 点击
   *  - 滑动
   *  - 拖拽
   *  - 滚动
   * @private
   */
  private bindEvents() {
    // 3. 前景选中区域
    this.foregroundShape.on(
      'mousedown',
      this.onMouseDown(this.foregroundShape),
    );
    this.foregroundShape.on(
      'touchstart',
      this.onMouseDown(this.foregroundShape),
    );
  }

  private onMouseDown = (handler: Handler | IShape) => (e: Event) => {
    // 1. 记录点击的滑块
    this.currentHandler = handler;

    const event = e.originalEvent as MouseEvent;

    const { x: centerX, y: centerY } = this.graph.getGraphCenterPoint();
    this.centerX = centerX;
    this.centerY = centerY;
    // 2. 存储当前点击位置
    event.stopPropagation();
    event.preventDefault();

    // 兼容移动端获取数据
    this.prevY = get(event, 'touches.0.pageY', event.pageY);

    // 3. 开始滑动的时候，绑定 move 和 up 事件
    const containerDOM = this.canvas.get('container');

    containerDOM.addEventListener('mousemove', this.onMouseMove);
    containerDOM.addEventListener('mouseup', this.onMouseUp);
    containerDOM.addEventListener('mouseleave', this.onMouseUp);

    // 移动端事件
    containerDOM.addEventListener('touchmove', this.onMouseMove);
    containerDOM.addEventListener('touchend', this.onMouseUp);
    containerDOM.addEventListener('touchcancel', this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    // 滑动过程中，计算偏移，更新滑块，然后 emit 数据出去
    e.stopPropagation();
    e.preventDefault();
    const y = e.pageY
    console.log('y : ', y , this.prevY);
    // 横向的 slider 只处理 x
    const offsetY = y - this.prevY;
    console.log('offsetY: ', offsetY);
    const offsetXRange = this.adjustOffsetRange(offsetY / this.height);
    console.log('offsetXRange: ', offsetXRange);
    if (offsetXRange > 0) {
      this.graph.translate(0, 5);
    }
    if (offsetXRange < 0) {
      this.graph.translate(0, -5);
    }

    // 更新 start end range 范围
    this.updateStartEnd(offsetXRange);
    // 更新 ui
    this.updateUI();

    this.prevY = y;
  };

  private onMouseUp = () => {
    // 结束之后，取消绑定的事件
    if (this.currentHandler) {
      this.currentHandler = undefined;
    }

    const containerDOM = this.canvas.get('container');
    if (containerDOM) {
      containerDOM.removeEventListener('mousemove', this.onMouseMove);
      containerDOM.removeEventListener('mouseup', this.onMouseUp);
      // 防止滑动到 canvas 外部之后，状态丢失
      containerDOM.removeEventListener('mouseleave', this.onMouseUp);

      // 移动端事件
      containerDOM.removeEventListener('touchmove', this.onMouseMove);
      containerDOM.removeEventListener('touchend', this.onMouseUp);
      containerDOM.removeEventListener('touchcancel', this.onMouseUp);
    }
  };

  /**
   * 调整 offsetRange，因为一些范围的限制
   * @param offsetRange
   */
  private adjustOffsetRange(offsetRange: number): number {
    // 针对不同的滑动组件，处理的方式不同
    switch (this.currentHandler) {
      case this.foregroundShape: {
        const min = 0 - this.start;
        const max = 1 - this.end;

        return Math.min(max, Math.max(min, offsetRange));
      }
      default:
        return 0;
    }
  }

  /**
   * 更新起始、结束的控制块位置、文本、范围值（原始值）
   * @param offsetRange
   */
  private updateStartEnd(offsetRange: number) {
    // 操作不同的组件，反馈不一样
    switch (this.currentHandler) {
      case this.foregroundShape:
        this.start += offsetRange;
        this.end += offsetRange;
        break;
      default:
        break;
    }
  }

  /**
   * 根据移动的比例来更新 ui，更新范围（0-1 范围的比例值）
   * @private
   */
  private updateUI() {
    if (this.start < 0) {
      this.start = 0;
    }
    if (this.start > 1) {
      this.start = 1;
    }
    if (this.end > 1) {
      this.end = 1;
    }
    if (this.end < 0) {
      this.end = 0;
    }

    const min = this.y + this.start * this.height;
    // const max = this.y + this.end * this.height;

    this.foregroundShape.attr('y', min);
  }

  public destory() {
    this.graph.off(VALUE_CHANGE, () => {
      /* do nothing */
    });

    const group = this.group;

    // 3. 前景选中区域
    this.foregroundShape.off('mousedown');
    this.foregroundShape.off('touchstart');
    this.foregroundShape.destroy();

    group.off(`${PLAY_PAUSE_BTN}:click`);
    group.off(`${NEXT_STEP_BTN}:click`);
    group.off(`${PRE_STEP_BTN}:click`);
    group.off(TIMEBAR_CONFIG_CHANGE);
    group.destroy();
  }
}
