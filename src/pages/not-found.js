export class NotFound {
  constructor(container) {
    this.cotainer = container;
    this.render();
  }

  render() {
    this.cotainer.innerHTML = `<div>Page not found! <a href='#/list/top'>Check out</a> our top articles</div>`;
  }
}
