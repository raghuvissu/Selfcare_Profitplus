KortaTokenController = function(scope, routeParams, location, localStorageService,$timeout,rootScope) {
		  
		  //values getting form constants.js file
		  var 	kortaServer 		= selfcareModels.kortaServer,
		  		kortaAmountField 	= selfcareModels.kortaAmountField,
		  		kortaclientId		= selfcareModels.kortaclientId,
		  		kortaTokenValue 	= selfcareModels.kortaTokenValue,
		  		encrytionKey 		= selfcareModels.encriptionKey;
		  scope.currency 			= selfcareModels.kortaCurrencyType;
		  scope.optlang 			= rootScope.localeLangCode;
		  
		  var encryptedData 		= location.search().key,
		      decryptedData 		= CryptoJS.AES.decrypt(encryptedData, encrytionKey).toString(CryptoJS.enc.Utf8),
		      kortaStorageData 		= angular.fromJson(decodeURIComponent(decryptedData)),
		      clientData 			= kortaStorageData.clientData || "",
		      paymentGatewayValues 	= kortaStorageData.paymentGatewayValues || "",
		      planData 				= kortaStorageData.planData || "";
		  
		  var clientId 				= clientData.id;
		  scope.fullName 			= clientData.displayName || "";
		  scope.address 			= clientData.addressNo;
		  scope.emailId 			= clientData.email;
		  (clientData.zip == null ||  clientData.zip == "") ? scope.zipcode = clientData.city : scope.zipcode = clientData.zip;
		  scope.city 				= clientData.city;
		  scope.country 			= clientData.country;
		  scope.mobileNo 			= clientData.phone;
		  
		  scope.amount 				= routeParams.price;
		  scope.description 		= planData.planCode;
		  scope.kortaMerchantId 	= paymentGatewayValues.merchantId;
		  scope.kortaTerminalId 	= paymentGatewayValues.terminalId;
		  
		  var token 				= clientData.selfcare.token || "";
		  scope.tokenVal			= CryptoJS.AES.decrypt(token, encrytionKey).toString(CryptoJS.enc.Utf8);
		  var encryptedToken 		= CryptoJS.AES.encrypt(scope.tokenVal, encrytionKey).toString();
		  
			  localStorageService.add("secretCode",paymentGatewayValues.secretCode);
			  var encryptData = {};
			  encryptData[kortaAmountField]     = scope.amount;   	encryptData[kortaTokenValue] 	= encryptedToken;	
			  encryptData[kortaclientId] 		= clientId;			encryptData.locale 				= scope.optlang; 
			  encryptData.email 				= scope.emailId;
			  
			  var encrytedSearchStr = CryptoJS.AES.encrypt(encodeURIComponent(JSON.stringify(encryptData)), encrytionKey).toString();
			  
			  scope.downloadurl = selfcareModels.additionalKortaUrl+"/"+kortaStorageData.screenName+"/"+kortaStorageData.planId+"/"+planData.id+"" +
			  						"?key="+encrytedSearchStr+"&";
			  
			  if(kortaServer == 'TEST'){
				  scope.md5data = scope.amount + scope.currency + scope.kortaMerchantId
				  + scope.kortaTerminalId + scope.description + "//1/" 
				  +scope.tokenVal + paymentGatewayValues.secretCode +kortaServer;
			  }else if(kortaServer == 'LIVE'){
				  scope.md5data = scope.amount + scope.currency + scope.kortaMerchantId
				  + scope.kortaTerminalId + scope.description + "//1/" 
				  +scope.tokenVal + paymentGatewayValues.secretCode;
			  }else{
				  alert("Please Configure the Server Type Properly. Either 'TEST' or 'LIVE'");
				  location.path('/profile');
			  }

			  scope.md5value=md5(scope.md5data);
			 
			  $timeout(function() {
				  $("#submitKortaTokenIntegration").click();
			    }, 1000);
    };
    
selfcareApp.controller('KortaTokenController', ['$scope', 
                                                '$routeParams', 
                                                '$location', 
                                                'localStorageService', 
                                                '$timeout', 
                                                '$rootScope', 
                                                KortaTokenController]);
