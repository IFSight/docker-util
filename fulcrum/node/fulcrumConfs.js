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
      site, dest_meta, dest;

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

      /* see if we have a cookie_domain */
      if (typeof dest_meta.cookie_domain !== 'undefined') {
        dest.pre.replace.cookie_domain = dest_meta.cookie_domain;
      }

      /* add to sites object */
      sites[dest_site] = dest;
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
