bovine.controller('findUser', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.lookup = function(username, firstName, middleName, lastName, email, role) {
        var queryString = '/user/lookup';
        if (username   ) queryString = queryString.concat('?username='   + username   );
        if (firstName  ) queryString = queryString.concat('?firstName='  + firstName  );
        if (middleName ) queryString = queryString.concat('?middleName=' + middleName );
        if (lastName   ) queryString = queryString.concat('?lastName='   + lastName   );
        if (email      ) queryString = queryString.concat('?email='      + email      );
        if (role       ) queryString = queryString.concat('?role='       + role       );
        if (username || firstName || middleName || lastName || email || role) {
            $http.get(queryString)
            .success(function(data, status){ $scope.data = data })
            .error(function(data,status){ $scope.data = data }); 
        } else $scope.data = null;
    }
    $scope.remove = function(id) {
        if (!id) return true;
        
        $http.get('/user/remove?target=' + id)
        .success(function(data, status){ showSuccess(data) })
        .error(function(data, status){ showError(data) });
    }
    $scope.shareTarget = function(id) { sharedTarget.set(id) }
}]);
bovine.controller('addUser', ['$scope', '$http', function($scope, $http) {
    // For testing purposes, will be removed later
    $scope.schools = ['West Side','East Side'];
    
    $scope.write = function(id, username, email, password, firstName, middleName, lastName, school, role, grade){
        var queryString = '/user/create';
        var postData = {};
        if (username   ) postData.username   = username   ;
        if (email      ) postData.email      = email      ;
        if (password   ) postData.password   = password   ;
        if (firstName  ) postData.firstName  = firstName  ;
        if (middleName ) postData.middleName = middleName ;
        if (lastName   ) postData.lastName   = lastName   ;
        if (school     ) postData.school     = school     ;
        if (role       ) postData.role       = role       ;
        if (grade      ) postData.grade      = grade      ;
        
        if (username && email && password && firstName && middleName && lastName && role && grade) {
            $http.post(queryString, postData)
            .success(function(data, status, headers, config){ showSuccess(data); })
            .error(function(data, status, headers, config){ showError(data) });
        } else showError('ERROR:  One of the required fields was left empty');
    };
}]);
bovine.controller('editUser', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.schools = ['West Side','East Side'];
    $( document ).ready(function() {
        $('#userEdit').on('shown.bs.modal', function() {
            $http.get('/user/lookup?id=' + sharedTarget.get()).success(function(data, status) {
                $scope.oldTarget = clone(data[0]);
                $scope.target = clone(data[0]);
                sharedTarget.set('');
            });
        });
    });
    $scope.write = function() {
        var post = {};
        if ($scope.target.username   != $scope.oldTarget.usename    ) post.username   = $scope.target.username   ;
        if ($scope.target.email      != $scope.oldTarget.email      ) post.email      = $scope.target.email      ;
        if ($scope.target.password   != $scope.oldTarget.password   ) post.password   = $scope.target.password   ;
        if ($scope.target.firstName  != $scope.oldTarget.firstName  ) post.firstName  = $scope.target.firstName  ;
        if ($scope.target.middleName != $scope.oldTarget.middleName ) post.middleName = $scope.target.middleName ;
        if ($scope.target.lastName   != $scope.oldTarget.lastName   ) post.lastName   = $scope.target.lastName   ;
        if ($scope.target.school     != $scope.oldTarget.school     ) post.school     = $scope.target.school     ;
        if ($scope.target.role       != $scope.oldTarget.role       ) post.role       = $scope.target.role       ;
        if ($scope.target.grade      != $scope.oldTarget.grade      ) post.grade      = $scope.target.grade      ;
        
        if (post.username || post.password || post.firstName || post.middleName || post.lastName || post.school || post.role || post.grade) {
            post._id = $scope.oldTarget.id;
            $http.post('/user/update', post)
            .success(function(data, status, headers, config){ showSuccess(data) })
            .error(function(data, status, headers, config){ showError(data) });
        }
    };
}]);
bovine.controller('findClass', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.lookup = function(name, category, website, grade) {
        var queryString = '/class/lookup';
        if (name     ) queryString = queryString.concat('?name='     + name     );
        if (category ) queryString = queryString.concat('?category=' + category );
        if (website  ) queryString = queryString.concat('?website='  + website  );
        if (grade    ) queryString = queryString.concat('?grade='    + grade    );
        
        if (name || category || website || grade) {
            $http.get(queryString)
            .success(function(data,status) { $scope.data = data })
            .error(function(data,status) { $scope.data = data });
        }
    }
    $scope.remove = function(id) {
        if (!id) return true;
        
        $http.get('/class/remove?target=' + id)
        .success(function(data,status){ showSuccess(data) })
        .error(function(data, status){ showError(data) });
    }
    $scope.shareTarget = function(id) { sharedTarget.set(id) }
}]);
bovine.controller('addClass', ['$scope', '$http', function($scope, $http) {
    $scope.getTeachers = function() { $http.get('/user/lookup?role=2').success( function(data, status) { $scope.teachers = data } ) }
    $scope.write = function(name, category, website, grade, teacher, desc){
        var queryString = '/class/create';
        var postData = {};
        if (name     ) postData.name     = name     ;
        if (category ) postData.category = category ;
        if (website  ) postData.website  = website  ;
        if (grade    ) postData.grade    = grade    ;
        if (teacher  ) postData.teacher  = teacher  ;
        if (desc     ) postData.desc     = desc     ;
        
        if (name) {
            $http.post(queryString, postData)
            .success(function(data, status, headers, config){ showSuccess(data) })
            .error(function(data, status, headers, config){ showError(data) });
        } else $scope.error = 'ERROR:  One of the required fields was left empty';
    }
}]);
bovine.controller('editClass', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.schools = ['West Side','East Side'];
    $( document ).ready(function() {
        $('#classEdit').on('shown.bs.modal', function() {
            $http.get('/class/lookup?id=' + sharedTarget.get()).success(function(data, status) {
                $scope.oldTarget = clone(data[0]);
                $scope.target = clone(data[0]);
                sharedTarget.set('');
            });
        });
    });
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
            .success(function(data, status, headers, config){ showSuccess(data) })
            .error(function(data, status, headers, config){ showError(data) });
        }
    };
}]);
bovine.controller('findSchool', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.lookup = function(name, type) {
        var queryString = '/school/lookup';
        if (name) queryString = queryString.concat('?name=' + name);
        if (type) queryString = queryString.concat('?type=' + type);
        
        if (name || type) {
            $http.get(queryString)
            .success(function(data,status) { $scope.data = data })
            .error(function(data,status) { $scope.data = data });
        }
    }
    $scope.remove = function(id) {
        if (!id) return true;
        
        $http.get('/school/remove?target=' + id).success(function(data,status){ showSuccess(data) })
        .error(function(data, status){ showError(data) });
    }
    $scope.shareTarget = function(id) { sharedTarget.set(id) }
}]);
bovine.controller('addSchool', ['$scope', '$http', function($scope, $http) {
    $scope.write = function(name, type, website, zipcode, district, city, state){
        var queryString = '/school/create';
        var postData = {};
        if (name     ) postData.name     = name     ;
        if (type     ) postData.type     = type     ;
        if (website  ) postData.website  = website  ;
        if (zipcode  ) postData.zipcode  = zipcode  ;
        if (district ) postData.district = district ;
        if (city     ) postData.city     = city     ;
        if (state    ) postData.state    = state    ;
        
        if (name && type) {
            $http.post(queryString, postData)
            .success(function(data, status, headers, config){ showSuccess(data) })
            .error(function(data, status, headers, config){ showError(data) });
        } else $scope.error = 'ERROR:  One of the required fields was left empty';
    }
}]);
bovine.controller('editSchool', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.schools = ['West Side','East Side'];
    $( document ).ready(function() {
        $('#schoolEdit').on('shown.bs.modal', function() {
            $http.get('/school/lookup?id=' + sharedTarget.get()).success(function(data, status) {
                $scope.oldTarget = clone(data[0]);
                $scope.target = clone(data[0]);
                sharedTarget.set('');
            });
        });
    });
    $scope.write = function() {
        var post = {};
        if ($scope.target.name     != $scope.oldTarget.name     ) post.name     = $scope.target.name     ;
        if ($scope.target.category != $scope.oldTarget.category ) post.category = $scope.target.category ;
        if ($scope.target.website  != $scope.oldTarget.website  ) post.website  = $scope.target.website  ;
        if ($scope.target.grade    != $scope.oldTarget.grade    ) post.grade    = $scope.target.grade    ;
        if ($scope.target.teacher  != $scope.oldTarget.teacher  ) post.teacher  = $scope.target.teacher  ;
        if (post.name || post.category || post.website || post.grade || post.teacher) {
            post._id = $scope.oldTarget.id;
            $http.post('/class/update', post)
            .success(function(data, status, headers, config){ showSuccess(data) })
            .error(function(data, status, headers, config){ showError(data) });
        }
    };
}]);