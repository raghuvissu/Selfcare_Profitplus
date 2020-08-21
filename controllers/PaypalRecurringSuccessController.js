PaypalRecurringSuccessController = function(scope,RequestSender,location,localStorageService,routeParams) {
 
	
		var screenName 		= routeParams.screenName||"",
			clientId 		= routeParams.clientId||"",
			planId 			= routeParams.planId||"",
			priceId 		= routeParams.priceId||"",
			orderId 		= routeParams.orderId||0;
	
		
		RequestSender.getRecurringScbcriberIdResource.get({orderId:orderId},function(data){
			scope.recurringData = angular.fromJson(angular.toJson(data));
			scope.subscriberId	= scope.recurringData.subscriberId;
			console.log("subscriberId-->"+scope.subscriberId);
			
			localStorageService.add("gatewayStatus","RECURRING");
			if(scope.subscriberId){
				var formData = {orderId:orderId,recurringStatus:"CANCEL",subscr_id : scope.subscriberId};
				RequestSender.orderDisconnectByScbcriberIdResource.update(formData,function(data){
					
					location.path("/orderbookingscreen/"+screenName+"/"+clientId+"/"+planId+"/"+priceId);
				});
			}else{
				location.path("/orderbookingscreen/"+screenName+"/"+clientId+"/"+planId+"/"+priceId);
			}
		});
        	        	
 };
        
selfcareApp.controller('PaypalRecurringSuccessController', ['$scope',
                                                  'RequestSender', 
                                                  '$location', 
                                                  'localStorageService',
                                                  '$routeParams',
                                                  PaypalRecurringSuccessController]);

