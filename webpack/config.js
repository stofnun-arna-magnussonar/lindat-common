var path = require('path');

// globals need to be stringified for DefinePlugin but raw in loaders
var globals = {
  REV: function () {
    var rev = 'DEV';
    try{
      var exec = require('child_process').execSync;
      rev = exec('git rev-parse HEAD', {cwd: __dirname});
      rev = rev.toString().trim();
    } catch(e){
      console.error('Executing "git rev-parse HEAD" failed...');
    }
    return rev;
  }(),
  VERSION: require('../package.json').version,
  GA_TRACKING_CODE: 'G-NW5GP651EJ',
  PIWIK_URL: '',  //'//lindat.mff.cuni.cz/piwik/', // include trailing slash
  REST_API: 'https://repository.clarin.is/repository/rest' ,
  DEV_REST_API: 'https://repository.clarin.is/repository/rest',
  //DEV_REST_API: 'https://repository.clarin.is/repository/rest',
};

module.exports = function(env, argv){
  var debug = true === argv.debug;
  var pages = true === argv.pages;
  globals.DEBUG = debug;

  var root = path.resolve(path.join(__dirname, '..'));
  // console.log('=====================');
  // console.log('ROOT: ' + root);
  // console.log('DEBUG: ' + debug);
  // console.log('PAGES: ' + pages);
  // console.log(argv);
  // console.log('=====================');

  return {
    root: root,
    src: path.join(root, 'src'),
    dist: path.join(root, 'dist'),
    pages: path.join(root, 'pages'),
    partials: path.join(root, 'src', 'partials'),
    publicPath: debug ? '/' :
               (pages ? 'https://ufal.github.io/lindat-common/' :
                        'https://edda-ux05.rhi.hi.is/repository/xmlui/themes/UFAL/lib/lindat/'),
    globals: globals
  };

};
