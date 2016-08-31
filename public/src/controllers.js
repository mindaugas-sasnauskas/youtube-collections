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

    $scope.Search = function(searchModel) {
        var q = $scope.searchModel;

        googleService.googleApiClientReady("search", q).then(function(data) {
            $scope.searchResults = data;
        }, function(error) {
            console.log('Failed: ' + error)
        });
    }

}

function AlertController($scope) {

};

function subscriptionsController(
    $window,
    $rootScope,
    $scope,
    $http,
    $sce,
    googleService,
    getPlaylistsItemsService,
    serviceCollections) {

    $scope.alerts = [];
    $scope.addAlert = function() {
        $scope.alerts.push({
            type: 'success',
            msg: 'Another alert!'
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    $scope.oneAtATime = true;

    $window.initGapi = function() {
        $scope.$apply($scope.getChannel);

    };

    // init functions
    setTimeout(function() {
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
        googleService.googleApiClientReady("Subscriptions", $scope.nextPageToken).then(function(data) {

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
                        function(response) {
                            console.log("successful post");
                        },
                        function() {
                            console.log("error post");
                        });
                }
                else {
                    getSubscriptions();

                }

            },
            function(error) {
                console.log('Failed: ' + error)
            });

    }

    function getPlaylistsItems(type, arg1, arg2) {
        console.log("getPlaylistsItems getPlaylistsItems")
    }

    function getChannelPlaylists(type) {
        if (type == "mine") {
            googleService.googleApiClientReady(
                "Paylists", undefined, undefined, true
            ).then(function(data) {

                    $scope.subscriptionsResult.myplaylists = data;
                    getPlaylistsItemsService.playlistItemsMyplaylists($scope.subscriptionsResult);
                },
                function(error) {
                    console.log('Failed: ' + error)
                });
        }
        else if (type = "channels") {

            googleService.googleApiClientReady(
                "Paylists",
                $scope.subscriptionsResult.items[i].snippet.resourceId.channelId
            ).then(function(data) {

                    for (var i = 0; i < $scope.subscriptionsResult.items.length; i++) {
                        if ($scope.subscriptionsResult.items[i].playlists == null) {

                            $scope.subscriptionsResult.items[i].playlists = data;
                            return;
                        }
                    }

                },
                function(error) {
                    console.log('Failed: ' + error)
                });
        }
    }

    function getCollections() {
        $http.get('/api/userItems').then(
            function(response) {
                console.log(response);
                $scope.collectionsResult = [];
                for (var i = 0; i < response.data.items.length; i++) {
                    if (response.data.items[i].type == "collection") {
                        $scope.collectionsResult.push(response.data.items[i]);
                        console.log($scope.collectionsResult + " " + i)
                    }
                }

                init_uploads()
                    // $scope.collectionsResult = response.data.collections;

                console.log("successful get");
            },
            function() {
                console.log("error post");
            });

    }

    function init_uploads() {
        for (var x = 0; $scope.collectionsResult.length; x++) {
            console.log($scope.collectionsResult[x] + " " + x)
            $scope.collectionsResult[x].uploads = [];

        }
    }

    function refreshSubscriptions() {
        $http.get('/api/userItems').then(
            function(response) {
                for (var i = 0; i < response.data.items.length; i++) {
                    if (response.data.items[i].type == "subsctiptions") {
                        console.log(response.data.items[i]);
                        $scope.subscriptionsResult = response.data.items[i].list;
                    }
                }
                console.log("successful get");
            },
            function() {
                console.log("error post");
            });
    }
    $scope.refreshUploadsCollection = function(collection) {
        getPlaylistsItemsService.playlistItemsCollections($scope.collectionsResult, collection)
    }
    $scope.getSubscriptions = function() {
        getSubscriptions()

    };
    $scope.logResult = function() {
        console.log($scope.subscriptionsResult);
        console.log($scope.collectionsResult);
        console.log($scope.iframeList);
    }
    $scope.refreshUploads = function() {
        getPlaylistsItemsService.playlistItems();
    }

    $scope.showCollections = function() {
        getCollections();
    }
    $scope.newCollection = function(collectionName) {
        serviceCollections.newCollection(collectionName)
        getCollections();
    }
    $scope.removeCollection = function(collectionName) {
        serviceCollections.removeCollection(collectionName)
        getCollections();
    }
    $scope.collection = function(type, title, channelId, collection) {

        if (type == 'add') {
            serviceCollections.collectionAdd('add', title, channelId, collection)

        }
        else if (type == 'remove') {
            serviceCollections.collectionRemove('remove', title, channelId, collection)
            getCollections();
        }
        else if (type == "get-uploads") {
            getPlaylistsItemsService.playlistItemsGetMoreUploads($scope.subscriptionsResult, channelId)
            getCollections();
        }
        else if (type == "get-more-uploads") {
            getPlaylistsItemsService.playlistItemsGetMoreUploads($scope.collectionsResult, channelId, collection)
        }
    }


    $scope.iframeListSet = false;
    $scope.makePlaylist = function(collection) {
        getPlaylistsItemsService.playlistItemsGetMoreUploads($scope.collectionsResult, collection)
            // setTimeout(function () {
            //   makePlaylist(collection)
            // }, 2000);
        $scope.makePlaylistCollection = collection;
        $scope.iframeListSet = true;
    }
    $scope.makePlaylistCron = function(collection, type) {
        console.log($scope.collectionsResult)

        var collectionfiltered = $scope.collectionsResult.filter(function(obj) {
            return obj.title == collection;
        });
        collectionfiltered[0].uploads.sort(function(a, b) {
            return new Date(b.publishedAt) - new Date(a.publishedAt);
        });
        $scope.iframeListCron = [];
        var firstVideoCron;
        for (var i = 0; i < collectionfiltered[0].uploads.length; i++) {

            if (i == 0) {
                firstVideoCron = collectionfiltered[0].uploads[i].videoId;
            }
            else {
                $scope.iframeListCron.push(collectionfiltered[0].uploads[i].videoId);

            }
            console.log($scope.iframeListCron)

        }
        var length = $scope.iframeList.length;
        if (type == "tab") {
            $window.open("https://www.youtube.com/v/" + firstVideoCron.toString() + "?enablejsapi=1&loop=1&playlist=" + $scope.iframeListCron.toString(), '_blank');
        }
        else {
            $scope.iframeListCron = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + firstVideoCron.toString() + "?enablejsapi=1&loop=1&playlist=" + $scope.iframeListCron.toString());

            $scope.iframeListSetCron = true;
        }
    }


    $scope.iframeList = $sce.trustAsResourceUrl('https://www.youtube.com/embed/');

    function makePlaylist(collection) {
        $scope.iframeList = [];
        var firstVideo;

        var collectionfiltered = $scope.collectionsResult.filter(function(obj) {
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
        $scope.iframeList = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + firstVideo.toString() + "?enablejsapi=1&loop=1&playlist=" + $scope.iframeList.toString());


    }

    function getChannels() {
        var data = {};
        googleService.googleApiClientReady("Subscriptions").then(function(data) {
                data = data;
                return data;
            },
            function(error) {
                console.log('Failed: ' + error)
            });
        return data;
    }
}
