class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  private PromiseState = null;
  private PromiseResult = null;
  private onFulfilledCallbacks = [];
  private onRejectedCallbacks = [];

  constructor(func) {
    this.PromiseState = MyPromise.PENDING;
    this.PromiseResult = null;
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  resolve(result) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.FULFILLED;
      this.PromiseResult = result;
      this.onFulfilledCallbacks.forEach(callback => {
        callback(result);
      });
    }
  }
  reject(reason) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.REJECTED;
      this.PromiseResult = reason;
      this.onRejectedCallbacks.forEach(callback => {
        callback(reason);
      });
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason;
          };

    if (this.PromiseState === MyPromise.PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }

    if (this.PromiseState === MyPromise.FULFILLED) {
      setTimeout(() => {
        onFulfilled(this.PromiseResult);
      });
    }
    if (this.PromiseState === MyPromise.REJECTED) {
      setTimeout(() => {
        onRejected(this.PromiseResult);
      });
    }
  }
}

export default MyPromise;
