/*
 * @Author: sfy
 * @Date: 2023-05-12 17:21:18
 * @LastEditors: sfy
 * @LastEditTime: 2023-05-14 21:26:52
 * @FilePath: /show-c/src/components/ER/index.tsx
 * @Description: update here
 */

import React, { useEffect } from 'react';
import { useGraph } from './effect';
import { GraphContext } from './utils';

function ER() {
  const { graph, container } = useGraph();

  return (
    <GraphContext.Provider value={{ graph }}>
      <div ref={container} />
    </GraphContext.Provider>
  );
}

export default ER;
