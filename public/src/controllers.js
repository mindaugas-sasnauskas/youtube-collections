angular.module('youtApp')
    .controller('searchController', searchController)
    .controller('subscriptionsController', subscriptionsController)
    .controller('AlertController', AlertController)

function searchController($rootScope, $scope, googleService,$sce) {
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
            $scope.iframeListSearchVid = []
            for (var i = 0; data.items.length>i; i++){
                if(data.items[i].id.kind == 'youtube#video'){
                    var it = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + data.items[i].id.videoId.toString());
                    $scope.iframeListSearchVid.push(it)
                }
            }
        }, function(error) {
            console.log('Failed: ' + error)
        });
    }
$scope.iframeList = $sce.trustAsResourceUrl('https://www.youtube.com/embed/');
}

function AlertController($scope, serviceAlerts) {};

function subscriptionsController(
    $window,
    $rootScope,
    $scope,
    $http,
    $sce,
    serviceAlerts,
    googleService,
    getPlaylistsItemsService,
    serviceCollections,
    serviceIframe) {


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
    // $scope.iframeVideoItem = "";
    $scope.previewVideo = function(videoId, channelId){
        serviceIframe.previewVideo($scope.subscriptionsResult, videoId, channelId)
    }
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
                $scope.collectionsResult = [];
                for (var i = 0; i < response.data.items.length; i++) {
                    if (response.data.items[i].type == "collection") {
                        $scope.collectionsResult.push(response.data.items[i]);
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

        for (var x = 0; $scope.collectionsResult.length>x; x++) {
            $scope.collectionsResult[x].uploads = [];

        }
    }

    function refreshSubscriptions() {
        $http.get('/api/userItems').then(
            function(response) {
                for (var i = 0; i < response.data.items.length; i++) {
                    if (response.data.items[i].type == "subsctiptions") {
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


    $scope.makePlaylist = function(collection) {
        serviceIframe.makePlaylist($scope.collectionsResult, collection)
    }
    $scope.makePlaylistCron = function makePlaylistCronFn(collection, type) {
       serviceIframe.makePlaylistCron($scope.collectionsResult, collection,type)
    }


    $scope.iframeList = $sce.trustAsResourceUrl('https://www.youtube.com/embed/');

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
