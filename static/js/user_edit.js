var bovine = angular.module('bovine', []);

bovine.controller('userEditorController', ['$scope', '$http', function($scope, $http) {
    $scope.schools = [
        'West Side',
        'East Side'
    ];
    
    $scope.write = function(id, username, email, password, firstName, middleName, lastName, school, role, grade){
        var postData = {};
        if (username) postData.username = username;
        if (email) postData.email = email;
        if (password) postData.password = password;
        if (firstName) postData.firstName = firstName;
        if (middleName) postData.middleName = middleName;
        if (lastName) postData.lastName = lastName;
        if (school) postData.school = school;
        if (role) postData.role = role;
        if (grade) postData.grade = grade;
        
        if (username || password || firstName || middleName || lastName || school || role || grade) {
            postData._id = id;
            $http.post('/admin/user/update', postData).success(function(data, status, headers, config){
                $scope.success = data;
            }).error(function(data, status, headers, config){
                $scope.error = data;
            });
        }
    };
}]);