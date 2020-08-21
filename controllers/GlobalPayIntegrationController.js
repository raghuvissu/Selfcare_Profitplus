GlobalPayIntegrationController = function(scope, RequestSender,location, localStorageService,$timeout) {  
		 
		//values getting form constants.js file
		  scope.currencyType		= selfcareModels.globalPayCurrencyType;
		  
		  var  encrytionKey 		= selfcareModels.encriptionKey,
		  	   encryptedData 		= location.search().key,
		  	   decryptedData 		= CryptoJS.AES.decrypt(encryptedData, encrytionKey).toString(CryptoJS.enc.Utf8),
		  	   globalpayStorageData = angular.fromJson(decodeURIComponent(decryptedData)),
		  	   clientData 			= globalpayStorageData.clientData,
		  	   clientId				= clientData.id;
    	  scope.names 				= clientData.displayName;
    	  scope.email 				= clientData.email;
    	  scope.phone 				= clientData.phone;
    	  scope.merchantId			= globalpayStorageData.globalpayMerchantId;
    	  scope.amount 				= globalpayStorageData.price;
    	  localStorageService.add("globalpayStorageData", {screenName : globalpayStorageData.screenName,clientId : clientId,
    		  											    planId : globalpayStorageData.planId, priceId : globalpayStorageData.priceId,price:scope.amount});
    	  
  		
		  var randomFun = function() {
				var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
				var string_length = 10;
				
				var randomstring = clientId + '-';
				
				for (var i=0; i<string_length; i++) {
					var rnum = Math.floor(Math.random() * chars.length);
					randomstring += chars.substring(rnum,rnum+1);	
				}	
				scope.txnref = randomstring;		
			};randomFun();	

			$timeout(function() {
				  $("#submitGlobalPayIntegration").click();
			}, 1000);
		  
    };
    
selfcareApp.controller('GlobalPayIntegrationController', ['$scope', 
                                                          'RequestSender',
                                                          '$location', 
                                                          'localStorageService',
                                                          '$timeout',
                                                          GlobalPayIntegrationController]);
