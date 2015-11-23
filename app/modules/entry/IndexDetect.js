import query from '/utils/query';
import IndexCss from '/entry/IndexCss';
import IndexBabylon from '/entry/IndexBabylon';


function contains(str, small) {
  return str.indexOf(small) >= 0;
}
function main() {
  const params = query.get_params();

  if (contains(window.location.pathname, 'experiment-2d.html')) {
    IndexCss.main(params);
  } else {
    IndexBabylon.main(params);
  }
}

export default { main };