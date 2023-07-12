/**
 * 基于 G 的时间轴组件
 */
import { createDom, modifyCSS } from '@antv/dom-util';
import { ICanvas } from '@antv/g-base';
import { Canvas as GCanvas } from '@antv/g-canvas';
import { Canvas as GSVGCanvas } from '@antv/g-svg';
import {
  GraphData,
  IAbstractGraph as IGraph,
  IG6GraphEvent,
  ShapeStyle,
  TimeBarType,
} from '@antv/g6-core';
import { isString, throttle } from '@antv/util';
import Base, { IPluginBaseConfig } from '../base';
import { VALUE_CHANGE } from './constant';
import TrendTimeBar, { SliderOption, TickCfg } from './trendTimeBar';

// simple 版本默认高度
const DEFAULT_SIMPLE_HEIGHT = 4;

// trend 版本默认高度
const DEFAULT_TREND_HEIGHT = 26;

export interface Callback extends IG6GraphEvent {
  originValue: number[];
  value: number[];
}

interface TrendConfig {
  // 数据
  readonly data: {
    date: string;
    value: string;
  }[];
  // 位置大小
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  // 样式
  readonly smooth?: boolean;
  readonly isArea?: boolean;
  // readonly backgroundStyle?: ShapeStyle;
  readonly lineStyle?: ShapeStyle;
  readonly areaStyle?: ShapeStyle;
}

interface TimeBarConfig extends IPluginBaseConfig {
  // position size
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly padding?: number;

  readonly type?: TimeBarType;
  // 趋势图配置项
  readonly trend?: TrendConfig;
  // 滑块、及前后背景的配置
  readonly slider?: SliderOption;

  // 是否过滤边，若为 true，则需要配合边数据上有 date 字段，过滤节点同时将不满足 date 在选中范围内的边也过滤出去
  // 若为 false，则仅过滤节点以及两端节点都被过滤出去的边
  //【deprecate】，由 filterItemTypes 替代
  readonly filterEdge?: boolean;

  // 过滤的类型, ['node', 'edge'], 默认为 ['node']
  readonly filterItemTypes?: string[];

  // 容器的 CSS 样式
  readonly containerCSS?: Object;

  // 是否通过 changeData 来进行筛选，false 则使用 hideItem
  readonly changeData?: boolean;

  /** 是否置于图容器当中 */
  readonly putInGraphContainer?: boolean;

  // 当时间轴范围发生变化时的回调函数
  rangeChange?: (graph: IGraph, minValue: string, maxValue: string) => void;

  // 用户根据节点/边数据返回对应时间值的方法
  getDate?: (d: any) => number;

  // 用户根据节点/边数据返回对应 value 的方法。value 用于在 type 为 trend 的时间轴上显示趋势线
  getValue?: (d: any) => number;

  // 在过滤图元素时是否要忽略某些元素，范围 true，则忽略。否则按照正常过滤逻辑处理
  shouldIgnore?: (
    itemType: 'node' | 'edge',
    model: any,
    dateRage: { min: number; max: number },
  ) => boolean;
}

export default class TimeBar extends Base {
  constructor(config?: TimeBarConfig) {
    super(config);
  }
  private cacheGraphData: GraphData;

  public getDefaultCfgs(): TimeBarConfig {
    return {
      container: null,
      className: 'g6-component-timebar',
      padding: 10,
      type: 'trend',
      trend: {
        data: [],
        isArea: false,
        smooth: true,
      },
      slider: {
        start: 0,
        end: 0.1,
        minText: 'min',
        maxText: 'max',
      },
      filterEdge: false, // deprecate，由 filterItemTypes 替代
      filterItemTypes: ['node'],
      containerCSS: {},
      putInGraphContainer: true,
    };
  }

