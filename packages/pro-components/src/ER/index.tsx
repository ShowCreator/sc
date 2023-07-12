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
import styles from './index.module.less';

function ER() {
  const { graph, container } = useGraph();

  return (
    <GraphContext.Provider value={{ graph }}>
      <div className={styles.container} ref={container} />
    </GraphContext.Provider>
  );
}

export default ER;
