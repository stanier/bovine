bovine.controller('teacherModule', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $http.get('/user/profile/id')
    .success(function(data, status, headers, config) {
        $scope.id = data;
        $scope.getClasses();
    })
    .error(function(data, status) { showError(data) });
    
    $scope.getClasses = function() {
        $http.get('/class/lookup?teacher=' + $scope.id)
        .success(function(data, status) { $scope.data = data })
        .error(function(data, status) { showError(data) });
    };
    $scope.shareTarget = function(id) { sharedTarget.set(id) }
    $scope.edit = function(id) { angular.element(document.getElementById('edit')).scope().init(id) }
}]);
bovine.controller('editClass', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.init = function(id) {
        var target = clone(id);
        $http.get('/class/lookup?id=' + target)
        .success(function(data, status) {
            $scope.oldTarget = clone(data[0]);
            $scope.target    = clone(data[0]);
        })
        .error(function(data, status) { showError(data) });
        
        $http.get('/class/' + id + '/students?detailed=true')
        .success(function(data, status) { $scope.students = clone(data) })
        .error(function(data, status) { showError(data) });
    };
    $scope.write = function() {
        var post = {};
        if ($scope.target.name     != $scope.oldTarget.name     ) post.name     = $scope.target.name     ;
        if ($scope.target.category != $scope.oldTarget.category ) post.category = $scope.target.category ;
        if ($scope.target.website  != $scope.oldTarget.website  ) post.website  = $scope.target.website  ;
        if ($scope.target.grade    != $scope.oldTarget.grade    ) post.grade    = $scope.target.grade    ;
        if ($scope.target.teacher  != $scope.oldTarget.teacher  ) post.teacher  = $scope.target.teacher  ;
        if ($scope.target.desc     != $scope.oldTarget.desc     ) post.desc     = $scope.target.desc     ;
        
        if (post.name || post.category || post.website || post.grade || post.teacher || post.desc) {
            post._id = $scope.oldTarget.id;
            $http.post('/class/update', post)
            .success(function(data, status) { showSuccess(data) })
            .error(function(data, status) { showError(data) });
        }
    }
    $scope.enroll = function(course, student) {
        $http.post('/class/' + course + '/enroll', {student: student})
        .success(function(data, status) { showSuccess(data) })
        .error(function(data, status) { showError(data) });
    }
    $scope.drop = function(course, student) {
        $http.post('/class/' + course + '/drop', {student: student})
        .success(function(data, status) { showSuccess(data) })
        .enroll(function(data, status) { showError(data) });
    }
    $scope.lookup = function(username, firstName, middleName, lastName, email) {
        var queryString = '/user/lookup';
        if (username   ) queryString = queryString.concat('?username='   + username   );
        if (firstName  ) queryString = queryString.concat('?firstName='  + firstName  );
        if (middleName ) queryString = queryString.concat('?middleName=' + middleName );
        if (lastName   ) queryString = queryString.concat('?lastName='   + lastName   );
        if (email      ) queryString = queryString.concat('?email='      + email      );
        if (username || firstName || middleName || lastName || email ) {
            $http.get(queryString)
            .success(function(data, status){ $scope.enrollStudents = data })
            .error(function(data,status){ $scope.enrollStudents = data }); 
        } else $scope.data = null;
    }
}]);