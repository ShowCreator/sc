---
title: 快速开始
order: 1
nav:
  order: 3
  title: function
  path: /function
group:
  path: /
---

### 依赖安装

```jsx
import {_promise} from './index.ts'
console.log('promise: ', _promise);
const p1 = new _promise((resolve, reject) => {
  resolve('这次一定')
})
console.log(p1, 'p1');

let p2 = new _promise((resolve, reject) => {
    reject('下次一定');
})
console.log(p2); 
import React from 'react';

export default () => 'Promise';

```
