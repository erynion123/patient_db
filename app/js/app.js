angular
.module('patient_db',[
 'ui.router',
 'ui.bootstrap',
 'ui.bootstrap.tpls',
 'firebase',
 'angularMoment'
 ])
 .config(['$stateProvider','$urlRouterProvider','$locationProvider',function($stateProvider, $urlRouterProvider,$locationProvider) {
 	$urlRouterProvider.otherwise("/dash");
    $stateProvider
    .state('dash', {
                url: "/dash",
                templateUrl: 'views/dash.html',
                abstract: true,
                controller:'appController'
            }).state('dash.home',{
                url: '',
                templateUrl: "views/home.html"
            }).state('dash.db',{
                url: '/db',
                templateUrl: "views/db.html"
            })

 }]).controller('appController', ['$scope','$firebase','moment', function($scope,$firebase,moment){

    
    $scope.patient = {};

    // validate form And send data

    $scope.validate = function(){
            var c = 0;
            if ($scope.patient.fname == undefined || $scope.patient.lname == undefined || $scope.patient.fname == null || $scope.patient.lname == null) {
                $scope.err_msg = "Please fill the required fields";
                c++;
            }else if ($scope.patient.age == undefined || $scope.patient.age == null || $scope.patient.age < 1 || $scope.patient.age > 120){
                $scope.err_msg = "Please enter valid age";
                c++;
            }else if ($scope.patient.gender == undefined || $scope.patient.gender == null){
                $scope.err_msg = "Please select your gender";
                c++;
            }
            else if($scope.patient.phone == undefined || $scope.patient.phone == null || $scope.patient.phone.length > 10 || $scope.patient.phone.length < 10 ){
                $scope.err_msg = "Enter a valid phone number";
                c++;
            }
            else if (c == 0){
                // Push Patient data to db
                var uid = $scope.patient.phone + $scope.patient.age ;
                $scope.patient.dob = new moment($scope.patient).format('l');
                firebase.database().ref().child(uid).set($scope.patient);
                $scope.patient = {};
                alert("data sent"); 
            }
    };
    
    // Fetch patients

    firebase.database().ref().on("value", function(snapshot) {
            $scope.data = [];
            snapshot.forEach(function(userSnapshot) {
                $scope.data.push(userSnapshot.val());
            });
            $scope.$apply();
        });



    // Dob picker Code
    $scope.today = function() 
    {
        $scope.patient.dob = new Date();
    };
    $scope.today();

    $scope.clear = function() 
    {
        $scope.patient.dob = null;
    };
    $scope.open1 = function() 
    {
        $scope.popup1.opened = true;
    };
    $scope.popup1 = 
    {
        opened: false
    };
    $scope.dateOptions = 
    {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(1950, 1, 1),
        startingDay: 1
    };
    $scope.format = 'shortDate';



 }]);
