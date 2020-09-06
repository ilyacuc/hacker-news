const defaultParams = {
  showItems: 10,
  type: "top",
  itemsPerPage: 10,
};

export class ListPage {
  /**
   * ListPage
   * @param {HTMLElement} container
   * @param {Store} store
   * @param {Object} actions
   * @param {Object} params
   */
  constructor(container, store, actions, params) {
    this.container = container;
    this.store = store;
    this.actions = actions;
    this.params = { ...defaultParams, ...params };
    this.dateFormatter = new Intl.DateTimeFormat("en", {
      timeStyle: "short",
      dateStyle: "medium",
    });

    this.init();
    this.render();
    this.store.on(`${this.params.type}Stories`, this.init.bind(this));
    this.store.on("items", this.render.bind(this));
  }

  async init() {
    const showItems = parseInt(this.params.showItems);
    let storiesIds = this.store.get(`${this.params.type}Stories`);

    if (!storiesIds) {
      this.actions.loadList(this.params.type);
    } else {
      this.actions.loadItems(storiesIds.slice(0, showItems));
    }
  }

  renderItem(item) {
    if (!item) {
      return "";
    }

    let content = "";
    if (item.text) {
      content = `${item.text.substring(0, 100)}...`;
    } else if (item.url) {
      content = `<a href="${item.url}" rel="noreferrer" target='_blank' class='list-item__link'>
                  ${item.url.substring(0, 50)}...
                 </a>`;
    }

    const date = this.dateFormatter.format(new Date(item.time * 1000));
    return `<div class='list-item'>
              <a class='list-item__title' href='#/item/${item.id}'>${item.title}</a>
              <div class='list-item__description'>${date} by ${item.by}</div>
              <div class='list-item__preview'>${content}</div>
            </div>`;
  }

  renderShowMoreButton() {
    const showItems =
      parseInt(this.params.showItems) + parseInt(this.params.itemsPerPage);

    return `<div class='show-more-container'>
              <a class='show-more-button' href='#/list/${this.params.type}/${showItems}'>Show more</a>
            </div>`;
  }

  render() {
    const storiesIds = this.store.get(`${this.params.type}Stories`, []);
    const stories = this.store.get("items", {});
    const showItems = parseInt(this.params.showItems);

    if (!storiesIds.length) {
      this.container.innerHTML = "loading";
      return;
    }

    const itemsMarkup = storiesIds.slice(0, showItems).map((id) => this.renderItem(stories[id]));

    this.container.innerHTML = itemsMarkup.join("") + this.renderShowMoreButton();
  }
}
