/**
 * @file
 * This node app works to parse fulcrum site configs.
 */

var input = '';

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
  input += chunk;
});

process.stdin.on('end', function () {
  var cfgs    = JSON.parse(input),
      envMap  = '',
      webMap  = '',
      cnfMap  = '',
      sites   = {},
      site;

  /* make easier to address */
  for (var i = 0; i < cfgs.sites.length; i++) {
    /* if site is missing use webroot */
    if (typeof cfgs.sites[i].site === 'undefined') {
      cfgs.sites[i].site = cfgs.sites[i].site.webroot;
    }

    sites[cfgs.sites[i].site] = cfgs.sites[i];
  }

  /* add the aliases */
  for (var src in cfgs.aliases) {
    if (sites.hasOwnProperty(src)) {
      sites[cfgs.aliases[src]] = sites[src];
      sites[cfgs.aliases[src]].site = cfgs.aliases[src];
    }
  }

  for (site in sites) {
    envMap += '  ' + site + '    \'' + sites[site].env             + '\';\n';
    webMap += '  ' + site + '    \'' + sites[site].webroot         + '\';\n';
    cnfMap += '  ' + site + '    \'' + JSON.stringify(sites[site]) + '\';\n';
  }

  process.stdout.write('map $host $fulcrum_env     {\n  hostnames;\n\n' + envMap + '}\n\n');
  process.stdout.write('map $host $fulcrum_webroot {\n  hostnames;\n\n' + webMap + '}\n\n');
  process.stdout.write('map $host $fulcrum_conf    {\n  hostnames;\n\n' + cnfMap + '}\n\n');
});
