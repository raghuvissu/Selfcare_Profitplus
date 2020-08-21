OrderBookingScreenController = function(RequestSender,rootScope,location,dateFilter,routeParams, localStorageService,modal) {
		  
	//values getting form routeParams 
	var  screenName			= routeParams.screenName;
		 clientId			= routeParams.clientId, 
		 planId				= routeParams.planId, 
		 priceId			= routeParams.priceId; 
		 
		 var returnOrderId = "";
	
	var gatewayStatus		= localStorageService.get("gatewayStatus")||"";
	var isAutoRenew 		= localStorageService.get("isAutoRenew") || "";
	var bookingCount 		= localStorageService.get("bookingCount") || "";
	var authorizeProfile = localStorageService.get("authorizeProfile") || "";
	var orderType	=  localStorageService.get("ordertype")||"";
	localStorageService.remove("ordertype");
	
	function successFun(planData){
		localStorageService.remove("gatewayStatus"); localStorageService.remove("storageData"); 
		localStorageService.remove("isAutoRenew");localStorageService.remove("chargeCodeData");
		localStorageService.remove("contractsData");localStorageService.remove("plansCheckoutList");
		localStorageService.remove("authorizeProfile");
		if(gatewayStatus == 'RECURRING'){
			var paypalrecurringsuccessPopupController = function ($scope,$modalInstance,$log){
				$scope.done = function(){
					$modalInstance.dismiss('cancel');
				};
				modalInstance.result.then(function () {
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
					location.path('/services');
				});
			};
			var modalInstance = modal.open({
				 templateUrl: 'paypalrecurringsuccesspopup.html',
				 controller: paypalrecurringsuccessPopupController,
				 resolve:{}
			 });
		}
		else if(screenName != "vod"){		
			if(location.search().paymentType == "authorize") {			 
				var updateData = {};
				updateData.subscriberId = authorizeProfile;
				updateData.orderId = returnOrderId;		
				updateData.clientId = clientId;			
				RequestSender.recurringPaymentSaveResource.update({}, updateData, function(data){
					location.path("/services");
				});	
				
			} else {		 
				 (location.search().amount==0) ? (location.$$search = {},location.path("/services")) : location.path('/paymentgatewayresponse/'+clientId);			 
			}			
		}
		else if (screenName == "vod"){
    		(priceId == "amountZero")? location.path("/events") : location.path('/paymentgatewayresponse/'+clientId);
    	};
    }
	var storageData = localStorageService.get("storageData");
		  var clientData 			= storageData.clientData;
		  var totalOrdersData 		= storageData.totalOrdersData;
		  var eventData		 		= storageData.eventData || "";
		  var orderId 				= storageData.orderId || null;
  RequestSender.clientResource.get({clientId: clientId} , function(clientsInfo) {
    if(screenName != "vod"){
      if(screenName != 'additionalorders'){
		for(var i in totalOrdersData){
		  if(totalOrdersData[i].planId == planId){
			for(var j in totalOrdersData[i].pricingData){
			  if(totalOrdersData[i].pricingData[j].id == priceId){
				var planData = totalOrdersData[i].pricingData[j];
				if(planData.isPrepaid == 'N'){
					var contractsData = localStorageService.get("contractsData");
					if(contractsData){
						planData.contractId = contractsData.contractId;
					}
				}
				if(screenName == "additionalorders"){
					var orderBookingData 			= {};
					(planData.isPrepaid=='Y') ? orderBookingData.billAlign 		= false : orderBookingData.billAlign 		= true;
					orderBookingData.isNewplan 		= true;
					orderBookingData.locale 		= rootScope.localeLangCode; 
					orderBookingData.dateFormat 	= 'dd MMMM yyyy'; 
					orderBookingData.start_date 	= dateFilter(new Date(clientsInfo.date),'dd MMMM yyyy'); 
					orderBookingData.paytermCode 	= planData.billingFrequency; 
					orderBookingData.contractPeriod = planData.contractId; 
					orderBookingData.planCode 		= planId;
					orderBookingData.autoRenew 		= isAutoRenew;
					if(gatewayStatus == "PENDING"){
						orderBookingData.status 	= gatewayStatus;
						orderBookingData.actionType	= screenName;
						RequestSender.scheduleOrderResource.save({clientId : clientId},orderBookingData,function(data){
							returnOrderId = data.resourceId;
							successFun(planData);
						});
					}
					else if(gatewayStatus == "RECURRING"){
						orderBookingData.status 	= gatewayStatus;
						orderBookingData.actionType	= screenName;
						RequestSender.scheduleOrderResource.save({clientId : clientId},orderBookingData,function(data){
							successFun(planData);
						});
						
					}else{
						RequestSender.bookOrderResource.save({clientId : clientId},orderBookingData,function(data){
							returnOrderId = data.resourceId;
							successFun(planData);
						});
					}
				}else if(screenName == "changeorder"){
					var changeOrderData 			 = {};
					(planData.isPrepaid=='Y') ? changeOrderData.billAlign 		= false : changeOrderData.billAlign 		= true;
					changeOrderData.isNewplan 		 = false;
					changeOrderData.locale 			 = rootScope.localeLangCode; 
					changeOrderData.dateFormat 		 = 'dd MMMM yyyy'; 
					changeOrderData.start_date 		 = dateFilter(new Date(clientsInfo.date),'dd MMMM yyyy'); 
					changeOrderData.disconnectionDate= dateFilter(new Date(clientsInfo.date),'dd MMMM yyyy');
					changeOrderData.paytermCode 	 = planData.billingFrequency; 
					changeOrderData.contractPeriod 	 = planData.contractId; 
					changeOrderData.planCode 		 = planId;
					changeOrderData.disconnectReason = "Not Interested";
					changeOrderData.autoRenew 		 = isAutoRenew;
					if(gatewayStatus == "PENDING"){
						changeOrderData.status 		= gatewayStatus;
						changeOrderData.actionType	= screenName;
						RequestSender.scheduleOrderResource.save({clientId : clientId},changeOrderData,function(data){
							successFun(planData);
						});
					}else if(gatewayStatus == "RECURRING"){
						changeOrderData.status 	= gatewayStatus;
						changeOrderData.orderId 	= orderId;
						changeOrderData.actionType	= screenName;
						RequestSender.scheduleOrderResource.save({clientId : clientId},changeOrderData,function(data){
							successFun(planData);
						});
						
					}else{
						RequestSender.changeOrderResource.update({'orderId':orderId},changeOrderData,function(data){
							returnOrderId = data.resourceId;
							successFun(planData);
						});
					}
				}else if(screenName == "renewalorder"){
						 var renewalOrderData 			 = {};
						 renewalOrderData.renewalPeriod  = planData.contractId; 
						 renewalOrderData.priceId  		 = priceId; 
						 renewalOrderData.description	 = 'Order Renewal through selfcare'; 
						if(gatewayStatus == "PENDING"){
							renewalOrderData.status 		= gatewayStatus;
							renewalOrderData.actionType	= screenName;
							RequestSender.scheduleOrderResource.save({clientId : clientId},renewalOrderData,function(data){
								successFun(planData);
							});
						}else if(gatewayStatus == "RECURRING"){
							renewalOrderData.status 		= gatewayStatus;
							renewalOrderData.orderId 		= orderId;
							renewalOrderData.actionType		= screenName;
							RequestSender.scheduleOrderResource.save({clientId : clientId},renewalOrderData,function(data){
								successFun(planData);
							});
						}else{
							RequestSender.orderRenewalResource.save({orderId :orderId},renewalOrderData,function(data){							
								returnOrderId = orderId;
								successFun(planData);
							 });
						}
				}
				break;
			  }
			}
		   break;
		  }
		}
      }else if(screenName == 'additionalorders'){
			var plansData = [];
			plansData = localStorageService.get("plansCheckoutList");
			var orderBookOneByOneFun = function(val){
				var orderBookingData 			= {};
				(plansData[val].isPrepaid=='Y') ? orderBookingData.billAlign 		= false : orderBookingData.billAlign 		= true;
				orderBookingData.isNewplan 		= true;
				orderBookingData.locale 		= rootScope.localeLangCode; 
				orderBookingData.dateFormat 	= 'dd MMMM yyyy'; 
				orderBookingData.start_date 	= dateFilter(new Date(clientsInfo.date),'dd MMMM yyyy'); 
				orderBookingData.paytermCode 	= plansData[val].billingFrequency; 
				orderBookingData.contractPeriod = plansData[val].contractId; 
				orderBookingData.planCode 		= plansData[val].planId;
				orderBookingData.autoRenew 		= isAutoRenew;
				
				if(gatewayStatus == "PENDING"){
					orderBookingData.status 	= gatewayStatus;
					orderBookingData.actionType	= screenName;
					RequestSender.scheduleOrderResource.save({clientId : clientId},orderBookingData,function(data){
						if(val == plansData.length-1){
							returnOrderId = data.resourceId;					 
							successFun("success");
						 }else{
							 val += 1;
							 orderBookOneByOneFun(val);
					 	 }
					});
				}
				else if(gatewayStatus == "RECURRING"){
					orderBookingData.status 	= gatewayStatus;
					orderBookingData.actionType	= screenName;
					/*RequestSender.scheduleOrderResource.save({clientId : clientId},orderBookingData,function(data){
						if(val == plansData.length-1){
							 successFun("success");
						 }else{
							 val += 1;
							 orderBookOneByOneFun(val);
					 	 }
					});*/
					function orderBookingFun(val){
					       RequestSender.bookOrderResource.save({'clientId': clientId},orderBookingData,function(data){
					            			if(val == bookingCount){
					            				 successFun("success");
					            			} //location.path('/vieworder/' + data.resourceId+'/'+routeParams.id)
					            			else {
					            					val++;
					            					orderBookingFun(val);
					            				
					            			}
					            		},function(errData){
					            			scope.flag = false;
					            		});
					            		
					            	}orderBookingFun(1);
					

				}else{
					function orderBookingFun(val){
						console.log(val);
					       RequestSender.bookOrderResource.save({'clientId': clientId},orderBookingData,function(data){
					            			if(val == bookingCount) location.path('/vieworder/' + data.resourceId+'/'+routeParams.id);
					            			else {
					            					val++;
					            					orderBookingFun(val);
					            				
					            			}
					            		},function(errData){
					            			scope.flag = false;
					            		});
					            		
					            	}orderBookingFun(1);
					
				}
			 };
			 if(plansData.length != 0 ) orderBookOneByOneFun(0);
			 
	 
      }
     }else if(screenName == "vod"){
    	 var eventSavedOneByOneFun = function(val){
			 RequestSender.eventsResource.save(eventFormData[val],function(data){
				 if(val == eventFormData.length-1){
					 successFun("adding Events");
				 }else{
					 val += 1;
				 	eventSavedOneByOneFun(val);
			 	 }
			 });
		 };
	 
		var eventFormData = [];
		 for(var i in eventData) {
			 
				 eventFormData[i] = {
					 							eventId 		: eventData[i].eventId,
					 							optType 		: eventData[i].optType,
					 							formatType 		: eventData[i].quality,
					 							clientId 		: clientId,
					 							locale 			: rootScope.localeLangCode,
					 							eventBookedDate : dateFilter(new Date(clientsInfo.date),'dd MMMM yyyy'),
					 							dateFormat 		: 'dd MMMM yyyy',
					 							deviceId 		: clientData.hwSerialNumber
				 							};
			 if(i == eventData.length-1){
				 eventSavedOneByOneFun(0);
			 }
		 }
     }
	});
		 
  };

selfcareApp.controller('OrderBookingScreenController', ['RequestSender',
                                                        '$rootScope',
                                                        '$location',
                                                        'dateFilter',
                                                        '$routeParams',
                                                        'localStorageService',
                                                        '$modal',
                                                         OrderBookingScreenController]);
