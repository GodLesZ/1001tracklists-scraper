"use strict";

var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var path    = require('path');

var scraper = require('./lib/scraper');

var argv = require('yargs')
    .usage('Usage: $0 --id [num] --plugin [string]')
    .option('id', {
        alias:    'i',
        demand:   true,
        describe: '1001tracklists id'
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

var tracklistId             = argv.id,
    tracklistConsumer       = argv.plugin,
    tracklistConsumerArgKey = tracklistConsumer + '-',
    tracklistConsumerArgs   = {},
    downloadDestination     = argv.dir,
    pluginPath              = './plugin/' + tracklistConsumer,
    shortUrl                = 'http://1001.tl/' + tracklistId;

for (var argKey in argv) {
    if (argv.hasOwnProperty(argKey) === false || argKey.indexOf(tracklistConsumerArgKey) !== 0) {
        continue;
    }

    tracklistConsumerArgs[argKey] = argv[argKey];
}

downloadDestination = downloadDestination.replace(/#tracklistId/gi, tracklistId);
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

    console.log('Got tracklist w/ ' + tracks.length + ' tracks from:', tracklistName);
    console.log('Loading "' + tracklistConsumer + '" plugin..');

    var plugin = require(pluginPath);
    plugin.consume(tracks, downloadDestination, tracklistConsumerArgs);
});