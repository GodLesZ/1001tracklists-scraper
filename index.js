"use strict";

var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var scraper = require('./lib/scraper');

var argv = require('yargs')
    .usage('Usage: $0 --id [num] --plugin [string]')
    .option('id', {
        alias: 'i',
        describe: '1001tracklists id'
    })
    .option('plugin', {
        alias: 'p',
        describe: 'a plugin to consume the tracklist',
        choices: ['soundcloud']
    })
    .argv;

var tracklistId = argv.id,
    tracklistConsumer = argv.plugin,
    pluginPath = './plugin/'+tracklistConsumer,
    shortUrl = 'http://1001.tl/' + tracklistId;

console.log('Requesting ' + shortUrl + ' ...');

scraper.scrape(shortUrl, function (err, tracks) {
    if (err) {
        console.error(err);
    }

    console.log('Got tracklist w/ '+tracks.length+' tracks');
    console.log('Loading "'+tracklistConsumer+'" plugin..');

    var plugin = require(pluginPath);
    plugin.consume(tracks);
});