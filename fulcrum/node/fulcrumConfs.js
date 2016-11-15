// read each json file in conf directory
var fs      = require('fs'),
    cfg_dir = process.argv[2],
    cnfMap = '',
    envMap = '',
    webMap = '',
    cfgs,
    site;

if (cfg_dir !== undefined) {
  cfgs    = fs.readdirSync(cfg_dir);

  for (var i = 0; i < cfgs.length; i++) {
    if (cfgs[i].match(/\.json$/)) {
      conf = require(cfg_dir + '/' + cfgs[i]);
      site = cfgs[i].replace(/\.json$/, '');
      envMap += '  ' + site + '    \'' + conf.env             + '\';\n';
      webMap += '  ' + site + '    \'' + conf.webroot         + '\';\n';
      cnfMap += '  ' + site + '    \'' + JSON.stringify(conf) + '\';\n';
    }
  }

  process.stdout.write('map $host $fulcrum_env     {\n  hostnames;\n\n' + envMap + '}\n\n');
  process.stdout.write('map $host $fulcrum_webroot {\n  hostnames;\n\n' + webMap + '}\n\n');
  process.stdout.write('map $host $fulcrum_conf    {\n  hostnames;\n\n' + cnfMap + '}\n');
} else {
  process.stdout.write('USAGE: ' + process.argv[1] + ' <CONFDIR>\n');
}