/*
 * @Author: sfy
 * @Date: 2023-05-14 10:54:17
 * @LastEditors: sfy
 * @LastEditTime: 2023-05-14 15:18:53
 * @FilePath: /show-c/src/components/Process/register/dice-er-scroll.ts
 * @Description: update here
 */
import G6 from '@antv/g6';

const {
  registerBehavior,
} = G6;


const isInBBox = (point, bbox) => {
  const {
    x,
    y
  } = point;
  const {
    minX,
    minY,
    maxX,
    maxY
  } = bbox;

  return x < maxX && x > minX && y > minY && y < maxY;
};



export const diceErScrollReg = () => {

  registerBehavior("dice-er-scroll", {
    getDefaultCfg() {
      return {
        multiple: true,
      };
    },
    getEvents() {
      return {
        itemHeight: 50,
        wheel: "scorll",
        click: "click",
        "node:mousemove": "move",
      };
    },
    scorll(e) {
      e.preventDefault();
      const {
        graph
      } = this;
      const nodes = graph.getNodes().filter((n) => {
        const bbox = n.getBBox();
  
        return isInBBox(graph.getPointByClient(e.clientX, e.clientY), bbox);
      });
      if (nodes) {
        nodes.forEach((node) => {
          const model = node.getModel();
          if (model.attrs.length < 9) {
            return;
          }
          const idx = model.startIndex || 0;
          let startX = model.startX || 0.5;
          let startIndex = idx + e.deltaY * 0.02;
          startX -= e.deltaX;
          if (startIndex < 0) {
            startIndex = 0;
          }
          if (startX > 0) {
            startX = 0;
          }
          if (startIndex > model.attrs.length - 1) {
            startIndex = model.attrs.length - 1;
          }
          graph.update(node, {
            startIndex,
            startX,
          });
        });
      }
  
  
    },
    click(e) {
      const {
        graph
      } = this;
      const {
        y
      } = e;
      const item = e.item;
      const shape = e.shape;
      if (!item) {
        return;
      }
      const model = item.getModel();
  
      if (shape.get("name") === "collapse") {
        graph.updateItem(item, {
          collapsed: true,
          size: [300, 50],
        });
        setTimeout(() => graph.layout(), 100);
      } else if (shape.get("name") === "expand") {
        graph.updateItem(item, {
          collapsed: false,
          size: [300, 500],
        });
        setTimeout(() => graph.layout(), 100);
      }
    },
    move(e) {
      const name = e.shape.get("name");
      const item = e.item;
  
      if (name && name.startsWith("item")) {
        this.graph.updateItem(item, {
          selectedIndex: Number(name.split("-")[1]),
        });
      } else {
        this.graph.updateItem(item, {
          selectedIndex: NaN,
        });
      }
    },
  });
}