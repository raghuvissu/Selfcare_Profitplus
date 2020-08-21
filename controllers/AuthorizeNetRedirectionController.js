 AuthorizeNetRedirectionController = function(scope,RequestSender, location,localStorageService,routeParams,dateFilter,rootScope) {
 
	if(rootScope.selfcare_sessionData){
			 scope.clientId = rootScope.selfcare_sessionData.clientId;
			RequestSender.clientResource.get({clientId: scope.clientId} , function(clientTotalData) {
				scope.clientData = clientTotalData;
				localStorageService.add("clientdata",{clientinfo:scope.clientData,locale:rootScope.localeLangCode});

	    		var AuthorizeData				= localStorageService.get("AuthorizeData")||"";
	    		
	    		var formData 					= {};
	    		
	    		formData.cardNumber             = location.search().cardno;
	    		formData.cardType               = location.search().cardtype;
	    		formData.clientId 				= location.search().clientId;
	    		formData.currency 				= scope.clientData.currency || 'USD';
	    		formData.emailId                = location.search().emailId;
	    		formData.locale 				= rootScope.localeLangCode;
	    		formData.source                 = paymentGatewaySourceNames.autherizeNet;
	    		formData.total_amount 			= location.search().amount;	
	    		formData.transactionId 			= location.search().transId;
	    		formData.dateFormat 			= 'dd MMMM yyyy';
	    		
	    		formData.otherData 				= {};
	    		formData.otherData.paymentDate 	= dateFilter(new Date(),'dd MMMM yyyy');
	    		formData.otherData.email        = location.search().emailId;
	    		formData.otherData.currency 	= formData.currency;
	    		formData.otherData.transactionId = formData.transactionId;
	    		
	    		var depositPayData = localStorageService.get("depositsPayData") || "";
	    		localStorageService.remove("depositsPayData");
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
	    		var addondata = localStorageService.get("createaddon") || "";
	    		localStorageService.remove("createaddon");
	    		var screenName					= AuthorizeData.screenName;
	    		var planId						= AuthorizeData.planId;
	    		var priceId						= AuthorizeData.priceId;
	    		
	    	
	    		//get localstorage data added in StatementsController.js
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
						
					RequestSender.paymentResource.save({clientId : formData.clientId},paymentFormData,function(data){
						var successData = {};
						successData.result = "Success";
						successData.description = "Transaction Successfully Completed";
						successData.amount = formData.total_amount;
						successData.transactionId = formData.transactionId;
						
						localStorageService.add("paymentgatewayresponse", {data:successData,cardType:formData.cardType,cardNumber:formData.cardNumber});
							location.$$search = {};
							location.path('/paymentgatewayresponse/'+formData.clientId);
					});
				   });
					
				}else if(addondata){
					 var createaddondata = {};
					 createaddondata.locale=rootScope.localeLangCode;
					 createaddondata.dateFormat="dd MMMM yyyy";
					 createaddondata.startDate=dateFilter(new Date(),'dd MMMM yyyy');
					 createaddondata.addonServices=addondata[3];
					 createaddondata.planName=addondata[4];
					 createaddondata.contractId = addondata[6];
					RequestSender.orderaddonResource.save({orderId: addondata[5]},createaddondata,function(data){
						var successData = {};
						successData.result = "Success";
						successData.description = "Transaction Successfully Completed";
						successData.amount = formData.total_amount;
						successData.transactionId = formData.transactionId;
						
						localStorageService.add("paymentgatewayresponse", {data:successData,cardType:formData.cardType,cardNumber:formData.cardNumber});
							location.$$search = {};
							location.path('/services');
					
		  	        }, function(errorData) {
		  	        	alert("Addon Creation Failed:\n \n "+errorData.data.errors[0].developerMessage);
						var successData = {};
						successData.result = "Success";
						successData.description = "Transaction Successfully Completed";
						successData.amount = formData.total_amount;
						successData.transactionId = formData.transactionId;
		  	        	localStorageService.add("paymentgatewayresponse", {data:successData,cardType:formData.cardType,cardNumber:formData.cardNumber});
						location.$$search = {};
						location.path('/services');
				
		  	        	
		  	        });
					
				}else{
	    		  RequestSender.paymentGatewayResource.update({},formData,function(data){
					  localStorageService.add("paymentgatewayresponse", {data:data,cardType:formData.cardType,cardNumber:formData.cardNumber});
					  var result = angular.uppercase(data.Result) || "";
					  location.$$search = {};
		    			if(screenName == 'payment'){
							location.path('/paymentgatewayresponse/'+formData.clientId);
						}else {
							localStorageService.add("gatewayStatus",result);
							location.path("/orderbookingscreen/"+screenName+"/"+formData.clientId+"/"+planId+"/"+priceId);
						}
				  });
			}
			});
	}
	
	    		
};

selfcareApp.controller('AuthorizeNetRedirectionController', ['$scope',
                                                       'RequestSender', 
	                                                  '$location', 
	                                                  'localStorageService', 
	                                                  '$routeParams', 
	                                                  'dateFilter', 
	                                                  '$rootScope',
	                                                  AuthorizeNetRedirectionController]);