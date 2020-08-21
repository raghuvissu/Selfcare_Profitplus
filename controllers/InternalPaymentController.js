
InternalPaymentController = function(scope, routeParams, location, localStorageService,$timeout,RequestSender,rootScope,$timeout,dateFilter) {
	
	var internalStorageData = localStorageService.get("internalStorageData");
	
	scope.formData 				= {};
	scope.formData.clientId 	= routeParams.clientId;
	scope.formData.total_amount	= routeParams.amount;
	scope.formData.locale		= rootScope.localeLangCode;
	scope.formData.emailId		= internalStorageData.email;
	scope.formData.source		= "internal payment";
	scope.formData.device		= "";
	scope.formData.currency		= internalStorageData.currency || rootScope.currencyCode;
	scope.formData.cardType 	= '';
	scope.formData.cardNumber 	= '';
	var screenName 				= routeParams.screenName,
		planId 					= routeParams.planId || '',
		priceId 				= routeParams.priceId || '';
	
	
	var randomFun = function() {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var string_length = 10;
		
		var randomstring = scope.formData.clientId + '-';
		
		for (var i=0; i<string_length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum,rnum+1);	
		}	
		scope.formData.transactionId = randomstring;		
	};randomFun();	
	 	
	scope.formData.otherData	= '{"email":'+internalStorageData.email+',"transactionId":'+scope.formData.transactionId+'}';
	
	$timeout(function() {
		
		if(localStorageService.get("statementsPayData")){
			
			 RequestSender.paymentTemplateResource.get(function(paymentTemplateData){
				 var paymentFormData = {};
				 paymentFormData.dateFormat = "dd MMMM yyyy";
				 paymentFormData.isSubscriptionPayment = false;
				 paymentFormData.locale = scope.formData.locale;
				 paymentFormData.paymentDate = dateFilter(new Date(),'dd MMMM yyyy');
				 paymentFormData.receiptNo = scope.formData.transactionId;
				 paymentFormData.amountPaid = scope.formData.total_amount;
				 paymentFormData.statmentId = localStorageService.get("StatementId");
				 for(var m in paymentTemplateData.data){
						 if(angular.lowercase(paymentTemplateData.data[m].mCodeValue) == 'online payment'){
							 paymentFormData.paymentCode = paymentTemplateData.data[m].id;
							 break;
						 }
					 }
					
				RequestSender.paymentResource.save({clientId : scope.formData.clientId},paymentFormData,function(data){
					var successData = {};
					successData.Result = "Success";
					successData.Description = "Transaction Successfully Completed";
					successData.Amount = scope.formData.total_amount;
					successData.TransactionId = scope.formData.transactionId;
					
					localStorageService.add("paymentgatewayresponse", {data:successData});
					localStorageService.remove("internalStorageData");
						location.path('/paymentgatewayresponse/'+scope.formData.clientId);
				});
			   });
				
			}else{
		  
			RequestSender.paymentGatewayResource.update({clientId:scope.formData.clientId},scope.formData,function(data){
				localStorageService.remove("internalStorageData");
				  localStorageService.add("paymentgatewayresponse", {data:data});
				  var result = angular.uppercase(data.Result);
				if(screenName == 'payment'){
					location.path('/paymentgatewayresponse/'+scope.formData.clientId);
				}else if(result == 'SUCCESS' || result == 'PENDING'){
					localStorageService.add("gatewayStatus",result);
					location.path("/orderbookingscreen/"+screenName+"/"+scope.formData.clientId+"/"+planId+"/"+priceId);
				}else{	 
					location.path('/paymentgatewayresponse/'+scope.formData.clientId);
				}
			});
		}
		
	}, 1000);
	
};
    
selfcareApp.controller('InternalPaymentController', ['$scope', 
                                                '$routeParams', 
                                                '$location', 
                                                'localStorageService', 
                                                '$timeout', 
                                                'RequestSender',
                                                '$rootScope',
                                                '$timeout',
                                                'dateFilter',
                                                InternalPaymentController]);
