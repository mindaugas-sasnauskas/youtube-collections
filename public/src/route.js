angular.module('youtApp')
.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/live/:vidId', {
    templateUrl: 'live-playlist.html',
    controller: 'live-playlist',
    resolve: {
      // I will cause a 1 second delay
      delay: function($q, $timeout) {
        var delay = $q.defer();
        $timeout(delay.resolve, 1000);
        return delay.promise;
      }
    }
  })
  .when('/live/:vidId/ch/:chapterId', {
    templateUrl: 'chapter.html',
    controller: 'ChapterController'
  });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});
})(window.angular);
