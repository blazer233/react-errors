export function isComponentClass(Component) {
  return Component.prototype && Component.prototype.render;
}

export function isReactMemo(Component) {
  return typeof Component !== "function" && !!Component["$$typeof"];
}

export default {
  isReactMemo,
  isComponentClass,
};
