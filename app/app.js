var myTLSApp = angular.module('myTLSApp', ['ngRoute', 'ngAnimate']);

// //config fires before the app runs
myTLSApp.config(['$routeProvider', function($routeProvider){
	
	$routeProvider
		.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'NinjaController'
		})
		// .when('/contact', {
		// 	templateUrl: 'views/contact.html',
		// 	controller: 'ContactController'
		// })
		.otherwise({
			redirectTo: '/home'
		});

}]);

// //run fires when the app runs
// myTLSApp.run(function(){

// });

myTLSApp.controller('NinjaController', ['$scope', '$http', function($scope, $http){

	// $scope.removeNinja = function(ninja){
	// 	var removedNinja = $scope.ninjas.indexOf(ninja);
	// 	$scope.ninjas.splice(removedNinja , 1);
	// };

	// $scope.addNinja = function(){
	// 	$scope.ninjas.push({
	// 		name: $scope.newninja.name,
	// 		belt: $scope.newninja.belt,
	// 		rate: parseInt($scope.newninja.rate),
	// 		available: false
	// 		});
	// 	$scope.newninja.name="";
	// 	$scope.newninja.belt="";
	// 	$scope.newninja.rate="";
	// };
	
	$scope.step = 1;
	$scope.myParam = 'ahags';
	$scope.showInfoBox = false;

	$scope.showInfo = function (value1){ 
		// $scope.step = value1;
		if($scope.showInfoBox ==true){
			$scope.showInfoBox =false;	
		} 
		else $scope.showInfoBox = true;

		$scope.infoContent = value1;
    };
	
	$scope.removeAll = function(){
		$scope.ninjas = [];
	};

	$http.get('data/ninjas.json').then(function(response){
		$scope.ninjas = response.data;
	});

}]);

