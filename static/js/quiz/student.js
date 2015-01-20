bovine.controller('quizController', ['$http', '$scope', function($http, $scope) {
    $scope.getQuiz = function(course, parent, quiz) {
        $http.get('/class/' + course + '/module/' + parent + '/activity/' + quiz + '/quiz/attempt')
        .success(function(data, status) {
            $scope.attemptData = {
                course    : course,
                parent    : parent,
                quiz      : quiz  ,
                questions : data
            }
            $scope.started = true;
            
            console.log($scope.questions);
        })
        .error(function(data, status) { showError(data) });
    }
    $scope.submitQuiz = function() {
        $http.post('/class/'    + $scope.attemptData.course +
                   '/module/'   + $scope.attemptData.parent +
                   '/activity/' + $scope.attemptData.quiz   +
                   '/quiz/submit',
                   $scope.attemptData)
        .success(function(data, status) { showSuccess(data) })
        .error(function(data, status) { showError(data) });
    }
}]);