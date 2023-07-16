class MyEventBus {
  private eventObj: Record<string, any> = {};
  constructor() {
    this.eventObj = {};
  }
  // 订阅事件,类似触发$on('key',()=>{})
  $on(name: string, callback: any) {
    if (!this.eventObj[name]) {
      this.eventObj[name] = [];
    }
    this.eventObj[name].push(callback);
  }
  // 发布事件，类似于触发事件$emit('key')
  $emit(name: string, ...args: any) {
    // 获取存储的事件回调函数数组
    const eventList = this.eventObj[name];

    for (const callback of eventList) {
      callback(...args);
    }
  }
  // 取消订阅函数，类似于$off('key1', id)
  $off(name: string, id: string) {
    delete this.eventObj[name][id];
    console.info(`id为${id}的事件已被取消订阅`);
    // 如果这是最后一个订阅者，则删除整个对象
    if (!Object.keys(this.eventObj[name]).length) {
      delete this.eventObj[name];
    }
  }
}

export default MyEventBus;
