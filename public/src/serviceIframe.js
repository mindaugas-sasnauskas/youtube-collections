angular.module('youtApp')
    .service('serviceIframe', ['$rootScope', '$sce', 'getPlaylistsItemsService',  function($rootScope, $sce, getPlaylistsItemsService) {
        $rootScope.iframeVideoItem = "";
        this.makePlaylist =function makePlaylistFn(collectionsResult, collection){
            var iframeList = [];
            var firstVideo;
            for (var i=0; i<collectionsResult.length; i++){
                if(collectionsResult[i].title == collection){
            var    collectionfiltered = collectionsResult[i]
                }
            }
            if (collectionfiltered.items[0].uploads == undefined) {
                setTimeout(function() {
                    makePlaylistFn(collectionsResult, collection)
                }, 500)
                return;
            }
            // if (collectionfiltered.items[0].uploads.items.length == 0) {
            //     setTimeout(function() {
            //         makePlaylistFn(collectionsResult, collection)
            //     }, 100)
            //     return;
            // }

            for (var z = 0; z < collectionfiltered.items.length; z++) {
                if (collectionfiltered.items[z].uploads !== undefined){


                var items = collectionfiltered.items[z].uploads.items;
                for (var j = 0; j < items.length; j++) {
                    if (z == 0) {
                        firstVideo = items[j].snippet.resourceId.videoId;
                    }else{

                    iframeList.push(items[j].snippet.resourceId.videoId);

                    }}
                }
            }

            $rootScope.iframeVideoItem = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"
            + firstVideo + "?enablejsapi=1&loop=1&playlist="
            + iframeList.toString());
            $rootScope.iframeVideo = true;

        }
        this.makePlaylistCron = function makePlaylistCronFn(collectionsResult, collection, type) {

            for (var i=0; i<collectionsResult.length; i++){
                if(collectionsResult[i].title == collection){
             var   collectionfiltered = collectionsResult[i]
                }
            }

            if (collectionfiltered.uploads.length == 0) {
                setTimeout(function() {
                    makePlaylistCronFn(collectionsResult, collection, type)
                }, 100)
                return;
            }
            collectionfiltered.uploads.sort(function(a, b) {
                return new Date(b.publishedAt) - new Date(a.publishedAt);
            });
            iframeListCron = [];
            var firstVideoCron;
            for (var i = 0; i < collectionfiltered.uploads.length; i++) {

                if (i == 0) {
                    firstVideoCron = collectionfiltered.uploads[i].videoId;
                }
                else {
                    iframeListCron.push(collectionfiltered.uploads[i].videoId);

                }

            }
            // var length = $scope.iframeList.length;
            if (type == "tab") {
                window.open("https://www.youtube.com/v/" + firstVideoCron.toString() + "?enablejsapi=1&loop=1&playlist=" + iframeListCron.toString(), '_blank');
            }
            else {
                $rootScope.iframeVideoItem = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + firstVideoCron.toString() + "?enablejsapi=1&loop=1&playlist=" + iframeListCron.toString());

                $rootScope.iframeVideo = true;
            }
        }
        this.previewVideo = function previewVideoFn(subscriptionsResult, videoId, channelId) {

            var subscriptionsfiltered = subscriptionsResult.filter(function(obj) {
                return obj.channelId == channelId;
            });
            var playlist = []

            if (subscriptionsfiltered[0].uploads == undefined) {
                getPlaylistsItemsService.playlistItemsGetMoreUploads(subscriptionsResult, channelId)

                setTimeout(function() {
                    previewVideoFn(subscriptionsResult, videoId, channelId)
                }, 100)

            }
            else {
                for (var i = 0; i < subscriptionsfiltered[0].uploads.items.length; i++) {
                    playlist.push(subscriptionsfiltered[0].uploads.items[i].contentDetails.videoId)
                }
            }


            $rootScope.iframeVideo = true;
            $rootScope.iframeVideoItem = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + videoId + "?enablejsapi=1&loop=1&playlist=" + playlist.toString())
        }

    }])