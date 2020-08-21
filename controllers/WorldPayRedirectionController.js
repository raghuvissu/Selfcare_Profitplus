WorldPayRedirectionController = function(scope,RequestSender, location,localStorageService,routeParams,dateFilter,rootScope) {
 
    		var worlpayData				= localStorageService.get("worlpayData")||"";
    		
    		var formData 					= {};
    		formData.transactionId 			= location.search().txnId;
    		formData.total_amount 			= location.search().amnt;
    		formData.currency 				= location.search().currency;
    		//if(angular.lowercase(location.search().payStatus) == 'completed')
    			//formData.status		 		= 'success';
    		formData.status		 	= location.search().payStatus;
    		formData.source 				= paymentGatewaySourceNames.worldpay;
    		console.log(formData.source);
    		formData.clientId 				= worlpayData.clientId;
    		formData.locale 				= rootScope.localeLangCode;
    		formData.dateFormat 			= 'dd MMMM yyyy';
    		formData.otherData 				= {};
    		formData.otherData.paymentDate 	= dateFilter(new Date(location.search().payDate),'dd MMMM yyyy');
    		formData.otherData.payerEmail 	= location.search().pyrEmail;
    		formData.otherData.address_name = location.search().name;
    		formData.otherData.receiverEmail= location.search().recvEmail;
    		formData.otherData.payerStatus 	= location.search().pyrStatus;
    		formData.otherData.currency 	= formData.currency;
    		formData.otherData.paymentStatus= formData.status;
    		formData.otherData.pendingReason= location.search().pendingReason;
    		
    		var depositPayData = localStorageService.get("depositsPayData") || "";
    		scope.amount = depositPayData[1];
    		scope.id = depositPayData[2];
    		scope.depositDistributions = [];
    		scope.depositDistributions.push({
				depositId : scope.id,
				amount    : scope.amount,
				clientId  : parseInt(location.search().clientId),
				locale    : rootScope.localeLangCode
				});
    		if(depositPayData!=""){
    			formData.paymentType = "Deposit";
    			formData.deposit= scope.depositDistributions;
    		}
    		localStorageService.remove("depositsPayData");
    		
    		
    		var screenName					= worlpayData.screenName;
    		var planId						= worlpayData.planId;
    		var priceId						= worlpayData.priceId;
    	
    	 if(worlpayData != ""){
    		
    	    if(localStorageService.get("statementsPayData")){
					
				 RequestSender.paymentTemplateResource.get(function(paymentTemplateData){
					 var paymentFormData = {};
					 paymentFormData.dateFormat = "dd MMMM yyyy";
					 paymentFormData.isSubscriptionPayment = false;
					 paymentFormData.locale = formData.locale;
					 paymentFormData.paymentDate = dateFilter(new Date(),'dd MMMM yyyy');
					 paymentFormData.receiptNo = formData.transactionId;
					 paymentFormData.amountPaid = formData.total_amount;
					 paymentFormData.statmentId = localStorageService.get("StatementId");
					 for(var m in paymentTemplateData.data){
							 if(angular.lowercase(paymentTemplateData.data[m].mCodeValue) == 'online payment'){
								 paymentFormData.paymentCode = paymentTemplateData.data[m].id;
								 break;
							 }
						 }
					console.log("........."+paymentFormData);	
					RequestSender.paymentResource.save({clientId : formData.clientId},paymentFormData,function(data){
						var successData = {};
						successData.result = "Success";
						successData.description = "Transaction Successfully Completed";
						successData.amount = formData.total_amount;
						successData.transactionId = formData.transactionId;
						
						localStorageService.add("paymentgatewayresponse", {data:successData});
						location.$$search = {};localStorageService.remove("worlpayData");
						  location.path('/paymentgatewayresponse/'+formData.clientId);
					});
				});
					
		   }else if(formData.status == "AUTHORIZED"){
				
				 RequestSender.paymentTemplateResource.get(function(paymentTemplateData){
					 var paymentFormData = {};
					 paymentFormData.dateFormat = "dd MMMM yyyy";
					 paymentFormData.isSubscriptionPayment = false;
					 paymentFormData.locale = formData.locale;
					 paymentFormData.paymentDate = dateFilter(new Date(),'dd MMMM yyyy');
					 paymentFormData.receiptNo = formData.transactionId;
					 paymentFormData.amountPaid = formData.total_amount;
					 paymentFormData.statmentId = localStorageService.get("StatementId");
					 for(var m in paymentTemplateData.data){
							 if(angular.lowercase(paymentTemplateData.data[m].mCodeValue) == 'online payment'){
								 paymentFormData.paymentCode = paymentTemplateData.data[m].id;
								 break;
							 }
						 }
					console.log("........."+paymentFormData);	
					var successData = {};
					successData.result = "AUTHORIZED";
					successData.description = "Transaction Successfully Completed";
					successData.amount = formData.total_amount;
					successData.transactionId = formData.transactionId;
					
					localStorageService.add("paymentgatewayresponse", {data:successData});
					location.$$search = {};localStorageService.remove("worlpayData");
					console.log(localStorageService.get("paymentgatewayresponse"));
					location.path('/paymentgatewayresponse/'+formData.clientId);
					  
					/*RequestSender.paymentResource.save({clientId : formData.clientId},paymentFormData,function(data){
						var successData = {};
						successData.Result = "Success";
						successData.Description = "Transaction Successfully Completed";
						successData.Amount = formData.total_amount;
						successData.TransactionId = formData.transactionId;
						
						localStorageService.add("paymentgatewayresponse", {data:successData});
						location.$$search = {};localStorageService.remove("worlpayData");
						  location.path('/paymentgatewayresponse/'+formData.clientId);
					});*/
				});
					
		   }else{
			   
			   RequestSender.paymentGatewayResource.update({},formData,function(data){
    			  
				  localStorageService.add("paymentgatewayresponse", {data:data});
				  var result = angular.uppercase(data.Result) || "";
	    			location.$$search = {};localStorageService.remove("worlpayData");
	    			if(screenName == 'payment'){
						location.path('/paymentgatewayresponse/'+formData.clientId);
					}else if(result == 'SUCCESS' || result == 'PENDING'){
						localStorageService.add("gatewayStatus",formData.status);
					  if(screenName != 'vod'){
						var storageData = localStorageService.get("storageData")||{};
						var orderId 	= storageData.orderId || 0;
						RequestSender.getRecurringScbcriberIdResource.get({orderId:orderId},function(data){
							scope.recurringData = angular.fromJson(angular.toJson(data));
							scope.scbcriberId 	= scope.recurringData.subscriberId;
							console.log("scope.scbcriberId-->"+scope.scbcriberId);
							if(scope.scbcriberId){
								var recurringOrderData = {orderId:orderId,recurringStatus:"CANCEL",subscr_id:scope.scbcriberId};
								RequestSender.orderDisconnectByScbcriberIdResource.update({},recurringOrderData,function(data){
									
									location.path("/orderbookingscreen/"+screenName+"/"+formData.clientId+"/"+planId+"/"+priceId);
								});
							}else{
								location.path("/orderbookingscreen/"+screenName+"/"+formData.clientId+"/"+planId+"/"+priceId);
							}
						});
					  }else if(screenName == 'vod'){
						  location.path("/orderbookingscreen/"+screenName+"/"+formData.clientId+"/"+planId+"/"+priceId);
					  }
						
					}
			  });
		    }
    	    
    	  }
    		
		};

selfcareApp.controller('WorldPayRedirectionController', ['$scope',
                                                       'RequestSender', 
	                                                  '$location', 
	                                                  'localStorageService', 
	                                                  '$routeParams', 
	                                                  'dateFilter', 
	                                                  '$rootScope', 
	                                                  WorldPayRedirectionController]);

