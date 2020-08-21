PaypalRecurringController = function(scope,RequestSender,location,routeParams,$timeout) {
 
	 var encrytionKey 		 = selfcareModels.encriptionKey;
	 var selfcareAppUrl		 = selfcareModels.selfcareAppUrl;
	 
	 var encryptedData 	   	 = location.search().key,
 	  	 decryptedData 		 = CryptoJS.AES.decrypt(encryptedData, encrytionKey).toString(CryptoJS.enc.Utf8),
	  	 paypalStorageData 	 = angular.fromJson(decodeURIComponent(decryptedData)),
	  	 ischargeCodeData	 = paypalStorageData.chargeCodeData,
	 	 screenName			 = paypalStorageData.screenName,
	 	 clientId			 = paypalStorageData.clientId,
	 	 planId				 = paypalStorageData.planId,
	 	 priceId			 = paypalStorageData.priceId,
	 	 contractId			 = paypalStorageData.contractId;
	 	 scope.price		 = paypalStorageData.price;
	 	 scope.emailId		 = paypalStorageData.paypalEmailId;
	 	 
	 	 var orderId = 0, billingFrequency =null;
	 	 if(ischargeCodeData){
	 		 scope.chargeCodeData = ischargeCodeData.data;
	 		 orderId 			 = ischargeCodeData.orderId || 0;
	 		 billingFrequency 	 = ischargeCodeData.billingFrequency;
	 	 }
		
		scope.returnURL 	 = selfcareAppUrl+"#/paypalrecurringsuccess/"+screenName+"/"+clientId+"/"+planId+"/"+priceId+"/"+orderId;
		
		console.log(orderId);
		scope.period		= scope.chargeCodeData.chargeDuration;
		scope.time			= scope.chargeCodeData.chargeType[0];
		
		if(screenName == "changeorder"){
			scope.customValue   = { clientId:clientId,planId:planId,paytermCode:billingFrequency,
					contractPeriod:contractId,orderId:orderId};
		}else if(screenName == "renewalorder"){
			scope.customValue   = {clientId:clientId,planId:planId,paytermCode:billingFrequency,
						renewalPeriod:contractId,orderId:orderId,priceId:priceId};
		}else{
			scope.customValue   = { clientId:clientId,planId:planId,paytermCode:billingFrequency,contractPeriod:contractId};
		}
		
		var contractType = 0,chargeType = 0;
		console.log("contractType**************>"+angular.lowercase(scope.chargeCodeData.contractType));
		console.log("chargeType**************>"+angular.lowercase(scope.chargeCodeData.chargeType));
    			switch (angular.lowercase(scope.chargeCodeData.contractType)) {
							case "month(s)": contractType = 30;
											  break;
							case "day(s)": contractType = 1;
											  break;
							case "week(s)": contractType = 7;
											  break;
							case "year(s)": contractType = 365;
										break;
							default: break;
					};
				switch (angular.lowercase(scope.chargeCodeData.chargeType)) {
							case "month(s)": chargeType = 30;
											  break;
							case "day(s)": chargeType = 1;
											  break;
							case "week(s)": chargeType = 7;
											  break;
							case "year(s)": chargeType = 365;
											  break;
							default: break;
						};
						console.log("contractType-->"+contractType);
						console.log("contractDuration-->"+scope.chargeCodeData.contractDuration);
						console.log("chargeType-->"+chargeType);
						console.log("chargeDuration-->"+scope.chargeCodeData.chargeDuration);
			scope.srt = (scope.chargeCodeData.contractDuration * contractType) / (chargeType * scope.chargeCodeData.chargeDuration);
			
			$timeout(function() {
				  $("#submitPaypalRecurringBtn").click();
			    }, 1000);
        	
        	        	
        };
        
selfcareApp.controller('PaypalRecurringController', ['$scope',
                                                  'RequestSender', 
                                                  '$location', 
                                                  '$routeParams',
                                                  '$timeout',
                                                  PaypalRecurringController]);

