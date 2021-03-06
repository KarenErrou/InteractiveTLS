var myTLSApp = angular.module('myTLSApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);

// //config fires before the app runs
myTLSApp.config(['$routeProvider', function($routeProvider){
	
	$routeProvider
		.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'TLSController'
		})
		.when('/missingTerms', {
			templateUrl: 'views/missingTerms.html',
			controller: 'MissingTerms'
		})
		.when('/info', {
			templateUrl: 'views/info.html',
			controller: 'Info'
		})
		.otherwise({
			redirectTo: '/home'
		});

}]);

// myTLSApp.controller('KEController', ['$scope', '$http', function($scope, $http){}]);
myTLSApp.controller('TLSController', ['$scope', '$http', function($scope, $http){
	$scope.error = true;
	$scope.step = 1.0;
	// $scope.postHandshake = true;
	$scope.alertsList = [
 		
  	];

	$scope.incrementStep = function(step,type){
		if(type == 'normal')
			$scope.step = step + 1.0;
		else if(type == 'serverHello')
			$scope.step = 4.0;
		else if(type == 'clientHello')
			$scope.step = 3.0;
		else
			$scope.step = step + 0.5;
	};

	$scope.listAdd = [];
	$scope.listAddSelect =[];
	$scope.addList = [false, false, false, false, false, false];
	$scope.add = function(step, index){
		$scope.listAdd = [];
		for(var i in $scope.addList){
			if(i == index){
				if($scope.addList[i] == false){
					$scope.addList[i] = true;
				}
				else{
					$scope.addList[i] = false;
				}		
			}
			else{
				$scope.addList[i] = false;
			}
		}
		
		if(step=='clientHello'){		
			for (var elt1 in $scope.chExtensions){
    			if($scope.chExtensions[elt1].deleted == "yes"){
    				$scope.listAdd.push($scope.chExtensions[elt1].eltName);
				}
			}	
		}
		else if(step=='serverHello'){
			for (var elt1 in $scope.shExtensions){
    			if($scope.shExtensions[elt1].deleted == "yes"){
    				$scope.listAdd.push($scope.shExtensions[elt1].eltName);
				}
			}	
		}
		else if(step=='helloRetryRequest'){
			for (var elt1 in $scope.hrrExtensions){
    			if($scope.hrrExtensions[elt1].deleted == "yes"){
    				$scope.listAdd.push($scope.hrrExtensions[elt1].eltName);
				}
			}	
		}
		else if(step=='rrClientHello'){
			for (var elt1 in $scope.rrClientHello){
    			if($scope.rrClientHello[elt1].deleted == "yes"){
    				$scope.listAdd.push($scope.rrClientHello[elt1].eltName);
				}
			}	
		}
		else if(step=='encryptedExtension'){
			for (var elt1 in $scope.encryptedExtension){
    			if($scope.encryptedExtension[elt1].deleted == "yes"){
    				$scope.listAdd.push($scope.encryptedExtension[elt1].eltName);
				}
			}
		}
		else if(step == 'certificateRequest'){
			for (var elt1 in $scope.certificateRequest){
    			if($scope.certificateRequest[elt1].deleted == "yes"){
    				$scope.listAdd.push($scope.certificateRequest[elt1].eltName);
				}
			}
		}	
	};

	$scope.addAdjust = function(step){
		for(var i in $scope.addList){
			$scope.addList[i] = false;
		}

		if(step=='clientHello'){
			for (var elt1 in $scope.chExtensions){
				for(var elt2 in $scope.listAddSelect){	
					if($scope.listAddSelect[elt2]==true){					
    					if($scope.chExtensions[elt1].eltName == String(elt2)){
    						$scope.chExtensions[elt1].deleted = "no";	
    						$scope.storeidField = $scope.chExtensions[elt1];
    						$scope.updateNextSteps('clientHello',$scope.chExtensions[elt1].eltName, '');
						}
					}
				}
			} 
		}
		else if(step=='serverHello'){
			for (var elt1 in $scope.shExtensions){
				for(var elt2 in $scope.listAddSelect){
					if($scope.listAddSelect[elt2]==true){					
	    				if($scope.shExtensions[elt1].eltName == String(elt2)){
	    					$scope.shExtensions[elt1].deleted = "no";	
	    					$scope.storeidField = $scope.shExtensions[elt1];
	    					$scope.updateNextSteps('serverHello',$scope.shExtensions[elt1].eltName, '');
						}
					}
				}
			} 
		}
		else if(step=='helloRetryRequest'){
			for (var elt1 in $scope.hrrExtensions){
				for(var elt2 in $scope.listAddSelect){	
					if($scope.listAddSelect[elt2]==true){				
    					if($scope.hrrExtensions[elt1].eltName == String(elt2)){
    						$scope.hrrExtensions[elt1].deleted = "no";	
    						$scope.storeidField = $scope.hrrExtensions[elt1];
    						$scope.updateNextSteps('helloRetryRequest',$scope.hrrExtensions[elt1].eltName, '');
						}
					}
				}
			} 
		}
		else if(step=='rrClientHello'){
			for (var elt1 in $scope.rrClientHello){
				for(var elt2 in $scope.listAddSelect){	
					if($scope.listAddSelect[elt2]==true){				
    					if($scope.rrClientHello[elt1].eltName == String(elt2)){
    						$scope.rrClientHello[elt1].deleted = "no";	
    						$scope.storeidField = $scope.rrClientHello[elt1];
    						$scope.updateNextSteps('rrClientHello',$scope.rrClientHello[elt1].eltName, '');
						}
					}
				}
			} 
		}
		else if(step=='encryptedExtension'){
			for (var elt1 in $scope.encryptedExtension){
				for(var elt2 in $scope.listAddSelect){
					if($scope.listAddSelect[elt2]==true){						
	    				if($scope.encryptedExtension[elt1].eltName == String(elt2)){
	    					$scope.encryptedExtension[elt1].deleted = "no";	
	    					$scope.storeidField = $scope.encryptedExtension[elt1];
	    					$scope.updateNextSteps('encryptedExtension',$scope.encryptedExtension[elt1].eltName, '');
						}
					}
				}
			} 
		}
		else if(step=='certificateRequest'){
			for (var elt1 in $scope.certificateRequest){
				for(var elt2 in $scope.listAddSelect){	
					if($scope.listAddSelect[elt2]==true){					
	    				if($scope.certificateRequest[elt1].eltName == String(elt2)){
	    					$scope.certificateRequest[elt1].deleted = "no";	
	    					$scope.storeidField = $scope.certificateRequest[elt1];
	    					$scope.updateNextSteps('certificateRequest',$scope.certificateRequest[elt1].eltName, '');
						}
					}
				}
			} 
		}

	}

	$scope.adjusting = false;
	$scope.data = {adjust: 'test'};
	$scope.sigalgoClient = true;
	$scope.sigalgoServer = true;
	$scope.storeidStep;
	$scope.storidField;
	$scope.adjusted;
	// 0- ECDHE , 1- DHE, 2- PSK ECDHE, 3- PSK DHE, 4- PSK Only, 5- depends on peer reply
	$scope.keyExMode = 0;

	// 0 - ECDHE, 1- DHE, 2- ECDHE + DHE
	$scope.supp_groups = 0;

	$scope.explainAlert;
	// Key Exchange 
	$scope.tlsVersion = [1.3, 1.3];
	// $scope.supportedgroupsKeyshare = [true,true,true,true];
	// $scope.pre_shared_keys = true;
	// $scope.supported_version = [true, true];	
	

	$scope.cipherSuitesClient = {
		"TLS_AES_128_GCM_SHA256": true,
		"TLS_AES_256_GCM_SHA384": false,
		"TLS_CHACHA20_POLY1305_SHA256": false, 
		"TLS_AES_128_CCM_SHA256": false,
		"TLS_AES_128_CCM_8_SHA256": false
	};
	$scope.cipherSuitesServer= "TLS_AES_128_GCM_SHA256";
	$scope.cipherSuitesHelloRetryRequest= "TLS_AES_128_GCM_SHA256";

	$scope.signatureClient = {
		"RSASSA-PKCS1-v15": true, 
		"ECDSA": true,
		"RSASSA-PSS RSAE": false,
		"EdDSA": false, 
		"RSASSA-PSS": false
	}
	$scope.signature_certClient = {
		"RSASSA-PKCS1-v15": true, 
		"ECDSA": true,
		"RSASSA-PSS RSAE": false,
		"EdDSA": false, 
		"RSASSA-PSS": false
	}

	$scope.signatureServer = {
		"RSASSA-PKCS1-v15": true, 
		"ECDSA": true,
		"RSASSA-PSS RSAE": false,
		"EdDSA": false, 
		"RSASSA-PSS": false
	}
	$scope.signature_certServer = {
		"RSASSA-PKCS1-v15": true, 
		"ECDSA": true,
		"RSASSA-PSS RSAE": false,
		"EdDSA": false, 
		"RSASSA-PSS": false
	}


	$scope.ECDHEClient = {
		"secp256r1(0x0017)": true, 
		"secp384r1(0x0018)": true,
		"secp521r1(0x0019)": false,
		"x25519(0x001D)": false, 
		"x448(0x001E)": false
	}
	$scope.DHEClient = {
		"ffdhe2048(0x0100)": false, 	
		"ffdhe3072(0x0101)": false, 
		"ffdhe4096(0x0102)": false,
		"ffdhe6144(0x0103)": false,
		"ffdhe8192(0x0104)": false
	}

	$scope.ECDHEServer = {
		"secp256r1(0x0017)": true, 
		"secp384r1(0x0018)": true,
		"secp521r1(0x0019)": false,
		"x25519(0x001D)": false, 
		"x448(0x001E)": false
	}
	$scope.DHEServer = {
		"ffdhe2048(0x0100)": false, 	
		"ffdhe3072(0x0101)": false, 
		"ffdhe4096(0x0102)": false,
		"ffdhe6144(0x0103)": false,
		"ffdhe8192(0x0104)": false
	}
	$scope.key_shareValue = "secp256r1(0x0017)";

	//Server Parameters
	$scope.clientCert = {
		"RawPublicKey" : true,
		"X.509" : true,
		"Additional certificate types" : true
	};
	$scope.certServer = {client: "X.509", server: "X.509"} ;

	$scope.serverCert = {
		"RawPublicKey" : true,
		"X.509" : true,
		"Additional certificate types" : true
	};


	$scope.showInfo = function (idStep, idField, LeftBoxType){ 
	
		// $scope.leftBoxContent 
		$scope.storeidStep = idStep;
		$scope.storeidField = idField;
		$scope.adjusting= false;
		$scope.early_dataClient = false;
		
		// if($scope.showInfoBox ==true){
		// 	$scope.showInfoBox =false;	
		// } 
		// else $scope.showInfoBox = true;


		if(LeftBoxType == 'info'){
			$scope.leftBoxTitle = 'Info on ' + idField.eltName;	
			$scope.leftBoxContent = idField.info;	
			document.querySelector(".leftBox").style.cssText = "  border-style: solid; border-color: #889EB7;";
		}


		else if(LeftBoxType == 'adjust'){
			document.querySelector(".leftBox").style.cssText = "  border-style: solid; border-color: #009200;";
			$scope.leftBoxContent = " ";
			$scope.leftBoxTitle = 'Adjust ' + idField.eltName;	
			
			$scope.adjusting= true;
			
			$scope.supported_groups = [false,false];
			$scope.checkboxsign_algo = [false,false];
			$scope.checkboxsign_algo_cert = [false,false];
			$scope.checkboxCipherSuites = false;
			$scope.checkboxClientCert = false;
			$scope.checkboxServerCert = false;
			$scope.radioClientCertServer = false;	
			$scope.radioServerCertServer = false;	
			$scope.key_share = false;
			$scope.checkbox = true;	
			

			if(idField.eltName == 'cipher_suites' && idStep == 'clientHello'){
				$scope.checkboxCipherSuites = true;
			}
			else if (idField.eltName == 'Client_certificate_type' && idStep == 'chExtensions' ){
				// $scope.checkbox = true;	
				$scope.checkboxClientCert = true;
			}
			else if (idField.eltName == 'Server_certificate_type' && idStep == 'chExtensions' ){
				// $scope.checkbox = true;	
				$scope.checkboxServerCert = true;
			}
			else if (idField.eltName == 'supported_groups' && idStep == 'chExtensions' ){
				$scope.supported_groups[0] = true;	
			}
			else if (idField.eltName == 'supported_groups' && idStep == 'encryptedExtension' ){
				$scope.supported_groups[1] = true;	
			}
			else if (idField.eltName == 'key_share' && idStep == 'shExtensions' ){
				$scope.key_share = true;	
			}
			else if (idField.eltName == 'signature_algorithms' && idStep == 'chExtensions' ){
				$scope.checkboxsign_algo[0] = true;	
			}
			else if (idField.eltName == 'signature_algorithms' && idStep == 'certificateRequest' ){
				$scope.checkboxsign_algo[1] = true;	
			}
			else if (idField.eltName == 'signature_algorithms_cert' && idStep == 'chExtensions' ){
				$scope.checkboxsign_algo_cert[0] = true;	
			}
			else if (idField.eltName == 'signature_algorithms_cert' && idStep == 'certificateRequest' ){
				$scope.checkboxsign_algo_cert[1] = true;	
			}
			else{
				$scope.checkbox = false;
				if (idField.eltName == 'Client_certificate_type' && idStep == 'encryptedExtension' ){
					$scope.radioClientCertServer = true;	
				}
				if (idField.eltName == 'Server_certificate_type' && idStep == 'encryptedExtension' ){
					$scope.radioServerCertServer = true;	
				}
			}


			if($scope.supported_groups[0] == true || $scope.supported_groups[1] == true || $scope.key_share == true){
				if(idField.adjustM){$scope.adjustMessage = idField.adjustM;}
				var str1 = idField.adjust1;
				$scope.groupsSplitted1 = str1.split(";");
				var str2 = idField.adjust2;
				$scope.groupsSplitted2 = str2.split(";");
			}
			else{
				if(idField.adjustM){$scope.adjustMessage = idField.adjustM;}
				if(idField.adjust){
					var str = idField.adjust;
					$scope.splitted = str.split(";");
				}
				else{
						$scope.splitted = '';
				}	
			}
		}

		else  if(LeftBoxType == 'delete'){
			$scope.leftBoxTitle = idField.eltName+ ' deleted' ;	
			$scope.leftBoxContent = " ";
			document.querySelector(".leftBox").style.cssText = "  border-style: solid; border-color:  #e70000;";
			$scope.nowDelete();
			for(var i in $scope.addList){
				$scope.addList[i] = false;	
			}
			
		}
    };
	
	
	$scope.nowDelete = function(){
		
		switch ($scope.storeidStep) {
			case 'clientHello':
				for (var elt1 in $scope.clientHello){
    				if($scope.storeidField.eltName == $scope.clientHello[elt1].eltName){
						$scope.clientHello[elt1].deleted = 'yes';
					}
				}
				// $scope.clientHello = $scope.clientHello.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('clientHello',$scope.storeidField.eltName,'deleted');
			break;
			case 'chExtensions':
				for (var elt1 in $scope.chExtensions){
    				if($scope.storeidField.eltName == $scope.chExtensions[elt1].eltName){
						$scope.chExtensions[elt1].deleted = 'yes';
					}
				}
				// $scope.chExtensions = $scope.chExtensions.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('clientHello',$scope.storeidField.eltName,'deleted');
			break;
			case 'serverHello':
				for (var elt1 in $scope.serverHello){
    				if($scope.storeidField.eltName == $scope.serverHello[elt1].eltName){
						$scope.serverHello[elt1].deleted = 'yes';
					}
				}
				// $scope.serverHello = $scope.serverHello.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('serverHello',$scope.storeidField.eltName,'deleted');
			break;
			case 'hrrExtensions':
				for (var elt1 in $scope.hrrExtensions){
    				if($scope.storeidField.eltName == $scope.hrrExtensions[elt1].eltName){
						$scope.hrrExtensions[elt1].deleted = 'yes';
					}
				}
				// $scope.serverHello = $scope.serverHello.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('helloRetryRequest',$scope.storeidField.eltName,'deleted');
			break;
			case 'shExtensions':
				for (var elt1 in $scope.shExtensions){
    				if($scope.storeidField.eltName == $scope.shExtensions[elt1].eltName){
						$scope.shExtensions[elt1].deleted = 'yes';
					}
				}
				// $scope.shExtensions = $scope.shExtensions.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('serverHello',$scope.storeidField.eltName,'deleted');
			break;
			
			case 'encryptedExtension':
				for (var elt1 in $scope.encryptedExtension){
    				if($scope.storeidField.eltName == $scope.encryptedExtension[elt1].eltName){
						$scope.encryptedExtension[elt1].deleted = 'yes';
					}
				}
				// $scope.shExtensions = $scope.shExtensions.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('encryptedExtension',$scope.storeidField.eltName,'deleted');
			break;

			case 'certificateRequest':
				for (var elt1 in $scope.certificateRequest){
    				if($scope.storeidField.eltName == $scope.certificateRequest[elt1].eltName){
						$scope.certificateRequest[elt1].deleted = 'yes';
					}
				}
				// $scope.shExtensions = $scope.shExtensions.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('certificateRequest',$scope.storeidField.eltName,'deleted');
			break;
			default:
		}
	};

	$scope.addAlert = function(title,description){
		$scope.alreadyAvailable = false;
		for(var alerts in $scope.alertsList){
			if($scope.alertsList[alerts].title == title){
				$scope.alreadyAvailable = true;
			}
		}
		if($scope.alreadyAvailable == false){
			$scope.alertsList.push({
			    title:   title, 
				description: description
			});
		}
	}
	$scope.removeAlert = function(title){
		for(var alerts in $scope.alertsList){
			$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf(title),1);										
		}
	}

	$scope.nowAdjust = function(){		
		switch ($scope.storeidStep) {
            case 'clientHello':
           	    for (var elt1 in $scope.clientHello){
	        		if($scope.storeidField.eltName == $scope.clientHello[elt1].eltName){
	        			switch ($scope.storeidField.eltName){
		      //       		case 'legacy_version':
		      //       			$scope.adjustVersion('clientHello', elt1, elt);
								// $scope.updateNextSteps('clientHello','legacy_version', 'adjusted');
		      //       		break;


							case 'cipher_suites':
							 	// $scope.alreadyAvailable = false;
								if($scope.cipherSuitesClient[$scope.cipherSuitesServer] ==  false){
									$scope.addAlert("Cipher Suites", $scope.cipherSuitesServer + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! ")
									// for(var alerts in $scope.alertsList){
									// 	if($scope.alertsList[alerts].title == "Cipher Suites"){
									// 		$scope.alreadyAvailable = true;
									// 	}
									// }
									// if($scope.alreadyAvailable == false){
									// 	$scope.alertsList.push({
								 //    		title:   "Cipher Suites", step: 'clientHello',
		    			// 					description: $scope.cipherSuitesServer + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! "
									// 	});
									// }

								}			

								else if($scope.cipherSuitesClient[$scope.cipherSuitesServer] ==  true){
									$scope.removeAlert("Cipher Suites");
									// for(var alerts in $scope.alertsList){
									// 	$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Cipher Suites"),1);										
									// }
								}
								// alreadyAvailable = false;
							break;		            		
							default:
		            	}
		            }
	          	}
            break;
            case 'chExtensions':
				for (var elt1 in $scope.chExtensions){
	        		if($scope.storeidField.eltName == $scope.chExtensions[elt1].eltName){
	        			switch ($scope.storeidField.eltName){
		        			case 'key_share':
								if($scope.data.adjust == 'empty'){
									$scope.keyExchange[0]='helloRetryRequest';
									$scope.chExtensions[elt1].eltValue="= empty";
									$scope.explainAlert = "<p>ClientHello.key_share extension is empty. This means the client request group selection from the server.</p><p>This will yield to a helloRetryRequest, therefore, an additional round-trip.</p>";
								}
								else{
									$scope.keyExchange[0]='serverHello';
									if($scope.supp_groups == 0){
										$scope.chExtensions[elt1].eltValue="= ECDHE keys";
									} else if($scope.supp_groups == 1){
										$scope.chExtensions[elt1].eltValue="= DHE keys";
									} else if($scope.supp_groups == 2){
										$scope.chExtensions[elt1].eltValue="= ECDHE + DHE keys";
									}

								}
							break;

							case 'Client_certificate_type':
								$scope.alreadyAvailable = false;
								if($scope.clientCert[$scope.certServer.client] ==  false){
									for(var alerts in $scope.alertsList){
										if($scope.alertsList[alerts].title ==  "Client Certificate"){
											$scope.alreadyAvailable = true;
										}
									}
									if($scope.alreadyAvailable == false){
										$scope.alertsList.push({
								    		title:   "Client Certificate", step: 'chExtensions',
		    								description: $scope.certServer.client + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! "
										});
									}

								}			

								else if($scope.clientCert[$scope.certServer.client] ==  true ){
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Client Certificate"),1);										
									}
								}
								alreadyAvailable = false;

								if($scope.clientCert['RawPublicKey'] == false && $scope.clientCert['Additional certificate types'] == false){
									$scope.explainAlert = "In case the client has no other certificate types remaining to send other than X.509 then this extension must be omitted.";
									$scope.showInfo('chExtensions', $scope.storeidField, 'delete');
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Client Certificate"),1);																			
									}
								}
							break;

							case 'Server_certificate_type':
								$scope.alreadyAvailable = false;
								if($scope.serverCert[$scope.certServer.server] ==  false){
									for(var alerts in $scope.alertsList){
										if($scope.alertsList[alerts].title == "Server Certificate"){
											$scope.alreadyAvailable = true;
										
										}
									}
									if($scope.alreadyAvailable == false){
										$scope.alertsList.push({
								    		title:   "Server Certificate", step: 'chExtensions',
		    								description: $scope.certServer.server + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! "
										});
									}

								}			

								else if($scope.serverCert[$scope.certServer.server] ==  true ){
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Server Certificate"),1);		
									}
								}
								$scope.alreadyAvailable = false;

								//TODO AttentionAlerts
								if($scope.serverCert['RawPublicKey'] == false && $scope.serverCert['Additional certificate types'] == false){
									$scope.explainAlert = "In case the client has no other certificate types remaining to send other than X.509 then this extension must be omitted.";
									$scope.showInfo('chExtensions', $scope.storeidField, 'delete');
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Server Certificate"),1);								
									}
								}
							break;

							case 'psk_key_exchange_modes':
								if($scope.data.adjust == 'psk_ke'){
									$scope.chExtensions[elt1].eltValue="= psk_ke"
								}
								else if ($scope.data.adjust == 'psk_dhe_ke'){
									$scope.keyExchange[0]='serverHello';
									$scope.chExtensions[elt1].eltValue="= psk_dhe_ke";
								}
								$scope.updateNextSteps('clientHello','psk_key_exchange_modes', 'adjusted');
							break;

						

							case 'supported_groups':
			      				ECDHEBoolClient = false;
								DHEBoolClient = false;
								keyshare = false;
								alert = true;

								//Check if supported groups ECDHE?
								for(var elt3 in $scope.ECDHEClient){
									if($scope.ECDHEClient[elt3] == true){
										ECDHEBoolClient = true;
										$scope.alreadyAvailable = false;
										if(elt3 == $scope.key_shareValue){
											for(var alerts in $scope.alertsList){
												$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Key Shares"),1);		
											}
											if($scope.keyExMode == 5){
												if($scope.data.adjust == 'secp256r1(0x0017)' || $scope.data.adjust == 'secp384r1(0x0018)' || $scope.data.adjust == 'secp521r1(0x0019)' || $scope.data.adjust == 'x25519(0x001D)' || $scope.data.adjust == 'x448(0x001E)'){
													$scope.keyExMode = 0;
												}
												else{
													$scope.keyExMode = 1;
												}
											}else if($scope.keyExMode == 4){
												if($scope.data.adjust == 'secp256r1(0x0017)' || $scope.data.adjust == 'secp384r1(0x0018)' || $scope.data.adjust == 'secp521r1(0x0019)' || $scope.data.adjust == 'x25519(0x001D)' || $scope.data.adjust == 'x448(0x001E)'){
													$scope.keyExMode = 2;
												}
												else{
													$scope.keyExMode = 3;
												}
											}
											alert = false;	
										}
									}
								}
								
								//Check if supported groups DHE?
								for(var elt3 in $scope.DHEClient){
									if($scope.DHEClient[elt3]== true){
										$scope.alreadyAvailable = false;
										DHEBoolClient = true;
										if(elt3 == $scope.key_shareValue){
											for(var alerts in $scope.alertsList){
												$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Key Shares"),1);								
											}
											if($scope.keyExMode == 5){
												if($scope.data.adjust == 'secp256r1(0x0017)' || $scope.data.adjust == 'secp384r1(0x0018)' || $scope.data.adjust == 'secp521r1(0x0019)' || $scope.data.adjust == 'x25519(0x001D)' || $scope.data.adjust == 'x448(0x001E)'){
													$scope.keyExMode = 0;
												}
												else{
													$scope.keyExMode = 1;
												}
											}else if($scope.keyExMode == 4){
												if($scope.data.adjust == 'secp256r1(0x0017)' || $scope.data.adjust == 'secp384r1(0x0018)' || $scope.data.adjust == 'secp521r1(0x0019)' || $scope.data.adjust == 'x25519(0x001D)' || $scope.data.adjust == 'x448(0x001E)'){
													$scope.keyExMode = 2;
												}
												else{
													$scope.keyExMode = 3;
												}
											}
											alert = false;	
										}
									}
								}

								if(alert == true){
									$scope.alreadyAvailable = false;
									for(var alerts in $scope.alertsList){
										if($scope.alertsList[alerts].title == "Key Shares"){
											$scope.alreadyAvailable = true;
										}
									}
									if($scope.alreadyAvailable == false){
										$scope.alertsList.push({
								    		title:   "Key Shares", step: 'clientHello',
		    								description: $scope.data.adjust + " is selected in the server and wasn't offered by the client!! ABORT HANDSHAKE!"
										});
									}
									if($scope.keyExMode == 1 || $scope.keyExMode == 0){
										$scope.keyExMode = 5;
									}else if($scope.keyExMode == 2 || $scope.keyExMode == 3){
										$scope.keyExMode = 4;

									}
									$scope.alreadyAvailable = false;
								}

								for (var elt2 in $scope.chExtensions){
	        						if($scope.chExtensions[elt2].eltName == "key_share"){
        								if(ECDHEBoolClient == true && DHEBoolClient == true){
											$scope.supp_groups = 2;
											$scope.storeidField.eltValue = "= ECDHE + DHE";
											$scope.chExtensions[elt2].eltValue = "= ECDHE + DHE keys";
										}
										else if(ECDHEBoolClient == true && DHEBoolClient == false){
											$scope.supp_groups = 0;
											$scope.storeidField.eltValue = "= ECDHE";
											$scope.chExtensions[elt2].eltValue = "= ECDHE keys";
										} else if(ECDHEBoolClient == false && DHEBoolClient == true){
											$scope.supp_groups = 1;
											$scope.storeidField.eltValue = "= DHE";
											$scope.chExtensions[elt2].eltValue = "= DHE keys";
										}else if(ECDHEBoolClient == false && DHEBoolClient == false){												
											$scope.explainAlert = "Supported_groups empty, default is selected!";
											$scope.ECDHEClient["secp256r1(0x0017)"] = true;
											$scope.supp_groups = 0;
											$scope.storeidField.eltValue = "= ECDHE";
											$scope.chExtensions[elt2].eltValue = "= ECDHE keys";
										}
									}
								}


								// 	$scope.alreadyAvailable = false;
								// 	if($scope.supp_groups == 0 || $scope.supp_groups == 2){
								// 		if($scope.ECDHEClient[$scope.data.adjust] ==  true || $scope.DHEClient[$scope.data.adjust] == true){
								// 			for(var alerts in $scope.alertsList){
								// 				$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Key Shares"),1);		
								// 			}
								// 		}
								// 	}	
									
								// }
							break;
							default:
		            	}
		            }
		        }
		    break;
            case 'serverHello':
            	for (var elt1 in $scope.serverHello){
            		if($scope.storeidField.eltName == $scope.serverHello[elt1].eltName){
            			switch ($scope.storeidField.eltName){
							// case 'legacy_version':
							// 	$scope.adjustVersion('serverHello', elt1, elt);
							// 	$scope.updateNextSteps('clientHello','legacy_version', 'adjusted');
		     //        		break;

       //      				case 'random':
       //      					$scope.storeElt;
       //      					for (var elt in $scope.splitted){
				   //          		if($scope.data.adjust == $scope.splitted[elt]){
				   //          			if( $scope.splitted[elt] == 'random'){
					  //           			$scope.serverHello[elt1].eltValue = ';';
				   //          			}
				   //          			else{
			    //         					$scope.serverHello[elt1].eltValue = $scope.splitted[elt] + ';';
				   //          			}
				   //          			$scope.storeElt = $scope.splitted[elt];
							// 		}
							// 	}
							// $scope.updateNextSteps('serverHello','random', 'adjusted');
		     //        		break;

		            		case 'cipher_suites':
								$scope.cipherSuitesServer = $scope.data.adjust;

								$scope.alreadyAvailable = false;
								if($scope.cipherSuitesClient[$scope.cipherSuitesServer] ==  false){
									for(var alerts in $scope.alertsList){
										if($scope.alertsList[alerts].title == "Cipher Suites"){
											$scope.alreadyAvailable = true;
										}
									}
									if($scope.alreadyAvailable == false){
										$scope.alertsList.push({
								    		title:   "Cipher Suites", step: 'clientHello',
		    								description: $scope.cipherSuitesServer + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! "
										});
									}

								}			

								if($scope.cipherSuitesClient[$scope.cipherSuitesServer] ==  true){
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Cipher Suites"),1);		
									}
								}
								$scope.alreadyAvailable = false;


								//TODO HelloRetryRequest
								if(keyExchange[0]=='helloRetryRequest'){
									//the serverHello and HelloRetryRequest 's cipher suite must be the same.
									if($scope.cipherSuitesServer != $scope.cipherSuitesHelloRetryRequest){
											alert("Cipher suites of helloRetryRequest and serverHello should be the same!! ABORT HANDSHAKE WITH ILLEGAL PARAMETER ALERT");
										}
								}
							break;		            

		            		default:
		            	}
		            }
		        }

	        break;
	        case 'shExtensions':
	        	for (var elt1 in $scope.shExtensions){
            		if($scope.storeidField.eltName == $scope.shExtensions[elt1].eltName){
            			switch ($scope.storeidField.eltName){
							case 'key_share':								
								$scope.alreadyAvailable = false;
								if($scope.ECDHEClient[$scope.data.adjust] ==  false || $scope.DHEClient[$scope.data.adjust] == false){
									for(var alerts in $scope.alertsList){
										if($scope.alertsList[alerts].title == "Key Shares"){
											$scope.alreadyAvailable = true;
										}
									}
									if($scope.alreadyAvailable == false){
										$scope.alertsList.push({
								    		title:   "Key Shares", step: 'clientHello',
		    								description: $scope.data.adjust + " is selected in the server and wasn't offered by the client!! ABORT HANDSHAKE!"
										});
									}

								}			

								if($scope.ECDHEClient[$scope.data.adjust] ==  true || $scope.DHEClient[$scope.data.adjust] == true){
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Key Shares"),1);		
									}
								}
								$scope.alreadyAvailable = false;

								if($scope.data.adjust == 'secp256r1(0x0017)' || $scope.data.adjust == 'secp384r1(0x0018)' || $scope.data.adjust == 'secp521r1(0x0019)' || $scope.data.adjust == 'x25519(0x001D)' || $scope.data.adjust == 'x448(0x001E)'){
 									$scope.shExtensions[elt1].eltValue = '= ECDHE';
								} else{
									$scope.shExtensions[elt1].eltValue = '= DHE';
								}
								$scope.key_shareValue = $scope.data.adjust;
							break;
						}
					}
				}
	        break;

            case 'helloRetryRequest':
				for (var elt1 in $scope.serverHello){
            		if($scope.storeidField.eltName == $scope.serverHello[elt1].eltName){
            			switch ($scope.storeidField.eltName){
		            		case 'cipher_suites':
		            			if($scope.cipherSuitesClient[$scope.cipherSuitesHelloRetryRequest] ==  false){
		            				//cpher suite selected by the server must be one from the list chosen by the client
									alert($scope.cipherSuitesServer + " is selected in the server and wasn't offered by the client!! ABORT HANDSHAKE!");
								}	

								//TODO		
								if($scope.cipherSuitesServer != $scope.cipherSuitesHelloRetryRequest){
									//the serverHello and HelloRetryRequest 's cipher suite must be the same.
									alert("Cipher suites of helloRetryRequest and serverHello should be the same!! ABORT HANDSHAKE WITH ILLEGAL PARAMETER ALERT");
								}
							break;		            
						}
					}
				}         
	        break;      

            case 'rrClientHello':
	        
	        break;
            
            case 'encryptedExtension':
            	for (var elt1 in $scope.encryptedExtension){
            		if($scope.storeidField.eltName == $scope.encryptedExtension[elt1].eltName){
            			switch ($scope.storeidField.eltName){
			            	case 'Client_certificate_type':								
								// $scope.clientCertServer = $scope.data.adjust;

								$scope.alreadyAvailable = false;
								if($scope.clientCert[$scope.certServer.client] ==  false){
									for(var alerts in $scope.alertsList){
										if($scope.alertsList[alerts].title == "Client Certificate"){
											$scope.alreadyAvailable = true;
										
										}
									}
									if($scope.alreadyAvailable == false){
										$scope.alertsList.push({
								    		title:   "Client Certificate", step: 'chExtensions',
		    								description: $scope.certServer.client + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! "
										});
									}

								}			

								else if($scope.clientCert[$scope.certServer.client] ==  true){
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Client Certificate"),1);		
									}
								}
								$scope.alreadyAvailable = false;
								
							break;	

							case 'Server_certificate_type':
								// $scope.serverCertServer = $scope.data.adjust;

								$scope.alreadyAvailable = false;
								if($scope.serverCert[$scope.certServer.server] ==  false){
									for(var alerts in $scope.alertsList){
										if($scope.alertsList[alerts].title == "Server Certificate"){
											$scope.alreadyAvailable = true;
										
										}
									}
									if($scope.alreadyAvailable == false){
										$scope.alertsList.push({
								    		title:   "Server Certificate", step: 'chExtensions',
		    								description: $scope.certServer.server + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! "
										});
									}

								}			

								else if($scope.serverCert[$scope.certServer.server] ==  true){
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Server Certificate"),1);		
									}
								}
								$scope.alreadyAvailable = false;
							break;
						}
					}
				}
            break;
            default:
        }
		
	};

	$scope.updateNextSteps = function (originalUpdate,fieldUpdated,type){
		switch (originalUpdate) {
			//////// KEY ECHANGE
			case 'clientHello':
				if(type == 'deleted'){
					for (var elt1 in $scope.chExtensions){
		        			if($scope.storeidField.eltName == $scope.chExtensions[elt1].eltName){
								$scope.chExtensions[elt1].deleted="yes";
						}
					}
				}
				switch(fieldUpdated){
					///legacy_version in clientHello Changed -> Check tlsVersion Client and server
					// case 'legacy_version':
					// 	$scope.checkRandom();
					// break;

					case 'supported_versions':
						$scope.explainAlert = "TLS 1.3 CientHello messages always contain 'supported_versions', otherwise, they will be interpreted as TLS 1.2 ClientHello messages";
												
						$scope.leftBoxTitle = 'supported_versions NOT deleted' ;	
						for (var elt2 in $scope.chExtensions){
	        				if($scope.storeidField.eltName == $scope.chExtensions[elt2].eltName){
								$scope.chExtensions[elt2].deleted="no";
							}
						}
						// $scope.newItem= {eltName: 'supported_versions', delete: 'yes', 
						// info: 'Indicates which versions of TLS it supports.'}
						// $scope.chExtensions.splice(0, 0, $scope.newItem);
					break;

					case 'supported_groups':
						for (var elt2 in $scope.chExtensions){
		        			if($scope.chExtensions[elt2].eltName == 'key_share'){					
								if($scope.chExtensions[elt2].deleted=="no"){
									$scope.alreadyAvailable = false;
									if($scope.storeidField.deleted == "yes"){
										for(var alerts in $scope.alertsList){
											if($scope.alertsList[alerts].title == "Missing supported_groups extension"){
												$scope.alreadyAvailable = true;													
											}
										}
										if($scope.alreadyAvailable == false){
											$scope.alertsList.push({
									    		title:   "Missing supported_groups extension", step: 'chExtensions',
			    								description: "Key Share and supported_group should always be available together. Either add supported_groups or, remove key_share and add pre_shared_keys    !! missing extension !!"
											});
										}
										if($scope.keyExMode == 2 || $scope.keyExMode == 3 || $scope.keyExMode == 4 ){
											$scope.keyExMode = 4; 
											for(var alerts in $scope.alertsList){
												$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add signature_algorithms extension"),1);	
											}
											for (var elt3 in $scope.chExtensions){
												if($scope.chExtensions[elt3].eltName == 'signature_algorithms'){
													$scope.alreadyAvailable = false;
													if($scope.chExtensions[elt3].deleted=="no"){
														for(var alerts in $scope.alertsList){
															if($scope.alertsList[alerts].title == "Remove signature_algorithms extension"){
																$scope.alreadyAvailable = true;													
															}
														}
														if($scope.alreadyAvailable == false){
															$scope.alertsList.push({
										    					title:   "Remove signature_algorithms extension", step: 'chExtensions',
							    								description: "Server authentication is not needed with PSK key exchange mode."
															});
														}	
													}
												}
											}
										}
										else {
											$scope.keyExMode = 5;
										}
									}			
									else if($scope.storeidField.deleted == "no"){
										for(var alerts in $scope.alertsList){
											$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Missing supported_groups extension"),1);	
										}
										if($scope.keyExMode == 4){
											if($scope.key_shareValue == 'secp256r1(0x0017)' || $scope.key_shareValue == 'secp384r1(0x0018)' || $scope.key_shareValue == 'secp521r1(0x0019)' || $scope.key_shareValue == 'x25519(0x001D)' || $scope.key_shareValue == 'x448(0x001E)'){
										 		$scope.keyExMode = 2;
										 	}else{
										 		$scope.keyExMode = 3;
										 	}
										}
										else if ($scope.keyExMode == 5){
											if($scope.key_shareValue == 'secp256r1(0x0017)' || $scope.key_shareValue == 'secp384r1(0x0018)' || $scope.key_shareValue == 'secp521r1(0x0019)' || $scope.key_shareValue == 'x25519(0x001D)' || $scope.key_shareValue == 'x448(0x001E)'){
										 		$scope.keyExMode = 0;
										 	}else{
										 		$scope.keyExMode = 1;
										 	}
										}
										for(var alerts in $scope.alertsList){
											$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Remove signature_algorithms extension"),1);	
										}
										for (var elt3 in $scope.chExtensions){
											if($scope.chExtensions[elt3].eltName == 'signature_algorithms'){
												$scope.alreadyAvailable = false;
												if($scope.chExtensions[elt3].deleted=="yes"){
													for(var alerts in $scope.alertsList){
														if($scope.alertsList[alerts].title == "Add signature_algorithms extension"){
															$scope.alreadyAvailable = true;													
														}
													}
													if($scope.alreadyAvailable == false){
														$scope.alertsList.push({
												    		title:   "Add signature_algorithms extension", step: 'chExtensions',
						    								description: "When (EC)DHE key exchange mode is used, the client must request authentication from the server by including the signature_algorithms extension."
														});
													}
												}
											}
										}
										$scope.alreadyAvailable = false;
									}
									
								}
								else if($scope.chExtensions[elt2].deleted=="yes"){
									$scope.alreadyAvailable = false;

									if($scope.storeidField.deleted == "no"){

									
										for(var alerts in $scope.alertsList){
											if($scope.alertsList[alerts].title == "Missing key_share extension"){
												$scope.alreadyAvailable = true;													
											}
										}
										if($scope.alreadyAvailable == false){
											$scope.alertsList.push({
									    		title:   "Missing key_share extension", step: 'chExtensions',
			    								description: "Key Share and supported_group should always be available together. Either add supported_groups or, remove key_share and add pre_shared_keys    !! missing extension !!"
											});
										}
									}			
									else if($scope.storeidField.deleted == "yes"){
										for(var alerts in $scope.alertsList){
											$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Missing key_share extension"),1);	
										}
									}
									$scope.alreadyAvailable = false;
								}
							}							
						}
						// else if($scope.chExtensions[elt2].eltName == 'pre_shared_keys'){
							// 	if($scope.chExtensions[elt2].deleted=="yes"){
							// 		alert("Supported groups is not available. PSK must be supported.");
							// 		alert("missing extension");
							// 	}
							// }
					break;			

					case 'key_share':
						supported_groups= true;
						pre_shared_keys = true;
						// $scope.supportedgroupsKeyshare[1]=false;
						for (var elt1 in $scope.chExtensions){
							if($scope.chExtensions[elt1].eltName == 'supported_groups'){
								if($scope.chExtensions[elt1].deleted=="yes"){
									supported_groups = false;
								}
								else{
									supported_groups = true;
								}
							}
							else if($scope.chExtensions[elt1].eltName == 'pre_shared_keys'){
								if($scope.chExtensions[elt1].deleted=="no"){
									pre_shared = true;
								}
								else{
									pre_shared = false;
								}
							}
							else if($scope.chExtensions[elt1].eltName == 'psk_key_exchange_modes'){
								$scope.alreadyAvailable = false;
								if($scope.chExtensions[elt1].deleted=='no' && $scope.chExtensions[elt1].eltValue=='= psk_dhe_ke'){
									for(var alerts in $scope.alertsList){
										if($scope.alertsList[alerts].title == "Missing key_share extension"){
											$scope.alreadyAvailable = true;													
										}
									}
									if($scope.alreadyAvailable == false){
										$scope.alertsList.push({
								    		title:   "Missing key_share extension", step: 'chExtensions',
		    								description: "When PSK_dhe_ke is selected in psk_key_exchange_modes, then key_share should be included in the extensions"
										});
									}
								}			
								else if($scope.chExtensions[elt1].deleted=='no' && $scope.chExtensions[elt1].eltValue == '= psk_ke'){
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Missing key_share extension"),1);	
									}
								}
								$scope.alreadyAvailable = false;
							}
						}
						
						if($scope.storeidField.deleted == "no"){

							$scope.alreadyAvailable = false;
							if(supported_groups == false){
							
								for(var alerts in $scope.alertsList){
									if($scope.alertsList[alerts].title == "Missing supported_groups extension"){
										$scope.alreadyAvailable = true;													
									}
								}
								if($scope.alreadyAvailable == false){
									$scope.alertsList.push({
							    		title:   "Missing supported_groups extension", step: 'chExtensions',
	    								description: "Key Share and supported_group should always be available together. Either add supported_groups or, remove key_share and add pre_shared_keys    !! missing extension !!"
									});
								}
							}			
							else if(supported_groups == true){
								for(var alerts in $scope.alertsList){
									$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Missing supported_groups extension"),1);	
								}
							}
							$scope.alreadyAvailable = false;
						}

						if($scope.storeidField.deleted == "yes"){

							$scope.alreadyAvailable = false;
							if(supported_groups == true){
								for(var alerts in $scope.alertsList){
									if($scope.alertsList[alerts].title == "Missing key_share extension"){
										$scope.alreadyAvailable = true;													
									}
								}
								if($scope.alreadyAvailable == false){
									$scope.alertsList.push({
							    		title:   "Missing key_share extension", step: 'chExtensions',
	    								description: "Key Share and supported_group should always be available together. Either add supported_groups or, remove key_share and add pre_shared_keys    !! missing extension !!"
									});
								}
							}			
							else if(supported_groups == false){
								for(var alerts in $scope.alertsList){
									$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Missing key_share extension"),1);	
								}
							}
							$scope.alreadyAvailable = false;
							if(pre_shared == false && supported_groups == false){
							
								for(var alerts in $scope.alertsList){
									if($scope.alertsList[alerts].title == "Missing extensions"){
										$scope.alreadyAvailable = true;													
									}
								}
								if($scope.alreadyAvailable == false){
									$scope.alertsList.push({
							    		title:   "Missing extensions", step: 'chExtensions',
	    								description: "Either add key_share extensions for (EC)DHE or pre_shared_keys for PSK mode   !! missing extension !!"
									});
								}
							}			
							else if(pre_shared == true){
								for(var alerts in $scope.alertsList){
									$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Missing extensions"),1);	
								}
							}
							$scope.alreadyAvailable = false;
						}					
					break;

					case 'psk_key_exchange_modes':
						key_share = [true,true];
						pre_shared = [true,true]; // true means is in extension right now
					
						for (var elt1 in $scope.chExtensions){
							if($scope.chExtensions[elt1].eltName == 'key_share'){
								if($scope.chExtensions[elt1].deleted=="no"){
									key_share[0] = true;
								}
								else{
									key_share[0] = false;
								}
							}
							else{
								if($scope.chExtensions[elt1].eltName == 'pre_shared_keys'){
									if($scope.chExtensions[elt1].deleted=="no"){
										pre_shared[0] = true;
									}
									else{
										pre_shared[0] = false;
									}
								}
							}
						}
						for (var elt1 in $scope.shExtensions){
							if($scope.shExtensions[elt1].eltName == 'key_share'){
								if($scope.shExtensions[elt1].deleted=="no"){
									key_share[1] = true;
								}
								else{
									key_share[1] = false;
								}
							}
							else if($scope.shExtensions[elt1].eltName == 'pre_shared_keys'){
								if($scope.shExtensions[elt1].deleted=="no"){
									pre_shared[1] = true;
								}
								else{
									pre_shared[1] = false;
								}
							}
						}
					
						if(type=='adjusted'){
							if($scope.storeidField.eltValue == '= psk_ke'){
								$scope.alreadyAvailable = false;
								if(key_share[0] || key_share[1]){
									for(var alerts in $scope.alertsList){
										if($scope.alertsList[alerts].title == "Remove key_share extension"){
											$scope.alreadyAvailable = true;													
										}
									}
									if($scope.alreadyAvailable == false){
										$scope.alertsList.push({
								    		title:   "Remove key_share extension", step: 'chExtensions',
		    								description: "psk_ke chosen in psk_key_exchange_modes: key_share should not be in the extensions"
										});
									}
								}			
								else if(key_share[0] == false && key_share[1] == false){
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Remove key_share extension"),1);	
									}
								}
								$scope.alreadyAvailable = false;	
							}
							else if($scope.storeidField.eltValue == '= psk_dhe_ke'){
								$scope.alreadyAvailable = false;
								if(key_share[0]==false || key_share[1]==false){
									for(var alerts in $scope.alertsList){
										if($scope.alertsList[alerts].title == "Add key_share extension"){
											$scope.alreadyAvailable = true;													
										}
									}
									if($scope.alreadyAvailable == false){
										$scope.alertsList.push({
								    		title:   "Add key_share extension", step: 'chExtensions',
		    								description: "PSK_dhe_ke chosen in psk_key_exchange_modes: key_share should be in the extensions"
										});
									}
								}			
								else if(key_share[0] && key_share[1]){
									for(var alerts in $scope.alertsList){
										$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add key_share extension"),1);	
									}
								}
								$scope.alreadyAvailable = false;
							}
							
							$scope.alreadyAvailable = false;
							if(pre_shared[0] == false){
								for(var alerts in $scope.alertsList){
									if($scope.alertsList[alerts].title == "Add pre_shared_keys extension"){
										$scope.alreadyAvailable = true;													
									}
								}
								if($scope.alreadyAvailable == false){
									$scope.alertsList.push({
							    		title:   "Add pre_shared_keys extension", step: 'chExtensions',
	    								description: "When psk_key_exchange_modes is in the extensions, pre_shared_keys should be there too"
									});
								}
							}			
							else if(pre_shared[0] == true){
								for(var alerts in $scope.alertsList){
									$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add pre_shared_keys extension"),1);	
								}
							}
							$scope.alreadyAvailable = false;
						}
						else if (type== 'deleted'){

							$scope.alreadyAvailable = false;
							if(pre_shared[0] == true){
								for(var alerts in $scope.alertsList){
									if($scope.alertsList[alerts].title == "Add psk_key_exchange_modes extension"){
										$scope.alreadyAvailable = true;													
									}
								}
								if($scope.alreadyAvailable == false){
									$scope.alertsList.push({
							    		title:   "Add psk_key_exchange_modes extension", step: 'chExtensions',
	    								description: "When pre_shared_keys is in the extension, psk_key_exchange_modes should be there too"
									});
								}
							}			
							else if(pre_shared[0] == false){
								for(var alerts in $scope.alertsList){
									$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add psk_key_exchange_modes extension"),1);	
								}
							}
							$scope.alreadyAvailable = false;
						}
						else{
							$scope.alreadyAvailable = false;
							if(pre_shared[0] == false){
								for(var alerts in $scope.alertsList){
									if($scope.alertsList[alerts].title == "Add pre_shared_keys extension"){
										$scope.alreadyAvailable = true;													
									}
								}
								if($scope.alreadyAvailable == false){
									$scope.alertsList.push({
							    		title:   "Add pre_shared_keys extension", step: 'chExtensions',
	    								description: "when psk_key_exchange_modes is in the extensions, pre_shared_keys should be there too"
									});
								}
							}			
							else if(pre_shared[0] == true){
								for(var alerts in $scope.alertsList){
									$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add pre_shared_keys extension"),1);	
								}
							}
							$scope.alreadyAvailable = false;
						}
						

					break;

					case 'pre_shared_keys':
						if (type == 'deleted'){
							for (var elt1 in $scope.chExtensions){
								if($scope.chExtensions[elt1].eltName == 'psk_key_exchange_modes'){
									$scope.alreadyAvailable = false;
									if($scope.chExtensions[elt1].deleted == 'no'){
										for(var alerts in $scope.alertsList){
											if($scope.alertsList[alerts].title == "Remove psk_key_exchange_modes extension"){
												$scope.alreadyAvailable = true;													
											}
										}
										if($scope.alreadyAvailable == false){
											$scope.alertsList.push({
									    		title:   "Remove psk_key_exchange_modes extension", step: 'chExtensions',
			    								description: "psk_key_exchange_modes should be removed when pre_shared_keys is removed"
											});
										}
									}			
									else if($scope.chExtensions[elt1].deleted == 'yes'){
										for(var alerts in $scope.alertsList){
											$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Remove psk_key_exchange_modes extension"),1);	
										}
									}
									$scope.alreadyAvailable = false;
								
								}else if($scope.chExtensions[elt1].eltName == 'key_share'){

									$scope.alreadyAvailable = false;
									if($scope.chExtensions[elt1].deleted=="yes"){
										for(var alerts in $scope.alertsList){
											if($scope.alertsList[alerts].title == "Missing extensions"){
												$scope.alreadyAvailable = true;													
											}
										}
										if($scope.alreadyAvailable == false){
											$scope.alertsList.push({
									    		title:   "Missing extensions", step: 'chExtensions',
			    								description: "Either add key_share extensions for (EC)DHE or pre_shared_keys for PSK mode   !! missing extension !!"
											});
										}
									}			
									else{
										for(var alerts in $scope.alertsList){
											$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Missing extensions"),1);	
										}
										$scope.keyExMode = 0;
										for(var alerts in $scope.alertsList){
											$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Remove signature_algorithms extension"),1);	
										}
										for (var elt3 in $scope.chExtensions){
											if($scope.chExtensions[elt3].eltName == 'signature_algorithms'){
												$scope.alreadyAvailable = false;
												if($scope.chExtensions[elt3].deleted=="yes"){
													for(var alerts in $scope.alertsList){
														if($scope.alertsList[alerts].title == "Add signature_algorithms extension"){
															$scope.alreadyAvailable = true;													
														}
													}
													if($scope.alreadyAvailable == false){
														$scope.alertsList.push({
												    		title:   "Add signature_algorithms extension", step: 'chExtensions',
						    								description: "When (EC)DHE key exchange mode is used, the client must request authentication from the server by including the signature_algorithms extension."
														});
													}
												}
											}
										}
									}
									$scope.alreadyAvailable = false;
								}
							}
						}
						else{
							for(var alerts in $scope.alertsList){
								$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add pre_shared_keys extension"),1);	
							}

							for (var elt1 in $scope.chExtensions){
								if($scope.chExtensions[elt1].eltName == 'psk_key_exchange_modes'){
									$scope.alreadyAvailable = false;
									if($scope.chExtensions[elt1].deleted == 'yes'){
										for(var alerts in $scope.alertsList){
											if($scope.alertsList[alerts].title == "Add psk_key_exchange_modes extension"){
												$scope.alreadyAvailable = true;													
											}
										}
										if($scope.alreadyAvailable == false){
											$scope.alertsList.push({
									    		title:   "Add psk_key_exchange_modes extension", step: 'chExtensions',
			    								description:  "When pre_shared_keys is in the extension, psk_key_exchange_modes should be there too"
											});
										}
									}			
									else if($scope.chExtensions[elt1].deleted == 'no'){
										for(var alerts in $scope.alertsList){
											$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add psk_key_exchange_modes extension"),1);	
										}

										for (var elt2 in $scope.shExtensions){
											if($scope.shExtensions[elt2].eltName == 'pre_shared_keys'){
												if($scope.shExtensions[elt2].deleted == 'no'){
													if($scope.keyExMode == 0){
														$scope.keyExMode = 2;
														for(var alerts in $scope.alertsList){
															$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Remove signature_algorithms extension"),1);	
														}
														for (var elt3 in $scope.chExtensions){
															if($scope.chExtensions[elt3].eltName == 'signature_algorithms'){
																$scope.alreadyAvailable = false;
																if($scope.chExtensions[elt3].deleted=="yes"){
																	for(var alerts in $scope.alertsList){
																		if($scope.alertsList[alerts].title == "Add signature_algorithms extension"){
																			$scope.alreadyAvailable = true;													
																		}
																	}
																	if($scope.alreadyAvailable == false){
																		$scope.alertsList.push({
																    		title:   "Add signature_algorithms extension", step: 'chExtensions',
										    								description: "When (EC)DHE key exchange mode is used, the client must request authentication from the server by including the signature_algorithms extension."
																		});
																	}
																}
															}
														}

													} else if($scope.keyExMode == 0){
														$scope.keyExMode = 0;

														for(var alerts in $scope.alertsList){
															$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Remove signature_algorithms extension"),1);	
														}
														for (var elt3 in $scope.chExtensions){
															if($scope.chExtensions[elt3].eltName == 'signature_algorithms'){
																$scope.alreadyAvailable = false;
																if($scope.chExtensions[elt3].deleted=="yes"){
																	for(var alerts in $scope.alertsList){
																		if($scope.alertsList[alerts].title == "Add signature_algorithms extension"){
																			$scope.alreadyAvailable = true;	
																		}												
																	}
																	if($scope.alreadyAvailable == false){
																		$scope.alertsList.push({
																    		title:   "Add signature_algorithms extension", step: 'chExtensions',
										    								description: "When (EC)DHE key exchange mode is used, the client must request authentication from the server by including the signature_algorithms extension."
																		});
																	}
																}
															}
														}
													} else if ($scope.keyExMode == 5){
														$scope.keyExMode = 4;

														for(var alerts in $scope.alertsList){
															$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add signature_algorithms extension"),1);	
														}
														for (var elt3 in $scope.chExtensions){
															if($scope.chExtensions[elt3].eltName == 'signature_algorithms'){
																$scope.alreadyAvailable = false;
																if($scope.chExtensions[elt3].deleted=="no"){
																	for(var alerts in $scope.alertsList){
																		if($scope.alertsList[alerts].title == "Remove signature_algorithms extension"){
																			$scope.alreadyAvailable = true;													
																		}
																	}
																	if($scope.alreadyAvailable == false){
																		$scope.alertsList.push({
													    					title:   "Remove signature_algorithms extension", step: 'chExtensions',
										    								description: "Server authentication is not needed with PSK key exchange mode."
																		});
																	}	
																}

															}
														}
													}
												}
											}
										}
									}
									$scope.alreadyAvailable = false;
								}
							}
						}

					break;
					case 'post_handshake_auth':
						// if (type == 'deleted'){
						// 	$scope.postHandshake = false;
						// }
						// else{
						// 	$scope.postHandshake = true;	
						// }
					break;

					case 'early_data':
						if (type == 'deleted'){
							$scope.early_dataClient = false;
						}
						else{
							$scope.early_dataClient = true;
							for (var elt1 in $scope.chExtensions){
								if($scope.chExtensions[elt1].eltName == 'pre_shared_keys'){
									$scope.alreadyAvailable = false;
									if($scope.chExtensions[elt1].deleted=="yes"){
										for(var alerts in $scope.alertsList){
											if($scope.alertsList[alerts].title == "Add pre_shared_keys extension"){
												$scope.alreadyAvailable = true;													
											}
										}
										if($scope.alreadyAvailable == false){
											$scope.alertsList.push({
									    		title:   "Add pre_shared_keys extension", step: 'chExtensions',
			    								description: "psk mode should be selected when using early data"
											});
										}
									}			
									else{
										for(var alerts in $scope.alertsList){
											$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add pre_shared_keys extension"),1);	
										}
										$scope.explainAlert = "Due to early data (0-RTT), the data is not forward secret.";
									}
									$scope.alreadyAvailable = false;

								}
							}
						}
					break;
					case 'signature_algorithms_cert':
						if (type == 'deleted'){
							for (var elt1 in $scope.chExtensions){
								if($scope.chExtensions[elt1].eltName == 'signature_algorithms'){
									$scope.alreadyAvailable = false;
									if($scope.chExtensions[elt1].deleted=="yes" && ($scope.keyExMode == 0 || $scope.keyExMode==1)){
										for(var alerts in $scope.alertsList){
											if($scope.alertsList[alerts].title == "Add signature_algorithms extension"){
												$scope.alreadyAvailable = true;													
											}
										}
										if($scope.alreadyAvailable == false){
											$scope.alertsList.push({
									    		title:   "Add signature_algorithms extension", step: 'chExtensions',
			    								description: "When (EC)DHE key exchange mode is used, the client must request authentication from the server by including the signature_algorithms extension."
											});
										}
									}		
									else if($scope.chExtensions[elt1].deleted=="no" && ($scope.keyExMode == 0 || $scope.keyExMode==1)){
										for(var alerts in $scope.alertsList){
											$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add signature_algorithms extension"),1);	
										}
										$scope.explainAlert = "When <i>signature_algorithms_cert</i> is not given, then <i>signature_algorithms</i> also applies to signatures in the certificateVerify message.";
									}
									$scope.alreadyAvailable = false;
								}
							}
						}
					break;
					case 'signature_algorithms':
						if (type == 'deleted'){
							$scope.sigalgoClient = false;
							$scope.alreadyAvailable = false;
							if($scope.keyExMode == 0 || $scope.keyExMode==1){
								for(var alerts in $scope.alertsList){
									if($scope.alertsList[alerts].title == "Add signature_algorithms extension"){
										$scope.alreadyAvailable = true;													
									}
								}
								if($scope.alreadyAvailable == false){
									$scope.alertsList.push({
							    		title:   "Add signature_algorithms extension", step: 'chExtensions',
	    								description: "When (EC)DHE key exchange mode is used, the client must request authentication from the server by including the signature_algorithms extension."
									});
								}
							}		
							else if($scope.keyExMode == 4){
								for(var alerts in $scope.alertsList){
									$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Remove signature_algorithms extension"),1);	
								}
							}
							$scope.alreadyAvailable = false;
						}
						else{
							$scope.sigalgoClient = true;

							$scope.alreadyAvailable = false;
							if($scope.keyExMode == 4){
								for(var alerts in $scope.alertsList){
									if($scope.alertsList[alerts].title == "Remove signature_algorithms extension"){
										$scope.alreadyAvailable = true;													
									}
								}
								if($scope.alreadyAvailable == false){
									$scope.alertsList.push({
							    		title:   "Remove signature_algorithms extension", step: 'chExtensions',
	    								description: "Server authentication is not needed with PSK key exchange mode."
									});
								}		
							} else if($scope.keyExMode != 5){
								for(var alerts in $scope.alertsList){
									$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Add signature_algorithms extension"),1);	
								}
							}
						}
					break;
					default:
				}
				
			break;

			case 'serverHello':
				if(type == 'deleted'){
					for (var elt1 in $scope.shExtensions){
		        			if($scope.storeidField.eltName == $scope.shExtensions[elt1].eltName){
								$scope.shExtensions[elt1].deleted="yes";
						}
					}
				}
				switch(fieldUpdated){
					// case 'legacy_version':
					// 	$scope.checkRandom();
					// break;

					// case 'random':
					// 	$scope.checkRandom();
					// break;

					case 'key_share':
						if(type == 'deleted'){
							if($scope.keyExMode == 0 || $scope.keyExMode == 1){
								$scope.keyExMode = 5;
								for(var alerts in $scope.alertsList){
									if($scope.alertsList[alerts].title == "Missing extensions ServerHello"){
										$scope.alreadyAvailable = true;													
									}
								}
								if($scope.alreadyAvailable == false){
									$scope.alertsList.push({
							    		title:   "Missing extensions ServerHello", step: 'chExtensions',
	    								description: "Either add key_share extensions for (EC)DHE or pre_shared_keys for PSK mode   !! missing extension !!"
									});
								}

							} else if($scope.keyExMode == 2 || $scope.keyExMode == 3){
								$scope.keyExMode = 4;
								for(var alerts in $scope.alertsList){
									$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Missing extensions ServerHello"),1);	
								}
							}
						}
						else{
							if($scope.storeidField.eltValue == '= ECDHE'){
								if($scope.keyExMode == 1 || $scope.keyExMode == 5){
									$scope.keyExMode = 0;
								} else if($scope.keyExMode == 3 || $scope.keyExMode == 4){
									$scope.keyExMode = 2;
								}
							} else if($scope.storeidField.eltValue == '= DHE'){
								if($scope.keyExMode == 0 || $scope.keyExMode == 5){
									$scope.keyExMode = 1;
								} else if($scope.keyExMode == 2 || $scope.keyExMode == 4){
									$scope.keyExMode = 3;
								}
							}
							for(var alerts in $scope.alertsList){
								$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Missing extensions ServerHello"),1);	
							}
						}
					break;


					case 'supported_versions':
						$scope.explainAlert = "TLS 1.3 ServerHello messages always contain 'supported_versions', otherwise, they will be interpreted as TLS 1.2 ClientHello messages.";
				
						$scope.leftBoxTitle = 'supported_versions NOT deleted' ;	
						$scope.newItem= {eltName: 'supported_versions', delete: 'yes', 
						info: 'Indicates which versions of TLS it supports.'}
						$scope.chExtensions.splice(0, 0, $scope.newItem);
					break;			


					case 'pre_shared_keys':
						if(type == 'deleted'){							
							for (var elt1 in $scope.shExtensions){
								if($scope.shExtensions[elt1].eltName == 'key_share'){
									$scope.alreadyAvailable = false;
									if($scope.shExtensions[elt1].deleted == 'yes'){
										for(var alerts in $scope.alertsList){
											if($scope.alertsList[alerts].title == "Missing extensions ServerHello"){
												$scope.alreadyAvailable = true;													
											}
										}
										if($scope.alreadyAvailable == false){
											$scope.alertsList.push({
									    		title:   "Missing extensions ServerHello", step: 'chExtensions',
			    								description: "Either add key_share extensions for (EC)DHE or pre_shared_keys for PSK mode   !! missing extension !!"
											});
										}
									}			
									else if($scope.shExtensions[elt1].deleted == 'no'){
										if($scope.shExtensions[elt1].eltValue == '= ECDHE'){
											$scope.keyExMode = 0;
										}
										else if($scope.shExtensions[elt1].eltValue == '= DHE'){
											$scope.keyExMode = 1;
										}
									// 	for(var alerts in $scope.alertsList){
									// 		$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Missing extensions ServerHello"),1);	
									// 	}
									}
									
									$scope.alreadyAvailable = false;

								}
							}
						} else{
							$scope.pre_shared = false;
							$scope.psk_mode = false;
							
							for (var elt1 in $scope.chExtensions){
								if($scope.chExtensions[elt1].eltName == 'pre_shared_keys'){
									if($scope.chExtensions[elt1].deleted == 'no'){
										$scope.pre_shared = true;
									}
								}
								else if($scope.chExtensions[elt1].eltName == 'psk_key_exchange_modes'){
									if($scope.chExtensions[elt1].deleted == 'no'){
										$scope.psk_mode = true;
									}
								}
							}
							
							$scope.alreadyAvailable = false;
							
							if($scope.pre_shared == false || $scope.psk_mode == false){
								$scope.keyExMode = 5;
								for(var alerts in $scope.alertsList){
									if($scope.alertsList[alerts].title == "Remove pre_shared extension ServerHello"){
										$scope.alreadyAvailable = true;													
									}
								}
								if($scope.alreadyAvailable == false){
									$scope.alertsList.push({
							    		title:   "Remove pre_shared extension ServerHello", step: 'chExtensions',
	    								description: "PSK is not offered by the client in the ClientHello !!"
									});
								}
							}			
							else if($scope.pre_shared == true && $scope.psk_mode == true){
								for(var alerts in $scope.alertsList){
									$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf("Remove pre_shared extension ServerHello"),1);	
								}
								for (var elt1 in $scope.shExtensions){
									if($scope.shExtensions[elt1].eltName == 'key_share'){
										if($scope.shExtensions[elt1].deleted == 'yes'){
											$scope.keyExMode = 4;
										}
										else{
											if($scope.shExtensions[elt1].eltValue == '= ECDHE'){
												$scope.keyExMode = 2;
											}
											else if($scope.shExtensions[elt1].eltValue == '= DHE'){
												$scope.keyExMode = 3;
											}
										}
									}
								}
							}
							$scope.alreadyAvailable = false;
							
							
						}

					break;
					default:
				}
			break;
			case 'helloRetryRequest':
				if(type == 'deleted'){
					for (var elt1 in $scope.hrrExtensions){
		        			if($scope.storeidField.eltName == $scope.hrrExtensions[elt1].eltName){
								$scope.hrrExtensions[elt1].deleted="yes";
						}
					}
				}
				switch(fieldUpdated){
					// case 'cookie':
					// 	for (var elt1 in $scope.rrClientHello){
		   //      			if($scope.rrClientHello[elt1].eltName == "cookie"){
					// 			if($scope.rrClientHello[elt1].deleted=="yes" && $scope.storeidField.deleted == "no")
					// 				alert("When cookie is available is the extension of helloRetryRequest, the client must include a cookie extension to its response clientHello");
					// 			if($scope.rrClientHello[elt1].deleted=="no" && $scope.storeidField.deleted == "yes")
					// 				alert("The client must not include a cookie extension if it is not available in the extension of helloRetryRequest");
					// 		}
					// 	}
						
					// break;		
					default:
				}
			break;
			case 'rrClientHello':
				if(type == 'deleted'){
					for (var elt1 in $scope.rrClientHello){
		        			if($scope.storeidField.eltName == $scope.rrClientHello[elt1].eltName){
								$scope.rrClientHello[elt1].deleted="yes";
						}
					}
				}
				switch(fieldUpdated){
					// case 'cookie':
					// 	for (var elt1 in $scope.hrrExtensions){
		   //      			if($scope.hrrExtensions[elt1].eltName == "cookie"){
					// 			if($scope.hrrExtensions[elt1].deleted=="yes" && $scope.storeidField.deleted == "no")
					// 				alert("The client must not include a cookie extension if it is not available in the extension of helloRetryRequest");
					// 			if($scope.hrrExtensions[elt1].deleted=="no" && $scope.storeidField.deleted == "yes")
					// 				alert("When cookie is available is the extension of helloRetryRequest, the client must include a cookie extension to its response clientHello");
					// 		}
					// 	}
						
					// break;		
					default:
				}
			break
			case 'encryptedExtension':
				if(type == 'deleted'){
					for (var elt1 in $scope.encryptedExtension){
		        			if($scope.storeidField.eltName == $scope.encryptedExtension[elt1].eltName){
								$scope.encryptedExtension[elt1].deleted="yes";
						}
					}
				}
			break;
			case 'certificateRequest':
				if(type == 'deleted'){
					for (var elt1 in $scope.certificateRequest){
		        			if($scope.storeidField.eltName == $scope.certificateRequest[elt1].eltName){
								$scope.certificateRequest[elt1].deleted="yes";
						}
					}
				}

				switch(fieldUpdated){

					case 'signature_algorithms':
						if(type == 'deleted'){
							$scope.sigalgoServer = false;
						}
						else{
							$scope.sigalgoServer = true;
						}
					break;

					case 'signature_algorithms_cert':
						if(type == 'deleted'){
							$scope.explainAlert = "When <i>signature_algorithms_cert</i> is not given, then <i>signature_algorithms</i> also applies to signatures in the certificateVerify message.";
						}
					break;
				}
			break;

			default:
		}
	};


	

	$scope.keyExchange = [
		'serverHello', 'certificateRequest'
	];

	

 	$scope.clientHello = [
 		{eltType: 'ProtocolVersion', eltName: 'legacy_version', eltValue: '= 0x0303', delete: 'no', adjustment:'no', deleted:'no',
 			info: 'In version prior to TLS1.3, this field was used for version negotiation.</br> In TLS1.3 this field can only be equal to <b> 0x0303 </b>, which indicates TLS1.2 and the version preferences must be indicated by the client in a later extension parameter (<i>supported_versions)</i> which is mandatory in TLS1.3 having 0x0304 as its highest version. </br> ',
 			// adjustM: '"Either = 0x0303 (indicating TLS1.2) or <0x0303 indictating prior versions of TLS1.2<br/> For a client to be recognized as TLS1.3 Client, its legacy_version should be equal to 0x0303.',
 			// adjust: '= 0x0303;< 0x303'
 		}, 
 		{eltType: 'Random', delete: 'no', eltName: 'random', eltValue: ';', adjustment:'no', deleted:'no',
 			info: '32 bytes generated by a secure random number generator. </br></br> This random number is used to prevent downgrade attacks.'
 		},
 		{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_session_id', eltValue: ';', deleted:'no',
 			info: 'In version prior to TLS1.3, the client could provide an ID negotiated in a previous session by using the “session resumption" feature. This allows to skip time and cost of negotiating new keys.In TLS1.3 it was merged with pre_shared_keys (PSK) that is more flexible. Thus, this field is not needed for this purpose anymore in TLS1.3, instead it is used as a non-empty field to trigger middlebox compatibility box. Middelbox compatibility box helps TLS1.3 to be disguised as a resumed TLS1.2.',
 			adjustM: "<p> <u>If Client TLS1.3 and Server TLS1.2 or below:</u></br>In compatibility mode: this field must be non-empty so a client not offering a pre-TLS1.3 session must generate a new 32-byte value. This value need not be random but should be unpredictable to avoid implementations fixating on a specific value (also known as ossification). Otherwise, it MUST be set as a zero-length vector (i.e., a zero-valued single byte length field). </p> <p><u>If Client TLS1.2 and Server TLS1.3:</u> </br>When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value </p> <p><u>If Client TLS1.2 and Server TLS1.2 or below: </u> </br> When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value. </p> <p> <u> If Client TLS1.1 or below and Server TLS1.3 or TLS1.2: </u> </br> When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value.</p>"
 		},
 		{eltType: 'CipherSuite', delete: 'no', adjustment:'yes', eltName: 'cipher_suites', eltValue: ';', deleted:'no',
 		info: 'This field is a list of symmetric cipher options that are supported by the client in descending order of client preference. Cipher suites are a set of encryption rules dictating how the TLS handshake works.',
 		adjustM: 'Cipher suites in TLS1.3 use the same cipher suite space as pre-TLS1.3. But, they are defined differently. Therefore, cipher suites for TLS1.2 and lower cannot be used with TLS1.3 and vice versa. <br/> If the client is attempting a PSK establishment, then it should advertise at least one cipher suite indicating a Hash associated with the PSK. <p> In TLS1.3, Static RSA and Diffie-Helman cipher suites have been removed. Cipher suites were whittled down significantly in TLS 1.3 to the point where there are now just five recommended cipher suites:',
 		adjust: 'TLS_AES_128_GCM_SHA256;TLS_AES_256_GCM_SHA384;TLS_CHACHA20_POLY1305_SHA256;TLS_AES_128_CCM_SHA256;TLS_AES_128_CCM_8_SHA256'
 		},
 		{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_compression_methods', eltValue: ';', deleted:'no',
 			info: 'Versions of TLS before 1.3 supported compression with the list of supported compression methods being sent in this field. </br> In TLS 1.3, this vector MUST contain exactly one byte set to zero, which corresponds to the "null" compression method in prior versions of TLS.</br>'
 			+'If it is not the case, and the server receives a non 0 value, then the server must abort the handshake with an "illegal_parameter" alert.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'Certificate Authorities', eltValue: ';', deleted:'yes',
 		info: 'In  this  extension  the  client  may  indicate the certificate authorities (CAs) that he supports.  The data of thisfield is a list of distinguished names of CAs.'
 		}
 	];

 	$scope.chExtensions = [
 		{eltName: 'supported_versions', delete: 'yes', adjustment:'no', deleted:'no',
 			info: 'Indicates which versions of TLS the client supports. It is a list of of supported versions ordered in preference with the most preferred first. <br/>For TLS1.3, 0x0304 (the number of TLS1.3) should be at the top of the list. </br></br> This extension should only be available when the peer supports TLS1.3.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'supported_groups', eltValue: '= ECDHE', deleted:'no',
 		info: 'This extension indicates which named groups the client supports for key exchange. This extension must be given with a <i>key_share</i> extension that will contain the (EC)DHE shares for some or all of the groups.',
 		adjustM: '',
 		adjust1: 'secp256r1(0x0017);secp384r1(0x0018);secp521r1(0x0019);x25519(0x001D);x448(0x001E)',
 		adjust2: 'ffdhe2048(0x0100);ffdhe3072(0x0101);ffdhe4096(0x0102);ffdhe6144(0x0103);ffdhe8192(0x0104)'
 		},
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'key_share', eltValue: '= ECDHE keys', deleted:'no',
 		info: 'This field contains the endpoints cryptographic parameters. It is a list of offered key share values in descending order of client preference. This allows the encryption of messages after the clientHello and serverHello. <p> In previous versions the messages were sent unencrypted </p>',
 		adjustM: '<p>The client can send this field empty to request group selection from the server. This will yield to a helloRetryRequest, therefore, an additional round-trip.</p> <p> Or, the client can send one or more public keys with an algorithm that he thinks the server supports. Each key share value must correspond to a group offered in the supported_groups and must appear in its same order.',
 		adjust: 'empty;keys'
 		},
 		// {eltType: '', delete: 'yes', adjustment:'no', eltName: 'Server_name', eltValue: ';', 
 		// info: 'This extension is used to guide certificate selection. Clients should send this extension when applicable. It helps to give the server the name of the server he is contacting, especially in cases where the server host multiple ‘virtual’ servers at a single underlying network address.'
 		// },
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'Client_certificate_type', eltValue: ';', deleted:'no',
 		info: '<p> This extension indicates the certificate types the client is able to provide to the server in case requested (using certificate_request message). </p> <p> This extension can be omitted if the client doesn’t possess the corresponding raw public key or certificate that it can provide when a certificate_request is requested. It can also be omitted in case it is not configured to use one with the given TLS server. </p> <p> The default type is X.509. In case the client has no other certificate types remaining to send other than X.509 then this extension must be omitted. </p>',
 		adjustM: 'X.509 being the default. In case the client has no other certificate types remaining to send other than X.509, then this extension must be omitted. ',
 		adjust: 'RawPublicKey;X.509;Additional certificate types'
 		},
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'Server_certificate_type', eltValue: ';', deleted:'no',
 		info: '<p> This extension indicates the certificate types the client is able to process when given by the server.</p><p> This extension can be omitted if the client doesn’t possess the corresponding raw public key or certificate that it can process.</p><p> The default type is X.509. In case the client has no other certificate types remaining to send other than X.509 then this extension must be omitted.</p>',
 		adjustM: 'X.509 being the default. In case the client has no other certificate types remaining to send other than X.509, then this extension must be omitted. ',
 		adjust: 'RawPublicKey;X.509;Additional certificate types'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'early_data', eltValue: ';', deleted:'yes',
 		info: '<p> if psk is used then the “pre_shared_key” extension is required and must be the last extension in the clientHello. </p>'
 		// adjustM: 'X.509 being the default. In case the client has no other certificate types remaining to send other than X.509, then this extension must be omitted. ',
 		// adjust: 'RawPublicKey;X.509;Additional certificate types'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'post_handshake_auth', eltValue: ';', deleted:'yes',
 		info: 'When this extension is sent by the client, then it indicates that he is willing to perform post-handshake authentication. When this extension is missing, servers should not send a post-handshake CertificateRequest. This extension value should be of zero length.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'signature_algorithms', eltValue: ';', deleted:'no',
 		info: '<p>Indicating  what  algorithms  can  be  used  in  digital  signatures  appearing  in the server certificates message</p> <p>When signature_algorithms_cert extension is not given, then signature_algorithms also applies to signatures in certificateVerify.</p>',
 		adjust: 'RSASSA-PKCS1-v15;ECDSA;RSASSA-PSS  RSAE;EdDSA;RSASSA-PSS',
 		},
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'signature_algorithms_cert', eltValue: ';', deleted:'no',
 		info: '<p>Indicating  what  algorithms  can  be  used  in  digital  signatures  appearing  in the server certificateVerify message</p> ',
 		adjust: 'RSASSA-PKCS1-v15;ECDSA;RSASSA-PSS  RSAE;EdDSA;RSASSA-PSS',
 		},
		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'psk_key_exchange_modes', eltValue: '= psk_dhe_ke;', deleted:'yes',
 		info: '<p> When PSK is selected, the client must include in its clientHello this extension that indicates the key exchange modes that can be used with PSKs </p>',
 		adjustM: '<ul><li>psk_ke (psk-only key establishment): the server must not supply the key_share extension.</li><li> psk_dhe_ke (psk with EC_DHE): key_share extension must also be supplied</li></ul>',
 		adjust: 'psk_ke;psk_dhe_ke'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'pre_shared_keys', eltValue: ';', deleted:'yes',
 		info: '<p> if psk is used then the “pre_shared_key” extension is required and must be the last extension in the clientHello. </p>'
 		}
 	];

 	$scope.serverHello = [
 		{eltType: 'ProtocolVersion',  eltName: 'legacy_version', eltValue: '= 0x0303;', delete: 'no', adjustment: 'no' , deleted:'no',
 			info: 'When this field is equal to 0x0303, it means the server wants to negotiate a version TLS1.3. In this case, <i>supported_version</i> extension must be available representing the highest version number supported by the server.', 
 			// adjustM: '"Either = 0x0303 (indicating TLS1.2) or <0x0303 indictating prior versions of TLS1.2',
 			// adjust: '= 0x0303;< 0x303'
 		},
 		{eltType: 'Random', delete: 'no', adjustment:'no', eltName: 'random', eltValue: ';', deleted:'no',
 			info: '32 bytes generated by a secure random number generator. The last 8 bytes MUST be overwritten if negotiating TLS 1.2 or TLS 1.1, but the remaining bytes MUST be random. This structure is generated by the server and MUST be generated independently of the <i>ClientHello.random</i>. </br></br> This random number is used to prevent downgrade attacks.',
 			// adjustM: 'This is to adjust the last 8 bytes of the server\'s random number. </br> If negotiating TLS1.2, then TLS1.3 server’s random number must set their last 8 bytes of their random number to: <br/> 44 4F 57 4E 47 52 44 01 </br>. If negotiating TLS1.1 or below, then TLS1.3 and TLS1.2 servers must set their last 8 bytes of their random number field to: </br> 44 4F 57 4E 47 52 44 00 </br>' ,
 			// adjust: '44 4F 57 4E 47 52 44 01;44 4F 57 4E 47 52 44 00;random'
 		},
 		{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_session_id', eltValue: ';', deleted:'no',
 			info: 'This field is echoed even if the client’s value corresponded to a cached pre-TLS 1.3 session which the server has chosen not to resume. Therefore its value is always the contents of the client’s legacy_session_id field. </br></br> In case it is not echoed the handshake is aborted with an illegal parameter!',
 		},
 		{eltType: 'CipherSuite', delete: 'no', adjustment:'yes', eltName: 'cipher_suites', eltValue: ';', deleted:'no',
 		info: 'This is an info',
 		adjustM: 'Cipher suites in TLS1.3 use the same cipher suite space as pre-TLS1.3. But, they are defined differently. Therefore, cipher suites for TLS1.2 and lower cannot be used with TLS1.3 and vice versa. <br/> If the client is attempting a PSK establishment, then it should advertise at least one cipher suite indicating a Hash associated with the PSK. <p> In TLS1.3, Static RSA and Diffie-Helman cipher suites have been removed. Cipher suites were whittled down significantly in TLS 1.3 to the point where there are now just five recommended cipher suites:',
 		adjust: 'TLS_AES_128_GCM_SHA256;TLS_AES_256_GCM_SHA384;TLS_CHACHA20_POLY1305_SHA256;TLS_AES_128_CCM_SHA256;TLS_AES_128_CCM_8_SHA256' 		
 		},
		{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_compression_methods', eltValue: ';', deleted:'no',
		info: 'Note that TLS 1.3 servers might receive TLS 1.2 or prior ClientHellos which contain other compression methods and (if negotiating such a prior version) must follow the procedures for the appropriate prior version of TLS. </br></br> This field\'s value in the serverHello must be a single byte which must have the value 0.'
		}
 	];

 	$scope.shExtensions = [
 		{eltName: 'supported_versions', delete: 'yes', adjustment:'no', deleted:'no',
 			info: 'Indicates which versions of TLS the server uses. It is a list of of supported versions ordered in preference with the most preferred first. <br/><br/>This extension should only be available when the peer supports TLS1.3.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'pre_shared_keys', eltValue: ';', deleted:'yes',
 		info: '<p> if psk is used then the “pre_shared_key” extension is required.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'key_share', eltValue: '= ECDHE', deleted:'no',
 		info: '<p>This field contains a single public key that is in the same group as one of the group selected in the <i>ClientHello.supported_groups</i>.</p> <p> When using ECDHE then the server offer one key in the serverHello. IF psk_ke is used, no key share must be sent.</p>',
 		adjust1: 'secp256r1(0x0017);secp384r1(0x0018);secp521r1(0x0019);x25519(0x001D);x448(0x001E)',
 		adjust2: 'ffdhe2048(0x0100);ffdhe3072(0x0101);ffdhe4096(0x0102);ffdhe6144(0x0103);ffdhe8192(0x0104)'
 		}
 	];

 	$scope.helloRetryRequest = [
	 	{eltType: 'ProtocolVersion',  eltName: 'legacy_version', eltValue: '= 0x0303;', delete: 'no', adjustment: 'no' , deleted:'no',
 			info: 'When this field is equal to 0x0303, it means the server wants to negotiate a version TLS1.3. In this case, <i>supported_version</i> extension must be available representing the highest version number supported by the server.', 
 			// adjustM: '"Either = 0x0303 (indicating TLS1.2) or <0x0303 indictating prior versions of TLS1.2',
 			// adjust: '= 0x0303;< 0x303'
 		},
 		{eltType: 'Random', delete: 'no', adjustment:'no', eltName: 'random', eltValue: ';', deleted:'no',
 			info: '32 bytes generated by a secure random number generator. To identify the helloRetryRequest message from a serverHello message, the random number of the helloRetryRequest is always equal to: <p>CF 21 AD 74 E5 9A 61 11 BE 1D 8C 02 1E 65 B8 91<br/>C2 A2 11 16 7A BB 8C 5E 07 9E 09 E2 C8 A8 33 9C</p>',
 			// adjustM: 'This is to adjust the last 8 bytes of the server\'s random number. </br> If negotiating TLS1.2, then TLS1.3 server’s random number must set their last 8 bytes of their random number to: <br/> 44 4F 57 4E 47 52 44 01 </br>. If negotiating TLS1.1 or below, then TLS1.3 and TLS1.2 servers must set their last 8 bytes of their random number field to: </br> 44 4F 57 4E 47 52 44 00 </br>' ,
 			// adjust: '44 4F 57 4E 47 52 44 01;44 4F 57 4E 47 52 44 00;random'
 		},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_session_id', eltValue: '<0..32>;', deleted:'no',
 			info: 'This field is echoed even if the client’s value corresponded to a cached pre-TLS 1.3 session which the server has chosen not to resume. Therefore its value is always the contents of the client’s legacy_session_id field. </br></br> In case it is not echoed the handshake is aborted with an illegal parameter!',
 		},
 		{eltType: 'CipherSuite', delete: 'yes', adjustment:'yes', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;', deleted:'no',
 		info: 'This is an info',
 		adjustM: 'Cipher suites in TLS1.3 use the same cipher suite space as pre-TLS1.3. But, they are defined differently. Therefore, cipher suites for TLS1.2 and lower cannot be used with TLS1.3 and vice versa. <br/> If the client is attempting a PSK establishment, then it should advertise at least one cipher suite indicating a Hash associated with the PSK. <p> In TLS1.3, Static RSA and Diffie-Helman cipher suites have been removed. Cipher suites were whittled down significantly in TLS 1.3 to the point where there are now just five recommended cipher suites:',
 		adjust: 'TLS_AES_128_GCM_SHA256;TLS_AES_256_GCM_SHA384;TLS_CHACHA20_POLY1305_SHA256;TLS_AES_128_CCM_SHA256;TLS_AES_128_CCM_8_SHA256' 		
 		},
		{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_compression_methods', eltValue: ';', deleted:'no',
		info: 'Note that TLS 1.3 servers might receive TLS 1.2 or prior ClientHellos which contain other compression methods and (if negotiating such a prior version) must follow the procedures for the appropriate prior version of TLS. </br></br> This field\'s value in the serverHello must be a single byte which must have the value 0.'
 		}
 	];

 	$scope.hrrExtensions = [
 		{eltName: 'supported_versions', delete: 'yes', adjustment:'yes', deleted:'no',
 			info: 'Indicates which versions of TLS the server uses. It is a list of of supported versions ordered in preference with the most preferred first. <br/><br/>This extension should only be available when the peer supports TLS1.3.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'key_share', eltValue: '= ECDHE share', deleted:'no',
 		info: '<p> This field indicates the mutually supported group the server intends to negotiate and is requesting a retried ClientHello key_share for. </p><br/> <p> Upon receiving this field the client checks if it this field correspong to a group provided in the clientHello.supported_groups. Additionally, it also checks that this field is not the same as the group in the clientHello.key_share. In case any of these checks are false then the handshake is aborted with an "illegal_parameter" alert --> MAN IN THE MIDDLE!??</p> <p> If these checks works, then the clientHello.key_share should be replaced by this field.</p>',
 		},
		// {eltType: '', delete: 'yes', adjustment:'no', eltName: 'cookie', eltValue: ';', deleted:'yes',
		// info: ''
 	// 	}
  	];

 	$scope.rrClientHello = [
 		{eltType: 'ProtocolVersion', eltName: 'legacy_version', eltValue: '= 0x0303;', delete: 'no', adjustment:'no', deleted:'no',
 			info: 'In version prior to TLS1.3, this field was used for version negotiation.</br> In TLS1.3 this field should be equal to <b> 0x0303 </b>, which indicates TLS1.2 and the version preferences are indicated by the client in a later extension parameter (<i>supported_versions)</i> which is mandatory in TLS1.3 having 0x0304 as its highest version. </br> ',
 			// adjustM: '"Either = 0x0303 (indicating TLS1.2) or <0x0303 indictating prior versions of TLS1.2<br/> For a client to be recognized as TLS1.3 Client, its legacy_version should be equal to 0x0303.',
 			// adjust: '= 0x0303;< 0x303'
 		}, 
 		{eltType: 'Random', delete: 'no', eltName: 'random', eltValue: ';', adjustment:'no', deleted:'no',
 			info: '32 bytes generated by a secure random number generator. </br></br> This random number is used to prevent downgrade attacks.'
 		},
 		{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_session_id', eltValue: ';', deleted:'no',
 			info: 'In version prior to TLS1.3, the client could provide an ID negotiated in a previous session by using the “session resumption" feature. This allows to skip time and cost of negotiating new keys.In TLS1.3 it was merged with pre_shared_keys (PSK) that is more flexible. Thus, this field is not needed for this purpose anymore in TLS1.3, instead it is used as a non-empty field to trigger middlebox compatibility box. Middelbox compatibility box helps TLS1.3 to be disguised as a resumed TLS1.2.',
 			adjustM: "<p> <u>If Client TLS1.3 and Server TLS1.2 or below:</u></br>In compatibility mode: this field must be non-empty so a client not offering a pre-TLS1.3 session must generate a new 32-byte value. This value need not be random but should be unpredictable to avoid implementations fixating on a specific value (also known as ossification). Otherwise, it MUST be set as a zero-length vector (i.e., a zero-valued single byte length field). </p> <p><u>If Client TLS1.2 and Server TLS1.3:</u> </br>When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value </p> <p><u>If Client TLS1.2 and Server TLS1.2 or below: </u> </br> When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value. </p> <p> <u> If Client TLS1.1 or below and Server TLS1.3 or TLS1.2: </u> </br> When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value.</p>"
 		},
 		{eltType: 'CipherSuite', delete: 'no', adjustment:'yes', eltName: 'cipher_suites', eltValue: ';', deleted:'no',
 		info: 'This field is a list of symmetric cipher options that are supported by the client in descending order of client preference. Cipher suites are a set of encryption rules dictating how the TLS handshake works.',
 		adjustM: 'Cipher suites in TLS1.3 use the same cipher suite space as pre-TLS1.3. But, they are defined differently. Therefore, cipher suites for TLS1.2 and lower cannot be used with TLS1.3 and vice versa. <br/> If the client is attempting a PSK establishment, then it should advertise at least one cipher suite indicating a Hash associated with the PSK. <p> In TLS1.3, Static RSA and Diffie-Helman cipher suites have been removed. Cipher suites were whittled down significantly in TLS 1.3 to the point where there are now just five recommended cipher suites:',
 		adjust: 'TLS_AES_128_GCM_SHA256;TLS_AES_256_GCM_SHA384;TLS_CHACHA20_POLY1305_SHA256;TLS_AES_128_CCM_SHA256;TLS_AES_128_CCM_8_SHA256'
 		},
 		{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_compression_methods', eltValue: ';', deleted:'no',
 			info: 'Versions of TLS before 1.3 supported compression with the list of supported compression methods being sent in this field. </br> In TLS 1.3, this vector MUST contain exactly one byte set to zero, which corresponds to the "null" compression method in prior versions of TLS.</br> If it is not the case, and the server receives a non 0 value, then the server must abort the handshake with an "illegal_parameter" alert.'
 		}
 		,
		// {eltType: '', delete: 'yes', adjustment:'no', eltName: 'cookie', eltValue: ';', deleted:'yes',
		// info: ''
 	// 	}
 	];

    $scope.encryptedExtension = [
	 	// {eltType: '', delete: 'yes', adjustment:'no', eltName: 'Server_name', eltValue: ';', 
 		// info: 'The <i> server_name" </i> extension is used to guide certificate selection. ',
 		// },
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'supported_groups', eltValue: ';', deleted:'yes',
 		info: 'The server may send a supported group extension. <p>As in the clientHello, it is a list from most to least preferred group supported by the peer.</p> ',
 		adjustM: '',
 		adjust1: 'secp256r1(0x0017);secp384r1(0x0018);secp521r1(0x0019);x25519(0x001D);x448(0x001E)',
 		adjust2: 'ffdhe2048(0x0100);ffdhe3072(0x0101);ffdhe4096(0x0102);ffdhe6144(0x0103);ffdhe8192(0x0104)'
 		},
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'Client_certificate_type', eltValue: ';', deleted:'no',
 		info: '<p> This extension should exist when the server requests a certificate form the client (in the certificate_request message). </p><p> This extension then indicates the type of certificates the client is requested to provide.</p>',
 		adjustM: '<p> The value in this extension must be selected from one of the values that are provided in the client_certificate_type extension in the client hello.</p> <p> If no client_certificate_type exists in the clientHello then the default X.508 should be chosen</p>',
 		adjust: 'RawPublicKey; X.509;Additional certificate types'
 		},
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'Server_certificate_type', eltValue: ';', deleted:'no',
 		info: '<p> This extension indicates the certificate types the server is going to provide.</p><p> This extension can be omitted if the server isn’t providing any other certificate types other than the default  X.509.</p>',
 		adjustM: '<p> The value in this extension must be selected from one of the values that are provided in the client_certificate_type extension in the client hello.</p> <p> If no client_certificate_type exists in the clientHello then the default X.508 should be chosen</p>',
 		adjust: 'RawPublicKey; X.509;Additional certificate types'
 		}
 	];

 	$scope.certificateRequest = [
	 	{eltType: '', delete: 'no', adjustment:'no', eltName: 'certificate_request_context', eltValue: ';', deleted:'yes',
 		info: ' Identifier for the certificate re-quest and will be echoed in the client’sCertificatemessage later on. It must be unique within the scope of this connection, preventing replay of the client CertificateVerify messages.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'Certificate Authorities', eltValue: ';', deleted:'yes',
 		info: 'In  this  extension  the  server  may  indicate the certificate authorities (CAs) that he supports.  The data of thisfield is a list of distinguished names of CAs.'
 		},{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'signature_algorithms', eltValue: ';', deleted:'no',
 		info: '<p>Indicating  what  algorithms  can  be  used  in  digital  signatures  appearing  in the client certificates message</p> <p>When signature_algorithms_cert extension is not given, then signature_algorithms also applies to signatures in certificateVerify.</p>',
 		adjust: 'RSASSA-PKCS1-v15;ECDSA;RSASSA-PSS  RSAE;EdDSA;RSASSA-PSS',
 		},
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'signature_algorithms_cert', eltValue: ';', deleted:'no',
 		info: '<p>Indicating  what  algorithms  can  be  used  in  digital  signatures  appearing  in the client certificateVerify message</p> ',
 		adjust: 'RSASSA-PKCS1-v15;ECDSA;RSASSA-PSS  RSAE;EdDSA;RSASSA-PSS',
 		}
 	];


}]);

myTLSApp.controller('MissingTerms', function ($scope) {
  $scope.oneAtATime = true;
});