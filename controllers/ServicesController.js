ServicesController = function(scope,RequestSender,localStorageService,location,$modal,route,dateFilter,rootScope,$log) {
		  
		  var isAutoRenewConfig = angular.fromJson(localStorageService.get("isAutoRenewConfig"));
		  var clientOrdersData =[],completeOrdersData = [];
	  	  scope.clienData = {};scope.ordersData = [];
	  	  scope.templateName = "views/prepaidplans.html";
	  		 if(rootScope.selfcare_sessionData){
	  			 scope.clientId = rootScope.selfcare_sessionData.clientId;
	  			RequestSender.clientResource.get({clientId: scope.clientId} , function(clientTotalData) {
	  				scope.clienData = clientTotalData;
  				  RequestSender.getOrderResource.get({clientId:scope.clientId},function(data){
  					  clientOrdersData = data.clientOrders;
  					  scope.ordersData = clientOrdersData;
  					  angular.forEach(scope.ordersData,function(value,key){
  						  if(value.isPrepaid == 'Y') scope.ordersData[key].planType = 'prepaid';
  						  else scope.ordersData[key].planType = 'postpaid';
  					  });
  					  RequestSender.orderTemplateResource.query({region : scope.clienData.state},function(data){
  						  completeOrdersData = data;
  						additionalPlansFun('prepaid');
  					  });
  				  });
	  			});
	  	    }
	  	  
	 scope.planTypeSelFun = function(name){
		 scope.planType = name;
		 if(scope.screenName == "additionalorders") additionalPlansFun(name);
		 if(scope.screenName == "changeorder") scope.activePackageSelectionFun(scope.selectedOrderId,scope.selectedPlanId,'ACTIVE',name);
		 if(scope.screenName == "renewalorder"){
			 scope.orderRenew ? orderRenew = 'Y': orderRenew = 'N';
			 scope.disconnectedPackageSelectionFun(scope.selectedOrderId,scope.selectedPlanId,'DISCONNECTED',orderRenew,name);
		 }
	 };
	 
	 function additionalPlansFun(name){
		 scope.screenName = "additionalorders";
		 scope.planType = name; 
		 scope.plansData = [];
		 var totalOrdersData = completeOrdersData;
		  for(var i in clientOrdersData ){
			  if(angular.lowercase(clientOrdersData[i].status) == 'pending'){
				  scope.existOrderStatus = 'pending';
			  }
			  totalOrdersData = _.filter(totalOrdersData, function(item) {
				  return item.planCode != clientOrdersData[i].planCode;
			  });
		  }
		 for(var j in totalOrdersData){
				  totalOrdersData[j].autoRenew = isAutoRenewConfig;
				  scope.autoRenewBtn = isAutoRenewConfig;
				  totalOrdersData[j].isVariantForOrders=false;
				  for(var k in totalOrdersData[j].pricingData){
					  totalOrdersData[j].pricingData[k].isCheck = 'no';
					  totalOrdersData[j].pricingData[k].planId = totalOrdersData[j].planId;
					  if(totalOrdersData[j].pricingData[k].variantCode=="None")
						  totalOrdersData[j].isVariantForOrders=true;
				  }
				  if(scope.planType == 'prepaid')
				  if(totalOrdersData[j].isPrepaid == 'Y')scope.plansData.push(totalOrdersData[j]); 
				  if(scope.planType == 'postpaid')
					  if(totalOrdersData[j].isPrepaid == 'N')scope.plansData.push(totalOrdersData[j]); 
			  }
			  localStorageService.add("storageData",{clientData:scope.clienData,totalOrdersData:totalOrdersData});
			  templateSelectionFun(scope.planType);
	 }
		  
	 scope.activePackageSelectionFun = function(selectedOrderId,selectedPlanId,orderStatus,planType){
		 scope.selectedOrderId = selectedOrderId;
		 scope.selectedPlanId  = selectedPlanId;
		 scope.planType		   = planType;
		 
			 scope.screenName = "changeorder";var totalOrdersData = [];
			 angular.copy(completeOrdersData,totalOrdersData);
			  for(var i in totalOrdersData){
				  for(var j in clientOrdersData){
					  
					  if(totalOrdersData[i].planId == clientOrdersData[j].pdid){
						 totalOrdersData[i].pricingData = _.reject(totalOrdersData[i].pricingData, function(item) {
							  return (item.duration == clientOrdersData[j].contractPeriod);
						  });
					  }
				  } 
			  }
			  scope.plansData = [];
			  for(var j in totalOrdersData){
				  totalOrdersData[j].autoRenew = isAutoRenewConfig;
				  if(scope.planType == 'prepaid')
					  if(totalOrdersData[j].isPrepaid == 'Y')scope.plansData.push(totalOrdersData[j]); 
				  if(scope.planType == 'postpaid')
					  if(totalOrdersData[j].isPrepaid == 'N')scope.plansData.push(totalOrdersData[j]); 
			  }
			  localStorageService.add("storageData",{clientData:scope.clienData,totalOrdersData:totalOrdersData,orderId:scope.selectedOrderId});
			  templateSelectionFun(scope.planType);
	  };
	  scope.disconnectedPackageSelectionFun = function(selectedOrderId,selectedPlanId,orderStatus,orderRenew,planType){
		  scope.orderRenew 		= angular.uppercase(orderRenew) == 'Y';
		  scope.selectedOrderId = selectedOrderId;
		  scope.selectedPlanId  = selectedPlanId;
		  scope.planType		= planType;
		  
			  scope.screenName = "renewalorder";var totalOrdersData = [];
			  angular.copy(completeOrdersData,totalOrdersData);
			  scope.plansData = [];
			  for(var j in totalOrdersData){
				  if(scope.planType == 'prepaid'){
				    if((totalOrdersData[j].planId == scope.selectedPlanId) && (totalOrdersData[j].isPrepaid == 'Y')){
					  totalOrdersData[j].autoRenew = isAutoRenewConfig;
					  scope.plansData.push(totalOrdersData[j]); 
					  break;
				    }
				  }
				  if(scope.planType == 'postpaid'){
					  if((totalOrdersData[j].planId == scope.selectedPlanId) && (totalOrdersData[j].isPrepaid == 'N')){
						  totalOrdersData[j].autoRenew = isAutoRenewConfig;
						  scope.plansData.push(totalOrdersData[j]); 
						  break;
					  }
				  }
			  }
			  localStorageService.add("storageData",{clientData:scope.clienData,totalOrdersData:totalOrdersData,orderId:scope.selectedOrderId});
			  templateSelectionFun(scope.planType);
	  };
	  
	  function templateSelectionFun(name){
		  name == 'prepaid' ?scope.templateName = "views/prepaidplans.html":scope.templateName = "views/postpaidplans.html";
	  }
	  
	  scope.revertRadioBtnFun = function(){
		  scope.selectedOrderId = '';
		  route.reload();
	  };
	  
	 scope.viewOrder = function(orderId){
		 scope.orderDisconnect = false;
		 var modalInstance = $modal.open({
                templateUrl: 'vieworder.html',
                controller: vieworderPopupController,
                resolve:{
                	orderId : function(){
                		return orderId;
                	}
                }
            });
		 modalInstance.result.then(function () {}, function () {
			 if(scope.orderDisconnect){route.reload();}
 	    });
     };
     scope.viewPlanServices = function(planId){
    	 scope.orderDisconnect = false;
    	 var modalInstance = $modal.open({
    		 templateUrl: 'viewplanservice.html',
    		 controller: viewPlanServicesPopupController,
    		 resolve:{
    			 planId : function(){
    				 return planId;
    			 }
    		 }
    	 });
    	 modalInstance.result.then(function () {}, function () {
    		 if(scope.orderDisconnect){route.reload();}
    	 });
     };
     
     scope.viewAddOns  = function(orderId){
    	 var modalInstance = $modal.open({
    		 templateUrl : 'viewaddons.html',
    		 controller : ViewAddOnsPopupController,
    		 resolve:{
    			 orderId : function(){
    				 return orderId;
    			 }
    		 }
    	 });
    	 
    	 modalInstance.result.then(function () {}, function () {
    		 if(scope.orderDisconnect){route.reload();}
    	 });
     };
     
     function twoDimensionalArray(array, elementsPerSubArray) {
		    var resultArray = [], i, k;

		    for (i = 0, k = -1; i < array.length; i++) {
		        if (i % elementsPerSubArray === 0) {
		            k++;
		            resultArray[k] = [];
		        }

		        resultArray[k].push(array[i]);
		    }

		    return resultArray;
		}
     
    function vieworderPopupController($scope, $modalInstance,$log,orderId) {
   	  function initialFunCall(){
    	RequestSender.getSingleOrderResource.get({orderId: orderId},function(data){
    		$scope.orderServices = twoDimensionalArray(data.orderServices, 3);
    		//$scope.orderServices = data.orderServices;
    		$scope.orderData = data.orderData;
    		$scope.orderPricingDatas = data.orderPriceData;
			  if(data.orderData.isPrepaid == 'Y'){
				  $scope.orderData.isPrepaid="Pre Paid";
	            }else{
	            	$scope.orderData.isPrepaid="Post Paid";
	            }
			  scope.orderGetDate = data.date;
		  });
   	  }initialFunCall();
    	
    	$scope.orderDisconnect = function(orderId){
    		var modalInstance = $modal.open({
    			templateUrl: 'OrderDisconnect.html',
    			controller: OrderDisconnectPopupController,
    			resolve:{
    				orderId : function(){
    					return orderId;
    				}
    			}
    		});
    	    modalInstance.result.then(function () {
    	    	scope.orderDisconnect = true;
    	    	initialFunCall();
    	    }, function () {
    	      $log.info('Modal dismissed at: ' + new Date());
    	    });
    		
    	};
   	  $scope.close = function () {$modalInstance.dismiss('cancel');};
         
     };
     
     function viewPlanServicesPopupController($scope, $modalInstance,$log,planId) {
    	RequestSender.planServicesResource.get({planId: planId},function(data){
    			 //$scope.planServices = data.selectedServices;
    			 $scope.planServices = twoDimensionalArray(data.selectedServices, 3);
    		 });
    	 
    	 $scope.close = function () {$modalInstance.dismiss('cancel');};
    	 
     };
     
       var OrderDisconnectPopupController = function ($scope, $modalInstance,orderId) {
           
			  $scope.flagOrderDisconnect=false;
			  $scope.disconnectDetails = [{'id':1,'mCodeValue':'Not Interested'},
			                              {'id':2,'mCodeValue':'Plan Change'},
							        	  {'id':3,'mCodeValue':'Wrong plan'}];
     	  $scope.start = {};
     	  $scope.start.date = new Date(scope.orderGetDate);
     	  $scope.formData = {};
     	  $scope.paymentFormData = {};
     	  
     	  $scope.approveDisconnection = function () {
     		  $scope.flagOrderDisconnect=true;
     		  
     		 RequestSender.getRecurringScbcriberIdResource.get({orderId:orderId},function(recurringdata){
     			scope.recurringData = angular.fromJson(angular.toJson(recurringdata));
     			scope.subscriberId	= scope.recurringData.subscriberId;
     			console.log("subId-->"+scope.subscriberId);
     			if(scope.subscriberId){ 				
     				
     				if(scope.recurringData.gatewayName == "authorizenet") {		
     					$scope.paymentFormData.orderId = orderId;
     					$scope.paymentFormData.actionName = "cancel";
     					$scope.paymentFormData.clientId = scope.clientId;
     					$scope.paymentFormData.subscriberId = scope.subscriberId;
     					
     					RequestSender.getRecurringScbcriberIdResource.save({'orderId': orderId},$scope.paymentFormData,function(data){
     						updatOrderResourceFun();	
     					});
     				
     				} else if (scope.recurringData.gatewayName == "paypal") {
     					var formData = {orderId:orderId,recurringStatus:"CANCEL",subscr_id : scope.subscriberId};
     					RequestSender.orderDisconnectByScbcriberIdResource.update(formData,function(data){
     						updatOrderResourceFun();
     					});
     					
     				} else {   					
     					alert("Recurring Billing not Implemented for this PaymentGateway: "+ scope.recurringData.gatewayName);	
     				}
     					 
     			}else updatOrderResourceFun();
     		});
     		function updatOrderResourceFun(){
	     	        $scope.formData.dateFormat = 'dd MMMM yyyy';
	     	        $scope.formData.disconnectionDate = dateFilter($scope.start.date,'dd MMMM yyyy');
	     	        $scope.formData.locale = rootScope.localeLangCode;
	     		  
	     	        RequestSender.bookOrderResource.update({'orderId': orderId},$scope.formData,function(data){
	     	        	$modalInstance.close('delete');
	     	        },function(orderErrorData){
	     	        	 $scope.flagOrderDisconnect=false;
	     	        	$scope.orderError = orderErrorData.data.errors[0].userMessageGlobalisationCode;
	     	        });
     		 }
           };
           $scope.cancelDisconnection = function () {
               $modalInstance.dismiss('cancel');
           };
           
       };
       
       function ViewAddOnsPopupController($scope, $modalInstance,$log,orderId) {
     	   
      	  RequestSender.getSingleOrderResource.get({orderId: orderId},function(orderData){
      		  $scope.orderAddonsDatas = orderData.orderAddonsDatas;
      		  $scope.planId = orderData.orderData.pdid;
     	  });
      	  
      	  $scope.createAddOn = function(){
          	 
      		$modalInstance.dismiss('cancel');
      		
      		 var modalInstance = $modal.open({
                      templateUrl: 'addaddons.html',
                      controller: AddAddonsPopupController,
                      resolve:{
                    	  orderId : function(){
                      		return orderId;
                      	}
                      }
                  });
           };
           
           $scope.disConnectAddon = function(addonId){
        	   
        	   var modalInstance = $modal.open({
                   templateUrl: 'disconnectaddon.html',
                   controller: DisconnectAddonsPopupController,
                   resolve:{
                	   addonId : function(){
                   		return addonId;
                   	}
                   }
               });
           };
           
           	$scope.close = function () {$modalInstance.dismiss('cancel');};
         	 
          };
       
       function AddAddonsPopupController($scope, $modalInstance,$log,orderId) {
    	   
    	   $scope.subscriptiondatas=[];
           $scope.addonsPriceDatas=[];
       	   $scope.addonServices=[];
       	   $scope.formData = {};
    	   
    	  RequestSender.getSingleOrderResource.get({orderId: orderId},function(orderData){
    		  $scope.orderData = orderData.orderData;
    		  $scope.planId = orderData.orderData.pdid;
       		RequestSender.orderaddonTemplateResource.get({planId : $scope.planId,chargeCode :  orderData.orderPriceData[0].billingFrequency} , function(data) {
       			$scope.subscriptiondatas=data.contractPeriods;
            	$scope.addonsPriceDatas=data.addonsPriceDatas;
            	$scope.serviceCategoryDatas = [];
                angular.forEach($scope.addonsPriceDatas,function(value,key){
                	$scope.serviceCategoryDatas.push({serviceCode:value.serviceCode});
                });
                $scope.serviceCategoryDatas = _.uniq($scope.serviceCategoryDatas,function(item){
                 return item.serviceCode;
                });
       		});
   		  });
    	  
    	  $scope.isSelected = function(id,isActive,price,chargeCodeId,index){
          	if(isActive =="Y"){
          		$scope.addonServices.push({
     				  "serviceId":id,
     				  "locale":rootScope.localeLangCode,
     				  "chargeCodeId":chargeCodeId,
     				  "price":price
     				 
     			  });
          	}else{
          		
          		angular.forEach($scope.addonServices,function(value,key){
          			if(value.serviceId == id && value.chargeCodeId == chargeCodeId){
          				$scope.addonServices.splice(key, 1);
          			}
          		});
  			  }
  			  
  		  };
    	   
  		$scope.save = function(){
  			$scope.formData.locale=rootScope.localeLangCode;
  			$scope.formData.dateFormat="dd MMMM yyyy";
  			$scope.formData.startDate=dateFilter(new Date(),'dd MMMM yyyy');
  			$scope.formData.addonServices=$scope.addonServices;
  			$scope.formData.planName=$scope.orderData.planCode;
  			var price=0;
  			for (var i in $scope.addonServices){
  					localStorageService.add("onlinePayAmount",price=price+$scope.addonServices[i].price);
  					localStorageService.add("fromsource",true);
  					localStorageService.add("createaddon",[$scope.formData.locale,$scope.formData.dateFormat,$scope.formData.startDate
  					                   ,$scope.formData.addonServices,$scope.formData.planName,$scope.orderData.id,$scope.formData.contractId]);
  					 location.path( '/prepaidpayment');
  							 $modalInstance.close('delete');
  			}
			/* RequestSender.orderaddonResource.save({orderId: $scope.orderData.id},$scope.formData,function(data){
				 $modalInstance.close('delete');
				 route.reload();
             },function(orderErrorData){
            	 $scope.errorDetails = rootScope.errorDetails;
            	 $scope.errorStatus = rootScope.errorStatus;
            	 rootScope.errorDetails = [];rootScope.errorStatus = [];
  	        });*/
  		 };
       
       	 $scope.close = function () {$modalInstance.dismiss('cancel');};
       	 
        };
        
        function DisconnectAddonsPopupController($scope, $modalInstance,$log,addonId) {
        	
      	   $scope.save = function(){
        	  RequestSender.orderaddonResource.remove({orderId:addonId},{},function(data){
        		  $modalInstance.close('delete');
        		  route.reload();
        	  },function(errorData){
            	 $scope.errorDetails = rootScope.errorDetails;
            	 $scope.errorStatus = rootScope.errorStatus;
            	 rootScope.errorDetails = [];rootScope.errorStatus = [];
  	          });
      	   };
        	  
             $scope.close = function () {$modalInstance.dismiss('cancel');};
           	 
          };
       
	       
 };

selfcareApp.controller('ServicesController', ['$scope',
                                              'RequestSender',
                                              'localStorageService',
                                              '$location',
                                              '$modal',
                                              '$route',
                                              'dateFilter',
                                              '$rootScope',
                                              '$log',
                                              ServicesController]);
