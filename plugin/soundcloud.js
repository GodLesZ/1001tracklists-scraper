"use strict";

var fs                = require('fs');
var path              = require('path');
var request           = require('request');
var seqQueue          = require('seq-queue');
var sanitize          = require("sanitize-filename");
var ffmetadata        = require("ffmetadata"),
    ffmetadataOptions = {};

var queue = seqQueue.createQueue(1000);
queue.on('drained', function () {
    console.log('All downloads completed');
});

module.exports = {
    consume: function (tracks, downloadDestination, pluginOtions) {
        console.log('Soundcloud plugin got tracklist');

        pluginOtions.filename = pluginOtions.filename || '##title';

        // @TODO: Take care for rtmp streams

        var queuedFiles = [];
        for (var i in tracks) {
            if (tracks.hasOwnProperty(i) === false) {
                continue;
            }

            var track       = tracks[i],
                scDataArray = track.mediaData.soundcloud,
                logTag      = '[' + track.number + '] ' + track.title + ': ',
                downloadUri = null;

            if (!scDataArray || scDataArray.length === 0) {
                console.log(logTag + 'No soundcloud data');
                continue;
            }

            for (var sc = 0; sc < scDataArray.length; sc++) {
                var scData         = scDataArray[sc],
                    targetFilename = pluginOtions.filename + '.mp3';

                for (var scDataKey in scData) {
                    if (scData.hasOwnProperty(scDataKey) === false) {
                        continue;
                    }

                    targetFilename = targetFilename.replace('##' + scDataKey, scData[scDataKey]);
                }

                var targetFilepath = path.normalize(downloadDestination + '/' + sanitize(targetFilename));

                if (scData.downloadable) {
                    downloadUri = scData.permalink_url + '/download?client_id=YOUR_CLIENT_ID';
                }
                else {
                    downloadUri = 'https://api.soundcloud.com/tracks/' + scData.id + '/stream?client_id=YOUR_CLIENT_ID';
                }

                if (queuedFiles.indexOf(targetFilepath) !== -1) {
                    continue;
                }

                queuedFiles.push(targetFilename);

                console.log('[Download]', track.number, ':', scData.title, '(#' + scData.id + ')');

                queue.push(function (url, targetFilepath, scData, trackData) {
                    return function (task) {

                        var writeStream = fs.createWriteStream(targetFilepath);
                        writeStream.on('finish', function () {
                            // @TODO: Currently ffmedata process closed w/ code -4058; don't know why
                            task.done();
                            /*
                             var data = {
                             TBPM:      scData.bpm || 0,
                             TIT3:      '"'+(scData.description || '')+'"',
                             genre:     scData.genre || '',
                             title:     '"'+(scData.title || '')+'"',
                             copyright: scData.permalink_url || '',
                             date:      scData.release_year || 0,
                             artist:    '"'+(scData.user ? scData.user.username : '')+'"'
                             };
                             ffmetadata.write(targetFilepath, data, ffmetadataOptions, function () {
                             task.done();
                             });
                             */
                        });

                        request
                            .get(url)
                            .on('error', function (err) {
                                console.error('[Request] Error during request:', err);
                                task.done();
                            })
                            .pipe(writeStream);
                    };
                }(downloadUri, targetFilepath, scData, track));
            }
        }

        queue.close();

        // @TODO: Taglib pics
        /*

         try
         {
         byte[] array = new byte[0];
         WebRequest webRequest = WebRequest.Create(trackInfo.artwork_url.ToString().Replace("-large.", "-t500x500."));
         Stream stream = webRequest.GetResponse().GetResponseStream();
         byte[] numArray1 = new byte[1024];
         MemoryStream memoryStream = new MemoryStream();
         int num4 = 0;
         do
         {
         num4 = stream.Read(numArray1, 0, (int)numArray1.Length);
         memoryStream.Write(numArray1, 0, num4);
         }
         while (num4 != 0);
         array = memoryStream.ToArray();
         stream.Close();
         memoryStream.Close();
         IPicture[] pictureArray = new IPicture[1];
         byte[] numArray2 = array;
         ByteVector byteVectors = new ByteVector(numArray2, (int)numArray2.Length);
         AttachedPictureFrame attachedPictureFrame = new AttachedPictureFrame(new Picture(byteVectors))
         {
         MimeType = "image/jpeg",
         Type = PictureType.FrontCover
         };
         pictureArray[0] = attachedPictureFrame;
         tag.Pictures = pictureArray;
         }
         */
    }
};