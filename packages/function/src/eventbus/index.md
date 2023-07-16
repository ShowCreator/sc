---
title: eventbus
order: 2
nav:
  order: 3
  title: function
  path: /function
group:
  path: /
---

### eventbus

```jsx
import { _EventBus } from '../index.ts';
let EB = new _EventBus();
// 订阅事件
EB.$on('key1', (name, age) => {
  console.info('我是订阅事件A:', name, age);
});
let id = EB.$on('key1', (name, age) => {
  console.info('我是订阅事件B:', name, age);
});
EB.$on('key2', name => {
  console.info('我是订阅事件C:', name);
});

// 发布事件key1
EB.$emit('key1', '小猪课堂', 26);
// 取消订阅事件
EB.$off('key1', id);
// 发布事件key1
EB.$emit('key1', '小猪课堂', 26);
// 发布事件
EB.$emit('key2', '小猪课堂');

import React from 'react';

export default () => 'Eventbus';
```
