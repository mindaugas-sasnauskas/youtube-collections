angular.module('youtApp')
  .directive('search', function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/search.html',
      replace: false,
      link: function($scope, element, attr) {

      }
    };
  })
  .directive('searchlist', function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/searchlist.html',
      replace: false,
      link: function($scope, element, attr) {

      }
    };
  })
  .directive('add2collection', function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/add2tollection.html',
      replace: false,
      link: function($scope, element, attr) {

      }
    };
  })
  .directive('removefromcollection', function() {
    return {
      restrict: 'EA',
      template: '<button type="button" name="button" ng-click="collection(\'remove\', item.title, item.channelId, collectionsResultItem.id)" class="btn btn-default pull-right">Remove</button>',
      replace: false,
      link: function($scope, element, attr) {
      }
    };
  })
  .directive('subscriptions', function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/subscriptions.html',
      replace: false,
      link: function($scope, element, attr) {

      }
    };
  }).directive('collections', function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/collections.html',
      replace: false,
      link: function($scope, element, attr) {

      }
    };
  })
  .directive('subscriptionslist', function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/subscriptionslist.html',
      replace: false,
      link: function($scope, element, attr) {

      }
    };
  })
  .directive('liveplaylist', ['$document',function($document) {
    return {
      restrict: 'EA',
      templateUrl: 'views/liveplaylist.html',
      replace: false,
      link: function($scope, element, attr) {
        var startX = 0, startY = 0, x = 0, y = 0;

        $("#draggable").css({
        position: 'relative',
        // backgroundColor: 'lightgrey',
        cursor: 'pointer'
        });
        element.on('mouseup', function(event) {
          $("#draggable iframe").css('height',element[0].offsetHeight-50);
           $("#draggable").css('margin-bottom',-element[0].offsetHeight-50)

          })
        $("#draggable").on('mousedown', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
          console.log(element[0].offsetHeight)
        });

        function mousemove(event) {
          y = event.pageY - startY;
          x = event.pageX - startX;
          $("#draggable").css({
            top: y + 'px',
            left:  x + 'px'
          });
        }

        function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        }
      }
    };
  }])
  .directive('myplaylists', function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/myplaylists.html',
      replace: false,
      link: function($scope, element, attr) {

      }
    };
  })
