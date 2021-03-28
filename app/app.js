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
		.when('/replay', {
			templateUrl: 'views/replay.html',
			controller: 'Replay'
		})
		.when('/downgrade', {
			templateUrl: 'views/downgrade.html',
			controller: 'Downgrade'
		})
		.otherwise({
			redirectTo: '/home'
		});

}]);

myTLSApp.controller('TLSController', ['$scope', '$http', function($scope, $http){
	$scope.error = true;
	$scope.step = 0.15;
	$scope.early_dataClient = false;
	$scope.early_dataServer = false;
	$scope.alertsList = [];

	$scope.incrementStep = function(step,type){
		increment = true;

		for(var alerts in $scope.alertsList){
			if ($scope.alertsList[alerts].stop == step){
				increment = false;
				$scope.keyExMode = 5;
			}
		}
		//initialise 
		if(step==0.15){
			$scope.step = 1.0;
			//keyshare not included in clienthello
			if($scope.clientKeyMode[0]==false){
				//PSK
				if($scope.clientKeyMode[1]==true){
					for (var elt1 in $scope.shExtensions){
						if($scope.shExtensions[elt1].eltName == "pre_shared_keys"){
							if($scope.clientKeyMode[3]==false){
								//Abort Handshake from server
								increment = false;
								$scope.step = 0.15;
							}
							$scope.shExtensions[elt1].deleted = "no";
						}
					}
					$scope.keyExMode = 4;
					$scope.serverKeyMode[1] = true;
				}
				//ERROR, not psk nor keyshare.
				else if($scope.clientKeyMode[1]==false){
					//Abort Handshake from server
					increment = false;
					$scope.keyExMode = 5;
					$scope.step = 0.15;
					$scope.serverKeyMode[1] = false;
				}
			
				for (var elt1 in $scope.shExtensions){
					if($scope.shExtensions[elt1].eltName == "key_share" && increment ){
						$scope.shExtensions[elt1].deleted = "yes";
					}
				} 
				$scope.serverKeyMode[0] = false;
			}
			else if($scope.clientKeyMode[0]==true && increment){
				$scope.keyExMode = 0;
				$scope.serverKeyMode[0] = true;
			}
		}
		if(increment){
			if(type == 'normal')
				$scope.step = step + 1.0;
			else if(type == 'serverHello')
				$scope.step = 4.0;
			else if(type == 'clientHello')
				$scope.step = 3.0;
			else if (type == 'cert'){
				if($scope.sigalgoClient == true){
					$scope.step = step + 1.0;
				}
				else{
					$scope.step = step + 3.0;
				}
			}
			else if (type == 'certS'){
				if($scope.sigalgoServer == true){
					$scope.step = step + 1.0;
				}
				else{
					$scope.step = step + 3.0;
				}
			}
			else
				$scope.step = step + 0.5;
		}		
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
		
		for (var elt1 in step){
    		if(step[elt1].deleted == "yes"){
    			$scope.listAdd.push(step[elt1].eltName);
			}
		}
	};
	$scope.addAdjust1 = function(step, type){
		for(var i in $scope.addList){
			$scope.addList[i] = false;
		}

		for (var elt1 in type){
			if(type[elt1].eltName == $scope.data.add){
				type[elt1].deleted = "no";	
				$scope.storeidField = type[elt1];
				$scope.updateNextSteps(step,type[elt1].eltName, '');
			}
		} 
	}

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
	$scope.data = {adjust: 'test', add:'test'};
	$scope.sigalgoClient = true;
	$scope.sigalgoServer = true;
	$scope.storeidStep;
	$scope.storidField;
	$scope.adjusted;

	// 0- ECDHE , 1- DHE, 2- PSK ECDHE, 3- PSK DHE, 4- PSK Only, 5- depends on peer reply
	$scope.keyExMode = 5;

	
  	//0- keyshare, 1- supp_groups, 2- pre_shared, 3- psk_ex_mode
  	$scope.clientKeyMode = [true,false,true,false];
  	$scope.clientKeyShare = "= ECDHE";
  	$scope.clientPSK = "= psk_dhe_ke";
  	// 0 - ECDHE, 1- DHE, 2- ECDHE + DHE
	$scope.supp_groups = 0;


  	//0- keyshare, 1- psk;
  	$scope.serverKeyMode = [true,false];
  	$scope.serverKeyShare = "= ECDHE";
	
	$scope.explainAlert;
	

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
				$scope.updateNextSteps('clientHello',$scope.storeidField.eltName,'deleted');
			break;
			case 'chExtensions':
				for (var elt1 in $scope.chExtensions){
    				if($scope.storeidField.eltName == $scope.chExtensions[elt1].eltName){
						$scope.chExtensions[elt1].deleted = 'yes';
					}
				}
				$scope.updateNextSteps('clientHello',$scope.storeidField.eltName,'deleted');
			break;
			case 'serverHello':
				for (var elt1 in $scope.serverHello){
    				if($scope.storeidField.eltName == $scope.serverHello[elt1].eltName){
						$scope.serverHello[elt1].deleted = 'yes';
					}
				}
				$scope.updateNextSteps('serverHello',$scope.storeidField.eltName,'deleted');
			break;
			case 'hrrExtensions':
				for (var elt1 in $scope.hrrExtensions){
    				if($scope.storeidField.eltName == $scope.hrrExtensions[elt1].eltName){
						$scope.hrrExtensions[elt1].deleted = 'yes';
					}
				}
				$scope.updateNextSteps('helloRetryRequest',$scope.storeidField.eltName,'deleted');
			break;
			case 'shExtensions':
				for (var elt1 in $scope.shExtensions){
    				if($scope.storeidField.eltName == $scope.shExtensions[elt1].eltName){
						$scope.shExtensions[elt1].deleted = 'yes';
					}
				}
				$scope.updateNextSteps('serverHello',$scope.storeidField.eltName,'deleted');
			break;
			
			case 'encryptedExtension':
				for (var elt1 in $scope.encryptedExtension){
    				if($scope.storeidField.eltName == $scope.encryptedExtension[elt1].eltName){
						$scope.encryptedExtension[elt1].deleted = 'yes';
					}
				}
				$scope.updateNextSteps('encryptedExtension',$scope.storeidField.eltName,'deleted');
			break;

			case 'certificateRequest':
				for (var elt1 in $scope.certificateRequest){
    				if($scope.storeidField.eltName == $scope.certificateRequest[elt1].eltName){
						$scope.certificateRequest[elt1].deleted = 'yes';
					}
				}
				$scope.updateNextSteps('certificateRequest',$scope.storeidField.eltName,'deleted');
			break;
			default:
		}
	};

	$scope.addAlert = function(title,description, step){
		$scope.alreadyAvailable = false;
		for(var alerts in $scope.alertsList){
			if($scope.alertsList[alerts].title == title){
				$scope.alreadyAvailable = true;
			}
		}
		if($scope.alreadyAvailable == false){
			$scope.alertsList.push({
			    title:   title,
				description: description,
				stop: step
			});
		}
		$scope.keyExMode = 5;
		$scope.step = step;
	}
	
	$scope.removeAlert = function(title){
		bool = false;
		for(var alerts in $scope.alertsList){
			if($scope.alertsList[alerts].title == title){
				bool =true;
			}
		}
		if(bool == true){
			for(var alerts in $scope.alertsList){
				$scope.alertsList.splice($scope.alertsList[alerts].title.indexOf(title),1);										
			}
		}
	}

	//This function is called when we adjust something in +
	$scope.nowAdjust = function(){		
		switch ($scope.storeidStep) {
            case 'clientHello':
           	    for (var elt1 in $scope.clientHello){
	        		if($scope.storeidField.eltName == $scope.clientHello[elt1].eltName){
	        			switch ($scope.storeidField.eltName){
							case 'cipher_suites':
								$scope.bool = false;
								for (var i in $scope.cipherSuitesClient){
									if ($scope.cipherSuitesClient[i] == true){
										$scope.bool = true;
										$scope.removeAlert("Cipher Suites Empty");
									}
								}
								if ($scope.bool == false){
									$scope.addAlert("Cipher Suites Empty",  "Please select at least one cipher suite", 1.0);
								}
								//removed the cipher suite selection from client
								if($scope.step >= 3.0){
									if($scope.cipherSuitesClient[$scope.cipherSuitesServer] ==  false){
										$scope.addAlert("Cipher Suites", $scope.cipherSuitesServer + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! ", 3.0);
									}
								}			
								//adding the cipher suite selection from client
								if($scope.cipherSuitesClient[$scope.cipherSuitesServer] ==  true){
									$scope.removeAlert("Cipher Suites");
								}
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
								if($scope.clientCert[$scope.certServer.client] ==  false){
									if($scope.step >= 3.0 ){
										$scope.addAlert("Client Certificate", $scope.certServer.client + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! ",3.0);
									}
								}			
								else if($scope.clientCert[$scope.certServer.client] ==  true ){
									$scope.removeAlert("Client Certificate");
								}

								if($scope.clientCert['RawPublicKey'] == false && $scope.clientCert['Additional certificate types'] == false){
									$scope.explainAlert = "In case the client has no other certificate types remaining to send other than X.509 then this extension must be omitted.";
									$scope.showInfo('chExtensions', $scope.storeidField, 'delete');
									$scope.removeAlert("Client Certificate");
								}
							break;

							case 'Server_certificate_type':
								if($scope.step >=3.0){
									if($scope.serverCert[$scope.certServer.server] ==  false){
										$scope.addAlert("Server Certificate", $scope.certServer.server + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! ",3.0);
									}			
								}
								else if($scope.serverCert[$scope.certServer.server] ==  true ){
									$scope.removeAlert("Server Certificate");		
								}

								if($scope.serverCert['RawPublicKey'] == false && $scope.serverCert['Additional certificate types'] == false){
									$scope.explainAlert = "In case the client has no other certificate types remaining to send other than X.509 then this extension must be omitted.";
									$scope.showInfo('chExtensions', $scope.storeidField, 'delete');
									$scope.removeAlert("Server Certificate");
								}
							break;

							case 'psk_key_exchange_modes':
								if($scope.data.adjust == 'psk_ke'){
									$scope.chExtensions[elt1].eltValue="= psk_ke";
									$scope.clientPSK = 1;
								}
								else if ($scope.data.adjust == 'psk_dhe_ke'){
									$scope.keyExchange[0]='serverHello';
									$scope.chExtensions[elt1].eltValue="= psk_dhe_ke";
									$scope.clientPSK = 0;
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
										if(elt3 == $scope.key_shareValue){
											$scope.removeAlert("Key Shares");
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
										DHEBoolClient = true;
										if(elt3 == $scope.key_shareValue){
											$scope.removeAlert("Key Shares");
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
									if($scope.step>=3.0){
										$scope.addAlert("Key Shares", $scope.data.adjust + " is selected in the server and wasn't offered by the client!! ABORT HANDSHAKE!",3.0);
									}
									if($scope.keyExMode == 1 || $scope.keyExMode == 0){
										$scope.keyExMode = 5;
									}else if($scope.keyExMode == 2 || $scope.keyExMode == 3){
										$scope.keyExMode = 4;

									}
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

							case 'signature_algorithms':
								$scope.bool =  false;
								for(var elt in $scope.signatureClient){
									if($scope.signatureClient[elt] == true){
										$scope.bool = true;
									}
								}
								if($scope.bool == false){
									$scope.showInfo('chExtensions', $scope.storeidField, 'delete');
								}
								else{
									$scope.bool = false;
								}
							break;

							case 'signature_algorithms_cert':
								$scope.bool =  false;
								for(var elt in $scope.signature_certClient){
									if($scope.signature_certClient[elt] == true){
										$scope.bool = true;
									}
								}
								if($scope.bool == false){
									$scope.showInfo('chExtensions', $scope.storeidField, 'delete');
								}
								else{
									$scope.bool = false;
								}
							break;
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
							case 'cipher_suites':
								$scope.cipherSuitesServer = $scope.data.adjust;

								if($scope.step>=3.0){
									if($scope.cipherSuitesClient[$scope.cipherSuitesServer] ==  false){
										$scope.addAlert("Cipher Suites", $scope.cipherSuitesServer + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! ",3.0);
									}			
								}

								if($scope.cipherSuitesClient[$scope.cipherSuitesServer] ==  true){
									$scope.removeAlert("Cipher Suites");
								}
								
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
								if($scope.step >= 3.0){
									if($scope.ECDHEClient[$scope.data.adjust] ==  false || $scope.DHEClient[$scope.data.adjust] == false){
										$scope.addAlert( "Key Shares", $scope.data.adjust + " is selected in the server and wasn't offered by the client!! ABORT HANDSHAKE!",3.0);
									}	
								}		

								if($scope.ECDHEClient[$scope.data.adjust] ==  true || $scope.DHEClient[$scope.data.adjust] == true){
									$scope.removeAlert("Key Shares");
								}
								
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

    //         case 'helloRetryRequest':
				// for (var elt1 in $scope.serverHello){
    //         		if($scope.storeidField.eltName == $scope.serverHello[elt1].eltName){
    //         			switch ($scope.storeidField.eltName){
		  //           		case 'cipher_suites':
		  //           			if($scope.cipherSuitesClient[$scope.cipherSuitesHelloRetryRequest] ==  false){
		  //           				//cpher suite selected by the server must be one from the list chosen by the client
				// 					alert($scope.cipherSuitesServer + " is selected in the server and wasn't offered by the client!! ABORT HANDSHAKE!");
				// 				}	

				// 				//TODO		
				// 				if($scope.cipherSuitesServer != $scope.cipherSuitesHelloRetryRequest){
				// 					//the serverHello and HelloRetryRequest 's cipher suite must be the same.
				// 					alert("Cipher suites of helloRetryRequest and serverHello should be the same!! ABORT HANDSHAKE WITH ILLEGAL PARAMETER ALERT");
				// 				}
				// 			break;		            
				// 		}
				// 	}
				// }         
	   //      break;      

         //    case 'rrClientHello':
	        
	        // break;
            
            case 'encryptedExtension':
            	for (var elt1 in $scope.encryptedExtension){
            		if($scope.storeidField.eltName == $scope.encryptedExtension[elt1].eltName){
            			switch ($scope.storeidField.eltName){
			            	case 'Client_certificate_type':								
				            	if($scope.step>=4){
									if($scope.clientCert[$scope.certServer.client] ==  false){
										$scope.addAlert("Client Certificate", $scope.certServer.client + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! ",4.0);
									}			
								}
								if($scope.clientCert[$scope.certServer.client] ==  true){
									$scope.removeAlert("Client Certificate");
									$scope.encryptedExtensionError["Client_certificate_type"] = false;
								}
							break;	

							case 'Server_certificate_type':
								if(step>=4){
									if($scope.serverCert[$scope.certServer.server] ==  false){
										$scope.addAlert("Server Certificate", $scope.certServer.server + " is selected in the server and wasn't offered by the client    !!  ABORT HANDSHAKE !! ",4.0);
									}			
									$scope.encryptedExtensionError["Server_certificate_type"] = true;
								}			

								if($scope.serverCert[$scope.certServer.server] ==  true){
									$scope.removeAlert("Server Certificate");
									$scope.encryptedExtensionError["Server_certificate_type"] = false;
								}
							break;
						}
					}
				}
            break;

            case 'certificateRequest':
            for (var elt1 in $scope.certificateRequest){
            		if($scope.storeidField.eltName == $scope.certificateRequest[elt1].eltName){
            			switch ($scope.storeidField.eltName){
            				case 'signature_algorithms':
								$scope.bool =  false;
								for(var elt in $scope.signatureServer){
									if($scope.signatureServer[elt] == true){
										$scope.bool = true;
									}
								}
								if($scope.bool == false){
									$scope.showInfo('certificateRequest', $scope.storeidField, 'delete');
								}
								else{
									$scope.bool = false;
								}
							break;

							case 'signature_algorithms_cert':
								$scope.bool =  false;
								for(var elt in $scope.signature_certServer){
									if($scope.signature_certServer[elt] == true){
										$scope.bool = true;
									}
								}
								if($scope.bool == false){
									$scope.showInfo('certificateRequest', $scope.storeidField, 'delete');
								}
								else{
									$scope.bool = false;
								}
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
			case 'clientHello':
				if(type == 'deleted'){
					for (var elt1 in $scope.chExtensions){
		        			if($scope.storeidField.eltName == $scope.chExtensions[elt1].eltName){
								$scope.chExtensions[elt1].deleted="yes";
						}
					}
				}
				switch(fieldUpdated){
					case 'supported_versions':
						$scope.explainAlert = "TLS 1.3 CientHello messages always contain 'supported_versions', otherwise, they will be interpreted as TLS 1.2 ClientHello messages";
												
						$scope.leftBoxTitle = 'supported_versions NOT deleted' ;	
						for (var elt2 in $scope.chExtensions){
	        				if($scope.storeidField.eltName == $scope.chExtensions[elt2].eltName){
								$scope.chExtensions[elt2].deleted="no";
							}
						}
						break;

					case 'supported_groups':
						if (type == 'deleted'){
							$scope.clientKeyMode[2]=false;
							//check if key share available or error change mode.
							if($scope.clientKeyMode[0] == true){
								$scope.addAlert("Missing supported_groups extension", "Key Share and supported_group should always be available together. Either add supported_groups or, remove key_share and add pre_shared_keys    !! missing extension !!",1.0);
								if($scope.keyExMode == 2 || $scope.keyExMode == 3 || $scope.keyExMode == 4 ){
									$scope.keyExMode = 4; 
								}
								else {
									$scope.keyExMode = 5;
								}
								$scope.removeAlert("Add signature_algorithms extension");	
								
								if($scope.sigalgoClient){
									$scope.addAlert("Remove signature_algorithms extension", "Server authentication is not needed with PSK key exchange mode.",1.0);
								}
							}
							//if key share does not exist
							else if($scope.clientKeyMode[0] == false){
								$scope.removeAlert("Add signature_algorithms extension");
								$scope.removeAlert("Missing key_share extension");
								for (var elt3 in $scope.chExtensions){
									if($scope.chExtensions[elt3].eltName == 'pre_shared_keys'){
										if($scope.chExtensions[elt1].deleted=="yes"){
											$scope.addAlert("Missing extensions ClientHello", "Either add key_share extensions for (EC)DHE or pre_shared_keys for PSK mode   !! missing extension !!",1.0);
										}
									}
								}
							}
						}
						else{
							$scope.clientKeyMode[2]=true;
							if($scope.clientKeyMode[1] && $scope.clientKeyMode[3]){
								if($scope.sigalgoClient){
									$scope.addAlert("Remove signature_algorithms extension", "Server authentication is not needed with PSK key exchange mode.",1.0);
								}
							}
							else{
								$scope.removeAlert("Remove signature_algorithms extension");
							}
							//if key share and supported_group exist
							if($scope.clientKeyMode[0] == true){
								$scope.removeAlert("Missing supported_groups extension");	
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
								//check if signature algo exists because mandatory in case of (EC)DHE 
								if(!$scope.sigalgoClient){
									$scope.addAlert("Add signature_algorithms extension", "When (EC)DHE key exchange mode is used, the client must request authentication from the server by including the signature_algorithms extension.",1.0);
								}
							}
							//if key share does not exist
							else if($scope.clientKeyMode[0] == false){
								$scope.addAlert("Missing key_share extension", "Key Share and supported_group should always be available together. Either add supported_groups or, remove key_share and add pre_shared_keys    !! missing extension !!",1.0);
							}
						}
					break;			

					case 'key_share':
						if(type=='deleted'){
							$scope.removeAlert("Missing supported_groups extension");
							$scope.clientKeyMode[0] = false;
							if($scope.clientKeyMode[3]==true){
								//psk_dhe_ke
								if($scope.clientPSK == 0){
									$scope.addAlert("Missing key_share extension", "When PSK_dhe_ke is selected in psk_key_exchange_modes, then key_share should be included in the extensions",1.0);
								}
								//psk_ke
								else if($scope.clientPSK ==1){
									$scope.removeAlert("Missing key_share extension");
									$scope.removeAlert("Remove key_share extension");
								}
							}
							
							if($scope.step >= 3.0){
								if($scope.serverKeyMode[0]==true){
									$scope.addAlert("Remove key_share in serverHello", "Key_share cannot be afford by the server if it is not offered by the client", 3.0);
								}
							}
							

							if($scope.clientKeyMode[2]==true){
								$scope.addAlert("Missing key_share extension", "Key Share and supported_group should always be available together. Either remove supported_groups and add pre_shared_keys or, add key_share     !! missing extension !!",1.0);
							}			
							else if($scope.clientKeyMode[2]==false){
								$scope.removeAlert("Missing key_share extension");
								$scope.removeAlert("Add signature_algorithms extension");

								if($scope.clientKeyMode[1]==false){
									$scope.addAlert("Missing extensions ClientHello", "Either add key_share extensions for (EC)DHE or pre_shared_keys for PSK mode   !! missing extension !!",1.0);
								}
							}
							
							if($scope.clientKeyMode[1]==true){
								$scope.removeAlert("Missing extensions ClientHello");
							}

						}
						else{
							$scope.clientKeyMode[0] = true;
							$scope.removeAlert("Remove key_share in serverHello");
							$scope.removeAlert("Missing key_share extension");
							if($scope.clientKeyMode[3]==true){
								//psk_ke
								if($scope.clientPSK ==1){
									$scope.addAlert("Remove key_share extension", "When PSK_ke is selected in psk_key_exchange_modes, then key_share should not be included in the extensions",1.0);
								}
							}
						
							if($scope.clientKeyMode[2]==false){
								$scope.addAlert("Missing supported_groups extension", "Key Share and supported_group should always be available together. Either add supported_groups or, remove key_share and add pre_shared_keys    !! missing extension !!",1.0);
							}			
							else if($scope.clientKeyMode[2]==true){
								$scope.removeAlert("Missing supported_groups extension");
							}
						}
										
					break;

					case 'psk_key_exchange_modes':
						if (type== 'deleted'){
							$scope.removeAlert("Remove psk_key_exchange_modes extension");
							$scope.clientKeyMode[3]=false;
							//pre_shared in extensions
							if($scope.clientKeyMode[1]==true){
								$scope.addAlert("Add psk_key_exchange_modes extension", "When pre_shared_keys is in the extension, psk_key_exchange_modes should be there too",1.0);
							}//pre_shared missing
							else if($scope.clientKeyMode[1]==false){
								$scope.removeAlert("Add psk_key_exchange_modes extension");
								if($scope.early_dataClient == true){
									$scope.addAlert("Remove early_data extension", "Early data can only used with PSK",1.0);
								}
							}
						}
						
						else if(type=='adjusted'){
							//psk exists
							if($scope.storeidField.eltValue == '= psk_ke'){
								$scope.clientPSK = 1;
								if($scope.clientKeyMode[0]==true){
									$scope.addAlert("Remove key_share extension", "psk_ke chosen in psk_key_exchange_modes: key_share should not be in the extensions",1.0);
								}
								else if($scope.clientKeyMode[0]==false){
									$scope.removeAlert("Remove key_share extension");
								}
							}
							else if($scope.storeidField.eltValue == '= psk_dhe_ke'){
								$scope.clientPSK = 0;
								if($scope.clientKeyMode[0]==true){
									$scope.removeAlert("Add key_share extension");
								}
								else if($scope.clientKeyMode[0]==false){
									$scope.addAlert("Add key_share extension", "PSK_dhe_ke chosen in psk_key_exchange_modes: key_share should be in the extensions",1.0);
								}
							}
							
							//pre_share key in extension 
							if($scope.clientKeyMode[1]==true){
								$scope.removeAlert("Add pre_shared_keys extension");
							}//pre_share key not in extension 
							else if($scope.clientKeyMode[1]==false){
								$scope.addAlert("Add pre_shared_keys extension", "When psk_key_exchange_modes is in the extensions, pre_shared_keys should be there too",1.0);
							}
						}
						else{
							$scope.clientKeyMode[3]=true;
							$scope.removeAlert("Add psk_key_exchange_modes extension");
							$scope.removeAlert("Remove early_data extension");
							//pre_share key not in extension 
							if($scope.clientKeyMode[1]==false){
								$scope.addAlert("Add pre_shared_keys extension", "when psk_key_exchange_modes is in the extensions, pre_shared_keys should be there too", 1.0);
							}
							else{
								if($scope.sigalgoClient){
									$scope.addAlert("Remove signature_algorithms extension", "Server authentication is not needed with PSK key exchange mode.", 1.0);
								}
							}
						}
						
						

					break;

					case 'pre_shared_keys':
						if (type == 'deleted'){
							$scope.removeAlert("Add psk_key_exchange_modes extension");
							$scope.clientKeyMode[1]=false;
							
							//psk_key_exchange_mode
							if($scope.clientKeyMode[3]){
								$scope.addAlert("Remove psk_key_exchange_modes extension", "psk_key_exchange_modes should be removed when pre_shared_keys is removed", 1.0);
							}
							if($scope.early_dataClient){
								$scope.addAlert("Remove early_data extension", "Early data can only used with PSK", 1.0);
							}

							//key_share
							if($scope.clientKeyMode[0]){
								$scope.removeAlert("Missing extensions ClientHello");
								$scope.keyExMode = 0;
								if(!$scope.sigalgoClient){
									$scope.addAlert("Add signature_algorithms extension", "When (EC)DHE key exchange mode is used, the client must request authentication from the server by including the signature_algorithms extension.",1.0);
								}
							}
							else if($scope.clientKeyMode[0]==false){
								$scope.addAlert("Missing extensions ClientHello", "Either add key_share extensions for (EC)DHE or pre_shared_keys for PSK mode   !! missing extension !!",1.0);
							}
						}
						else{
							$scope.clientKeyMode[1]=true;
							$scope.removeAlert("Missing extensions ClientHello");
							$scope.removeAlert("Add pre_shared_keys extension");
							$scope.removeAlert("Remove pre_shared extension ServerHello");
							$scope.removeAlert("Remove early_data extension");

							if($scope.clientKeyMode[3]==false){
								$scope.addAlert("Add psk_key_exchange_modes extension", "When pre_shared_keys is in the extension, psk_key_exchange_modes should be there too", 1.0);
							}
							else if($scope.clientKeyMode[3]){
								$scope.removeAlert("Add psk_key_exchange_modes extension");
								if($scope.sigalgoClient){
									$scope.addAlert("Remove signature_algorithms extension", "Server authentication is not needed with PSK key exchange mode.", 1.0);
								}
							}
						}

					break;

					case 'early_data':
						if (type == 'deleted'){
							$scope.early_dataClient = false;
							if($scope.early_dataServer){
								$scope.addAlert("Remove early_data extension in encryptedExtension", "Early data is offered by the server but not the client");
							}
							$scope.removeAlert("Remove early_data extension");
						}
						else{
							$scope.early_dataClient = true;
							if($scope.clientKeyMode[1]==false){
								$scope.addAlert("Remove early_data extension", "Early data can only used with PSK",1.0);
							}
							else if($scope.clientKeyMode[1]==true){
								$scope.removeAlert("Remove early_data extension");
								$scope.removeAlert("Remove early_data extension in encryptedExtension");
								$scope.explainAlert = "Due to early data (0-RTT), the data is not forward secret.";
							}
						}
					break;
					case 'signature_algorithms_cert':
						if (type == 'deleted'){
							$scope.removeAlert("Remove signature_algorithms_cert extension");
							if( $scope.clientKeyMode[0] && $scope.clientKeyMode[1]==false && $scope.clientKeyMode[3]==false){
								if($scope.sigalgoClient){
									$scope.removeAlert("Add signature_algorithms extension");
										$scope.explainAlert = "When <i>signature_algorithms_cert</i> is not given, then <i>signature_algorithms</i> also applies to signatures in the certificateVerify message.";
								}
								else if(!$scope.sigalgoClient){
									$scope.addAlert("Add signature_algorithms extension", "When (EC)DHE key exchange mode is used, the client must request authentication from the server by including the signature_algorithms extension.",1.0);
								}
							}
						}
					break;
					case 'signature_algorithms':
						if (type == 'deleted'){
							$scope.sigalgoClient = false;
							$scope.removeAlert("Remove signature_algorithms extension");
							//(EC)DHE no PSK
							if($scope.clientKeyMode[1]==false && $scope.clientKeyMode[3]==false && $scope.clientKeyMode[0]){
								$scope.addAlert("Add signature_algorithms extension", "When (EC)DHE key exchange mode is used, the client must request authentication from the server by including the signature_algorithms extension.",1.0);
							}
							//PSK
							else if($scope.clientKeyMode[1] && $scope.clientKeyMode[3]){ 
								for (var elt2 in $scope.chExtensions){
		        					if($scope.chExtensions[elt2].eltName == "signature_algorithms_cert"){
										if($scope.chExtensions[elt2].deleted=="no"){
											$scope.addAlert("Remove signature_algorithms_cert extension", "Server authentication is not needed with PSK key exchange mode.",1.0);
										}
									}
								}
							}
						}
						else{
							$scope.sigalgoClient = true;
							$scope.removeAlert("Add signature_algorithms extension");
							if($scope.keyExMode == 2 || $scope.keyExMode == 3 ||$scope.keyExMode == 4){
								$scope.addAlert("Remove signature_algorithms extension", "Server authentication is not needed with PSK key exchange mode.",1.0);
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
					case 'key_share':
						if(type == 'deleted'){
							$scope.serverKeyMode[0]=false;
							$scope.removeAlert("Remove key_share in serverHello");
							if($scope.serverKeyMode[1]==false){
								$scope.addAlert("Missing extensions ServerHello", "Either add key_share extensions for (EC)DHE or pre_shared_keys for PSK mode   !! missing extension !!", 3.0);
							}
							else {
								$scope.keyExMode = 4;
								$scope.removeAlert("Missing extensions ServerHello");	
							}
						}
						else{
							$scope.serverKeyMode[0]=true;
							$scope.serverKeyShare = $scope.storeidField.eltValue;
							$scope.removeAlert("Missing extensions ServerHello");	
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
							if($scope.early_dataServer){
								$scope.addAlert("Remove early_data extension in encryptedExtension", "Early data can only used with PSK", 4.0);
							}
							$scope.serverKeyMode[1]=false;						
							if($scope.serverKeyMode[0]==false){
								$scope.addAlert("Missing extensions ServerHello", "Either add key_share extensions for (EC)DHE or pre_shared_keys for PSK mode   !! missing extension !!", 3.0);
							}
							else{
								if($scope.serverKeyShare == '= ECDHE'){
									$scope.keyExMode = 0;
								}
								else if($scope.serverKeyShare == '= DHE'){
									$scope.keyExMode = 1;
								}
							}
						} else{
							$scope.serverKeyMode[1]=true;
							$scope.removeAlert("Missing extensions ServerHello");
							$scope.removeAlert("Remove early_data extension in encryptedExtension");
						
							bool = false;
							if($scope.clientKeyMode[1]==false || $scope.clientKeyMode[3]==false){
								$scope.keyExMode = 5;
								$scope.addAlert("Remove pre_shared extension ServerHello", "PSK is not offered by the client in the ClientHello !!", 3.0);
							}			
							else if($scope.clientKeyMode[1]==true && $scope.clientKeyMode[3]==true){
								$scope.removeAlert("Remove pre_shared extension ServerHello");
								if($scope.serverKeyMode[0]==false){
									$scope.keyExMode = 4;
									if($scope.sigalgoClient){
										$scope.addAlert("Remove signature_algorithms extension", "Server authentication is not needed with PSK key exchange mode.", 3.0);
									}
									$scope.explainAlert = "<p>1. When using PSK mode, no need for server authentication.</p><br/> <p>2. When using PSK without (EC)DHE, forward secrecy of the application data is lost. There are no guarantees of replay attacks.";
								}else if($scope.serverKeyMode[0]==true){
									if($scope.serverKeyShare == '= ECDHE'){
										$scope.keyExMode = 2;
									}
									else if($scope.serverKeyShare == '= DHE'){
										$scope.keyExMode = 3;
									}
									$scope.explainAlert = "When using PSK mode, no need for server authentication.";
								}
							}
						}
					break;
					default:
				}
			break;
			// case 'helloRetryRequest':
			// 	if(type == 'deleted'){
			// 		for (var elt1 in $scope.hrrExtensions){
		 //        			if($scope.storeidField.eltName == $scope.hrrExtensions[elt1].eltName){
			// 					$scope.hrrExtensions[elt1].deleted="yes";
			// 			}
			// 		}
			// 	}
			// 	switch(fieldUpdated){	
			// 		default:
			// 	}
			// break;
			// case 'rrClientHello':
			// 	if(type == 'deleted'){
			// 		for (var elt1 in $scope.rrClientHello){
		 //        			if($scope.storeidField.eltName == $scope.rrClientHello[elt1].eltName){
			// 					$scope.rrClientHello[elt1].deleted="yes";
			// 			}
			// 		}
			// 	}
			// 	switch(fieldUpdated){	
			// 		default:
			// 	}
			// break
			case 'encryptedExtension':
				if(type == 'deleted'){
					for (var elt1 in $scope.encryptedExtension){
		        			if($scope.storeidField.eltName == $scope.encryptedExtension[elt1].eltName){
								$scope.encryptedExtension[elt1].deleted="yes";
						}
					}
				}
				case 'early_data':
					if (type == 'deleted'){
						$scope.early_dataServer = false;
						$scope.removeAlert("Remove early_data extension in encryptedExtension");
					}
					else{
						$scope.early_dataServer = true;
						if($scope.serverKeyMode[1]==false){
							$scope.addAlert("Remove early_data extension in encryptedExtension", "Early data can only used with PSK",4.0);
						}
						else if($scope.serverKeyMode[1]==true){
							if($scope.early_dataClient){
								$scope.removeAlert("Remove early_data extension in encryptedExtension");	
							}
							else{
								$scope.addAlert("Remove early_data extension in encryptedExtension", "Early data is not offered by the client",4.0);		
							}
							$scope.explainAlert = "Due to early data (0-RTT), the data is not forward secret.";
						}
					}
				break;
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
 			info: 'In version prior to TLS1.3, this field was used for version negotiation.</br> In TLS1.3 this field can only be equal to <b> 0x0303 </b>, which indicates TLS1.2 and the version preferences must be indicated by the client in a later extension parameter (<i>supported_versions)</i> which is mandatory in TLS1.3 having 0x0304 as its highest version. </br> '
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
 			info: '<p>  </p>'
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
 		},
 		{eltType: 'Random', delete: 'no', adjustment:'no', eltName: 'random', eltValue: ';', deleted:'no',
 			info: '32 bytes generated by a secure random number generator. The last 8 bytes MUST be overwritten if negotiating TLS 1.2 or TLS 1.1, but the remaining bytes MUST be random. This structure is generated by the server and MUST be generated independently of the <i>ClientHello.random</i>. </br></br> This random number is used to prevent downgrade attacks.',
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

 	// $scope.helloRetryRequest = [
	 // 	{eltType: 'ProtocolVersion',  eltName: 'legacy_version', eltValue: '= 0x0303;', delete: 'no', adjustment: 'no' , deleted:'no',
 	// 		info: 'When this field is equal to 0x0303, it means the server wants to negotiate a version TLS1.3. In this case, <i>supported_version</i> extension must be available representing the highest version number supported by the server.'
 	// 	},
 	// 	{eltType: 'Random', delete: 'no', adjustment:'no', eltName: 'random', eltValue: ';', deleted:'no',
 	// 		info: '32 bytes generated by a secure random number generator. To identify the helloRetryRequest message from a serverHello message, the random number of the helloRetryRequest is always equal to: <p>CF 21 AD 74 E5 9A 61 11 BE 1D 8C 02 1E 65 B8 91<br/>C2 A2 11 16 7A BB 8C 5E 07 9E 09 E2 C8 A8 33 9C</p>'
 	// 	},
 	// 	{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_session_id', eltValue: '<0..32>;', deleted:'no',
 	// 		info: 'This field is echoed even if the client’s value corresponded to a cached pre-TLS 1.3 session which the server has chosen not to resume. Therefore its value is always the contents of the client’s legacy_session_id field. </br></br> In case it is not echoed the handshake is aborted with an illegal parameter!',
 	// 	},
 	// 	{eltType: 'CipherSuite', delete: 'yes', adjustment:'yes', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;', deleted:'no',
	 // 		info: 'This is an info',
	 // 		adjustM: 'Cipher suites in TLS1.3 use the same cipher suite space as pre-TLS1.3. But, they are defined differently. Therefore, cipher suites for TLS1.2 and lower cannot be used with TLS1.3 and vice versa. <br/> If the client is attempting a PSK establishment, then it should advertise at least one cipher suite indicating a Hash associated with the PSK. <p> In TLS1.3, Static RSA and Diffie-Helman cipher suites have been removed. Cipher suites were whittled down significantly in TLS 1.3 to the point where there are now just five recommended cipher suites:',
	 // 		adjust: 'TLS_AES_128_GCM_SHA256;TLS_AES_256_GCM_SHA384;TLS_CHACHA20_POLY1305_SHA256;TLS_AES_128_CCM_SHA256;TLS_AES_128_CCM_8_SHA256' 		
 	// 	},
		// {eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_compression_methods', eltValue: ';', deleted:'no',
		// 	info: 'Note that TLS 1.3 servers might receive TLS 1.2 or prior ClientHellos which contain other compression methods and (if negotiating such a prior version) must follow the procedures for the appropriate prior version of TLS. </br></br> This field\'s value in the serverHello must be a single byte which must have the value 0.'
 	// 	}
 	// ];

 	// $scope.hrrExtensions = [
 	// 	{eltName: 'supported_versions', delete: 'yes', adjustment:'yes', deleted:'no',
 	// 		info: 'Indicates which versions of TLS the server uses. It is a list of of supported versions ordered in preference with the most preferred first. <br/><br/>This extension should only be available when the peer supports TLS1.3.'
 	// 	},
 	// 	{eltType: '', delete: 'yes', adjustment:'no', eltName: 'key_share', eltValue: '= ECDHE share', deleted:'no',
 	// 		info: '<p> This field indicates the mutually supported group the server intends to negotiate and is requesting a retried ClientHello key_share for. </p><br/> <p> Upon receiving this field the client checks if it this field correspong to a group provided in the clientHello.supported_groups. Additionally, it also checks that this field is not the same as the group in the clientHello.key_share. In case any of these checks are false then the handshake is aborted with an "illegal_parameter" alert --> MAN IN THE MIDDLE!??</p> <p> If these checks works, then the clientHello.key_share should be replaced by this field.</p>',
 	// 	}
  // 	];

 	// $scope.rrClientHello = [
 	// 	{eltType: 'ProtocolVersion', eltName: 'legacy_version', eltValue: '= 0x0303;', delete: 'no', adjustment:'no', deleted:'no',
 	// 		info: 'In version prior to TLS1.3, this field was used for version negotiation.</br> In TLS1.3 this field should be equal to <b> 0x0303 </b>, which indicates TLS1.2 and the version preferences are indicated by the client in a later extension parameter (<i>supported_versions)</i> which is mandatory in TLS1.3 having 0x0304 as its highest version. </br> '
 	// 	}, 
 	// 	{eltType: 'Random', delete: 'no', eltName: 'random', eltValue: ';', adjustment:'no', deleted:'no',
 	// 		info: '32 bytes generated by a secure random number generator. </br></br> This random number is used to prevent downgrade attacks.'
 	// 	},
 	// 	{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_session_id', eltValue: ';', deleted:'no',
 	// 		info: 'In version prior to TLS1.3, the client could provide an ID negotiated in a previous session by using the “session resumption" feature. This allows to skip time and cost of negotiating new keys.In TLS1.3 it was merged with pre_shared_keys (PSK) that is more flexible. Thus, this field is not needed for this purpose anymore in TLS1.3, instead it is used as a non-empty field to trigger middlebox compatibility box. Middelbox compatibility box helps TLS1.3 to be disguised as a resumed TLS1.2.',
 	// 		adjustM: "<p> <u>If Client TLS1.3 and Server TLS1.2 or below:</u></br>In compatibility mode: this field must be non-empty so a client not offering a pre-TLS1.3 session must generate a new 32-byte value. This value need not be random but should be unpredictable to avoid implementations fixating on a specific value (also known as ossification). Otherwise, it MUST be set as a zero-length vector (i.e., a zero-valued single byte length field). </p> <p><u>If Client TLS1.2 and Server TLS1.3:</u> </br>When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value </p> <p><u>If Client TLS1.2 and Server TLS1.2 or below: </u> </br> When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value. </p> <p> <u> If Client TLS1.1 or below and Server TLS1.3 or TLS1.2: </u> </br> When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value.</p>"
 	// 	},
 	// 	{eltType: 'CipherSuite', delete: 'no', adjustment:'yes', eltName: 'cipher_suites', eltValue: ';', deleted:'no',
	 // 		info: 'This field is a list of symmetric cipher options that are supported by the client in descending order of client preference. Cipher suites are a set of encryption rules dictating how the TLS handshake works.',
	 // 		adjustM: 'Cipher suites in TLS1.3 use the same cipher suite space as pre-TLS1.3. But, they are defined differently. Therefore, cipher suites for TLS1.2 and lower cannot be used with TLS1.3 and vice versa. <br/> If the client is attempting a PSK establishment, then it should advertise at least one cipher suite indicating a Hash associated with the PSK. <p> In TLS1.3, Static RSA and Diffie-Helman cipher suites have been removed. Cipher suites were whittled down significantly in TLS 1.3 to the point where there are now just five recommended cipher suites:',
	 // 		adjust: 'TLS_AES_128_GCM_SHA256;TLS_AES_256_GCM_SHA384;TLS_CHACHA20_POLY1305_SHA256;TLS_AES_128_CCM_SHA256;TLS_AES_128_CCM_8_SHA256'
 	// 	},
 	// 	{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_compression_methods', eltValue: ';', deleted:'no',
 	// 		info: 'Versions of TLS before 1.3 supported compression with the list of supported compression methods being sent in this field. </br> In TLS 1.3, this vector MUST contain exactly one byte set to zero, which corresponds to the "null" compression method in prior versions of TLS.</br> If it is not the case, and the server receives a non 0 value, then the server must abort the handshake with an "illegal_parameter" alert.'
 	// 	}
 	// ];

    $scope.encryptedExtension = [
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
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'early_data', eltValue: ';', deleted:'yes',
 			info: '<p>  </p>'
 		},
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

//ANIMATIONS
myTLSApp.controller('Replay', ['$scope', '$http', function($scope, $http){
	var id = null;
	$scope.animate = true;
	$scope.replayAnimate= function() {
		$scope.animate = false;
  		var client1 = document.getElementById("step1");   
  		var client2 = document.getElementById("step2");
  		var server1 = document.getElementById("step3");
  		var server2 = document.getElementById("step4"); 
  		var attacker1 = document.getElementById("attacker1");   
  		var attacker2 = document.getElementById("attacker2");   
  		var server3 = document.getElementById("step7");   
  		var server4 = document.getElementById("step8");   
  		var client3 = document.getElementById("step9"); 
  		var client4 = document.getElementById("step10"); 

  		var message1 = document.getElementById("message1");   
  		var message2 = document.getElementById("message2"); 
  		var message3 = document.getElementById("message3"); 

  		// transparent to hide
		$scope.showHideElem = function(elem, color){
 		  	elem.style.borderColor  = color;
 		  	if(color=='transparent')
  				elem.style.color  = color;
  			else   	
  				elem.style.color  = 'black';
		}

  		attacker_stop1.style.color = 'transparent';
  		attacker_stop2.style.color = 'transparent';
  		$scope.showHideElem(client2,'transparent');
  		$scope.showHideElem(server1,'transparent');  	
  		$scope.showHideElem(server2,'transparent');
  		$scope.showHideElem(server3,'transparent');
  		$scope.showHideElem(server4,'transparent');
  		$scope.showHideElem(client3,'transparent');
  		$scope.showHideElem(client4,'transparent');
  		
  		
  		$scope.showHideElem(attacker1,'transparent');
  		$scope.showHideElem(attacker2,'transparent');
  		
  		message1.style.color = "transparent";
  		message2.style.color = "transparent";
  		message3.style.color = "transparent";

  		function percentwidth(elem){
 		   var pa= elem.offsetParent || elem;
    		return ((elem.offsetWidth/pa.offsetWidth)*100).toFixed(1);

		}

  		clearInterval(id);
  		id = setInterval(step1, 40);
  		var pos = 0;
  		var width = 0;

  		function step1() {
  			width = parseInt(percentwidth(client1));
    		if (pos == (98-width)) {
      			clearInterval(id);
  				pos = 0;
  				$scope.showHideElem(client2,'#2E86C1');	
  				id = setInterval(step2, 40);
    		} else {
      			pos++; 
      			client1.style.left = pos + '%'; 
    		}
  		}
  		function step2(){
  			width = parseInt(percentwidth(client2));
  			if (pos == (98-width)) {
      			clearInterval(id);
      			pos = 0;
  				$scope.showHideElem(server1,'#16A085');		
				message1.style.color = "black";
      			id = setInterval(step3, 40);
    		} else {
      			pos++; 
      			client2.style.left = pos + '%'; 
    		}
  		}
  		function step3(){
  			var width = parseInt(percentwidth(server1));
  			if (pos == (100 - width)){
      			clearInterval(id);
      			pos = 0;
  				$scope.showHideElem(server2,'#16A085');		  	
  				attacker_stop1.style.color  = 'red';
      			id = setInterval(step4, 40);
    		} else {
      			pos++; 
      			server1.style.right = pos + '%'; 
    		}
  		}
  		function step4(){
  			width = parseInt(percentwidth(server2));
    		if (pos == (98-width)) {
      			clearInterval(id);
      			pos = 50;
  				$scope.showHideElem(attacker1,'red');	
  				attacker_stop2.style.color  = 'red';
      			id = setInterval(step5, 40);
    		} else {
      			pos++; 
      			server2.style.right = pos + '%'; 
    		}
  		}
  		function step5(){
  			width = parseInt(percentwidth(attacker1));
    		if (pos == (98-width)) {
      			clearInterval(id);
      			pos = 50;
  				$scope.showHideElem(attacker2,'red');	
      			id = setInterval(step6, 40);
    		} else {
      			pos++; 
      			attacker1.style.left = pos + '%'; 
    		}
  		}
  		function step6(){
  			width = parseInt(percentwidth(attacker2));
    		if (pos == (98-width)) {
      			clearInterval(id);
      			pos = 0;
  				$scope.showHideElem(server3,'#16A085');	
				message2.style.color = "black";
      			id = setInterval(step7, 40);
    		} else {
      			pos++; 
      			attacker2.style.left = pos + '%'; 
    		}
  		}
  		function step7(){
  			width = parseInt(percentwidth(server3));
    		if (pos == (98-width)) {
      			clearInterval(id);
      			pos = 0;
  				$scope.showHideElem(server4,'#16A085');
      			id = setInterval(step8, 40);
    		} else {
      			pos++; 
      			server3.style.right = pos + '%'; 
    		}
  		}
  		function step8(){
  			width = parseInt(percentwidth(server4));
    		if (pos == (98-width)) {
      			clearInterval(id);
      			pos = 0;
  				$scope.showHideElem(client3,'#2E86C1');
      			id = setInterval(step9, 40);
    		} else {
      			pos++; 
      			server4.style.right = pos + '%'; 
    		}
  		}
  		function step9(){
  			width = parseInt(percentwidth(client3));
    		if (pos == (98-width)) {
      			clearInterval(id);
      			pos = 0;
  				$scope.showHideElem(client4,'#2E86C1');
      			id = setInterval(step10, 40);
    		} else {
      			pos++; 
      			client3.style.left = pos + '%'; 
    		}
  		}
  		function step10(){
  			width = parseInt(percentwidth(client4));
    		if (pos == (98-width)) {
      			clearInterval(id);
      			pos = 0;
				message3.style.color = "black";
    		} else {
      			pos++; 
      			client4.style.left = pos + '%'; 
    		}
  		}
	}
}]);

myTLSApp.controller('Downgrade', ['$scope', '$http', function($scope, $http){
	var id = null;
	$scope.animate = true;
	$scope.downgradeAnimate= function() {
		$scope.animate = false;
  		var clientHello1 = document.getElementById("clientHello1");   
  		var clientHello_stop1 = document.getElementById("clientHello_stop1");
  		var attacker1 = document.getElementById("attacker1");
  		var clientHello2 = document.getElementById("clientHello2"); 
  		var serverHello1 = document.getElementById("serverHello1");   
  		var clientHello3 = document.getElementById("clientHello3");   
  		var message1 = document.getElementById("message1");   
  		var message2 = document.getElementById("message2"); 
  		
  		$scope.showHideElem = function(elem, color){
 		  	elem.style.borderColor  = color;
 		  	if(color=='transparent')
  				elem.style.color  = color;
  			else   	
  				elem.style.color  = 'black';
		}
  		
		$scope.showHideElem(attacker1,'transparent');
		$scope.showHideElem(clientHello2,'transparent');
		$scope.showHideElem(serverHello1,'transparent');
		$scope.showHideElem(clientHello3,'transparent');

  		clientHello_stop1.style.color = 'transparent';
  		message1.style.color = "transparent";
  		message2.style.color = "transparent";

  		function percentwidth(elem){
 		  	var pa= elem.offsetParent || elem;
    		return ((elem.offsetWidth/pa.offsetWidth)*100).toFixed(1);
		}
  		
  		clearInterval(id);
  		id = setInterval(step1, 40);
  		var pos = 0;
  		function step1() {
  			width = parseInt(percentwidth(clientHello1));
    		if (pos == (98-width)) {
      			clearInterval(id);
  				clientHello_stop1.style.color = 'red';
  				pos = 50;
  				$scope.showHideElem(attacker1,'red');
  				id = setInterval(step2, 40);
    		} else {
      			pos++; 
      			clientHello1.style.left = pos + '%'; 
    		}
  		}
  		function step2(){
    		width = parseInt(percentwidth(attacker1));
    		if (pos == (98-width)) {
      			clearInterval(id);
      			pos = 0;
      			$scope.showHideElem(clientHello2,'#2E86C1');
				message1.style.color = "black";
      			id = setInterval(step3, 40);
    		} else {
      			pos++; 
      			attacker1.style.right = pos + '%'; 
    		}
  		}
  		function step3(){
  			width = parseInt(percentwidth(clientHello2));
    		if (pos == (98-width)) {
      			clearInterval(id);
      			pos = 0;
      			$scope.showHideElem(serverHello1,'#16A085');
      			id = setInterval(step4, 40);
    		} else {
      			pos++; 
      			clientHello2.style.left = pos + '%'; 
    		}
  		}
  		function step4(){
  			width = parseInt(percentwidth(serverHello1));
    		if (pos == (98-width)) {
  			// if (pos == 70) {
      			clearInterval(id);
      			pos = 0;
      			$scope.showHideElem(clientHello3,'#2E86C1');
				message2.style.color = "black";
      			id = setInterval(alert1, 40);
    		} else {
      			pos++; 
      			serverHello1.style.right = pos + '%'; 
    		}
  		}
  		function alert1(){
  			width = parseInt(percentwidth(clientHello3));
    		if (pos == (98-width)) {
      			clearInterval(id);
    		} else {
      			pos++; 
      			clientHello3.style.left = pos + '%'; 
    		}
  		}
	}
}]);
