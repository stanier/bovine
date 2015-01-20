bovine.controller('classController', ['$scope', '$http', '$sce', 'sharedTarget', function($scope, $http, $sce, sharedTarget) {
    $scope.init = function(id) {
        $scope.classId = clone(id);
        $scope.reInit();
    }
    $scope.reInit = function() {
        $http.get('/class/lookup?id=' + $scope.classId)
        .success(function(data, status) {
            $scope.oldTarget = clone(data[0]);
            $scope.target    = clone(data[0]);
        
            $scope.modules = [];
            for (var i in $scope.oldTarget.modules.length) {
                $http.get('/class/' + $scope.classId + '/module/' + $scope.oldTarget.modules[i] + '/info')
                .success(function(data, status) {
                    $scope.modules.push(data);
                    
                    for (var j in $scope.modules[i-1].activities.length) {
                        $scope.modules[i-1].detailedActivities = [];
                        
                        $http.get('/class/' + $scope.classId +
                                  '/module/' + $scope.modules[i-1].id +
                                  '/activity/' + $scope.modules[i-1].activities[j] +
                                  '/info')
                        .success(function(data, status) { $scope.modules[i-1].detailedActivities.push(data) })
                        .error(function(data, status) { showError(data) });
                    }
                })
                .error(function(data, status) { showError(data) });
            }
        })
        .error(function(data, status) { showError(data) });
    }
    $scope.parseDesc = function(unit) {
        if (unit.desc) unit.parsedDesc = $sce.trustAsHtml(marked(unit.desc));
        else unit.parsedDesc = $sce.trustAsHtml('<i>dust</i>');
    }
}]);