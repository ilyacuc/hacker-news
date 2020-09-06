export class ItemPage {
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
    this.params = params;
    this.dateFormatter = new Intl.DateTimeFormat("en", {
      timeStyle: "short",
      dateStyle: "long",
    });

    this.init();
    this.render();
    this.store.on("items", this.render.bind(this));
  }

  async init() {
    const itemId = parseInt(this.params.id);
    const items = this.store.get("items", {});
    const item = items[itemId];

    if (!item) {
      this.actions.loadItems([itemId]);
    } else {
      if (item.kids && item.kids.length) {
        const limitedKids = item.kids.slice(0, 10);
        const shouldLoadKids = limitedKids.some((kidId) => !items[kidId]);
        if (shouldLoadKids) {
          this.actions.loadItems(limitedKids);
        }
      }
    }
  }

  renderItem(item) {
    if (!item) {
      return `<div>loading</div>`;
    }
    let content = "";
    if (item.text) {
      content = item.text;
    } else if (item.url) {
      content = `<a href="${item.url}" rel="noreferrer" target='_blank' class='item__link'>
                   ${item.url}
                 </a>`;
    }

    const date = this.dateFormatter.format(new Date(item.time * 1000));
    return `<div>
              <h1 class='item__title'>${item.title}</h1>
              <div class='item__description'>${date} by ${item.by}</div>
              <div class='item__content'>${content}</div>
              ${this.renderComments(item)}
            </div>`;
  }

  renderComments(item) {
    const items = this.store.get("items");
    const comments = item.kids.map((kidId) => items[kidId]).filter(Boolean);

    if (!comments.length) {
      return "";
    }

    return `<h2 class='comments__title'>Comments</h2>${comments.map(this.renderComment.bind(this)).join("")}`;
  }

  renderComment(item) {
    const date = this.dateFormatter.format(new Date(item.time * 1000));

    return `<div class='comment'>
              <div class='comment__description'>${item.by} (at ${date}):</div>
              <div class='comment__content'>${item.text}</div>
            </div>`;
  }

  render() {
    const itemId = parseInt(this.params.id);
    const items = this.store.get("items");
    this.container.innerHTML = this.renderItem(items[itemId]);
  }
}
