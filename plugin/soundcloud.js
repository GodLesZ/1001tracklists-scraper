"use strict";

module.exports = {
    consume: function(tracks) {
        console.log('Soundcloud plugin got tracklist');

        // @TODO: Investigate and provide auto-download
        // @TODO: Take care for rtmp streams
        /*
        if (soundcloud.downloadable) {
            <permalink>/download?client_id=YOUR_CLIENT_ID
        } else {
            https://api.soundcloud.com/tracks/<id>/stream?client_id=YOUR_CLIENT_ID
        }

     {
         publisher_metadata: null,
         user: [Object],
         user_id: 296190,
         genre: 'progressive house',
         tag_list: 'hardwell makj countdown original mix download',
         duration: 123518,
         downloadable: false,
         streamable: true,
         original_content_size: 1977838,
         commentable: true,
         sharing: 'public',
         public: true,
         created_at: '2013/10/07 10:04:13 +0000',
         updated_at: '2015/08/17 17:56:10 +0000',
         isrc: '',
         state: 'finished',
         embeddable: true,
         embeddable_by: 'all',
         license: 'all-rights-reserved',
         waveform_url: 'https://w1.sndcdn.com/VVgJKaBf6bVq_m.png',
         feedable: false,
         label_name: 'Revealed Recordings',
         release_date: '2013-10-07',
         has_downloads_left: true,
         purchase_title: null,
         purchase_url: 'http://bit.ly/CountdownBP',
         policy: 'ALLOW',
         monetization_model: 'NOT_APPLICABLE',
         visuals: null,
         permalink: 'hardwell-makj-countdown-original-mix-download',
         title: 'Hardwell & MAKJ - Countdown - OUT NOW!',
         description: 'Show some love and vote for Hardwell → http://www.djhardwell.com/vote\n\nHardwell presents Revealed Vol. 6 → http://hwl.dj/REVRVol6\nHardwell - United We Are (Album) → http://bit.ly/UNITEDWEARE\n\nHardwell & MAKJ - Countdown (Original Mix)\nDownload on iTunes: http://bit.ly/CountdownItunes\nBeatport:  http://bit.ly/CountdownBP\nStream on Spotify: http://spoti.fi/1a4WKKZ\n\nAfter releasing his firing edit of Blasterjaxx\'s "Fifteen," he quickly turns around an exhilarating new original in collaboration with the Los Angeles-based rising star, MAKJ. Ever since "Countdown" was dropped during his acclaimed set at Ultra Music Festival 2013, Hardwell has established the song as a peak-time secret weapon in his performances all summer, thus becoming one of his most highly anticipated tracks.\n\nHardwell brings on the burgeoning talent, MAKJ, to foster an explosive new sound that has been tested and proven throughout this year. The fact that "Countdown" has been one of the most buzzed about tracks for months is a testament to Hardwell\'s signature, festival anthem sound has been manifested at its fundamental core time and time again.\n\nCheck out the trailer for "I AM HARDWELL - The Documentary" and subscribe here: http://www.djhardwell.com/docu/\n\nFor more info:\nhttp://www.djhardwell.com\nhttp://www.twitter.com/hardwell\nhttp://www.facebook.com/djhardwell\nhttp://www.soundcloud.com/hardwell\nhttp://www.instagram.com/hardwell\n\nhttp://www.DJMAKJ.com\nhttp://www.twitter.com/DJMAKJ\nhttp://www.facebook.com/MAKJOfficial\nhttp://www.soundcloud.com/djmakj\nhttp://instagram.com/djmakj\n\nhttp://www.revealedrecordings.com\nhttp://facebook.com/revealedrecordings\nhttp://twitter.com/revealedrec',
         track_type: 'original',
         last_modified: '2015/08/17 17:56:10 +0000',
         artwork_url: 'https://i1.sndcdn.com/artworks-000059523832-do5lay-large.jpg',
         id: 114203961,
         kind: 'track',
         stream_url: 'https://api.soundcloud.com/tracks/114203961/stream',
         secret_token: null,
         reposts_count: 25773,
         permalink_url: 'https://soundcloud.com/hardwell/hardwell-makj-countdown-original-mix-download',
         likes_count: 95679,
         download_count: 1,
         playback_count: 5459232,
         comment_count: 4458,
         uri: 'https://api.soundcloud.com/tracks/114203961',
         download_url: null
     }
         */
    }
};