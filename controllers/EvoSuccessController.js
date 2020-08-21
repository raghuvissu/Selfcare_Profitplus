EvoSuccessController = function(scope,RequestSender, location,localStorageService,rootScope,dateFilter,$modal,$log) {
	
	
		rootScope.evoSuccesssPage = true;
		if(location.path().match('/evosuccess') != '/evosuccess'){
			rootScope.showFrame 	= false;
		}
 
    		//values getting form constants.js file
  		    scope.currencyType		= selfcareModels.EVO_CurrencyType;
  		    scope.optlang 			= rootScope.localeLangCode;
  		    
    		var length				= location.search().Len;
    		var data				= location.search().Data;
    		var output				= "";
    		var blowfishDecData		= {text:data,length:length};
            scope.requestData = {}; 
    		
    		RequestSender.evoPaymentGatewayResource.save({method:'decrypt'},blowfishDecData,function(data){
    			output = data.map.blowfishData;
    			var splitAmpersand = output.split('&'); 
    			var outputObj = {};
    			for(var i in splitAmpersand){
    				var splitEqual = splitAmpersand[i].split('=');
    				outputObj[splitEqual[0]] = splitEqual[1];
    			}
    			
    			
    		if(angular.uppercase(outputObj.Status) == 'AUTHORIZED' || angular.uppercase(outputObj.Status) == 'OK' && outputObj.Code == 00000000){	
    				evoStorageData 		= angular.fromJson(outputObj.UserData),
    				clientId 			= evoStorageData.clientId,
    				email 				= evoStorageData.email,
    				price 				= evoStorageData.price,
    				planId 				= evoStorageData.planId,
    				priceId 			= evoStorageData.priceId,
    				screenName 			= evoStorageData.screenName;
    				isAutoPayment       = evoStorageData.isAutoPayment;
    				isCardChange        = evoStorageData.isCardChange;
    				
    			var formData = {};
    			formData.total_amount = price;
    			formData.transactionId = outputObj.refnr;
    			formData.source = paymentGatewaySourceNames.evo;
    			formData.otherData  = {};
    			formData.otherData  = outputObj;
    			delete formData.otherData.UserData;
    			formData.locale = scope.optlang;
    			formData.emailId = email;
    			//formData.device = "";
    			formData.currency = scope.currencyType;
    			formData.clientId = clientId;
    			
    			var cardNumber = "XXXX-XXXX-XXXX-X"+outputObj.PCNr.toString().substring(13, 16);
    			var cardType = outputObj.CCBrand;
    			var cardExpiry = outputObj.CCExpiry;
    			
    				var successData = {};
					successData.result = "Success";
					successData.description = "Transaction Successfully Completed";
					successData.amount = formData.total_amount;
					successData.transactionId = formData.transactionId;
					localStorageService.add("paymentgatewayresponse", {data:successData,cardType:cardType,cardNumber:cardNumber});
					location.$$search = {};
					if(isAutoPayment == "true") {
						RequestSender.creditCardSaveResource.getCardType({clientId: formData.clientId, identifier: 'PseudoCard'}, function(data){								
							    scope.requestData.type = 'PseudoCard';
								scope.requestData.name = email;
								scope.requestData.cardNumber = outputObj.PCNr.toString();
								scope.requestData.cardType = cardType;
								scope.requestData.cardExpiryDate = cardExpiry;
                                scope.requestData.rtftype = 'R';   
                                
                               if(!data.id){
                                 RequestSender.creditCardSaveResource.save({clientId:formData.clientId},scope.requestData,function(data){			                    									  									
									location.path('/profile/');         								  										
								 });
                               }else{
									location.path('/profile/');
								}
						});											 					
					}else if(isCardChange=="true"){
						RequestSender.creditCardSaveResource.getCardType({clientId: formData.clientId, identifier: 'PseudoCard'}, function(data){								
						    scope.requestData.type = 'PseudoCard';
							scope.requestData.name = email;
							scope.requestData.cardNumber = outputObj.PCNr.toString();
							scope.requestData.cardType = cardType;
							scope.requestData.cardExpiryDate = cardExpiry;
                            scope.requestData.rtftype = 'R'; 
                            
                            if(data.id) { 										
								if(data.cardNumber == scope.requestData.cardNumber && data.cardType == scope.requestData.cardType) {									   											
									location.path('/profile/');          									  									
								}
								else{
									RequestSender.creditCardUpdateResource.update({clientId: formData.clientId, id: data.id, 
										cardType: scope.requestData.type}, scope.requestData,function(data){
											$log.info('card Details Updation Done Successfully.');
											location.path('/profile/');
					                });
								}
							}
                            
						});
					}else {
						location.path('/paymentgatewayresponse/'+formData.clientId);     
					}
					
    			}else{
    				alert("Status Failed :"+outputObj.Description);
    			}
    		 });
    		localStorageService.remove("depositsPayData");
		};

selfcareApp.controller('EvoSuccessController', ['$scope',
                                                'RequestSender', 
	                                            '$location', 
	                                            'localStorageService', 
	                                            '$rootScope', 
	                                            'dateFilter',
	                                            '$modal',
	                                            '$log',
	                                            EvoSuccessController]);

