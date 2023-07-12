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
console.log(1);
const p1 = new _promise((resolve, reject) => {
console.log(2);
  resolve('这次一定');
  //  reject('这次buhui');
})
p1.then(
    result => {
        console.log('fulfilled:', result);
    },
    reason => {
        console.log('rejected:', reason)
    }
)
console.log(3);

// let p2 = new _promise((resolve, reject) => {
//     reject('下次一定');
// })
// console.log(p2); 
import React from 'react';

export default () => 'Promise';

```
