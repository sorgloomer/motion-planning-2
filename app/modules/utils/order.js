export function compare(sa, sb) {
  return sa > sb ? 1 : (sa < sb ? -1 : 0);
}
export function comparerByField(field) {
  return (a, b) => compare(a[field], b[field]);
}
export function comparerBy(selector) {
  return (a, b) => compare(selector(a), selector(b));
}
