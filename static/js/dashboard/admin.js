var bovine = angular.module('bovine', [])
    .service('sharedTarget', function() {
        var target;
        return {
            get: function() { return target },
            set: function(id) { target = id }
        }
    });

bovine.controller('findUser', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.lookup = function(username, firstName, middleName, lastName, email, role) {
        var queryString = '/admin/user/lookup';
        if (username) queryString = queryString.concat('?username=' + username);
        if (firstName) queryString = queryString.concat('?firstName=' + firstName);
        if (middleName) queryString = queryString.concat('?middleName=' + middleName);
        if (lastName) queryString = queryString.concat('?lastName=' + lastName);
        if (email) queryString = queryString.concat('?email=' + email);
        if (role) queryString = queryString.concat('?role=' + role)
        if (username || firstName || middleName || lastName || email || role) {
            $http.get(queryString)
            .success(function(data, status){ $scope.data = data })
            .error(function(data,status){ $scope.data = data }); 
        } else $scope.data = null;
    }
    $scope.remove = function(id) {
        if (!id) return true;
        
        $http.get('/admin/user/remove?target=' + id)
        .success(function(data, status){ $scope.success = data })
        .error(function(data, status){ $scope.error = data });
    }
    $scope.dismissSuccess = function() { $scope.success = null }
    $scope.dismissError = function() { $scope.error = null }
    $scope.shareTarget = function(id) { sharedTarget.set(id) }
}]);
bovine.controller('addUser', ['$scope', '$http', function($scope, $http) {
    // For testing purposes, will be removed later
    $scope.schools = [
        'West Side',
        'East Side'
    ];
    
    $scope.write = function(id, username, email, password, firstName, middleName, lastName, school, role, grade){
        var queryString = '/admin/user/create';
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
        
        if (username && email && password && firstName && middleName && lastName && role && grade) {
            $http.post(queryString, postData)
            .success(function(data, status, headers, config){ $scope.success = data })
            .error(function(data, status, headers, config){ $scope.error = data });
        } else $scope.error = 'ERROR:  One of the required fields was left empty';
    };
    $scope.dismissSuccess = function() { $scope.success = null; }
    $scope.dismissError = function() { $scope.error = null }
}]);
bovine.controller('editUser', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.schools = [
        'West Side',
        'East Side'
    ];
    $( document ).ready(function() {
        $('#userEdit').on('shown.bs.modal', function() {
            $http.get('/admin/user/lookup?id=' + sharedTarget.get()).success(function(data, status) {
                $scope.oldTarget = clone(data[0]);
                $scope.target = clone(data[0]);
                sharedTarget.set('');
            });
        });
    });
    $scope.write = function() {
        var post = {};
        if ($scope.target.username != $scope.oldTarget.usename) post.username = $scope.target.username;
        if ($scope.target.email != $scope.oldTarget.email) post.email = $scope.target.email;
        if ($scope.target.password != $scope.oldTarget.password) post.password = $scope.target.password;
        if ($scope.target.firstName != $scope.oldTarget.firstName) post.firstName = $scope.target.firstName;
        if ($scope.target.middleName != $scope.oldTarget.middleName) post.middleName = $scope.target.middleName;
        if ($scope.target.lastName != $scope.oldTarget.lastName) post.lastName = $scope.target.lastName;
        if ($scope.target.school != $scope.oldTarget.school) post.school = $scope.target.school;
        if ($scope.target.role != $scope.oldTarget.role) post.role = $scope.target.role;
        if ($scope.target.grade != $scope.oldTarget.grade) post.grade = $scope.target.grade;
        
        if (post.username || post.password || post.firstName || post.middleName || post.lastName || post.school || post.role || post.grade) {
            post._id = $scope.oldTarget.id;
            $http.post('/admin/user/update', post)
            .success(function(data, status, headers, config){ $scope.success = data })
            .error(function(data, status, headers, config){ $scope.error = data });
        }
    };
}]);
bovine.controller('findClass', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.lookup = function(name, category, website, grade) {
        var queryString = '/admin/class/lookup';
        if (name) queryString = queryString.concat('?name=' + name);
        if (category) queryString = queryString.concat('?category=' + category);
        if (website) queryString = queryString.concat('?website=' + website);
        if (grade) queryString = queryString.concat('?grade=' + grade);
        
        if (name || category || website || grade) {
            $http.get(queryString)
            .success(function(data,status) { $scope.data = data })
            .error(function(data,status) { $scope.data = data });
        }
    }
    $scope.remove = function(id) {
        if (!id) return true;
        
        $http.get('/admin/class/remove?target=' + id)
        .success(function(data,status){ $scope.success = data })
        .error(function(data, status){ $scope.error = data });
    }
    $scope.dismissSuccess = function() { $scope.success = null }
    $scope.dismissError = function() { $scope.error = null }
    $scope.shareTarget = function(id) { sharedTarget.set(id) }
}]);
bovine.controller('addClass', ['$scope', '$http', function($scope, $http) {
    $scope.getTeachers = function() {
        $http.get('/admin/user/lookup?role=2').success(function(data, status) { $scope.teachers = data });
    }
    $scope.write = function(name, category, website, grade, teacher){
        var queryString = '/admin/class/create';
        var postData = {};
        if (name) postData.name = name;
        if (category) postData.category = category;
        if (website) postData.website = website;
        if (grade) postData.grade = grade;
        if (teacher) postData.teacher = teacher;
        
        if (name) {
            $http.post(queryString, postData)
            .success(function(data, status, headers, config){ $scope.success = data })
            .error(function(data, status, headers, config){ $scope.error = data });
        } else $scope.error = 'ERROR:  One of the required fields was left empty';
    }
    $scope.dismissSuccess = function() { $scope.success = null }
    $scope.dismissError = function() { $scope.error = null }
}]);
bovine.controller('editClass', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.schools = [
        'West Side',
        'East Side'
    ];
    $( document ).ready(function() {
        $('#classEdit').on('shown.bs.modal', function() {
            $http.get('/admin/class/lookup?id=' + sharedTarget.get()).success(function(data, status) {
                $scope.oldTarget = clone(data[0]);
                $scope.target = clone(data[0]);
                sharedTarget.set('');
            });
        });
    });
    $scope.write = function() {
        var post = {};
        if ($scope.target.name != $scope.oldTarget.name) post.name = $scope.target.name;
        if ($scope.target.category != $scope.oldTarget.category) post.category = $scope.target.category;
        if ($scope.target.website != $scope.oldTarget.website) post.website = $scope.target.website;
        if ($scope.target.grade != $scope.oldTarget.grade) post.grade = $scope.target.grade;
        if ($scope.target.teacher != $scope.oldTarget.teacher) post.teacher = $scope.target.teacher;
        if (post.name || post.category || post.website || post.grade || post.teacher) {
            post._id = $scope.oldTarget.id;
            $http.post('/admin/class/update', post)
            .success(function(data, status, headers, config){ $scope.success = data })
            .error(function(data, status, headers, config){ $scope.error = data });
        }
    };
}]);
bovine.controller('findSchool', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.lookup = function(name, type) {
        var queryString = '/admin/school/lookup';
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
        
        $http.get('/admin/school/remove?target=' + id).success(function(data,status){ $scope.success = data })
        .error(function(data, status){ $scope.error = data });
    }
    $scope.dismissSuccess = function() { $scope.success = null }
    $scope.dismissError = function() { $scope.error = null }
    $scope.shareTarget = function(id) { sharedTarget.set(id) }
}]);
bovine.controller('addSchool', ['$scope', '$http', function($scope, $http) {
    $scope.write = function(name, type, website, zipcode, district, city, state){
        var queryString = '/admin/school/create';
        var postData = {};
        if (name) postData.name = name;
        if (type) postData.type = type;
        if (website) postData.website = website;
        if (zipcode) postData.zipcode = zipcode;
        if (district) postData.district = district;
        if (city) postData.city = city;
        if (state) postData.state = state;
        
        if (name && type) {
            $http.post(queryString, postData)
            .success(function(data, status, headers, config){ $scope.success = data })
            .error(function(data, status, headers, config){ $scope.error = data });
        } else $scope.error = 'ERROR:  One of the required fields was left empty';
    }
    $scope.dismissSuccess = function() { $scope.success = null }
    $scope.dismissError = function() { $scope.error = null }
}]);
bovine.controller('editSchool', ['$scope', '$http', 'sharedTarget', function($scope, $http, sharedTarget) {
    $scope.schools = [
        'West Side',
        'East Side'
    ];
    $( document ).ready(function() {
        $('#schoolEdit').on('shown.bs.modal', function() {
            $http.get('/admin/school/lookup?id=' + sharedTarget.get()).success(function(data, status) {
                $scope.oldTarget = clone(data[0]);
                $scope.target = clone(data[0]);
                sharedTarget.set('');
            });
        });
    });
    $scope.write = function() {
        var post = {};
        if ($scope.target.name != $scope.oldTarget.name) post.name = $scope.target.name;
        if ($scope.target.category != $scope.oldTarget.category) post.category = $scope.target.category;
        if ($scope.target.website != $scope.oldTarget.website) post.website = $scope.target.website;
        if ($scope.target.grade != $scope.oldTarget.grade) post.grade = $scope.target.grade;
        if ($scope.target.teacher != $scope.oldTarget.teacher) post.teacher = $scope.target.teacher;
        if (post.name || post.category || post.website || post.grade || post.teacher) {
            post._id = $scope.oldTarget.id;
            $http.post('/admin/class/update', post)
            .success(function(data, status, headers, config){ $scope.success = data })
            .error(function(data, status, headers, config){ $scope.error = data });
        }
    };
}]);

function clone(o) {
    if (null == o || "object" != typeof o) return o;
    var c = o.constructor();
    for (var a in o) { if (o.hasOwnProperty(a)) c[a] = o[a] }
    return c;
}