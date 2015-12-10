function el(tagName, children, opt_class) {
  var r = document.createElement(tagName);
  children && children.forEach(e => {
    if (typeof e === 'string') e = document.createTextNode(e);
    r.appendChild(e);
  });
  if (opt_class) r.className = opt_class;
  return r;
}

var dataTable = null;
function createDataTable() {
  var dataTable = el('table', [
    el('tr', [
      el('th', ['time']),
      el('th', ['samples']),
      el('th', ['storage']),
      el('th', ['cost']),
      el('th', ['timeout'])
    ])
  ], 'data-table');
  document.getElementById('data-container').appendChild(dataTable);
  return dataTable;
}
function ensureTable() {
  if (!dataTable) {
    dataTable = createDataTable();
  }
  return dataTable;
}

function isObject(o) {
  return !!((typeof o === 'object') && o);
}

function num_to_str(x) {
  return '' + (0+x).toFixed(2);
}
function any_to_str(x) {
  return '' + x;
}

function appendDataToTable(data) {
  if (isObject(data)) {
    ensureTable().appendChild(
      el('tr', [
        el('td', [num_to_str(data.time)]),
        el('td', [any_to_str(data.samples)]),
        el('td', [any_to_str(data.storage)]),
        el('td', [num_to_str(data.cost)]),
        el('td', [data.timeout ? 'timeout' : ''])
      ])
    );
  }
}

function setCurrentData(data) {
  document.getElementById('data-time').textContent = num_to_str(data.time);
  document.getElementById('data-samples').textContent = any_to_str(data.samples);
  document.getElementById('data-storage').textContent = any_to_str(data.storage);
}

export default {
  appendDataToTable,
  setCurrentData
};