class Router {
  constructor() {
    this.routes = [];
    this.notFoundRoute = null;
    this.defaultRoute = null;
  }

  /**
   * Register new route
   * @param {string} route
   * @param {Function} component
   */
  registerRoute(route, component) {
    if (route === "404") {
      this.notFoundRoute = component;
    }
    const [, resource, ...params] = route.split("/");
    const parsedParams = params.map((param) => param.substr(1));

    this.routes.push({ resource, params: parsedParams, component });
  }

  /**
   * Register default route /
   * @param {Function} component
   */
  registerDefaultRoute(component) {
    this.defaultRoute = component;
  }

  onChange() {
    if (
      (!window.location.hash || window.location.hash === "#/") &&
      this.defaultRoute
    ) {
      this.defaultRoute();
      return;
    }

    const [, resource, ...params] = window.location.hash.split("/");
    const matchedRoute = this.routes.find(
      (route) => route.resource === resource
    );

    if (matchedRoute) {
      const paramsObject = { resource };

      params.forEach((paramValue, i) => {
        if (matchedRoute.params[i]) {
          paramsObject[matchedRoute.params[i]] = paramValue;
        }
      });

      matchedRoute.component(paramsObject);
      return;
    }

    if (this.notFoundRoute) {
      this.notFoundRoute();
    }
  }

  init() {
    window.addEventListener("hashchange", this.onChange.bind(this));
    this.onChange();
  }
}

const router = new Router();
export { router };
