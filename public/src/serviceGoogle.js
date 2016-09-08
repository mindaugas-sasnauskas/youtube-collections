 angular.module('youtApp')
     .service('googleService', ['$http', '$q', function($http, $q) {


         this.googleApiClientReady = function(type, q, maxResults, mine) {
             var deferred = $q.defer();
             if (maxResults == undefined) {
                 maxResults = 10;
             }
             gapi.client.setApiKey('AIzaSyDz-n5ZL3bbWXP0eHdUWOoPFCrRlbKxluk');
             gapi.client.load('youtube', 'v3', function() {
                 if (type == "search") {
                     var request = gapi.client.youtube.search.list({
                         q: q,
                         maxResults: maxResults,
                         part: 'snippet'
                     });
                 }
                 else if (type == "Subscriptions") {
                     var request = gapi.client.youtube.subscriptions.list({
                         part: 'snippet,contentDetails',
                         type: 'channel',
                         mine: true,
                         pageToken: q,
                         maxResults: 50
                     });
                 }
                 else if (type == "Paylists") {
                     var request = gapi.client.youtube.playlists.list({
                         part: 'snippet,contentDetails',
                         channelId: q,
                         maxResults: 3,
                         mine: mine

                     });
                 }
                 else if (type == "Channels") {
                     var request = gapi.client.youtube.channels.list({
                         part: 'contentDetails',
                         id: q,
                         maxResults: 3
                     });
                 }
                 else if (type == "PlaylistItems") {
                     var request = gapi.client.youtube.playlistItems.list({
                         part: 'snippet,contentDetails',
                         playlistId: q,
                         maxResults: maxResults
                     });
                 }
                 else {
                     console.log("unknown type");

                     return;
                 }
                 request.execute(function(response) {
                     deferred.resolve(response.result);
                 });
             });
             return deferred.promise;
         };
     }])