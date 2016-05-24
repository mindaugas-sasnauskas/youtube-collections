angular.module('youtApp')
  .directive('search', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/search.html',
      replace: false,
      link: function ($scope, element, attr) {

      }
    };
  })
  .directive('searchlist', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/searchlist.html',
      replace: false,
      link: function ($scope, element, attr) {

      }
    };
  })
  .directive('subscriptions', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/subscriptions.html',
      replace: false,
      link: function ($scope, element, attr) {

      }
    };
  }).directive('collections', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/collections.html',
      replace: false,
      link: function ($scope, element, attr) {

      }
    };
  })
  .directive('subscriptionslist', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/subscriptionslist.html',
      replace: false,
      link: function ($scope, element, attr) {

      }
    };
  })
  .directive('liveplaylist', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/liveplaylist.html',
      replace: false,
      link: function ($scope, element, attr) {

      }
    };
  })
  .directive('myplaylists', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/myplaylists.html',
      replace: false,
      link: function ($scope, element, attr) {

      }
    };
  })
