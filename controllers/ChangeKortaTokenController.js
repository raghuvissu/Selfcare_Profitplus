ChangeKortaTokenController = function(scope, RequestSender, location,localStorageService,modal,rootScope) {
		  
		   
		   //values getting form constants.js file
		   var  kortaServer 			= selfcareModels.kortaServer,
		   	    kortaAmountField 		= selfcareModels.kortaAmountField,
		   	    kortaclientId			= selfcareModels.kortaclientId,
		   	    kortaPaymentMethod 		= selfcareModels.kortaPaymentMethod,
		   	    kortaTokenValue 		= selfcareModels.kortaTokenValue,
		   	    encrytionKey 			= selfcareModels.encriptionKey;
		   scope.currency 				= selfcareModels.kortaCurrencyType;
		   scope.doAction 				= selfcareModels.changeKortaTokenDoActionMsg;
		   scope.optlang 				= rootScope.localeLangCode;
		   
		   if(rootScope.selfcare_sessionData){
			   scope.clientId = rootScope.selfcare_sessionData.clientId;
		    RequestSender.clientResource.get({clientId: scope.clientId} , function(data) {
			  scope.fullName 	= data.displayName;;
			  scope.address 	= data.addressNo;
			  scope.emailId 	= data.email;
			  (data.zip == null ||  data.zip == "") ? scope.zipcode = data.city : scope.zipcode = data.zip;
			  scope.city 		= data.city;
			  scope.country 	= data.country;
			  scope.mobileNo 	= data.phone;
			  scope.description = "Token Updation";
			  scope.amount 		= 1;
			  scope.terms 		= 'N';
			  
			  var token = "";
			  var randomFun = function() {
				  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
				  var string_length = 13;
				  
				  var randomstring = 'TT';
				  
				  for (var i=0; i<string_length; i++) {
					  var rnum = Math.floor(Math.random() * chars.length);
					  randomstring += chars.substring(rnum,rnum+1);	
				  }	
				  scope.tokenVal = randomstring;
				  token = CryptoJS.AES.encrypt(scope.tokenVal, encrytionKey).toString();
				  
			  };randomFun();  
			  
			  var encryptData = {};
			  encryptData[kortaAmountField] = scope.amount;   		encryptData[kortaPaymentMethod]	= scope.doAction;
			  encryptData[kortaTokenValue] 	= token;		  		encryptData[kortaclientId] 		= scope.clientId;
			  encryptData.locale 			= scope.optlang;  		encryptData.email 				= scope.emailId;
			  
			  var encrytedSearchStr 	  = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(encryptData)), encrytionKey).toString();
			  scope.downloadurl 		  = selfcareModels.additionalKortaUrl+"/changekortatoken/0/0?key="+encrytedSearchStr+"&";
			  
			  var secretCode = "";
			  RequestSender.paymentGatewayConfigResource.get(function(data) {
				  for(var i in data.globalConfiguration){
				    if(data.globalConfiguration[i].enabled && (data.globalConfiguration[i].name == paymentGatewayNames.korta)){
					   var jsonObj = angular.fromJson(data.globalConfiguration[i].value);
					   scope.kortaMerchantId = jsonObj.merchantId;
					   scope.kortaTerminalId = jsonObj.terminalId;
					   secretCode 			 = jsonObj.secretCode;
					   
					   if(kortaServer == 'TEST'){
						   scope.md5data = scope.amount + scope.currency + scope.kortaMerchantId
						   + scope.kortaTerminalId + scope.description + "/" + scope.doAction + "//" 
						   +scope.tokenVal + secretCode +kortaServer;
					   }else if(kortaServer == 'LIVE'){
						   scope.md5data = scope.amount + scope.currency + scope.kortaMerchantId
						   + scope.kortaTerminalId + scope.description + "/" + scope.doAction + "//" 
						   +scope.tokenVal + secretCode;
					   }else{
						   alert("Please Configure the Server Type Properly. Either 'TEST' or 'LIVE'");
						   location.path('/profile');
					   }
					   localStorageService.add("secretCode",secretCode);
					   scope.md5value=md5(scope.md5data);
					   break;
				    }
				   }
			  });
		  });
		 }

		 var TermsandConditionsController = function($scope,$modalInstance){
		    	var termsAndConditions = "termsAndConditions_"+scope.optlang+"_locale";
		    	if(scope.optlang){
		    			$scope.termsAndConditionsText = korta[termsAndConditions];
		    	}
		    	$scope.done = function(){
		    		$modalInstance.dismiss('cancel');
		    	};
		    };
		   
		    scope.termsAndConditionsFun = function(){
			    modal.open({
					 templateUrl: 'termsandconditions.html',
					 controller: TermsandConditionsController,
					 resolve:{}
			    });
	    };
		  
	  };

selfcareApp.controller('ChangeKortaTokenController', ['$scope', 
                                                      'RequestSender',
                                                      '$location',
                                                      'localStorageService',
                                                      '$modal',
                                                      '$rootScope',
                                                      ChangeKortaTokenController]);
