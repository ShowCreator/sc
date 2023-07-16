---
title: promise
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
import { _Promise } from '../index.ts';
console.log(1);
const p1 = new _Promise((resolve, reject) => {
  console.log(2);
  setTimeout(() => {
    resolve('这次一定');
    console.log(4);
  });
  //  reject('这次buhui');
});
p1.then(
  result => {
    console.log('fulfilled:', result);
  },
  reason => {
    console.log('rejected:', reason);
  },
);
console.log(3);

import React from 'react';

export default () => 'Promise';
```
