TwoCheckoutSuccessController = function(scope,RequestSender, location,localStorageService,dateFilter,rootScope) {
 
    		var formData = {};
    		scope.isQueryString = true;
    		   if(window.location.search){
    			   scope.isQueryString = true;
    			   var qs = (function(a) {
	    			    if (a == "") return {};
	    			    var b = {};
	    			    for (var i = 0; i < a.length; ++i)
	    			    {
	    			        var p=a[i].split('=', 2);
	    			        if (p.length == 1)
	    			            b[p[0]] = "";
	    			        else
	    			            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	    			    }
	    			    return b;
    			   })(window.location.search.substr(1).split('&'));
    			   localStorageService.add("queryString",{transactionId:qs["order_number"],currency :qs["currency_code"],
    				   				total_amount:qs["total"],otherData :{"clientName":qs["card_holder_name"],"invoiceId":qs["invoice_id"],"key":qs["key"],"type":qs["li_0_type"]}});
    			   window.location.search="";
    		   }else if(localStorageService.get("queryString")){
    			   
    			   scope.isQueryString = false;
    			   formData = localStorageService.get("queryString");
    			   localStorageService.remove("queryString");
		    		
		    		formData.source 		= paymentGatewayNames.two_checkout;
		    		formData.locale 		= rootScope.localeLangCode;
		    		var StorageData			= localStorageService.get("twoCheckoutStorageData");
		    		
		    		if(StorageData){
		    			var screenName			= StorageData.screenName;
		    			formData.clientId		= StorageData.clientId;
		    			var planId				= StorageData.planId;
		    			var priceId				= StorageData.priceId;
		    			
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
	    							successData.Result = "Success";
	    							successData.Description = "Transaction Successfully Completed";
	    							successData.Amount = formData.total_amount;
	    							successData.TransactionId = formData.transactionId;
	    							
	    							localStorageService.add("paymentgatewayresponse", {data:successData});
	     							location.$$search = {};localStorageService.remove("twoCheckoutStorageData");
	     								location.path('/paymentgatewayresponse/'+formData.clientId);
	    						});
	    					   });
	    						
	    					}else{
		    			
					    		RequestSender.paymentGatewayResource.update(formData, function(data){
					    			localStorageService.remove("twoCheckoutStorageData");
					    			localStorageService.add("paymentgatewayresponse", {data:data});
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
		    		}
    		   }
    		
		};

selfcareApp.controller('TwoCheckoutSuccessController', ['$scope',
                                                        'RequestSender', 
                                                        '$location', 
                                                        'localStorageService', 
                                                        'dateFilter', 
                                                        '$rootScope', 
                                                        TwoCheckoutSuccessController]);

