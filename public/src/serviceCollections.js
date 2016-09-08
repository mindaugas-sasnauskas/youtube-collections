 angular.module('youtApp')
     .service('serviceCollections', ['$http', '$q','serviceAlerts', function($http, $q,serviceAlerts) {


         this.collectionAdd = function(type, title, channelId, collection) {
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
                     serviceAlerts.alertAdd('Successfuly added to collection','success');
                 },
                 function() {
                     console.log("error post");
                      serviceAlerts.alertAdd( 'Could not add to collection','danger');
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
                     serviceAlerts.alertAdd("Item removed", 'success')
                 },
                 function() {
                     console.log("error post");
                     serviceAlerts.alertAdd("Item failed to be removed", 'warning')
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
                     serviceAlerts.alertAdd("Collection added", 'success')
                 },
                 function() {
                     console.log("error post");
                     serviceAlerts.alertAdd("Collection failed to be added", 'warning')
                 });
         }
         this.removeCollection = function(collectionName) {
             data = {
                 title: collectionName
             }
             $http.delete('/api/' + collectionName).then(
                 function(response) {
                     console.log("successful post");
                     serviceAlerts.alertAdd("Item removed", 'success')

                 },
                 function() {
                     console.log("error post");
                     serviceAlerts.alertAdd("Item failed to be removed", 'warning')
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