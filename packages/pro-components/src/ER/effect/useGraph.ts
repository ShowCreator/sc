/*
 * @Author: sfy
 * @Date: 2023-05-12 23:25:19
 * @LastEditors: sfy
 * @LastEditTime: 2023-05-14 11:35:31
 * @FilePath: /sqlG/src/Process/effect/useGraph.ts
 * @Description: update here
 */

import G6, { Graph } from '@antv/g6';
import { useEffect, useRef, useState } from 'react';
import { register } from '../register';
import { data } from '../data';
import G6Pplugin from '../../G6P/plugins';
const timeBarData = [];

for (let i = 0; i < 100; i++) {
  timeBarData.push({
    date: `2020${i}`,
    value: Math.round(Math.random() * 300),
  });
}
const timebar = new G6Pplugin.TimeBar({
  x: 0,
  y: 0,
  width: 20,
  height: 400,
  padding: 10,
  type: 'trend',
  trend: {
    data: [],
  },
});
export const useGraph = () => {
  const [graph, setGraph] = useState<Graph>();
  const container = useRef<HTMLDivElement>();

  useEffect(() => {
    register();
    const g = new G6.Graph({
      container: container.current,
      width: 400,
      height: 400,
      defaultNode: {
        size: [300, 400],
        type: 'dice-er-box',
        color: '#5B8FF9',
        style: {
          fill: '#9EC9FF',
          lineWidth: 3,
        },
        labelCfg: {
          style: {
            fill: 'black',
            fontSize: 20,
          },
        },
      },
      defaultEdge: {
        type: 'dice-er-edge',
        style: {
          stroke: '#e2e2e2',
          lineWidth: 4,
          endArrow: true,
        },
      },
      modes: {
        default: ['dice-er-scroll', 'drag-node', 'drag-canvas'],
      },
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        align: 'UL',
        controlPoints: true,
        nodesepFunc: () => 0.2,
        ranksepFunc: () => 0.5,
      },
      plugins: [timebar],
      fitView: true,
    });
    setGraph(g);
    g.data(data);
    g.render();
    return () => {
      g.destroy();
    };
  }, []);

  return {
    graph,
    container,
  };
};
