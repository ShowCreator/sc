class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  private PromiseState = null;
  private PromiseResult = null;

  constructor(func) {
    this.PromiseState = MyPromise.PENDING;
    func(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(result) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.FULFILLED;
      this.PromiseResult = result;
    }
  }
  reject(reason) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.REJECTED;
      this.PromiseResult = reason;
    }
  }
}

export default MyPromise;
