angular.module('youtApp')
.service('serviceAlerts', ['$rootScope', function($rootScope) {
    $rootScope.alerts =[]
    this.alertAdd = function(msg,type){

        $rootScope.alerts.push({msg:msg, type:type})

        setTimeout(function(){
            $rootScope.alerts = []
        },5000)
    }

}])