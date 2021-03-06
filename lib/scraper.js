"use strict";

var request     = require('request');
var syncRequest = require('sync-request');
var cheerio     = require('cheerio');
var jquery      = require('jquery');
var env         = require('jsdom').env;
var querystring = require('querystring');

var reTracklistsUri        = /^\/track\/([\d]+)_/i;
var reTrackMediaSoundcloud = /({[^}]+})/i;

var resolveSoundcloudLink = function (mediaData, track) {
    var url = 'http://www.1001tracklists.com/ajax/get_medialink.php?' + querystring.stringify(mediaData);
    console.log('Resolve 1001tl media data on', (track.number ? ' no. ' + track.number : ''), ':', track.title);
    var res  = syncRequest('GET', url);
    var data = res.body.toString('utf-8');
    if (!data) {
        return null;
    }

    try {
        var json = JSON.parse(data);
        if (json && json.success && json.data && json.data.length > 0) {
            console.log('Resolve', json.data.length, 'soundcloud track(s)');
            var scData = [],
                scUrl;
            for (var i = 0; i < json.data.length; i++) {
                var m = /api.soundcloud.com\/tracks\/(\d+)/.exec(json.data[i].player);
                if (!m || m.length < 2) {
                    continue;
                }
                scUrl      = 'https://api.soundcloud.com/tracks/' + m[1] + '.json?client_id=02gUJC0hH2ct1EGOcYXQIzRFU91c72Ea';
                res        = syncRequest('GET', scUrl);
                data       = res.body.toString('utf-8');
                var scJson = data && data.length ? JSON.parse(data) : null;
                if (scJson) {
                    scData.push(scJson);
                }

            }

            return scData;
        }
    }
    catch (er) {
    }

    return null;
};

var scrapeTracklist = function ($, url) {

    var tracks = [];

    $('div[itemtype="http://schema.org/MusicPlaylist"]')
        .find('table')
        .find('tr.tlpItem')
        .each(function () {
            "use strict";

            var $row              = $(this);
            var $columns          = $row.find('td');
            var $col_track_number = $columns.eq(0);
            var $col_track_data   = $columns.eq(2);
            var $container_tracks = $col_track_data.find('[itemprop="tracks"]');
            var $container_media  = $col_track_data.find('[id$="_media_buttons"]');
            var track, match;

            track = {
                number:         $col_track_number.find('input[id^="tlp_tracknumber_"]').val(),
                cueStart:       $col_track_number.find('.cueValueField').text(),
                artist:         $container_tracks.find('meta[itemprop="byArtist"]').attr('content'),
                title:          $container_tracks.find('meta[itemprop="name"]').attr('content'),
                tracklistsLink: $container_tracks.find('meta[itemprop="url"]').attr('content'),
                tracklistsId:   null,
                mediaData:      {
                    soundcloud: null
                }
            };
            if (track.tracklistsLink) {
                match = reTracklistsUri.exec(track.tracklistsLink);
                if (match && match.length >= 2) {
                    track.tracklistsId = match[1];
                }
            }
            if ($container_media && $container_media.length) {
                var $sc_container = $container_media.find('.s32-soundcloud');
                if ($sc_container && $sc_container.length) {
                    var media_data = $sc_container.attr('onclick');
                    if (media_data) {
                        // new MediaViewer(this, 'tlptr_1541555', { idObject: '5', idItem: '173432', idMediaType: '4', viewSource: 1, viewItem: 82205 } );
                        match = reTrackMediaSoundcloud.exec(media_data);
                        if (match && match.length >= 2) {
                            var crappyJson  = match[1];
                            var fixedJson   = crappyJson.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ').replace(/'/g, '"');
                            var requestData = JSON.parse(fixedJson);
                            var scLinks     = resolveSoundcloudLink(requestData, track);
                            if (scLinks) {
                                track.mediaData.soundcloud = scLinks;
                            }
                        }
                    }
                }
            }

            tracks.push(track)
        });

    return tracks;
};

var scrapeArtistTracklist = function ($, url) {

    var tracks = [];

    $('table.default.detail.tlTbl')
        .find('tr.trTog')
        .each(function () {
            "use strict";

            var $row              = $(this);
            var $columns          = $row.find('td');
            var $col_track_data   = $columns.eq(0);
            var $track_data       = $col_track_data.find('div.iBlock:first');
            var $container_media  = $col_track_data.find('div.iBlock.tgHid.tlIconBox[title*="open media players"]');
            var trackTitle = ($track_data.text() + '').trim(),
                track, match;

            track = {
                number: tracks.length + 1,
                title: trackTitle,
                mediaData: {
                    soundcloud: null
                }
            };
            if ($container_media && $container_media.length) {
                var $sc_container = $container_media.find('.s32-soundcloud');
                if ($sc_container && $sc_container.length) {
                    var media_data = $sc_container.attr('onclick');
                    if (media_data) {
                        // new MediaViewer(this, 'tlptr_1541555', { idObject: '5', idItem: '173432', idMediaType: '4', viewSource: 1, viewItem: 82205 } );
                        // new MediaViewer(this, null, { idObject: '5', idItem: '263806' , idSource: '10' } );
                        match = reTrackMediaSoundcloud.exec(media_data);
                        if (match && match.length >= 2) {
                            var crappyJson  = match[1];
                            var fixedJson   = crappyJson.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ').replace(/'/g, '"');
                            var requestData = JSON.parse(fixedJson);
                            var scLinks     = resolveSoundcloudLink(requestData, track);
                            if (scLinks) {
                                track.mediaData.soundcloud = scLinks;
                            }
                        }
                    }
                }
            }

            tracks.push(track)
        });

    return tracks;
};

module.exports = {
    scrape: function (url, callback) {
        var tracks = [];

        env(url, function (error, window) {
            "use strict";

            if (error) {
                callback.call(null, error);
                return;
            }


            var $ = jquery(window),
                tracklistName = $('meta[name="description"]').attr('content');

            if (/\/tracklist\//.test(url)) {
                tracks = scrapeTracklist($, url);
            } else if (/\/artist\//.test(url)) {
                tracks = scrapeArtistTracklist($, url);
            } else {
                throw 'Unknown url type: ' + url;
            }

            callback.call(null, null, tracks, tracklistName);
        })
    }
};
