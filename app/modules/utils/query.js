function get_params_from_url(query) {
  const result = new Map();
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    result.set(decodeURIComponent(pair[0]), decodeURIComponent(pair[1]));
  }
  return result;
}

function get_params() {
  return get_params_from_url(window.location.search.substring(1));
}

export default {
  get_params, get_params_from_url
};