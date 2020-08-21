MultiroomPostpaidPlansController = function(scope,RequestSender,localStorageService,location,$modal,route,dateFilter,rootScope,$log) {
	
	scope.durationSelectionFun = function(priceData,planId){
    	if(scope.existOrderStatus == 'pending'){
    		scope.priceId 	= priceData.id;
    		var modalInstance = $modal.open({
   			   templateUrl: 'messagespopup.html',
   			   controller: MessagesPopupController,
   			   resolve:{
   				   planId : function(){
   					   return planId;
   				   }
   			   }
   		   });
    	    modalInstance.result.then(function () {
    	    	delete scope.priceId;
     	      }, function () {
     			  delete scope.priceId;
     			 $log.info('Modal dismissed at: ' + new Date());
     		});
    	}else{ 
	    	if(scope.planType == 'postpaid'){
	    		
	    		if(scope.planId!=planId){
	    			delete scope.contractPeriod;
	    		}
	      		   scope.planId 	= planId;				scope.billingFrequency 	= priceData.billingFrequency;
	      		   scope.priceId 	= priceData.id;			scope.price 			= priceData.price;
	      		   
	      		   var modalInstance = $modal.open({
	      			   templateUrl: 'viewcontractperiods.html',
	      			   controller: ViewContractPeriodsPopupController,
	      			   resolve:{
	      				 priceData : function(){
	      					   return priceData;
	      				   }
	      			   }
	      		   });
	      		   modalInstance.result.then(function () {
	      			 localStorageService.add("contractsData",{contractId:scope.contractId,contractPeriod : scope.contractPeriod});
	      		   }, function () {
	      			   if(!scope.contractPeriod){
		      			   delete scope.priceId;
		      			   console.log(scope.priceId);
		      			   $log.info('Modal dismissed at: ' + new Date());
	      			   }
	      		   });
	    	 }
    	}
       };
       
       //Messages Popup Controller
       function  MessagesPopupController($scope, $modalInstance) {
    	   	  rootScope.popUpMsgs = [];
	    	  rootScope.popUpMsgs.push({
	    		  'image' : '../images/info-icon.png',
	    		  'names' : [{'name' : 'error.plan.already.pending'}]
	    	      });
		
	      		$scope.approve = function () { 
	      			$modalInstance.close('delete');
	      		};
		} 
       
     //View Contract Periods Popup Controller
       function ViewContractPeriodsPopupController($scope, $modalInstance,$log,priceData) {
	    	RequestSender.gettingContractsResource.get({planId: priceData.planId,clientId:scope.clientId,template:'true'},function(data){
	    			 $scope.subscriptiondatas = data.subscriptiondata;
	    		 },function(errorData){
	    			 $scope.errorDetails = rootScope.errorDetails;
	            	 $scope.errorStatus = rootScope.errorStatus;
	            	 rootScope.errorDetails = [];rootScope.errorStatus = [];
	    		 });
	    	 
	    	$scope.approve = function (contractPeriod) {
	    		
	    		if(contractPeriod){
	    			
	    			RequestSender.finalPriceCheckingResource.get({priceId:priceData.id,clientId:scope.clientId,
						contractId:contractPeriod,paytermCode:priceData.billingFrequency},function(data){
							angular.forEach($scope.subscriptiondatas,function(value,key){
								if(value.id == contractPeriod){
									scope.contractPeriod = value.Contractdata;
									scope.contractId   = value.id;
									$modalInstance.close([scope.contractId,scope.contractPeriod]);
								}
							});
						},function(errorData){
				            	 $scope.errorDetails = rootScope.errorDetails;
				            	 $scope.errorStatus = rootScope.errorStatus;
				            	 rootScope.errorDetails = [];rootScope.errorStatus = [];
				  	 });
	    			
	    		}
	    	};
	    	$scope.cancel = function () {
	    		$modalInstance.dismiss('cancel');
	    	};
	    	 
	     };
	     scope.checkboxSelection = function(position, pricingData) {
	    	   angular.forEach(pricingData, function(priceData, index) {
	    	     if (position != index) {
	    	    	 priceData.isCheck = 'no';
	    	    	 if(scope.previewCheckoutList.length != 0){
		    			   scope.totalAmount -= priceData.price;
		    		   }
	    	     scope.previewCheckoutList = scope.previewCheckoutList.filter(function( obj ) {
			   			return obj.id != priceData.id;
	    	       });
	    	     }
	    	   });
	    	 };
	    
	     //checkout process code start
	     scope.durationCheckboxSelectionFun = function(priceData,index){
	    	 if(scope.existOrderStatus == 'pending'){
	     		var modalInstance = $modal.open({
	    			   templateUrl: 'messagespopup.html',
	    			   controller: MessagesPopupController,
	    			   resolve:{
	    				   planId : function(){
	    					   return priceData.planId;
	    				   }
	    			   }
	    		   });
	     		modalInstance.result.then(function (){
	       	    	uncheckSelectedBox();
	       	       },function (){
	       	    	   uncheckSelectedBox();
	       	    });
		      			   
	       	    function uncheckSelectedBox(){
	       	    	angular.forEach(scope.plansData,function(value,key){
	       	    		if(value.planId == priceData.planId){
	       	    			scope.plansData[key].pricingData[index].isCheck = 'no';
	       	    		} 
	       	    	});
	       	    	$log.info('Modal dismissed at: ' + new Date());
	       	    };
	     	}else{
	    	   if(priceData.isCheck == 'no'){
	    		   if(scope.previewCheckoutList.length != 0){
	    			   scope.totalAmount -= priceData.price;
	    		   }
	    		   scope.previewCheckoutList = scope.previewCheckoutList.filter(function( obj ) {
	    			   		return obj.id != priceData.id;
		   		   });
	    	   }else if(priceData.isCheck=='yes'){
	    		   
	    		   var modalInstance = $modal.open({
	      			   templateUrl: 'viewcontractperiods.html',
	      			   controller: ViewContractPeriodsPopupController,
	      			   resolve:{
	      				 priceData : function(){
	      					   return priceData;
	      				   }
	      			   }
	      		   });
	      		   modalInstance.result.then(function (array) {
	      			   
	      			 angular.forEach(scope.plansData,function(value,key){
	      				if(value.planId == priceData.planId){
	      					scope.plansData[key].pricingData[index].contractId = array[0];
	      					scope.plansData[key].pricingData[index].contractPeriod = array[1];
	      				} 
	      			 });
	      		   }, function () {
	      			   
	      			  angular.forEach(scope.plansData,function(value,key){
		      				if(value.planId == priceData.planId){
		      					scope.plansData[key].pricingData[index].isCheck = 'no';
		      				} 
		      			 });
		      			   $log.info('Modal dismissed at: ' + new Date());
	      		   });
	    	   }
	         }
	       };
	       
	       scope.previewCheckoutList = [];
	       scope.totalAmount = 0;
	       scope.pushCheckoutListFun = function(planId){
	    	   scope.totalAmount = 0;
	    	   angular.forEach(scope.plansData,function(value,key){
	    		   if(value.planId == planId){
	    			   for(var j in value.pricingData){
	    				   if(value.pricingData[j].isCheck=='yes'){
	    					   scope.previewCheckoutList.push(value.pricingData[j]);
	    				   }
	    			   }
	    		   }
	    	   });
	    	   
	    	   scope.previewCheckoutList=_.uniq(scope.previewCheckoutList,function(item,key,id){
	               return item.id;
	           });
	    	   
	    	   angular.forEach(scope.previewCheckoutList,function(value,key){
	    		   scope.totalAmount += value.price;
	    	   });
	       };
	       
	       scope.resetSelectionFun = function(){
	    	   angular.forEach(scope.plansData,function(value,key){
	    			   for(var j in value.pricingData){
	    				   value.pricingData[j].isCheck = 'no';
	    			   }
	    	   });
	    	   scope.previewCheckoutList = [];
	    	   scope.totalAmount = 0;
	       };
	       
	       scope.submitFun = function(){
	    	   localStorageService.add("isAutoRenew",angular.toJson(false));
	    	   localStorageService.add("planType",'N');
				  if(scope.totalAmount != 0 && scope.previewCheckoutList.length !=0){
					  var price = 0;
					  var finalPriceCheckOneByOneFun = function(val){
							 RequestSender.finalPriceCheckingResource.get({priceId:scope.previewCheckoutList[val].id,clientId:scope.clientId,
								 		contractId:scope.previewCheckoutList[val].contractId,paytermCode:scope.previewCheckoutList[val].billingFrequency},function(data){
								 scope.previewCheckoutList[val].finalAmount = data.finalAmount;
								 price += data.finalAmount;
								 if(val == scope.previewCheckoutList.length-1){
									 if(val == 0)
										 localStorageService.add("chargeCodeData",{data:data,billingFrequency:scope.previewCheckoutList[0].billingFrequency});
									 localStorageService.add("plansCheckoutList",scope.previewCheckoutList);
									 location.path( '/paymentprocess/'+scope.screenName+'/0/0/'+price);
								 }else{
									 val += 1;
									 finalPriceCheckOneByOneFun(val);
							 	 }
							 });
						 };finalPriceCheckOneByOneFun(0);
					  
				  }else if(scope.totalAmount == 0 && scope.previewCheckoutList.length !=0){
					  localStorageService.add("plansCheckoutList",scope.previewCheckoutList);
					  location.path( '/paymentprocess/'+scope.screenName+'/0/0/0');
				  }
					
			};
		  //checkout process code end
	     
	     scope.checkingRecurringStatus = function(autoRenew){
			  
			  if(scope.planId && scope.billingFrequency && scope.priceId && scope.price){
				 
				RequestSender.finalPriceCheckingResource.get({priceId:scope.priceId,clientId:scope.clientId,
																contractId:scope.contractId,paytermCode:scope.billingFrequency},function(data){
				   scope.screenName == "additionalorders" ?
						localStorageService.add("chargeCodeData",{data:data,billingFrequency:scope.billingFrequency}) :
							localStorageService.add("chargeCodeData",{data:data,orderId:scope.selectedOrderId,billingFrequency:scope.billingFrequency});
						
						localStorageService.add("isAutoRenew",angular.toJson(false));
						
						location.path( '/paymentprocess/'+scope.screenName+'/'+scope.planId+'/'+scope.priceId+'/'+data.finalAmount);
			    });
			  }else if(scope.price == 0){
					 localStorageService.add("isAutoRenew",angular.toJson(false));
				  location.path( '/paymentprocess/'+scope.screenName+'/'+scope.planId+'/'+scope.priceId+'/'+scope.price);
			  }
				
			};
};

selfcareApp.controller('MultiroomPostpaidPlansController', ['$scope',
                                              'RequestSender',
                                              'localStorageService',
                                              '$location',
                                              '$modal',
                                              '$route',
                                              'dateFilter',
                                              '$rootScope',
                                              '$log',
                                              MultiroomPostpaidPlansController]);
