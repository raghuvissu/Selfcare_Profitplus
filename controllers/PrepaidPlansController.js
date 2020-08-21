PrepaidPlansController = function(scope,RequestSender,localStorageService,location,$modal,route,dateFilter,rootScope,$log) {
	
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
	    	 if(scope.planType == 'prepaid'){
	    	   if(priceData.contractId != 0){
	    		   scope.planId 	= planId;				scope.billingFrequency 	= priceData.billingFrequency;
	    		   scope.priceId 	= priceData.id;			scope.price 			= priceData.price;
	    		   
	    	   }else if(priceData.contractId == 0){
	    		   delete scope.priceId;
	    		   alert("Contract Id is '0',Please Choose another.....");
	    	   }
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
       scope.ordertype = function(name){
    	   console.log(name);
    		   scope.ordertype = name;
    		   console.log( scope.ordertype);
       };
       //checkout process code start
       scope.durationCheckboxSelectionFun = function(priceId,price,isCheck,planId,index){
    	   if(scope.existOrderStatus == 'pending'){
       		   var modalInstance = $modal.open({
      			   templateUrl: 'messagespopup.html',
      			   controller: MessagesPopupController,
      			   resolve:{
      				   planId : function(){
      					   return planId;
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
       	    		if(value.planId == planId){
       	    			scope.plansData[key].pricingData[index].isCheck = 'no';
       	    		} 
       	    	});
       	    	$log.info('Modal dismissed at: ' + new Date());
       	    };
       	  }else{
	    	   if(isCheck == 'no'){
	    		   if(scope.previewCheckoutList.length != 0){
	    			   scope.totalAmount -= price;
	    		   }
	    		   scope.previewCheckoutList = scope.previewCheckoutList.filter(function( obj ) {
	    			   			return obj.id != priceId;
	   				});
	    	   }
       	  }
       };
       
       scope.previewCheckoutList = [];scope.totalAmount = 0;
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
       
       //checkbox change
       scope.checkboxSelection = function(position, pricingData) {
    	   scope.showhideprop = true;
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
    	 
    	 scope.autoRenewBtnFun = function(autoRenewBtn){
    		 scope.autoRenewBtn = autoRenewBtn;
    		 console.log(autoRenewBtn);
    	 }
       scope.submitFun = function(){
    	   
    	   localStorageService.add("isAutoRenew",scope.autoRenewBtn);
    	   localStorageService.add("planType",'Y');
    	   localStorageService.add("bookingCount",1);
			  if(scope.totalAmount != 0 && scope.previewCheckoutList.length !=0){
				  var price = 0;
				  var finalPriceCheckOneByOneFun = function(val){
						 RequestSender.finalPriceCheckingResource.get({priceId:scope.previewCheckoutList[val].id,clientId:scope.clientId},function(data){
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
				 
				RequestSender.finalPriceCheckingResource.get({priceId:scope.priceId,clientId:scope.clientId},function(data){
				   scope.screenName == "additionalorders" ?
						localStorageService.add("chargeCodeData",{data:data,billingFrequency:scope.billingFrequency}) :
							localStorageService.add("chargeCodeData",{data:data,orderId:scope.selectedOrderId,billingFrequency:scope.billingFrequency});
						
				   (scope.screenName == "renewalorder") ?
							localStorageService.add("isAutoRenew",scope.orderRenew):
								localStorageService.add("isAutoRenew",autoRenew);
				   
						location.path( '/paymentprocess/'+scope.screenName+'/'+scope.planId+'/'+scope.priceId+'/'+data.finalAmount);
			    });
			  }else if(scope.price == 0){
				  (scope.screenName == "renewalorder") ?
							localStorageService.add("isAutoRenew",scope.orderRenew):
								localStorageService.add("isAutoRenew",autoRenew);
							
				  location.path( '/paymentprocess/'+scope.screenName+'/'+scope.planId+'/'+scope.priceId+'/'+scope.price);
			  }
				
			};
};

selfcareApp.controller('PrepaidPlansController', ['$scope',
                                              'RequestSender',
                                              'localStorageService',
                                              '$location',
                                              '$modal',
                                              '$route',
                                              'dateFilter',
                                              '$rootScope',
                                              '$log',
                                              PrepaidPlansController]);
