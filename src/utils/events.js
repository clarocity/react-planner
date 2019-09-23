
export default function EventsMediator () {
  const components = new Set();

  function invokeEvent (name, source, args) {
    for (let c of components) {
      if (typeof c[name] !== 'function') continue;
      const result = c[name](source, ...args);
      if (result === false) break;
    }
  }

  const proxy = new Proxy({
    get components () {
      return components;
    }
  }, { get: function (q, key) {
    if (key in q) return q[key];
    const stub = function (...args) {
      invokeEvent(key, this, args);
    }

    proxy[key] = stub; // cache the stub for future calls
    return stub;
  }});

  proxy.bind = (component) => {
    components.add(component);
  }

  proxy.unbind = (component) => {
    this.components.remove(component);
  }

  return proxy;
}
