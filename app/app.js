var myTLSApp = angular.module('myTLSApp', ['ngRoute', 'ngAnimate', 'ngSanitize']);

// //config fires before the app runs
myTLSApp.config(['$routeProvider', function($routeProvider){
	
	$routeProvider
		.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'TLSController'
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

myTLSApp.controller('TLSController', ['$scope', '$http', function($scope, $http){

	$scope.step = 2;
	$scope.showInfoBox = false;
	$scope.retryRequest = false;
	$scope.adjusting = false;
	$scope.data = {adjust: 'test'};
	$scope.storeidStep;
	$scope.storidField;
	$scope.adjusted;
	$scope.tlsVersion = [1.3, 1.3];


	//Key Exchange Extensions
	$scope.supported_version = [true, true];	


	$scope.showInfo = function (idStep, idField, LeftBoxType){ 
		// $scope.leftBoxContent 
		$scope.storeidStep = idStep;
		$scope.storeidField = idField;
		$scope.adjusting= false;
		// $scope.step = value1;
		if($scope.showInfoBox ==true){
			$scope.showInfoBox =false;	
		} 
		else $scope.showInfoBox = true;

		if(LeftBoxType == 'info'){
			$scope.leftBoxTitle = 'Info on ' + idField.eltName;	
			$scope.leftBoxContent = idField.info;	
			document.querySelector(".leftBox").style.cssText = "  border-style: solid; border-color: #889EB7;";
		}
		else if(LeftBoxType == 'adjust'){
			document.querySelector(".leftBox").style.cssText = "  border-style: solid; border-color: green;";
			$scope.leftBoxContent = " ";
			var str = idField.adjust;
			$scope.splitted = str.split(";"); 
			$scope.adjusting= true;
			$scope.leftBoxTitle = 'Adjust ' + idField.eltName;	
			$scope.adjustMessage = idField.adjustM;
		}
		else  if(LeftBoxType == 'delete'){
			$scope.leftBoxTitle = idField.eltName+ ' deleted' ;	
			$scope.leftBoxContent = " ";
			document.querySelector(".leftBox").style.cssText = "  border-style: solid; border-color: red;";
			$scope.nowDelete();
		}
    };
	
	
	$scope.nowDelete = function(){
		switch ($scope.storeidStep) {
			case 'clientHello':
				$scope.clientHello = $scope.clientHello.filter(item => item.eltType !== $scope.storeidField.eltType);
				$scope.updateNextSteps('clientHello',$scope.storeidField.eltName,'deleted');
			break;
			case 'chExtensions':
				$scope.chExtensions = $scope.chExtensions.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('clientHello',$scope.storeidField.eltName,'deleted');
			break;

			case 'serverHello':
				$scope.serverHello = $scope.serverHello.filter(item => item.eltType !== $scope.storeidField.eltType);
				$scope.updateNextSteps('serverHello',$scope.storeidField.eltName,'deleted');
			break;
			case 'shExtensions':
				$scope.shExtensions = $scope.shExtensions.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('serverHello',$scope.storeidField.eltName,'deleted');
			break;
			default:

		}
		
	};
	

	$scope.nowAdjust = function(){

		switch ($scope.storeidStep) {
            case 'clientHello':
        	  
            	for (var elt1 in $scope.clientHello){
            		if($scope.storeidField.eltName == $scope.clientHello[elt1].eltName){
		            	switch ($scope.storeidField.eltName){
		            		case 'legacy_version':
		            			for (var elt in $scope.splitted){
		            				// alert($scope.splitted[elt]);
									if($scope.data.adjust == $scope.splitted[elt]){
										$scope.clientHello[elt1].eltValue = $scope.splitted[elt];
										if($scope.clientHello[elt1].eltValue == '= 0x0304'){
											$scope.tlsVersion[0] = 1.4;
										}
										if($scope.clientHello[elt1].eltValue == '= 0x0303'){
											$scope.tlsVersion[0] = 1.3;

										}
										else $scope.tlsVersion[0] = 1.2;
									}
								}
								$scope.updateNextSteps('clientHello','legacy_version', 'adjusted');
		            		break;

		            		default:
		            	}
		            }
	          	}
            break;

            case 'serverHello':
	        
	        break;

            case 'helloRetryRequest':
	        
	        break;      

            case 'rrClientHello':
	        
	        break;
            
            default:
        }
		
	};

	$scope.updateNextSteps = function (originalUpdate,fieldUpdated,type){
		
		switch (originalUpdate) {
			case 'clientHello':
			//////// KEY ECHANGE
				///something in clientHello Changed
				switch(fieldUpdated){
					///legacy_version in clientHello Changed -> Check tlsVersion Client and server
					case 'legacy_version':

						//// Client with TLS1.3
						if($scope.tlsVersion[0]==1.3){

							//// Server with TLS1.3
							if($scope.tlsVersion[1]==1.3){
								if(scope.supported_version[0] == false){
									$scope.leftBoxContent = "Server and Client will negotiate TLS1.2 ----- NOT AVAILABLE IN THIS APP<br/> TLS1.3 should be negotiated";
									$scope.attentionMessage="Since the server is compliant with TLS1.2 and supported_version is not available, server and Client will negotiate TLS1.2 --- NOT AVAILABLE IN THIS APP";		
									alert($scope.attentionMessage);
									// $scope.leftBoxTitle = fieldUpdated.eltName + ' not deleted' ;
								}
							}

							//// Server with < TLS1.3
							if($scope.tlsVersion[0]==1.2){
														
							}

							//// "supported_versions" extension mandatory
							if( $scope.supported_version[0] == false);	

								//ERROR{

								//}
						}
						/// Client with < TLS1.3
						if($scope.tlsVersion[0]==1.2){
							//// Server with TLS1.3
							if($scope.tlsVersion[1]==1.3){

							}

							//// Server with < TLS1.3
							if($scope.tlsVersion[0]==1.2){
														
							}
						}
					break;
					case 'supported_versions':
						// if(type == 'deleted'){
						$scope.supported_version[0] = false;	
						// }

						if($scope.tlsVersion[1]==1.4){

						}

						if($scope.tlsVersion[0]==1.3){

							

							//// Server with TLS1.3
							if($scope.tlsVersion[1]==1.3 ){
								if($scope.supported_version[0] == false){
									$scope.leftBoxContent = "Server and Client will negotiate TLS1.2 <br/> NOT AVAILABLE IN THIS APP <br/> <b>TLS1.3 should be negotiated</b>";
									$scope.attentionMessage="Since the server is compliant with TLS1.2 and supported_version is not available, server and Client will negotiate TLS1.2 --- NOT AVAILABLE IN THIS APP";		
									alert($scope.attentionMessage);
									$scope.leftBoxTitle = 'supported_versions NOT deleted' ;	
									$scope.newItem= {eltName: 'supported_versions', delete: 'yes', 
 															info: 'Indicates which versions of TLS it supports.'}
									$scope.chExtensions.splice(0, 0, $scope.newItem);
									$scope.supported_version[0] = true;
								}
							}

							//// Server with < TLS1.3
							if($scope.tlsVersion[0]==1.2){
														
							}

							if($scope.supported_version[0] == true){

							}

						}
						
						/// Client with < TLS1.3
						if($scope.tlsVersion[0]==1.2){
							//// Server with TLS1.3
							if($scope.tlsVersion[1]==1.4){
								if($scope.supported_version[0] == false){
									$scope.attentionMessage="supported_extension field should be available when negotiating TLS1.3";		
									alert($scope.attentionMessage);
								}
							}

							//// Server with < TLS1.3
							if($scope.tlsVersion[1]==1.2 || $scope.tlsVersion[1]==1.3){
								if($scope.supported_version[0] == false){
									$scope.attentionMessage="supported_extension field should not be available when negotiating a version prior to TLS1.3";		
									alert($scope.attentionMessage);
								}
							}
						}
					break;			
					default:
				}
				
			break;

			case 'serverHello':
			//////// KEY ECHANGE
				//// SERVER HELLO OR HELLORETRYREQUEST
				if($scope.serverHello[0].eltName == 'legacy_version'){
					////Client with TLS1.3 -> supported_versions extension mandatory
					if($scope.clientHello[0].eltValue == '= 0x0303'){

						//// "supported_versions" extension mandatory
						$scope.ch_supported_version = false;	
						for(var elt in $scope.chExtensions){
							if($scope.chExtensions[elt].eltName == 'supported_versions'){
								$scope.ch_supported_version = true;	
							}
						}
						if($scope.ch_supported_version){
							$scope.keyExchange=[];
							$scope.keyExchange.push( {type: 'server', name:'ServerHello'});
						}
						else{		
							$scope.keyExchange=[];
							// $scope.errorMessage.push('When legacy_version is equal to 0x0303, supported_version extension is mandatory to indicate which version it uses. This extension field must contain (0x0304) if negotiating TLS1.3');
							$scope.keyExchange.push( {type: 'server', name:'HelloRetryRequest'});
						}
					}
					////Client with <TLS1.3 
				}
			break;

			default:
		}
	};


	// $scopes.stepsProtocol = 
	// 		[{id:"ClientHello", value: clientHello}, 
	// 		{id:"ServerHello", value: serverHello}];

	$scope.keyExchange = [
	{type: 'server', name:'ServerHello'}
	];

 	$scope.clientHello = [
 		{eltType: 'ProtocolVersion', eltName: 'legacy_version', eltValue: '= 0x0303;', delete: 'no', adjustment:'yes',
 			info: 'In version prior to TLS1.3, this field was used for version negotiation.</br> In TLS1.3 this field should be equal to <b> 0x0303 </b>, which indicates TLS1.2 and the version preferences are indicated by the client in a later extension parameter (<i>supported_versions)</i> which is mandatory in TLS1.3 havinf 0x0304 as its highest version. </br> ',
 			adjustM: '"Either = 0x0303 (indicating TLS1.2) or <0x0303 indictating prior versions of TLS1.2<br/> For a client to be recognized as TLS1.3 Client, its legacy_version should be equal to 0x0303.',
 			adjust: '= 0x0303;< 0x302'
 		}, 
 		{eltType: 'Random', delete: 'yes', eltName: 'random', eltValue: ';', adjustment:'no',
 			info: '32 bytes generated by a secure random number generator. </br></br> This random number is used to prevent downgrade attacks.'},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_session_id', eltValue: '<0..32>;', info: 'This is an info'},
 		{eltType: 'CipherSuite', delete: 'yes', adjustment:'yes', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;', info: 'This is an info'},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_compression_methods', eltValue: '<1..2^8-1>;', info: 'This is an info'},
		
 	];

 	$scope.chExtensions = [
 		{eltName: 'supported_versions', delete: 'yes', adjust:'yes',
 			info: 'Indicates which versions of TLS the client supports. It is a list of of supported versions ordered in preference with the most preferred first. <br/>For TLS1.3, 0x0304 (the number of TLS1.3) should be at the top of the list. </br></br> This extension should only be available when the peer supports TLS1.3.'
 		}
 	];

 	$scope.serverHello = [
 		{eltType: 'ProtocolVersion',  eltName: 'legacy_version', eltValue: '= 0x0303;', delete: 'no', adjustment: 'no' ,
 			info: 'When this field is equal to 0x0303, it means the server wants to negotiate a version TLS1.3. In this case, <i>supported_version</i> extension must be available representing the highest version number supported by the server.', 
 			adjustM: '"Either =0x0304 (indicating TLS1.3), = 0x0303 (indicating TLS1.2) or <0x0303 indictating prior versions of TLS1.2',
 			adjust: '= 0x0303;< 0x302'
 		},
 		{eltType: 'Random', delete: 'yes', adjustment:'yes', eltName: 'random', eltValue: ';', 
 			info: '32 bytes generated by a secure random number generator. The last 8 bytes MUST be overwritten if negotiating TLS 1.2 or TLS 1.1, but the remaining bytes MUST be random. This structure is generated by the server and MUST be generated independently of the <i>ClientHello.random</i>. </br></br> This random number is used to prevent downgrade attacks.',
 			adjustM: 'This is to adjust the last 8 bytes of the server\'s random number. </br> If negotiating TLS1.2, then TLS1.3 server’s random number must set their last 8 bytes of their random number to: <br/> 44 4F 57 4E 47 52 44 01 </br>. If negotiating TLS1.1 or below, then TLS1.3 and TLS1.2 servers must set their last 8 bytes of their random number field to: </br> 44 4F 57 4E 47 52 44 00 </br>' ,
 			adjust: '44 4F 57 4E 47 52 44 01;44 4F 57 4E 47 52 44 00'
 		},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_session_id', eltValue: '<0..32>;', info: 'This is an info'},
 		{eltType: 'CipherSuite', delete: 'yes', adjustment:'yes', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;', info: 'This is an info'},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_compression_methods', eltValue: '<1..2^8-1>;', info: 'This is an info'},
 	];

 	$scope.shExtensions = [
 		{eltName: 'supported_versions', delete: 'yes', adjustment:'yes',
 			info: 'Indicates which versions of TLS the server uses. It is a list of of supported versions ordered in preference with the most preferred first. <br/><br/>This extension should only be available when the peer supports TLS1.3.'
 		}
 	];

 	$scope.helloRetryRequest = [
 		{eltType: 'ProtocolVersion', delete: 'yes', adjustment:'yes', eltName: 'legacy_version', eltValue: '= 0x0303;'}, 
 		{eltType: 'Random', delete: 'yes', adjustment:'yes', eltName: 'random', eltValue: ';'},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_session_id', eltValue: '<0..32>;'},
 		{eltType: 'CipherSuite', delete: 'yes', adjustment:'yes', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;'},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_compression_methods', eltValue: '<1..2^8-1>;'},
		{eltType: 'Extension', delete: 'yes', adjustment:'yes', eltName: 'extensions', eltValue: '<8..2^16-1>;'},
 	];

 	$scope.rrClientHello = [
 		{eltType: 'ProtocolVersion', delete: 'yes', adjustment:'yes', eltName: 'legacy_version', stepValue: '= 0x0303;'}, 
 		{eltType: 'Random', delete: 'yes', adjustment:'yes', eltName: 'random', stepValue: ';'},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_session_id', stepValue: '<0..32>;'},
 		{eltType: 'CipherSuite', eltName: 'cipher_suites', stepValue: '<2..2^16-2>;'},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_compression_methods', stepValue: '<1..2^8-1>;'},
		{eltType: 'Extension', delete: 'yes', adjustment:'yes', eltName: 'extensions', stepValue: '<8..2^16-1>;'},
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

