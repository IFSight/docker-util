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
      cnfMap  = '';

  for (var i = 0; i < cfgs.length; i++) {
    envMap += '  ' + cfgs[i].webroot + '    \'' + cfgs[i].env             + '\';\n';
    webMap += '  ' + cfgs[i].webroot + '    \'' + cfgs[i].webroot         + '\';\n';
    cnfMap += '  ' + cfgs[i].webroot + '    \'' + JSON.stringify(cfgs[i]) + '\';\n';
  }

  process.stdout.write('map $host $fulcrum_env     {\n  hostnames;\n\n' + envMap + '}\n\n');
  process.stdout.write('map $host $fulcrum_webroot {\n  hostnames;\n\n' + webMap + '}\n\n');
  process.stdout.write('map $host $fulcrum_conf    {\n  hostnames;\n\n' + cnfMap + '}\n\n');
});
