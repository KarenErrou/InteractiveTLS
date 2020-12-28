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


myTLSApp.controller('TLSController', ['$scope', '$http', function($scope, $http){

	$scope.step = 2;
	$scope.client = true;
	$scope.showInfoBox = false;
	$scope.retryRequest = false;
	$scope.adjusting = false;
	$scope.data = {adjust: 'test'};
	$scope.cipherSuitesClient = {
		"TLS_AES_128_GCM_SHA256": true,
		"TLS_AES_256_GCM_SHA384": false,
		"TLS_CHACHA20_POLY1305_SHA256": false, 
		"TLS_AES_128_CCM_SHA256": false,
		"TLS_AES_128_CCM_8_SHA256": false
	};
	$scope.cipherSuitesServer= "TLS_AES_128_GCM_SHA256";
	$scope.cipherSuitesHelloRetryRequest= "TLS_AES_128_GCM_SHA256";

	$scope.storeidStep;
	$scope.storidField;
	$scope.adjusted;

	// Key Exchange 
	$scope.tlsVersion = [1.3, 1.3];
	$scope.random;
	$scope.supportedgroupsKeyshare = [true,true,true,true];
	$scope.pre_shared_keys = true;
	// Extensions
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
			$scope.leftBoxTitle = 'Adjust ' + idField.eltName;	
			$scope.adjusting= true;
			if(idField.adjustM){$scope.adjustMessage = idField.adjustM;}
			if(idField.adjust){
				var str = idField.adjust;
				$scope.splitted = str.split(";");
			}
			else{
					$scope.splitted = '';
			}

			if(idField.eltName == 'cipher_suites' && idStep == 'clientHello'){
				$scope.checkbox = true;
			}
			else{
				$scope.checkbox = false;
			}			

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
				$scope.clientHello = $scope.clientHello.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('clientHello',$scope.storeidField.eltName,'deleted');
			break;
			case 'chExtensions':
				$scope.chExtensions = $scope.chExtensions.filter(item => item.eltName !== $scope.storeidField.eltName);
				$scope.updateNextSteps('clientHello',$scope.storeidField.eltName,'deleted');
			break;

			case 'serverHello':
				$scope.serverHello = $scope.serverHello.filter(item => item.eltName !== $scope.storeidField.eltName);
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
		            			$scope.adjustVersion('clientHello', elt1, elt);
								$scope.updateNextSteps('clientHello','legacy_version', 'adjusted');
		            		break;
							case 'cipher_suites':
								if($scope.cipherSuitesClient[$scope.cipherSuitesServer] ==  false){
										alert($scope.cipherSuitesServer + " is selected in the server and wasn't offered by the client!! ABORT HANDSHAKE!");
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
									$scope.chExtensions[elt1].eltValue="= empty"
								}
								else{
									$scope.keyExchange[0]='serverHello';
									//TODO: Check ther stuff for HELLORETRYREQUEST
									$scope.chExtensions[elt1].eltValue="= ECDHE shares for some or all the groups";
								}
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
							case 'legacy_version':
								$scope.adjustVersion('serverHello', elt1, elt);
								$scope.updateNextSteps('clientHello','legacy_version', 'adjusted');
		            		break;

            				case 'random':
            					$scope.storeElt;
            					for (var elt in $scope.splitted){
				            		if($scope.data.adjust == $scope.splitted[elt]){
				            			if( $scope.splitted[elt] == 'random'){
					            			$scope.serverHello[elt1].eltValue = ';';
				            			}
				            			else{
			            					$scope.serverHello[elt1].eltValue = $scope.splitted[elt] + ';';
				            			}
				            			$scope.storeElt = $scope.splitted[elt];
									}
								}
							$scope.updateNextSteps('serverHello','random', 'adjusted');
		            		break;

		            		case 'cipher_suites':
		            			if($scope.cipherSuitesClient[$scope.cipherSuitesServer] ==  false){
		            				//cpher suite selected by the server must be one from the list chosen by the client
										alert($scope.cipherSuitesServer + " is selected in the server and wasn't offered by the client!! ABORT HANDSHAKE!");
								}			
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

            case 'helloRetryRequest':
				for (var elt1 in $scope.serverHello){
            		if($scope.storeidField.eltName == $scope.serverHello[elt1].eltName){
            			switch ($scope.storeidField.eltName){
		            		case 'cipher_suites':
		            			if($scope.cipherSuitesClient[$scope.cipherSuitesHelloRetryRequest] ==  false){
		            				//cpher suite selected by the server must be one from the list chosen by the client
										alert($scope.cipherSuitesServer + " is selected in the server and wasn't offered by the client!! ABORT HANDSHAKE!");
								}			
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
						$scope.checkRandom();
					break;
					case 'supported_versions':
						if($scope.tlsVersion[0]==1.3){
							alert("TLS 1.3 CientHello messages always contain 'supported_versions', otherwise, they will be interpreted as TLS 1.2 ClientHello messages.");
						}						
						
						if($scope.tlsVersion[0]==1.2){
							alert("Server and Client will negotiate TLS1.2 <br/> NOT AVAILABLE IN THIS APP <br/> <b>TLS1.3 should be negotiated</b>");
						}
						$scope.leftBoxTitle = 'supported_versions NOT deleted' ;	
						$scope.newItem= {eltName: 'supported_versions', delete: 'yes', 
						info: 'Indicates which versions of TLS it supports.'}
						$scope.chExtensions.splice(0, 0, $scope.newItem);
					break;

					case 'supported_groups':
						$scope.supportedgroupsKeyshare[0]=false;
						if($scope.supportedgroupsKeyshare[1]==true){
							alert("ECDHE is not supported since supported groups is not available. Key share shouldn't be available and PSK must be supported.");
							alert("missing extension");
						}
						if($scope.pre_shared_keys[0]==false){
							alert("ECDHE is not supported since supported groups is not available. PSK must be supported.");
							alert("missing extension");
						}
					break;			

					case 'key_share':
						if(type == 'deleted'){
							$scope.supportedgroupsKeyshare[1]=false;
							if($scope.supportedgroupsKeyshare[0]==true){
								alert("key_share should be available when supported groups is available");
								alert("missing extension");
							}
							else{
								if($scope.pre_shared_keys[0]==false){
									alert("ECDHE is not supported since supported groups is not available. PSK must be supported.");
									alert("missing extension");
								}
							}
						}
					default:
				}
				
			break;

			case 'serverHello':
				switch(fieldUpdated){
					case 'legacy_version':
						$scope.checkRandom();
					break;

					case 'random':
						$scope.checkRandom();
					break;

					case 'supported_versions':
						if($scope.tlsVersion[0]==1.3){
							alert("TLS 1.3 ServerHello messages always contain 'supported_versions', otherwise, they will be interpreted as TLS 1.2 ClientHello messages.");
						}						
						
						if($scope.tlsVersion[0]==1.2){
							alert("Server and Client will negotiate TLS1.2 <br/> NOT AVAILABLE IN THIS APP <br/> <b>TLS1.3 should be negotiated</b>");
						}
						$scope.leftBoxTitle = 'supported_versions NOT deleted' ;	
						$scope.newItem= {eltName: 'supported_versions', delete: 'yes', 
						info: 'Indicates which versions of TLS it supports.'}
						$scope.chExtensions.splice(0, 0, $scope.newItem);
					break;			
					default:
				}
			break;

			default:
		}
	};

	$scope.adjustVersion= function(step, elt1, elt){
		if(step == 'clientHello'){
			for (var elt in $scope.splitted){
				// alert($scope.splitted[elt]);
				if($scope.data.adjust == $scope.splitted[elt]){
					$scope.clientHello[elt1].eltValue = $scope.splitted[elt] + ';';
					if($scope.clientHello[elt1].eltValue == '= 0x0303;'){
						$scope.tlsVersion[0] = 1.3;

					}
					else $scope.tlsVersion[0] = 1.2;
				}
			}
		}
		else if (step == 'serverHello'){
			for (var elt in $scope.splitted){
				if($scope.data.adjust == $scope.splitted[elt]){
					$scope.serverHello[elt1].eltValue = $scope.splitted[elt] + ';';
					if($scope.clientHello[elt1].eltValue == '= 0x0303'){
						$scope.tlsVersion[1] = 1.3;

					}
					else $scope.tlsVersion[1] = 1.2;
				}
			}
		}
		if($scope.tlsVersion[0] == 1.2)
			alert("Client with TLS prior than version 1.3! Not offered in this app");
		if($scope.tlsVersion[1] == 1.2)
			alert("Client with TLS prior than version 1.3! Not offered in this app");
	}


	$scope.checkRandom =function(){
		if($scope.tlsVersion[0]==1.3){
			if($scope.storeElt=='44 4F 57 4E 47 52 44 01')						
				alert("This value is left for the case where the client is TLS1.2 and the server is TLS1.3.");							
			if($scope.storeElt=='44 4F 57 4E 47 52 44 00')
				alert("This value is left for the case where the client is TLS1.1 or below and the server is TLS1.3 or TLS1.2.");
		}
		if($scope.tlsVersion[0]==1.2){
			if($scope.tlsVersion[1]==1.3 && $scope.storeElt!='44 4F 57 4E 47 52 44 01'){
				alert("When the Client is TLS1.2 and the server TLS1.3, the last 8 byte should be equal to '44 4F 57 4E 47 52 44 01'. Abort with an “illegal_parameter” alert.");
				alert("Downgrade Attack!!");
			}
			if($scope.tlsVersion[1]==1.2){ //1.2 or below
				if($scope.storeElt=='44 4F 57 4E 47 52 44 01')						
					alert("This value is left for the case where the client is TLS1.2 and the server is TLS1.3.");							
				if($scope.storeElt=='44 4F 57 4E 47 52 44 00')
					alert("This value is left for the case where the client is TLS1.1 or below and the server is TLS1.3 or TLS1.2.");
			}
		}
		if($scope.tlsVersion[0]==1.1){
			if($scope.tlsVersion[1]==1.3 || $scope.tlsVersion[1]==1.2){
				if($scope.storeElt!='44 4F 57 4E 47 52 44 00'){
					alert("When the Client is prior to TLS1.1 and the server TLS1.3 or TLS1.2, the last 8 byte should be equal to '44 4F 57 4E 47 52 44 00'. Abort with an “illegal_parameter” alert.");
					alert("Downgrade Attack!!");
				}
			}
		}
	}
	// $scopes.stepsProtocol = 
	// 		[{id:"ClientHello", value: clientHello}, 
	// 		{id:"ServerHello", value: serverHello}];

	$scope.keyExchange = [
		'serverHello'
	];

 	$scope.clientHello = [
 		{eltType: 'ProtocolVersion', eltName: 'legacy_version', eltValue: '= 0x0303;', delete: 'no', adjustment:'yes',
 			info: 'In version prior to TLS1.3, this field was used for version negotiation.</br> In TLS1.3 this field should be equal to <b> 0x0303 </b>, which indicates TLS1.2 and the version preferences are indicated by the client in a later extension parameter (<i>supported_versions)</i> which is mandatory in TLS1.3 havinf 0x0304 as its highest version. </br> ',
 			adjustM: '"Either = 0x0303 (indicating TLS1.2) or <0x0303 indictating prior versions of TLS1.2<br/> For a client to be recognized as TLS1.3 Client, its legacy_version should be equal to 0x0303.',
 			adjust: '= 0x0303;< 0x303'
 		}, 
 		{eltType: 'Random', delete: 'no', eltName: 'random', eltValue: ';', adjustment:'no',
 			info: '32 bytes generated by a secure random number generator. </br></br> This random number is used to prevent downgrade attacks.'},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_session_id', eltValue: '<0..32>;', 
 			info: 'In version prior to TLS1.3, the client could provide an ID negotiated in a previous session by using the “session resumption" feature. This allows to skip time and cost of negotiating new keys.In TLS1.3 it was merged with pre_shared_keys (PSK) that is more flexible. Thus, this field is not needed for this purpose anymore in TLS1.3, instead it is used as a non-empty field to trigger middlebox compatibility box. Middelbox compatibility box helps TLS1.3 to be disguised as a resumed TLS1.2.',
 			adjustM: "<p> <u>If Client TLS1.3 and Server TLS1.2 or below:</u></br>In compatibility mode: this field must be non-empty so a client not offering a pre-TLS1.3 session must generate a new 32-byte value. This value need not be random but should be unpredictable to avoid implementations fixating on a specific value (also known as ossification). Otherwise, it MUST be set as a zero-length vector (i.e., a zero-valued single byte length field). </p> <p><u>If Client TLS1.2 and Server TLS1.3:</u> </br>When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value </p> <p><u>If Client TLS1.2 and Server TLS1.2 or below: </u> </br> When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value. </p> <p> <u> If Client TLS1.1 or below and Server TLS1.3 or TLS1.2: </u> </br> When a client has a cached session ID that is set by a pre-TLS1.3 server then this field should be set to that value.</p>"
 		},
 		{eltType: 'CipherSuite', delete: 'yes', adjustment:'yes', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;', 
 		info: 'This field is a list of symmetric cipher options that are supported by the client in descending order of client preference. Cipher suites are a set of encryption rules dictating how the TLS handshake works.',
 		adjustM: 'Cipher suites in TLS1.3 use the same cipher suite space as pre-TLS1.3. But, they are defined differently. Therefore, cipher suites for TLS1.2 and lower cannot be used with TLS1.3 and vice versa. <br/> If the client is attempting a PSK establishment, then it should advertise at least one cipher suite indicating a Hash associated with the PSK. <p> In TLS1.3, Static RSA and Diffie-Helman cipher suites have been removed. Cipher suites were whittled down significantly in TLS 1.3 to the point where there are now just five recommended cipher suites:',
 		adjust: 'TLS_AES_128_GCM_SHA256;TLS_AES_256_GCM_SHA384;TLS_CHACHA20_POLY1305_SHA256;TLS_AES_128_CCM_SHA256;TLS_AES_128_CCM_8_SHA256'
 				},
 		{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_compression_methods', eltValue: '<1..2^8-1>;', 
 			info: 'Versions of TLS before 1.3 supported compression with the list of supported compression methods being sent in this field. </br> In TLS 1.3, this vector MUST contain exactly one byte set to zero, which corresponds to the "null" compression method in prior versions of TLS.</br>'
 			+'If it is not the case, and the server receives a non 0 value, then the server must abort the handshake with an "illegal_parameter" alert.'
 		},		
 	];

 	$scope.chExtensions = [
 		{eltName: 'supported_versions', delete: 'yes', adjustment:'no',
 			info: 'Indicates which versions of TLS the client supports. It is a list of of supported versions ordered in preference with the most preferred first. <br/>For TLS1.3, 0x0304 (the number of TLS1.3) should be at the top of the list. </br></br> This extension should only be available when the peer supports TLS1.3.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'supported_groups', eltValue: '= ECDHE groups', 
 		info: 'If available, the client supports elliptic curves (ECDHE) cryptography. This field contains the supported groups that the client supports for key exchange. It is ordered from most to least preferred. <br/> In previous versions it was called <i> elleptic curves</i> and only supported elleptic curves groups. In TLS1.3, signature algorithms are negotiated in another extension. <br/> It contains values for Elliptic curve groups (ECDHE), Finite Field Groups (DHE) and other reserved coodes for private use.',
 		},
 		{eltType: '', delete: 'yes', adjustment:'yes', eltName: 'key_share', eltValue: '= ECDHE shares for some or all the groups', 
 		info: 'This field contains the endpoints cryptographic parameters. It is a list of offered key share values in descending order of client preference. This allows the encryption of messages after the clientHello and serverHello. <p> In previous versions the messages were sent unencrypted </p>',
 		adjustM: '<p>The client can send this field empty to request group selection from the server. This will yield to a helloRetryRequest, therefore, an additional round-trip.</p> <p> Or, the client can send one or more public keys with an algorithm that he thinks the server supports. Each key share value must correspond to a group offered in the supported_groups and must appear in its same order.',
 		adjust: 'empty;keys'
 		}
 	];

 	$scope.serverHello = [
 		{eltType: 'ProtocolVersion',  eltName: 'legacy_version', eltValue: '= 0x0303;', delete: 'no', adjustment: 'yes' ,
 			info: 'When this field is equal to 0x0303, it means the server wants to negotiate a version TLS1.3. In this case, <i>supported_version</i> extension must be available representing the highest version number supported by the server.', 
 			adjustM: '"Either = 0x0303 (indicating TLS1.2) or <0x0303 indictating prior versions of TLS1.2',
 			adjust: '= 0x0303;< 0x303'
 		},
 		{eltType: 'Random', delete: 'no', adjustment:'yes', eltName: 'random', eltValue: ';', 
 			info: '32 bytes generated by a secure random number generator. The last 8 bytes MUST be overwritten if negotiating TLS 1.2 or TLS 1.1, but the remaining bytes MUST be random. This structure is generated by the server and MUST be generated independently of the <i>ClientHello.random</i>. </br></br> This random number is used to prevent downgrade attacks.',
 			adjustM: 'This is to adjust the last 8 bytes of the server\'s random number. </br> If negotiating TLS1.2, then TLS1.3 server’s random number must set their last 8 bytes of their random number to: <br/> 44 4F 57 4E 47 52 44 01 </br>. If negotiating TLS1.1 or below, then TLS1.3 and TLS1.2 servers must set their last 8 bytes of their random number field to: </br> 44 4F 57 4E 47 52 44 00 </br>' ,
 			adjust: '44 4F 57 4E 47 52 44 01;44 4F 57 4E 47 52 44 00;random'
 		},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_session_id', eltValue: '<0..32>;', 
 			info: 'This field is echoed even if the client’s value corresponded to a cached pre-TLS 1.3 session which the server has chosen not to resume. Therefore its value is always the contents of the client’s legacy_session_id field. </br></br> In case it is not echoed the handshake is aborted with an illegal parameter!',
 		},
 		{eltType: 'CipherSuite', delete: 'yes', adjustment:'yes', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;', 
 		info: 'This is an info',
 		adjustM: 'Cipher suites in TLS1.3 use the same cipher suite space as pre-TLS1.3. But, they are defined differently. Therefore, cipher suites for TLS1.2 and lower cannot be used with TLS1.3 and vice versa. <br/> If the client is attempting a PSK establishment, then it should advertise at least one cipher suite indicating a Hash associated with the PSK. <p> In TLS1.3, Static RSA and Diffie-Helman cipher suites have been removed. Cipher suites were whittled down significantly in TLS 1.3 to the point where there are now just five recommended cipher suites:',
 		adjust: 'TLS_AES_128_GCM_SHA256;TLS_AES_256_GCM_SHA384;TLS_CHACHA20_POLY1305_SHA256;TLS_AES_128_CCM_SHA256;TLS_AES_128_CCM_8_SHA256' 		
 		},
		{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_compression_methods', eltValue: '<1..2^8-1>;', 
		info: 'Note that TLS 1.3 servers might receive TLS 1.2 or prior ClientHellos which contain other compression methods and (if negotiating such a prior version) must follow the procedures for the appropriate prior version of TLS. </br></br> This field\'s value in the serverHello must be a single byte which must have the value 0.'
		}	 		
 	];

 	$scope.shExtensions = [
 		{eltName: 'supported_versions', delete: 'yes', adjustment:'no',
 			info: 'Indicates which versions of TLS the server uses. It is a list of of supported versions ordered in preference with the most preferred first. <br/><br/>This extension should only be available when the peer supports TLS1.3.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'supported_groups', eltValue: '= ECDHE groups', 
 		info: 'In TLS1.3, servers can send this extension to the client in case there is a more preferred group to the one in the key_share extension but for now e is still willing to accept this clientHello. This field is therefore sent just to update the client’s view on the server’s preferences. But, before a successful completion of the handshake, the client shouldn\'t act upon any information gained from this field. After the successful completion of the handshake the client can use the information gained to change the groups used in its “key_share” extension in following connections.',
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'key_share', eltValue: '= ECDHE share' 
 		info: '<p>This field contains a single public key that is in the same group as one of the group selected in the <i>ClientHello.supported_groups</i>.</p> <p> When using ECDHE then the server offer one key in the serverHello. IF psk_ke is used, no key share must be sent.</p>',
 		}
 	];

 	$scope.helloRetryRequest = [
	 	 {eltType: 'ProtocolVersion',  eltName: 'legacy_version', eltValue: '= 0x0303;', delete: 'no', adjustment: 'yes' ,
 			info: 'When this field is equal to 0x0303, it means the server wants to negotiate a version TLS1.3. In this case, <i>supported_version</i> extension must be available representing the highest version number supported by the server.', 
 			adjustM: '"Either = 0x0303 (indicating TLS1.2) or <0x0303 indictating prior versions of TLS1.2',
 			adjust: '= 0x0303;< 0x303'
 		},
 		{eltType: 'Random', delete: 'no', adjustment:'yes', eltName: 'random', eltValue: ';', 
 			info: '32 bytes generated by a secure random number generator. The last 8 bytes MUST be overwritten if negotiating TLS 1.2 or TLS 1.1, but the remaining bytes MUST be random. This structure is generated by the server and MUST be generated independently of the <i>ClientHello.random</i>. </br></br> This random number is used to prevent downgrade attacks.',
 			adjustM: 'This is to adjust the last 8 bytes of the server\'s random number. </br> If negotiating TLS1.2, then TLS1.3 server’s random number must set their last 8 bytes of their random number to: <br/> 44 4F 57 4E 47 52 44 01 </br>. If negotiating TLS1.1 or below, then TLS1.3 and TLS1.2 servers must set their last 8 bytes of their random number field to: </br> 44 4F 57 4E 47 52 44 00 </br>' ,
 			adjust: '44 4F 57 4E 47 52 44 01;44 4F 57 4E 47 52 44 00;random'
 		},
 		{eltType: 'opaque', delete: 'yes', adjustment:'yes', eltName: 'legacy_session_id', eltValue: '<0..32>;', 
 			info: 'This field is echoed even if the client’s value corresponded to a cached pre-TLS 1.3 session which the server has chosen not to resume. Therefore its value is always the contents of the client’s legacy_session_id field. </br></br> In case it is not echoed the handshake is aborted with an illegal parameter!',
 		},
 		{eltType: 'CipherSuite', delete: 'yes', adjustment:'yes', eltName: 'cipher_suites', eltValue: '<2..2^16-2>;', 
 		info: 'This is an info',
 		adjustM: 'Cipher suites in TLS1.3 use the same cipher suite space as pre-TLS1.3. But, they are defined differently. Therefore, cipher suites for TLS1.2 and lower cannot be used with TLS1.3 and vice versa. <br/> If the client is attempting a PSK establishment, then it should advertise at least one cipher suite indicating a Hash associated with the PSK. <p> In TLS1.3, Static RSA and Diffie-Helman cipher suites have been removed. Cipher suites were whittled down significantly in TLS 1.3 to the point where there are now just five recommended cipher suites:',
 		adjust: 'TLS_AES_128_GCM_SHA256;TLS_AES_256_GCM_SHA384;TLS_CHACHA20_POLY1305_SHA256;TLS_AES_128_CCM_SHA256;TLS_AES_128_CCM_8_SHA256' 		
 		},
		{eltType: 'opaque', delete: 'no', adjustment:'no', eltName: 'legacy_compression_methods', eltValue: '<1..2^8-1>;', 
		info: 'Note that TLS 1.3 servers might receive TLS 1.2 or prior ClientHellos which contain other compression methods and (if negotiating such a prior version) must follow the procedures for the appropriate prior version of TLS. </br></br> This field\'s value in the serverHello must be a single byte which must have the value 0.'
 		}
 	];

 	$scope.hrrExtensions = [
 		{eltName: 'supported_versions', delete: 'yes', adjustment:'yes',
 			info: 'Indicates which versions of TLS the server uses. It is a list of of supported versions ordered in preference with the most preferred first. <br/><br/>This extension should only be available when the peer supports TLS1.3.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'supported_groups', eltValue: '= ECDHE groups', 
 		info: 'In TLS1.3, servers can send this extension to the client in case there is a more preferred group to the one in the key_share extension but for now e is still willing to accept this clientHello. This field is therefore sent just to update the client’s view on the server’s preferences. But, before a successful completion of the handshake, the client shouldn\'t act upon any information gained from this field. After the successful completion of the handshake the client can use the information gained to change the groups used in its “key_share” extension in following connections.'
 		},
 		{eltType: '', delete: 'yes', adjustment:'no', eltName: 'key_share', eltValue: '= ECDHE share',
 		info: '<p> This field indicates the mutually supported group the server intends to negotiate and is requesting a retried ClientHello key_share for. </p><br/> <p> Upon receiving this field the client checks if it this field correspong to a group provided in the clientHello.supported_groups. Additionally, it also checks that this field is not the same as the group in the clientHello.key_share. In case any of these checks are false then the handshake is aborted with an "illegal_parameter" alert --> MAN IN THE MIDDLE!??</p> <p> If these checks works, then the clientHello.key_share should be replaced by this field.</p>',
 	}
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

