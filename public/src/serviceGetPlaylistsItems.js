angular.module('youtApp')
    .service('getPlaylistsItemsService', ['googleService', '$q', function(googleService, $q) {


        this.playlistItemsSubscriprions = function(subscriptionsResult, arg1, arg2) {

            subscriptionsResult = collectionsResult;
            var uploadsId = "UU" + arg1.substring(2);

            googleService.googleApiClientReady(
                "PlaylistItems",
                uploadsId
            ).then(function(data) {


                    for (var i = 0; i < subscriptionsResult.length; i++) {

                        if (subscriptionsResult[i].channelId == data.items[0].snippet.channelId) {

                            subscriptionsResult[i].uploads = data;

                            return;
                        }
                    }
                },
                function(error) {
                    console.log('Failed: ' + error)
                });

        }
        this.playlistItemsCollections = function(collectionsResult, arg1, arg2) {
            var collectionfiltered = collectionsResult.filter(function(obj) {
                return obj.title == arg1;
            });
            for (var i = 0; i < collectionfiltered[0].items.length; i++) {

                var uploadsId = "UU" + collectionfiltered[0].items[i].channelId.substring(2);

                googleService.googleApiClientReady(
                    "PlaylistItems",
                    uploadsId
                ).then(function(data) {

                        for (var i = 0; i < collectionsResult.length; i++) {

                            for (var ii = 0; ii < collectionsResult[i].items.length; ii++) {
                                if (collectionsResult[i].items[ii].channelId == data.items[0].snippet.channelId) {

                                    collectionsResult[i].items[ii].uploads = data;
                                    for (var k = 0; k < data.items.length; k++) {
                                        var obj = {
                                            "videoId": data.items[k].contentDetails.videoId,
                                            "publishedAt": data.items[k].snippet.publishedAt
                                        }
                                        collectionsResult[i].uploads.push(obj);

                                    }


                                    // if ($scope.makePlaylistCollection !== undefined) {
                                    //   makePlaylist($scope.makePlaylistCollection);
                                    //   $scope.makePlaylistCollection = undefined;
                                    // }
                                    return;

                                }
                            }
                        }
                    },
                    function(error) {
                        console.log('Failed: ' + error)
                    });


            }


        }
        this.playlistItemsMyplaylists = function(subscriptionsResult) {
            for (var i = 0; i < subscriptionsResult.myplaylists.items.length; i++) {
                var uploadsId = subscriptionsResult.myplaylists.items[i].id;

                googleService.googleApiClientReady(
                    "PlaylistItems",
                    uploadsId
                ).then(function(data) {

                        for (var i = 0; i < subscriptionsResult.myplaylists.items.length; i++) {
                            if (subscriptionsResult.myplaylists.items[i].id == data.items[0].snippet.playlistId) {
                                subscriptionsResult.myplaylists.items[i].uploads = data;
                                return;

                            }
                        }
                    },
                    function(error) {
                        console.log('Failed: ' + error)
                    });

            }
        }
        this.playlistItemsGetMoreUploads = function(collectionsResult, arg1, arg2) {
            if (arg2 !== undefined) {
                for (var i = 0; i < collectionsResult[arg2].length; i++) {
                    var uploadsId = "UU" + arg1.substring(2);

                    googleService.googleApiClientReady(
                        "PlaylistItems",
                        uploadsId,
                        50
                    ).then(function(data) {


                            for (var i = 0; i < collectionsResult[arg2].length; i++) {
                                if (collectionsResult[arg2][i].channelId == data.items[0].snippet.channelId) {

                                    collectionsResult[arg2][i].uploads = data;

                                    return;

                                }
                            }
                        },
                        function(error) {
                            console.log('Failed: ' + error)
                        });


                }
            }
            else {
                subscriptionsResult = collectionsResult
                var uploadsId = "UU" + arg1.substring(2);

                googleService.googleApiClientReady(
                    "PlaylistItems",
                    uploadsId,
                    50
                ).then(function(data) {


                        for (var i = 0; i < subscriptionsResult.length; i++) {

                            if (subscriptionsResult[i].channelId == data.items[0].snippet.channelId) {

                                subscriptionsResult[i].uploads = data;

                                return;
                            }
                        }
                    },
                    function(error) {
                        console.log('Failed: ' + error)
                    });
            }

        }

    }])