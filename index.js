import { client } from "./src/client.js";
import { store } from "./src/store.js";
import { router } from "./src/router.js";
import { NotFound } from "./src/pages/not-found.js";
import { ItemPage } from "./src/pages/item-page.js";
import { ListPage } from "./src/pages/list-page.js";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

async function initApp() {
  const actions = { loadItems, loadList };
  const container = document.getElementById("app");

  router.registerDefaultRoute(
    (params) => new ListPage(container, store, actions, params)
  );
  router.registerRoute(
    "/list/:type/:showItems",
    (params) => new ListPage(container, store, actions, params)
  );
  router.registerRoute(
    "/item/:id",
    (params) => new ItemPage(container, store, actions, params)
  );
  router.registerRoute("404", () => new NotFound(container));
  router.init();
}

/**
 * load items and save to store
 * @param {number[]} items
 */
function loadItems(items) {
  if (!items || !items.length) {
    return;
  }

  let storedItems = store.get("items", {});

  items.forEach(async (itemId) => {
    if (!storedItems[itemId]) {
      const result = await client.getItem(itemId);
      if (result.data) {
        storedItems = store.get("items");
        store.set("items", { ...storedItems, [itemId]: result.data });
      }
    }
  });
}

/**
 * load list of items of specific type and save to store
 * @param {'top'|'best'|'job'|'new'|'ask'|'show'} type
 */
async function loadList(type) {
  const result = await client.getList(type);
  if (result.data) {
    store.set(`${type}Stories`, result.data);
  }
}
