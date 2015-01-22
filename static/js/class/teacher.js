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
            
            $http.get('/class/' + $scope.classId + '/students?detailed=true')
            .success(function(data, status) { $scope.students = clone(data) })
            .error(function(data, status) { showError(data) });
        
            $scope.modules = [];
            for (var i in $scope.oldTarget.modules) {
                $http.get('/class/' + $scope.classId + '/module/' + $scope.oldTarget.modules[i] + '/info')
                .success(function(data, status) {
                    $scope.modules.push(data);
                    
                    for (var j in $scope.modules[i-1].activities) {
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
        
    };
    $scope.write = function() {
        var post = {};
        if ( $scope.target.name     != $scope.oldTarget.name     ) post.name     = $scope.target.name     ;
        if ( $scope.target.category != $scope.oldTarget.category ) post.category = $scope.target.category ;
        if ( $scope.target.website  != $scope.oldTarget.website  ) post.website  = $scope.target.website  ;
        if ( $scope.target.grade    != $scope.oldTarget.grade    ) post.grade    = $scope.target.grade    ;
        if ( $scope.target.teacher  != $scope.oldTarget.teacher  ) post.teacher  = $scope.target.teacher  ;
        if ( $scope.target.desc     != $scope.oldTarget.desc     ) post.desc     = $scope.target.desc     ;
        
        if ( post.name || post.category || post.website || post.grade || post.teacher || post.desc) {
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
        if ( username   ) queryString = queryString.concat('?username='   + username   );
        if ( firstName  ) queryString = queryString.concat('?firstName='  + firstName  );
        if ( middleName ) queryString = queryString.concat('?middleName=' + middleName );
        if ( lastName   ) queryString = queryString.concat('?lastName='   + lastName   );
        if ( email      ) queryString = queryString.concat('?email='      + email      );
        if ( username || firstName || middleName || lastName || email ) {
            $http.get(queryString)
            .success(function(data, status){ $scope.enrollStudents = data })
            .error(function(data,status){ $scope.enrollStudents = data }); 
        } else $scope.data = null;
    }
    $scope.createModule = function(name, desc) {
        var post = {};
        if ( name ) post.name = name ;
        if ( desc ) post.desc = desc ;
        
        if ( post.name ) {
            $http.post('/class/' + $scope.classId + '/module/create', post)
            .success(function(data, status) {
                showSuccess(data);
                $scope.reInit();
            })
            .error(function(data, status) { showError(data) });
        }
    }
    $scope.removeModule = function(id) {
         $http.get('/class/' + $scope.classId + '/module/' + id + '/remove')
         .success(function(data, status) {
             showSuccess(data);
             $scope.reInit();
         })
         .error(function(data, status) { showError(data) });
    }
    $scope.editModule = function(id) {
        for(var i in $scope.modules) {
            if ( objectHasValue($scope.modules[i], id) ) {
                $scope.moduleOldTarget = clone($scope.modules[i]);
                $scope.moduleTarget = clone($scope.modules[i]);
                $('#editModule').modal('show');
            }
        }
    }
    $scope.updateModule = function(id) {
        var post = {};
        
        if ( $scope.moduleTarget.name != $scope.moduleOldTarget.name ) post.name = $scope.moduleTarget.name;
        if ( $scope.moduleTarget.desc != $scope.moduleOldTarget.desc ) post.desc = $scope.moduleTarget.desc;
        
        if ( post.name || post.desc ) {
           $http.post('/class/' + $scope.classId + '/module/' + id + '/update', post)
            .success(function(data, status) {
                showSuccess(data);
                $scope.reInit();
            })
            .error(function(data, status) { showError(data) }); 
        }
        
    }
    $scope.parseDesc = function(unit) {
        if (unit.desc) unit.parsedDesc = $sce.trustAsHtml(marked(unit.desc));
        else unit.parsedDesc = $sce.trustAsHtml('<i>dust</i>');
    }
    $scope.quiz = {
        questions : []
    }
    
    $scope.addQuestion = function() {
        $scope.quiz.questions[$scope.quiz.questions.length] = {
            id: $scope.quiz.questions.length + 1, 
            options: []
        };
    }
    $scope.questionClass = {
        choice : {
            add : function(question) { question.options[question.options.length] = { id: question.options.length + 1 } }
        },
        matching : {
            add : function(question) { question.options[question.options.length] = { id: question.options.length + 1 } }
        }
    }
    $scope.addActivity = function(parent) {
        $('#addActivity').modal('show');
        $scope.quiz.parent = parent;
    }
    $scope.createQuiz = function(quiz) {
        var post = { type: 'quiz' };
        
        if ( quiz.name      ) post.name    = quiz.name      ;
        if ( quiz.desc      ) post.desc    = quiz.desc      ;
        if ( quiz.questions ) post.content = { questions: quiz.questions };
        
        if ( post.name ) {
            $http.post('/class/' + $scope.classId +
                       '/module/' + quiz.parent +
                       '/activity/create', post)
            .success(function(data, status) {
                showSuccess(data);
                $scope.reInit();
            })
            .error(function(data, status) { showError(data) });
        }
    }
}]);