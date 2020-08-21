NetellerController = function(scope,RequestSender,routeParams,location,dateFilter,localStorageService,rootScope) {
		  
		var clientId 			= routeParams.clientId;
		
		scope.formData 			= {};
		var	decryptedData     	= CryptoJS.AES.decrypt(location.search().key, selfcareModels.encriptionKey).toString(CryptoJS.enc.Utf8),
			kortaStorageData 	= angular.fromJson(decodeURIComponent(decryptedData));
    	scope.amount 			= kortaStorageData.total_amount;
    	scope.formData 			= kortaStorageData;
    	var screenName 			= scope.formData.screenName;
    	scope.formData.locale	= rootScope.localeLangCode;
    	scope.formData.source	= paymentGatewaySourceNames.neteller;
    	
		  var randomFun = function() {
				var chars = "0123456789";
				var string_length = 6;
				var randomstring = dateFilter(new Date(),'yyMMddHHmmss');
				
				for (var i=0; i<string_length; i++) {
					var rnum = Math.floor(Math.random() * chars.length);
					randomstring += chars.substring(rnum,rnum+1);	
				}	
				scope.formData.transactionId = randomstring;
				
			};randomFun();
    	
    	scope.validation = {};
    	scope.validationValueForNeteller = function(value){
    		
    		if(value == null || value == '' || value == undefined){
    			scope.validation.value = true;
    		}else{
    			scope.validation.value = false;
    		}
    		
    	};
    	scope.validationForNeteller = function(code){
    		
    		if(code == null || code == '' || code == undefined || code.length < 6){
    			scope.validation.verificationCode = true;
    		}else{
    			scope.validation.verificationCode = false;
    		}
    		
    	};
    	
    	scope.submit = function() { 
    		if(rootScope.selfcare_sessionData){
    			scope.formData.clientId = clientId;
    		  if(!scope.validation.value && !scope.validation.verificationCode){
    			  
    			  if(localStorageService.get("statementsPayData")){
  					
    	   				 RequestSender.paymentTemplateResource.get(function(paymentTemplateData){
    	   					 var paymentFormData = {};
    	   					 paymentFormData.dateFormat = "dd MMMM yyyy";
    	   					 paymentFormData.isSubscriptionPayment = false;
    	   					 paymentFormData.locale = scope.formData.locale;
    	   					 paymentFormData.paymentDate = dateFilter(new Date(),'dd MMMM yyyy');
    	   					 paymentFormData.receiptNo = scope.formData.transactionId;
    	   					 paymentFormData.amountPaid = scope.amount;
    	   					 paymentFormData.statmentId = localStorageService.get("StatementId");
    	   					 for(var m in paymentTemplateData.data){
    	   							 if(angular.lowercase(paymentTemplateData.data[m].mCodeValue) == 'online payment'){
    	   								 paymentFormData.paymentCode = paymentTemplateData.data[m].id;
    	   								 break;
    	   							 }
    	   						 }
    	   						
    	   					RequestSender.paymentResource.save({clientId : clientId},paymentFormData,function(data){
    	   						var successData = {};
    	   						successData.Result = "Success";
    	   						successData.Description = "Transaction Successfully Completed";
    	   						successData.Amount = scope.amount;
    	   						successData.TransactionId = scope.formData.transactionId;
    	   						
    	   						localStorageService.add("paymentgatewayresponse", {data:successData});
    	   						  location.path('/paymentgatewayresponse/'+clientId);
    	   					});
    	   				});
    	   					
    	   		   }else{
		    			  if(screenName == 'vod') scope.formData.screenName = "";
		    			  var authentication = {username:selfcareModels.obs_username,password:selfcareModels.obs_password};
		    			  RequestSender.netellerPaymentResource.save(authentication,scope.formData, function(data){
		    				localStorageService.add("paymentgatewayresponse",{data:data});
		    				var result = angular.uppercase(data.Result);
		    				
		    				if(screenName == 'vod'){
		    					if(result == "SUCCESS" || result == 'PENDING'){
		    						localStorageService.add("gatewayStatus",result);
		    						location.path("/orderbookingscreen/"+screenName+"/"+clientId+"/0/0");
		    					}else if(result == "FAILURE"){
		    						location.path('/paymentgatewayresponse/'+clientId);
		    					}
		    				}else{
		    					location.path('/paymentgatewayresponse/'+clientId);
		    				}
		               });
    	   		   }
    	    }
			
    	};
       };
    	
		 
    };
    
selfcareApp.controller('NetellerController',['$scope',
                                             'RequestSender',
                                             '$routeParams',
                                             '$location',
                                             'dateFilter',
                                             'localStorageService',
                                             '$rootScope',
                                             NetellerController]);
