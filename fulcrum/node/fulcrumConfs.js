var input = '';

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
  input += chunk;
});

process.stdin.on('end', function() {
  var cfgs    = JSON.parse(input),
      envMap  = '',
      webMap  = '',
      cnfMap  = '',
      site;

  for (var i = 0; i < cfgs.length; i++) {
    site = cfgs[i].webroot;

    if (typeof cfgs[i].site !== 'undefined') {
      site = cfgs[i].site;
    }

    envMap += '  ' + site + '    \'' + cfgs[i].env             + '\';\n';
    webMap += '  ' + site + '    \'' + cfgs[i].webroot         + '\';\n';
    cnfMap += '  ' + site + '    \'' + JSON.stringify(cfgs[i]) + '\';\n';
  }

  process.stdout.write('map $host $fulcrum_env     {\n  hostnames;\n\n' + envMap + '}\n\n');
  process.stdout.write('map $host $fulcrum_webroot {\n  hostnames;\n\n' + webMap + '}\n\n');
  process.stdout.write('map $host $fulcrum_conf    {\n  hostnames;\n\n' + cnfMap + '}\n\n');
});
