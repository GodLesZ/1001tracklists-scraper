"use strict";

var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var path    = require('path');

var scraper = require('./lib/scraper');

var argv = require('yargs')
    .usage('Usage: $0 --id [num] --type [type_to_fetch] --plugin [dir]')
    .option('id', {
        alias:    'i',
        demand:   true,
        describe: '1001tracklists id'
    })
    .option('type', {
        alias:    't',
        demand:   true,
        default:  'tracklist',
        choices:  ['tracklist', 'artist'],
        describe: '1001tracklists type to fetch'
    })
    .option('plugin', {
        alias:    'p',
        demand:   true,
        describe: 'tracklist consumer',
        choices:  ['soundcloud']
    })
    .option('dir', {
        alias:    'd',
        demand:   true,
        default:  '#tracklistId/',
        describe: 'download destination'
    })
    .argv;

var fetchId             = argv.id,
    fetchType           = argv.type,
    plugin              = argv.plugin,
    pluginArgKey        = plugin + '-',
    pluginArgs          = {},
    pluginPath          = './plugin/' + plugin,
    downloadDestination = argv.dir,
    shortUrl            = 'http://1001.tl/' + fetchType + '/' + fetchId;

for (var argKey in argv) {
    if (argv.hasOwnProperty(argKey) === false || argKey.indexOf(pluginArgKey) !== 0) {
        continue;
    }

    pluginArgs[argKey] = argv[argKey];
}

downloadDestination = downloadDestination.replace(/#id/gi, fetchId);
if (path.isAbsolute(downloadDestination) === false) {
    downloadDestination = path.normalize(__dirname + '/' + downloadDestination);
}
if (fs.existsSync(downloadDestination) === false) {
    fs.mkdirSync(downloadDestination);
}

console.log('Requesting ' + shortUrl + ' ...');

scraper.scrape(shortUrl, function (err, tracks, tracklistName) {
    if (err) {
        console.error(err);
    }

    console.log('Got ' + tracks.length + ' tracks from:', tracklistName);
    console.log('Loading "' + pluginPath + '" ..');

    var plugin = require(pluginPath);
    plugin.consume(tracks, downloadDestination, pluginArgs);
});