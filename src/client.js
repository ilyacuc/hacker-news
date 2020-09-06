class Client {
  constructor() {
    this.baseUrl = "https://hacker-news.firebaseio.com/v0/";
    this.request = async (endpoint, method = "GET") => {
      return await fetch(`${this.baseUrl}${endpoint}.json`, {
        method,
      })
        .then((response) => response.json())
        .then((data) => {
          return {
            data,
          };
        })
        .catch((error) => {
          return {
            error,
          };
        });
    };
  }
  /**
   * get list of items of specific type
   * @param {'top'|'best'|'job'|'new'|'ask'|'show'} type
   */
  async getList(type) {
    return await this.request(`${type}stories`);
  }

  /**
   * get item
   * @param {number} itemId
   */
  async getItem(itemId) {
    return await this.request(`item/${itemId}`);
  }
}

const client = new Client();

export { client };
