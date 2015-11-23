import query from '/utils/query';
import IndexCss from '/IndexCss';
import IndexBabylon from '/IndexBabylon';


function main() {
  const params = query.get_params();
  if (params.get('mode') === 'css') {
    IndexCss.main(params);
  } else {
    IndexBabylon.main(params);
  }
}

export default { main };