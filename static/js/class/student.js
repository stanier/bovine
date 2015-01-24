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
            
            $scope.oldTarget.modules.forEach(function(element, index, array) {
                $http.get('/class/' + $scope.classId + '/module/' + element + '/info')
                .success(function(data, status) {
                    data.activities.forEach(function(element2, index2, array2) {
                        $http.get('/class/'   + $scope.classId +
                                 '/module/'   + element.id     +
                                 '/activity/' + element2       +
                                 '/info')
                        .success(function(data, status) { data.detailedActivities.push(data) })
                        .error(  function(data, status) { showError(data)                    });
                        
                        $scope.modules.push(data);
                    });
                })
                .error(function(data, status) { showError(data) });
            });
        })
        .error(function(data, status) { showError(data) });
    }
    $scope.parseDesc = function(unit) {
        if (unit.desc) unit.parsedDesc = $sce.trustAsHtml(marked(unit.desc));
        else unit.parsedDesc = $sce.trustAsHtml('<i>dust</i>');
    }
}]);