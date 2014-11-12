var bovine = angular.module('bovine', []);

bovine.controller('userEditorController', ['$scope', '$http', function($scope, $http) {
    $scope.write = function(username){
        var queryString = '/admin/user/update';
        
        if (username) {
            $http({method:'POST',url: queryString, data: {'data':'hello world'} }).success(function(){
                console.log('POST sent succesfully');
            }); 
        }
    };
}]);