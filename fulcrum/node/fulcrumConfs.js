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
      optMaps = {
        'fulcrum_doc_ttl' : 'map $host $fulcrum_doc_ttl {\n  hostnames;\n\n  default 3d;\n\n',
        'fulcrum_s3'      : 'map $host $fulcrum_s3      {\n  hostnames;\n\n'
      },
      envMap  = 'map $host $fulcrum_env     {\n  hostnames;\n\n',
      webMap  = 'map $host $fulcrum_webroot {\n  hostnames;\n\n',
      cnfMap  = 'map $host $fulcrum_conf    {\n  hostnames;\n\n',
      sites   = {},
      site, dest_meta, dest, opt;

  /* make easier to address */
  for (var i = 0; i < cfgs.sites.length; i++) {
    /* if site is missing use webroot */
    if (typeof cfgs.sites[i].site === 'undefined') {
      cfgs.sites[i].site = cfgs.sites[i].site.webroot;
    }

    sites[cfgs.sites[i].site] = cfgs.sites[i];
  }

  /* add aliases.json, e.g. :
    {
      "*.example.ifdev" : {"src" : "www.example.ifdev"},
      "www.foobar.ifdev" : {"src" : "www.barfoo.ifdev", "cookie_domain" : ".foobar.ifdev"}
    }
  */
  for (var dest_site in cfgs.aliases) {
    dest_meta = cfgs.aliases[dest_site];

    /* make sure src is defined for dest and src actually exist in sites */
    if (dest_meta.hasOwnProperty('src') && sites.hasOwnProperty(dest_meta.src)) {
      /* copy the src object, as string to avoid change by reference */
      dest = JSON.parse(JSON.stringify(sites[dest_meta.src]));

      /* override the site with the alias site */
      dest.site = dest_meta.site;

      /* loop over aliase overides besides the src */
      for (var attr in dest_meta) {
        if (attr !== 'src') {
          dest.pre.replace[attr] = dest_meta[attr];
        }
      }

      /* add to sites object */
      sites[dest_site] = dest;
    }
  }

  for (site in sites) {
    /* if optional maps exist then set it */
    for (opt in optMaps) {
      if (typeof sites[site][opt] !== 'undefined') {
        optMaps[opt] += '  ' + site + '    ' + JSON.stringify(sites[site][opt]) + ';\n';
      }
    }

    envMap += '  ' + site + '    \'' + sites[site].env             + '\';\n';
    webMap += '  ' + site + '    \'' + sites[site].webroot         + '\';\n';
    cnfMap += '  ' + site + '    \'' + JSON.stringify(sites[site]) + '\';\n';
  }

  for (opt in optMaps) {
    stdoutWriteMapWithEnd(optMaps[opt]);
  }

  stdoutWriteMapWithEnd(envMap);
  stdoutWriteMapWithEnd(webMap);
  stdoutWriteMapWithEnd(cnfMap);
});

function stdoutWriteMapWithEnd(str) {
  process.stdout.write(str + '}\n\n');
}