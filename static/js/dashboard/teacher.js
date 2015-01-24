bovine.controller('dashboardController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    $scope.getEnrolled = function() {
        $http.get('/user/profile/id')
        .success(function(data, status, headers, config) {
            $scope.id = data;
            $scope.getClasses();
        })
        .error(function(data, status) { showError(data) });
    }
    
    $scope.getClasses = function() {
        $http.get('/class/lookup?teacher=' + $scope.id)
        .success(function(data, status) {
            $scope.enrolled = data;
            
            $scope.enrolled.forEach(function(entry) {
                entry.teacher = { id: entry.teacher };
                $http.get('/user/profile/' + entry.teacher.id + '/name')
                .success(function(data, status) { entry.teacher.name = data               })
                .error(  function(data, status) { entry.teacher.name = 'An error occured' });
            });
        })
        .error(function(data, status) { $scope.enrolled = data });
    }
    $scope.parseDesc = function(unit) {
        unit.parsedDesc = (unit.desc) ? $sce.trustAsHtml(marked(unit.desc)) : $sce.trustAsHtml('<i>dust</i>') ;
    }
}]);