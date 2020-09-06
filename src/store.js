class Store {
  constructor() {
    this.storage = {};
    this.subsribers = [];
  }

  /**
   * get value from storage
   * @param {string} key
   * @param {any=} defaultValue
   * @return {any}
   */
  get(key, defaultValue) {
    if (key) {
      if (!this.storage[key] && defaultValue) {
        this.storage[key] = defaultValue;
      }
      return this.storage[key];
    }
    return this.storage;
  }

  /**
   * subscribe to store updates
   * @param {string} key
   * @param {Function} callback
   */
  on(key, callback) {
    if (typeof callback === "function") {
      this.subsribers.push({ key, callback });
    }
  }

  /**
   * set value in storage
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    this.storage[key] = value;
    this.subsribers.forEach((subscriber) => {
      if (subscriber.key === key) {
        subscriber.callback(value);
      }
    });
  }
}

const store = new Store();
export { store };
window.store=store
