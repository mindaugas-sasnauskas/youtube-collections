angular.module('youtApp')
  .service('googleService', ['$http', '$q', function ($http, $q) {


    this.googleApiClientReady = function (type, q, maxResults, mine) {
      var deferred = $q.defer();
      if (maxResults == undefined) {
        maxResults = 3;
      }
      gapi.client.setApiKey('AIzaSyDz-n5ZL3bbWXP0eHdUWOoPFCrRlbKxluk');
      gapi.client.load('youtube', 'v3', function () {
        if (type == "search") {
          //  console.log(q);
          var request = gapi.client.youtube.search.list({
            q: q,
            maxResults: maxResults,
            part: 'snippet'
          });
        } else if (type == "Subscriptions") {
          console.log(q);
          var request = gapi.client.youtube.subscriptions.list({
            part: 'snippet,contentDetails',
            type: 'channel',
            mine: true,
            pageToken: q,
            maxResults: 50
          });
        } else if (type == "Paylists") {
          //  console.log(q);
          var request = gapi.client.youtube.playlists.list({
            part: 'snippet,contentDetails',
            channelId: q,
            maxResults: 3,
            mine: mine

          });
        } else if (type == "Channels") {
          //  console.log(q);
          var request = gapi.client.youtube.channels.list({
            part: 'contentDetails',
            id: q,
            maxResults: 3
          });
        } else if (type == "PlaylistItems") {
          // console.log(q);
          var request = gapi.client.youtube.playlistItems.list({
            part: 'snippet,contentDetails',
            playlistId: q,
            maxResults: maxResults
          });
        } else {
          console.log("unknown type");
          return;
        }
        request.execute(function (response) {
          deferred.resolve(response.result);
          //  console.log(response.result);
        });
      });
      return deferred.promise;
    };
  }])
  .factory('apiUrl', function ($resource) {
      return $resource('/api/yout/:id', { id: '@id' }, {
          'update': { method: 'PUT' }
      });
  })
  .factory('mongo', function ($q, $http, apiUrl) {
      var url = '/options/displayed_fields',
          ignore = ['firstName', 'lastName', 'id', 'userId'],
          allFields = [],
          deferred = $q.defer(),

          contacts = Contact.query(function () {
              contacts.forEach(function (c) {
                  Object.keys(c).forEach(function (k) {
                      if (allFields.indexOf(k) < 0 && ignore.indexOf(k) < 0) allFields.push(k);
                  });
              });
              deferred.resolve(allFields);
          });

      return {
          get: function () {
              return $http.get(url);
          },
          set: function (newFields) {
              return $http.post(url, { fields: newFields });
          },
          headers: function () {
              return deferred.promise;
          }
      };
  })
