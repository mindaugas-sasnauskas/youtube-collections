 angular.module('youtApp')
     .service('serviceCollections', ['$http', '$q', function($http, $q) {


         this.collectionAdd = function(type, title, channelId, collection) {
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
                 function(response) {
                     console.log("successful post");
                     //   $scope.alerts.push({type: 'success',msg: 'Successfuly added to collection'});
                 },
                 function() {
                     console.log("error post");
                     //   $scope.alerts.push({type: 'danger',msg: 'Could not add to collection'});
                 });
         }
         this.collectionRemove = function(type, title, channelId, collection) {
             channelId = channelId.substring(2);
             data = {
                 type: type,
                 title: title,
                 collection: collection,
                 channelId: "UC" + channelId,
                 uploadsId: "UU" + channelId
             }
             var config = "";

             $http.put('/api/' + collection, JSON.stringify(data)).then(
                 function(response) {
                     console.log("successful post");
                 },
                 function() {
                     console.log("error post");
                 });
         }
         this.newCollection = function(collectionName) {
             data = {
                 type: "collection",
                 title: collectionName
             }
             $http.post('/api/yout', JSON.stringify(data)).then(
                 function(response) {
                     console.log("successful post");
                 },
                 function() {
                     console.log("error post");
                 });
         }
         this.removeCollection = function(collectionName) {
             data = {
                 title: collectionName
             }
             $http.delete('/api/' + collectionName).then(
                 function(response) {
                     console.log("successful post");

                 },
                 function() {
                     console.log("error post");
                 });
         }
         this.getCollections = function(collectionsResult) {
             var collectionsResult1
             $http.get('/api/userItems').then(
                 function(response, collectionsResult) {
                     collectionsResult = [];
                     for (var i = 0; i < response.data.items.length; i++) {
                         if (response.data.items[i].type == "collection") {
                             collectionsResult.push(response.data.items[i]);

                         }
                     }


                     collectionsResult1 = collectionsResult
                     console.log(collectionsResult1)
                     console.log("successful get");
                 },
                 function() {
                     console.log("error post");
                 });
             console.log(collectionsResult1)
             this.collectionsResult = collectionsResult1
         }


     }])