  /**
   * 初始化 TimeBar 的容器
   */
  public initContainer() {
    const graph: IGraph = this.get('graph');
    const { width, height, putInGraphContainer } = this._cfgs;
    const className: string = this.get('className') || 'g6-component-timebar';

    let container: HTMLDivElement | null | string = this.get('container');

    let timeBarContainer;
    if (!container) {
      timeBarContainer = createDom(`<div class='${className}'></div>`);
      modifyCSS(timeBarContainer, { position: 'relative' });
    } else {
      if (isString(container)) {
        container = document.getElementById(container) as HTMLDivElement;
      }
      timeBarContainer = container;
    }

    if (putInGraphContainer) {
      const graphContainer = this.get('graph').get('container');
      graphContainer.appendChild(timeBarContainer);
    }

    this.set('timeBarContainer', timeBarContainer);

    let canvas;
    const renderer = graph.get('renderer');
    if (renderer === 'SVG') {
      canvas = new GSVGCanvas({
        container: timeBarContainer,
        width,
        height,
      });
    } else {
      canvas = new GCanvas({
        container: timeBarContainer,
        width,
        height,
      });
    }
    // 根据传入的参数修改容器 CSS 样式
    if (this.get('containerCSS'))
      modifyCSS(timeBarContainer, this.get('containerCSS'));
    this.set('canvas', canvas);
  }

  public init() {
    this.initContainer();
    const canvas: ICanvas = this.get('canvas');
    const timeBarGroup = canvas.addGroup({
      name: 'timebar-group',
    });

    this.set('timeBarGroup', timeBarGroup);

    this.renderTrend();
    this.initEvent();
  }

  private renderTrend() {
    const {
      width,
      height,
      x,
      y,
      padding,
      type,
      trend,
      slider,
      tick,
      backgroundStyle,
      foregroundStyle,
    } = this._cfgs;
    const { data, ...other } = trend;

    const graph = this.get('graph');
    const group = this.get('timeBarGroup');
    const canvas = this.get('canvas');

    let timebar = null;
    const getValue = this.get('getValue');
    timebar = new TrendTimeBar({
      graph,
      canvas,
      group,
      type,
      x: 0,
      y: 0,
      width,
      height: height,
      blockHeight: 40,
      padding,
      backgroundStyle,
      foregroundStyle,
      trendCfg: {
        ...other,
        data: data.map(d => getValue?.(d) || d.value),
      },
      ...slider,
    });

    this.set('timebar', timebar);
  }

  private filterData(evt) {}

  private afterrenderListener = e => this.filterData({});
  private valueChangeListener = throttle(
    e => this.filterData(e), // 不可简写，否则 filterData 中 this 指针不对
    200,
    {
      trailing: true,
      leading: true,
    },
  ) as any;

  public changeData = e => {
    const graph: IGraph = this.get('graph');
    this.cacheGraphData = graph.get('data');
    this.filterData({});
  };

  private initEvent() {
    const graph: IGraph = this.get('graph');
    // 图数据变化，更新时间轴的原始数据
    graph.on('afterchangedata', this.changeData);
    // 图渲染，触发时间轴筛选
    graph.on('afterrender', this.afterrenderListener);
    // 时间轴的值发生改变的事件，触发筛选
    graph.on(VALUE_CHANGE, this.valueChangeListener);
  }

  public destroy() {
    const graph: IGraph = this.get('graph');
    graph.off('afterchangedata', this.changeData);
    graph.off('afterrender', this.afterrenderListener);
    graph.off(VALUE_CHANGE, this.valueChangeListener);
    const timebar = this.get('timebar');
    if (timebar && timebar.destory) {
      timebar.destory();
    }

    super.destroy();

    const timeBarContainer = this.get('timeBarContainer');
    if (timeBarContainer) {
      let container: HTMLElement | null = this.get('container');
      if (!container) {
        container = this.get('graph').get('container');
      }
      if (isString(container)) {
        container = document.getElementById(container) as HTMLElement;
      }
      if (container === timeBarContainer) {
        container = container.parentElement;
      }
      container.removeChild(timeBarContainer);
    }
  }
}
