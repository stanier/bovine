var bovine = angular.module('bovine', []);

bovine.controller('dashboardController', ['$scope', '$http', function($scope, $http) {
    $scope.lookup = function(username, email, id){
        var queryString = '/admin/lookup';
        if (username != null && username != '') queryString = queryString.concat('?username=' + username);
        if (email != null && email != '') queryString = queryString.concat('?email=' + email);
        if (id != null && id != '') queryString = queryString.concat('?id=' + id);
        if (username || email || id) {
            $http({method:'GET',url: queryString}).success(function(data,status){
                $scope.data = data;
            }).error(function(data,status){
                $scope.data = data;
            }); 
        } else $scope.data = null;
    };
}]);