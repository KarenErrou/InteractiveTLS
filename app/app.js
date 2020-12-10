var myTLSApp = angular.module('myTLSApp', ['ngRoute', 'ngAnimate', 'ngSanitize']);

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
	
	$scope.step = 2;
	$scope.showInfoBox = false;
	$scope.retryRequest = false;

	$scope.showInfo = function (id, LeftBoxType){ 
		// $scope.leftBoxContent 
		// $scope.step = value1;
		if($scope.showInfoBox ==true){
			$scope.showInfoBox =false;	
		} 
		else $scope.showInfoBox = true;

		if(LeftBoxType == 'info'){
			$scope.leftBoxTitle = 'Info on ' + id.eltName;	
			$scope.leftBoxContent = id.info;	
			document.querySelector(".leftBox").style.cssText = "  border-style: solid; border-color: #889EB7;";
		}
		else if(LeftBoxType == 'adjust'){
			$scope.leftBoxTitle = 'Adjust ' + id.eltName;	
			// $scope.leftBoxContent = id;	
			document.querySelector(".leftBox").style.cssText = "  border-style: solid; border-color: green;";
		}
		else  if(LeftBoxType == 'delete'){
			$scope.leftBoxTitle = 'Delete ' + id.eltName;	
			// $scope.leftBoxContent = id;	
			document.querySelector(".leftBox").style.cssText = "  border-style: solid; border-color: red;";
		}
    };
	
	$scope.removeAll = function(){
		$scope.ninjas = [];
	};

	$http.get('data/ninjas.json').then(function(response){
		$scope.ninjas = response.data;
	});

	// $scopes.stepsProtocol = 
	// 		[{id:"ClientHello", value: clientHello}, 
	// 		{id:"ServerHello", value: serverHello}];

	$scope.keyExchange = [{type: 'server', id:0, name:'HelloRetryRequest'}];

 	$scope.clientHello = [
 		{eltType: 'ProtocolVersion', eltName: 'legacy_version', eltValue: '= 0x0303;', info: 'This is an info'}, 
 		{eltType: 'Random', eltName: 'random', eltValue: ';', info: 'This is an info'},
 		{eltType: 'opaque', eltName: 'legacy_session_id', eltValue: '<0..32>;', info: 'This is an info'},
 		{eltType: 'CipherSuite', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;', info: 'This is an info'},
 		{eltType: 'opaque', eltName: 'legacy_compression_methods', eltValue: '<1..2^8-1>;', info: 'This is an info'},
		{eltType: 'Extension', eltName: 'extensions', eltValue: '<8..2^16-1>;', info: 'This is an info'}
 	];

 	$scope.serverHello = [
 		{eltType: 'ProtocolVersion', eltName: 'legacy_version', eltValue: '= 0x0303;', info: 'This is an info'}, 
 		{eltType: 'Random', eltName: 'random', eltValue: ';', info: 'This is an info'},
 		{eltType: 'opaque', eltName: 'legacy_session_id', eltValue: '<0..32>;', info: 'This is an info'},
 		{eltType: 'CipherSuite', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;', info: 'This is an info'},
 		{eltType: 'opaque', eltName: 'legacy_compression_methods', eltValue: '<1..2^8-1>;', info: 'This is an info'},
		{eltType: 'Extension', eltName: 'extensions', eltValue: '<8..2^16-1>;', info: 'This is an info'}
 	];

 	$scope.helloRetryRequest = [
 		{eltType: 'ProtocolVersion', eltName: 'legacy_version', eltValue: '= 0x0303;'}, 
 		{eltType: 'Random', eltName: 'random', eltValue: ';'},
 		{eltType: 'opaque', eltName: 'legacy_session_id', eltValue: '<0..32>;'},
 		{eltType: 'CipherSuite', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;'},
 		{eltType: 'opaque', eltName: 'legacy_compression_methods', eltValue: '<1..2^8-1>;'},
		{eltType: 'Extension', eltName: 'extensions', eltValue: '<8..2^16-1>;'},
 	];

 	$scope.rrClientHello = [
 		{eltType: 'ProtocolVersion', eltName: 'legacy_version', stepValue: '= 0x0303;'}, 
 		{eltType: 'Random', eltName: 'random', stepValue: ';'},
 		{eltType: 'opaque', eltName: 'legacy_session_id', stepValue: '<0..32>;'},
 		{eltType: 'CipherSuite', eltName: 'cipher_suites', stepValue: '<2..2^16-2>;'},
 		{eltType: 'opaque', eltName: 'legacy_compression_methods', stepValue: '<1..2^8-1>;'},
		{eltType: 'Extension', eltName: 'extensions', stepValue: '<8..2^16-1>;'},
 	];

  //  $scope.addNewChoice = function() {her
  //    var newItemNo = $scope.choices.length+1;
  //    $scope.choices.push({'id' : 'choice' + newItemNo, 'name' : 'choice' + newItemNo});
  //  };
   
  //  $scope.removeNewChoice = function() {
  //    var newItemNo = $scope.choices.length-1;
  //    if ( newItemNo !== 0 ) {
  //     $scope.choices.pop();
  //    }
  //  };
   
  //  $scope.showAddChoice = function(choice) {
  //    return choice.id === $scope.choices[$scope.choices.length-1].id;
  //  };

}]);

