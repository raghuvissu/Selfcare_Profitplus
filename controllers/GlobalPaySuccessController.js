GlobalPaySuccessController = function(RequestSender, location,localStorageService,dateFilter,rootScope) {
 
    		var formData			= {};
    		formData.transactionId 	= location.search().txnref;
    		formData.source 		= paymentGatewaySourceNames.globalpay;
    		var StorageData			= localStorageService.get("globalpayStorageData");
    		if(StorageData){
    			var screenName		= StorageData.screenName,
    			     clientId		= StorageData.clientId,
    				 planId			= StorageData.planId,
    			     priceId		= StorageData.priceId;
    			
    		 if(localStorageService.get("statementsPayData")){
					
   				 RequestSender.paymentTemplateResource.get(function(paymentTemplateData){
   					 var paymentFormData = {};
   					 paymentFormData.dateFormat = "dd MMMM yyyy";
   					 paymentFormData.isSubscriptionPayment = false;
   					 paymentFormData.locale = rootScope.localeLangCode;
   					 paymentFormData.paymentDate = dateFilter(new Date(),'dd MMMM yyyy');
   					 paymentFormData.receiptNo = formData.transactionId;
   					 paymentFormData.amountPaid = StorageData.price;
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
   						successData.Amount = StorageData.price;
   						successData.TransactionId = formData.transactionId;
   						
   						localStorageService.add("paymentgatewayresponse", {data:successData});
   						location.$$search = {};localStorageService.remove("globalpayStorageData");
   						  location.path('/paymentgatewayresponse/'+clientId);
   					});
   				});
   					
   		   }else{
    		
	    		RequestSender.paymentGatewayResource.update(formData, function(data){
	    			localStorageService.remove("globalpayStorageData");
	    			localStorageService.add("paymentgatewayresponse", {data:data});
	    			var result = angular.uppercase(data.Result) || "";
	    			location.$$search = {};
	    			if(screenName == 'payment'){
						location.path('/paymentgatewayresponse/'+formData.clientId);
					}else if(result == 'SUCCESS' || result == 'PENDING'){
						localStorageService.add("gatewayStatus",result);
						location.path("/orderbookingscreen/"+screenName+"/"+clientId+"/"+planId+"/"+priceId);
					}
	    		});
   		    }
    	  }
    		
		};

selfcareApp.controller('GlobalPaySuccessController', ['RequestSender', 
	                                                  '$location', 
	                                                  'localStorageService', 
	                                                  'dateFilter', 
	                                                  '$rootScope', 
	                                                  GlobalPaySuccessController]);

