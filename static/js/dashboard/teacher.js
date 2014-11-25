var bovine = angular.module('bovine', []);

bovine.controller('teacherModule', ['$scope', '$http', function($scope, $http) {
    $scope.getClasses = function() {
        $http.get('/teacher/classes/list').success(function(data, status) {
            $scope.data = data;
        })
        .error(function() {
            
        });
    }
}]);