 OrderServiceController = function(scope,localStorageService,$rootScope,API_VERSION,$upload,dateFilter,$timeout,RequestSender,route,$modal) {
 	 scope.ordersData = [];
	 scope.orders = [];
	 scope.clientId = $rootScope.selfcare_sessionData.clientId;
	 scope.locale = $rootScope.localeLangCode;
	 scope.isFlag= false;
     scope.isButtonsEnable= false;
     
	 scope.orderDataFun = function(){
		 RequestSender.getOrderResource.get({clientId: scope.clientId} , function(data) {
			  scope.ordersData = data.clientOrders;
			  for(var i in scope.ordersData){
                 if((scope.ordersData[i].planCode == 'u-mee home' || scope.ordersData[i].planCode == 'u-mee fam1' 
                	 || scope.ordersData[i].planCode == 'u-mee fam2')&& (scope.ordersData[i].status == 'ACTIVE') ){
                	  var temp = i;
                      scope.isButtonsEnable= true;          	  
					  scope.orderValueId = scope.ordersData[i].id;
					  scope.planId  = scope.ordersData[i].pdid;
					  scope.planCode = scope.ordersData[i].planCode;
					  scope.addOnPrices = 0;
					  RequestSender.getSingleOrderResource.get({orderId:  scope.orderValueId} , function(data) {
						  scope.orderAddonsDatas = data.orderAddonsDatas;
						  if(scope.orderAddonsDatas.length >= 1){ 
							  
							  scope.isButtonsEnable= false;
							  for (var j in scope.orderAddonsDatas){
								   scope.addOnPrices = scope.addOnPrices + scope.orderAddonsDatas[j].price;
								   scope.ordersData.push({orderNo:scope.ordersData[temp].orderNo,planCode:scope.orderAddonsDatas[j].serviceCode,
									   price:scope.orderAddonsDatas[j].price,startDate:scope.orderAddonsDatas[j].startDate,contractPeriod:'Perpetual'});
							  }
							  scope.ordersData[temp].price = scope.ordersData[temp].price - scope.addOnPrices;
						  }
					  });
					  
					  
				  }

				  if(scope.ordersData[i].planCode == 'TV+GO' || scope.ordersData[i].planCode == 'u-mee plus'){
					  scope.isFlag= true;
					  break;
				  }
			  }
			  scope.orders = scope.ordersData;
		 });
	 };
	 scope.orderDataFun();
	 var reqDate = dateFilter(new Date(),'dd MMMM yyyy');
	 
	 /**
	  * This function is used for change order
	  **/
	 scope.upgrade = function(orderId){		 
			  		
			  scope.changePlanJson = {"billAlign":true,"autoRenew":false,"planCode":2,"contractPeriod":1,"paytermCode":"Monthly","isNewplan"
						 :false,"locale":"en","dateFormat":"dd MMMM yyyy","start_date":reqDate,"disconnectionDate":reqDate,"disconnectReason":"Not Interested"};
		 		
			  RequestSender.changeOrderResource.update({orderId: orderId},  scope.changePlanJson , function(data) {
				  scope.orderDataFun();
				  route.reload();
			 });
			  
			  
	 };
	 
	 /**
	  * This function is used for add's addon service 'TV+GO' to exist plans
	  **/
	 scope.addOnToOrder = function(orderId,planCodeName,addonServiceDetails){
		 
		 /*scope.newOrderJson = {"billAlign":true,"autoRenew":false,"planCode":3,"contractPeriod":1,"paytermCode":"Monthly","isNewplan"
				 :true,"locale":"en","dateFormat":"dd MMMM yyyy","start_date":reqDate}; 
		 
		  RequestSender.bookOrderResource.save({clientId: scope.clientId}, scope.addOnServiceJson , function(data) {
			  scope.orderDataFun();
			  route.reload();
		 });*/
		 
		 scope.addOnServiceJson = {"contractId":1,"locale":"en","dateFormat":"dd MMMM yyyy","startDate":reqDate,
				 "addonServices":[{"serviceId":addonServiceDetails.serviceId,"locale":"en","chargeCodeId":addonServiceDetails.chargeCodeId,"price":addonServiceDetails.price}],
				 "planName":planCodeName};
		 
		  RequestSender.orderaddonResource.save({orderId: orderId}, scope.addOnServiceJson , function(data) {
			  //scope.orderDataFun();
			  route.reload();
		  });
		 
	 };
	 
	 /**
	  * This code is for Popup
	  * 
	  **/
     scope.perFormAction = function (orderId, planId,planCode,actionType){
         scope.orderIdValue = orderId;
       	 scope.actionType = actionType;
       	 scope.planIdValue  = planId;
       	 scope.planCodeName = planCode;
        
        if (actionType == 'PLUS'){
            
            $modal.open({
	            templateUrl: 'actionPopup.html',
	            controller: approve,
	            resolve:{}
	        });
            
        }
        else{
        
            $modal.open({
	            templateUrl: 'actionPopupTVGo.html',
	            controller: approve,
	            resolve:{}
	        });
        
        }
      };
       
   	function  approve($scope, $modalInstance) {
   		$scope.approve = function () {
           
   			if(scope.actionType == 'PLUS'){
   				scope.upgrade(scope.orderIdValue);
   			}else if(scope.actionType == 'TV+GO'){
   				/** Addon Creation */
   				if(scope.planIdValue && scope.planCodeName){
   					RequestSender.orderaddonTemplateResource.get({planId : scope.planIdValue,chargeCode :'Monthly'} , function(data) { 	
   						scope.addonServiceDetails=data.addonsPriceDatas[0];
   						scope.addOnToOrder(scope.orderIdValue,scope.planCodeName,scope.addonServiceDetails);
   					});
   				}
   			}else{}
           	$modalInstance.dismiss('delete');
   		};
         $scope.cancel = function () {
               $modalInstance.dismiss('cancel');
         };
     }
	
 };   
selfcareApp.controller('OrderServiceController', [ '$scope','localStorageService','$rootScope','API_VERSION','$upload','dateFilter','$timeout','RequestSender','$route','$modal',OrderServiceController]);
