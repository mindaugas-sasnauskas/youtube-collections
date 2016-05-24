angular.module('youtApp')
  .controller('searchController', searchController)
  .controller('subscriptionsController', subscriptionsController)
  .controller('AlertController', AlertController)

function searchController($rootScope, $scope, googleService) {
  $scope.searchResults = {
    "items": {
      "1": "s",
      "2": "s3",
      "3": "s2"
    }
  }

  $scope.Search = function (searchModel) {
    var q = $scope.searchModel;

    googleService.googleApiClientReady("search", q).then(function (data) {
      $scope.searchResults = data;
    }, function (error) {
      console.log('Failed: ' + error)
    });
  }

}
function AlertController ($scope) {

};

function subscriptionsController($window, $rootScope, $scope, $http, $sce, googleService) {
  $scope.alerts=[];
    $scope.addAlert = function() {
      $scope.alerts.push({type: 'success',msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  $scope.oneAtATime = true;

  $window.initGapi = function () {
    $scope.$apply($scope.getChannel);

  };

  // init functions
  setTimeout(function () {
      getCollections();
      refreshSubscriptions();
      getChannelPlaylists("mine");

    }, 1000)
    // init functions End
  $scope.nextPageToken = "";
  $scope.subscriptionsResult = [];

  function getSubscriptions() {
    if ($scope.subscriptionsResult == undefined) {
      $scope.subscriptionsResult = [];
    }
    googleService.googleApiClientReady("Subscriptions", $scope.nextPageToken).then(function (data) {

        $scope.nextPageToken = data.nextPageToken;

        for (var i = 0; i < data.items.length; i++) {
          $scope.subscriptionsResult.push({
            "title": data.items[i].snippet.title,
            "channelId": data.items[i].snippet.resourceId.channelId
          });
        }

        if ($scope.nextPageToken == undefined) {
          data = {
            type: "subsctiptions",
            list: $scope.subscriptionsResult
          }
          console.log(data);
          var config = "";

          $http.post('/api/yout', angular.toJson(data)).then(
            function (response) {
              console.log("successful post");
            },
            function () {
              console.log("error post");
            });
        } else {
          getSubscriptions();

        }

      },
      function (error) {
        console.log('Failed: ' + error)
      });

  }

  function getChannelUploads() {

    for (var i = 0; i < $scope.subscriptionsResult.items.length; i++) {
      googleService.googleApiClientReady(
        "Channels",
        $scope.subscriptionsResult.items[i].snippet.resourceId.channelId
      ).then(function (data) {
          for (var i = 0; i < $scope.subscriptionsResult.items.length; i++) {
            if ($scope.subscriptionsResult.items[i].uploads == null) {
              $scope.subscriptionsResult.items[i].uploads = data;
              return;
            }
          }
        },
        function (error) {
          console.log('Failed: ' + error)
        });
    }
  }



  function getPlaylistsItems(type, arg1, arg2) {
    if (type == "subscriptions") {

      var uploadsId = "UU" + arg1.substring(2);

      googleService.googleApiClientReady(
        "PlaylistItems",
        uploadsId
      ).then(function (data) {


          for (var i = 0; i < $scope.subscriptionsResult.length; i++) {

            if ($scope.subscriptionsResult[i].channelId == data.items[0].snippet.channelId) {

              $scope.subscriptionsResult[i].uploads = data;

              return;
            }
          }
        },
        function (error) {
          console.log('Failed: ' + error)
        });

    // } else if (type == "collections") {
    //   var collectionfiltered = $scope.collectionsResult.filter(function(obj ) {
    //     return obj.title == arg1;
    //   });
    //   for (var i = 0; i < $scope.collectionsResult.length; i++) {
    //
    //     if ($scope.collectionsResult[i].title == arg1){
    //       for (var ii = 0; ii < $scope.collectionsResult[i].items.length; ii++) {
    //
    //         var uploadsId = "UU" + $scope.collectionsResult[i].items[ii].channelId.substring(2);
    //
    //         googleService.googleApiClientReady(
    //           "PlaylistItems",
    //           uploadsId
    //         ).then(function (data) {
    //
    //             for (var i = 0; i < $scope.collectionsResult.length; i++) {
    //               for (var ii = 0; ii < $scope.collectionsResult[i].items.length; ii++) {
    //               if ($scope.collectionsResult[i].items[ii].channelId == data.items[0].snippet.channelId) {
    //
    //                 $scope.collectionsResult[i].items[ii].uploads = data;
    //                 if ($scope.makePlaylistCollection !== undefined) {
    //                   makePlaylist($scope.makePlaylistCollection);
    //                   $scope.makePlaylistCollection = undefined;
    //                 }
    //                 return;
    //
    //                 }
    //               }
    //             }
    //
    //           },
    //           function (error) {
    //             console.log('Failed: ' + error)
    //           });
    //
    //
    //       }
    //
    //     }
    //   }
    // }
  } else if (type == "collections") {
    var collectionfiltered = $scope.collectionsResult.filter(function(obj ) {
      return obj.title == arg1;
    });
        for (var i = 0; i < collectionfiltered[0].items.length; i++) {

          var uploadsId = "UU" + collectionfiltered[0].items[i].channelId.substring(2);

          googleService.googleApiClientReady(
            "PlaylistItems",
            uploadsId
          ).then(function (data) {

 for (var i = 0; i < $scope.collectionsResult.length; i++) {
                for (var ii = 0; ii < $scope.collectionsResult[i].items.length; ii++) {
                if ($scope.collectionsResult[i].items[ii].channelId == data.items[0].snippet.channelId) {

                  $scope.collectionsResult[i].items[ii].uploads = data;
                  if ($scope.makePlaylistCollection !== undefined) {
                    makePlaylist($scope.makePlaylistCollection);
                    $scope.makePlaylistCollection = undefined;
                  }
                  return;

                  }

              }
             }

            },
            function (error) {
              console.log('Failed: ' + error)
            });


        }


  }
    else if (type == "myplaylists") {
      for (var i = 0; i < $scope.subscriptionsResult.myplaylists.items.length; i++) {
        var uploadsId = $scope.subscriptionsResult.myplaylists.items[i].id;

        googleService.googleApiClientReady(
          "PlaylistItems",
          uploadsId
        ).then(function (data) {

            for (var i = 0; i < $scope.subscriptionsResult.myplaylists.items.length; i++) {
              if ($scope.subscriptionsResult.myplaylists.items[i].id == data.items[0].snippet.playlistId) {
                $scope.subscriptionsResult.myplaylists.items[i].uploads = data;
                return;

              }
            }
          },
          function (error) {
            console.log('Failed: ' + error)
          });

      }
    } else if (type == "get-more-uploads") {
      if (arg2 !== undefined) {
        for (var i = 0; i < $scope.collectionsResult[arg2].length; i++) {
          var uploadsId = "UU" + arg1.substring(2);

          googleService.googleApiClientReady(
            "PlaylistItems",
            uploadsId,
            50
          ).then(function (data) {


              for (var i = 0; i < $scope.collectionsResult[arg2].length; i++) {
                if ($scope.collectionsResult[arg2][i].channelId == data.items[0].snippet.channelId) {

                  $scope.collectionsResult[arg2][i].uploads = data;

                  return;

                }
              }
            },
            function (error) {
              console.log('Failed: ' + error)
            });


        }
      } else {
        var uploadsId = "UU" + arg1.substring(2);

        googleService.googleApiClientReady(
          "PlaylistItems",
          uploadsId,
          50
        ).then(function (data) {


            for (var i = 0; i < $scope.subscriptionsResult.length; i++) {

              if ($scope.subscriptionsResult[i].channelId == data.items[0].snippet.channelId) {

                $scope.subscriptionsResult[i].uploads = data;

                return;
              }
            }
          },
          function (error) {
            console.log('Failed: ' + error)
          });
      }
    }
  }

  function getChannelPlaylists(type) {
    if (type == "mine") {
      googleService.googleApiClientReady(
        "Paylists", undefined, undefined, true
      ).then(function (data) {

          $scope.subscriptionsResult.myplaylists = data;
          getPlaylistsItems("myplaylists");
        },
        function (error) {
          console.log('Failed: ' + error)
        });
    } else if (type = "channels") {

      googleService.googleApiClientReady(
        "Paylists",
        $scope.subscriptionsResult.items[i].snippet.resourceId.channelId
      ).then(function (data) {

          for (var i = 0; i < $scope.subscriptionsResult.items.length; i++) {
            if ($scope.subscriptionsResult.items[i].playlists == null) {

              $scope.subscriptionsResult.items[i].playlists = data;
              return;
            }
          }

        },
        function (error) {
          console.log('Failed: ' + error)
        });
    }
  }

  function getCollections() {
    $http.get('/api/userItems').then(
      function (response) {
        console.log(response);
        $scope.collectionsResult = [];
        for (var i = 0; i < response.data.items.length; i++) {
          if (response.data.items[i].type == "collection") {
            $scope.collectionsResult.push(response.data.items[i]);
          }
        }

        // $scope.collectionsResult = response.data.collections;

        console.log("successful get");
      },
      function () {
        console.log("error post");
      });
  }

  function refreshSubscriptions() {
    $http.get('/api/userItems').then(
      function (response) {
        for (var i = 0; i < response.data.items.length; i++) {
          if (response.data.items[i].type == "subsctiptions") {
            console.log(response.data.items[i]);
            $scope.subscriptionsResult = response.data.items[i].list;
          }
        }
        console.log("successful get");
      },
      function () {
        console.log("error post");
      });
  }
  $scope.refreshUploadsCollection = function (collection) {
    getPlaylistsItems("collections", collection)
  }
  $scope.getSubscriptions = function () {
    getSubscriptions()

  };
  $scope.logResult = function () {
    console.log($scope.subscriptionsResult);
    console.log($scope.collectionsResult);
    console.log($scope.iframeList);
  }
  $scope.refreshUploads = function () {
    getPlaylistsItems();
  }

  $scope.showCollections = function () {
    getCollections();

  }
  $scope.newCollection = function (collectionName) {
    data = {
      type: "collection",
      title: collectionName
    }
    $http.post('/api/yout', JSON.stringify(data)).then(
      function (response) {
        console.log("successful post");
        getCollections();
      },
      function () {
        console.log("error post");
      });
  }
  $scope.removeCollection = function (collectionName) {
    data = {
      title: collectionName
    }
    $http.delete('/api/' + collectionName).then(
      function (response) {
        console.log("successful post");
        getCollections();
      },
      function () {
        console.log("error post");
      });
  }
  $scope.collection = function (type, title, channelId, collection) {

    if (type == 'add') {

      channelId = channelId.substring(2);
      data = {
        type: type,
        title: title,
        collection: collection,
        channelId: "UC" + channelId,
        uploadsId: "UU" + channelId
      }
      console.log(data);
      var config = "";

      $http.put('/api/' + collection, JSON.stringify(data)).then(
        function (response) {
          console.log("successful post");
          $scope.alerts.push({type: 'success',msg: 'Successfuly added to collection'});
          getCollections();
        },
        function () {
          console.log("error post");
          $scope.alerts.push({type: 'danger',msg: 'Could not add to collection'});
        });
    } else if (type == 'remove') {

      channelId = channelId.substring(2);
      data = {
        type: type,
        title: title,
        collection: collection,
        channelId: "UC" + channelId,
        uploadsId: "UU" + channelId
      }
      console.log(data);
      var config = "";

      $http.put('/api/'+collection, JSON.stringify(data)).then(
        function (response) {
          console.log("successful post");
          getCollections();
        },
        function () {
          console.log("error post");
        });
    } else if (type == "get-uploads") {
      getPlaylistsItems('subscriptions', channelId)
    } else if (type == "get-more-uploads") {
      getPlaylistsItems('get-more-uploads', channelId, collection)
    }
  }
  $scope.iframeListSet = false;
  $scope.makePlaylist = function (collection) {
    getPlaylistsItems("collections", collection)
      // setTimeout(function () {
      //   makePlaylist(collection)
      // }, 2000);
    $scope.makePlaylistCollection = collection;
    $scope.iframeListSet = true;
  }
  $scope.iframeList = $sce.trustAsResourceUrl('https://www.youtube.com/embed/');

  function makePlaylist(collection) {
    $scope.iframeList = [];
    var firstVideo;

    var collectionfiltered = $scope.collectionsResult.filter(function(obj ) {
      return obj.title == collection;
    });
    for (var i = 0; i < collectionfiltered[0].items.length; i++) {
      var items = collectionfiltered[0].items[i].uploads.items;
      for (var j = 0; j < items.length; j++) {
        if (i == 0) {
          firstVideo = items[j].snippet.resourceId.videoId;
        }
        $scope.iframeList.push(items[j].snippet.resourceId.videoId);
      }
    }
    var length = $scope.iframeList.length;
    $scope.iframeList = $sce.trustAsResourceUrl("https://www.youtube.com/v/" + firstVideo.toString() + "?version=3&loop=1&playlist=" + $scope.iframeList.toString());


  }

  function getChannels() {
    var data = {};
    googleService.googleApiClientReady("Subscriptions").then(function (data) {
        data = data;
        return data;
      },
      function (error) {
        console.log('Failed: ' + error)
      });
    return data;
  }
}
