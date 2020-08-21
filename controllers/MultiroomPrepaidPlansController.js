 MultiroomPrepaidPlansController = function(scope,RequestSender,localStorageService,location,$modal,route,dateFilter,rootScope,$log) {
	
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
       
       // no.of connection disply code naaa
       scope.postpaid  ={};
       scope.postpaid.open = true;
       scope.isnow=true;
       scope.variantConnection = false;
       scope.existActiveOrders = 0;
       scope.noOfConnections = 1;
       scope.connectionDatas=[{id:"1",value:"1", isDisabled:false},{id:"2",value:"2",isDisabled:false},
                              {id:"3",value:"3",isDisabled:false},{id:"4",value:"4",isDisabled:false}];
       
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
       //checkout process code start change
       scope.durationCheckboxSelectionFun = function(priceId,price,isCheck,planId,index,parentIndex){
    	  
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
       	    			scope.plansData[key].isCheck = 'no';
       	    			if(scope.plansData[key].pricingData[index].isCheck = 'no')
       	    			scope.plansData[key].isClickedToShowConnections=false;
       	    		} 
       	    	});
       	    	$log.info('Modal dismissed at: ' + new Date());
       	    };
       	  }else{
	    	   if(isCheck == 'no'){
	    		   if(scope.previewCheckoutList.length != 0){
	    			   scope.totalAmount -= scope.plansData[parentIndex].totalPrice;
	    		   }
	    		   scope.previewCheckoutList = scope.previewCheckoutList.filter(function( obj ) {
	    			   			return obj.id != priceId;
	   				});
	    	   }
       	  }
    	   scope.noOfConnections = 1;
    	   
    	   
       };
       
       scope.previewCheckoutList = [];scope.totalAmount = 0;
       scope.pushCheckoutListFun = function(planId){
    	   scope.totalAmount = 0;
    	   angular.forEach(scope.plansData,function(value,key){
    		   if(value.planId == planId){
    			   for(var j in value.pricingData){
    				   if(value.pricingData[j].isCheck=='yes'){
       					   scope.totalAmount += value.totalPrice;
    					   scope.previewCheckoutList.push(value.pricingData[j]);
    				   }
    			   }
    		   }
    	   });
    	   
    	   scope.previewCheckoutList=_.uniq(scope.previewCheckoutList,function(item,key,id){
               return item.id;
           });
    	 //removing all preview orders except last order for multiroom offer
    	   for(var k in scope.previewCheckoutList){
    		   if(scope.previewCheckoutList[k].isCheck == 'no'){
    			   scope.previewCheckoutList.splice(k,1);
    		   }
    	   }
    	       };
    	       scope.default_option ="regular";
		scope.radioTypeSelection = function(name){
			if(name == "multiroom"){
				scope.ordertype= true;
				scope.ordertypevalue= "multiroom";
			}else{
				scope.ordertype= false;
				localStorageService.add("bookingCount",1);
			}
		};
       scope.resetSelectionFun = function(){
    	   angular.forEach(scope.plansData,function(value,key){
    			   for(var j in value.pricingData){
    				   value.pricingData[j].isCheck = 'no';
    				   if(value.pricingData[j].isCheck = 'no')
    					   scope.plansData[key].isClickedToShowConnections=false;
    			   }
    	   });
    	   scope.previewCheckoutList = [];
    	   scope.totalAmount = 0;
       };
       
       //checkbox click naaaaa
       scope.checkboxSelection = function(parentPos,position, pricingData,singlPriceData,planId) {
    	   
    	   scope.ordertype = false;
    	   for(var p in scope.plansData){
     		   for (var c in scope.plansData[p].pricingData){
     			   if(scope.plansData[p].pricingData[c] != scope.plansData[parentPos].pricingData[position]){
     				  scope.plansData[p].pricingData[c].isCheck = "no";
     				 scope.plansData[p].isClickedToShowConnections=false;
     			   }
     		   }
     	   }
    	   // add price and total amount url naaaa
    	   scope.duration = singlPriceData.duration;
    	   scope.billingFrequency = singlPriceData.billingFrequency;
    	   scope.plansData[parentPos].isDeposit = 'no';
    	   RequestSender.orderBookingResource.get({planId:planId,clientId:scope.clientData.id,'payterm': scope.billingFrequency, 'count':scope.plansData[parentPos].pricingData[position].noOfConnections, 'contract':scope.duration} , function(data) {
    		   
    		    scope.plansData[parentPos].connectionPrice = data.price;
      			scope.plansData[parentPos].deposit = data.depositPrice;
      			scope.plansData[parentPos].totalPrice = data.price+data.depositPrice;
      			scope.plansData[parentPos].secondaryPrice = data.secondaryPrice;
      			scope.plansData[parentPos].noOfConnections = data.activeOrders + 1;
      			scope.plansData[parentPos].price = data.price;
      			if(scope.plansData[parentPos].pricingData[position].isCheck=='yes')
      			scope.plansData[parentPos].isClickedToShowConnections=true;
      			if(scope.plansData[parentPos].deposit == 0)
      				scope.plansData[parentPos].isDeposit = 'yes';
      			else
       				scope.plansData[parentPos].isDeposit = 'no';
      			if(scope.plansData[parentPos].noOfConnections >= 1){
					for (var i=1; scope.plansData[parentPos].noOfConnections > i ; i++){
						scope.connectionDatas[i-1].isDisabled=true;
					}
				}
    		  
    	   });
    	   
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
    	 // add price and total amount naaa
    	 scope.changeConnections = function (position,bookingCount,planId) {
    		 console.log("sanjay");
    		 
         	bookingCount=bookingCount-scope.existActiveOrders;
         	scope.plansData[position].isDeposit = 'no';
         		
         		RequestSender.orderBookingResource.get({planId:planId,clientId: scope.clientData.id,'payterm': scope.billingFrequency, 'count':bookingCount, 'contract':scope.duration} , function(data) {
         		   scope.plansData[position].connectionPrice = data.price;
           			scope.plansData[position].deposit = data.depositPrice;
           			scope.plansData[position].totalPrice = data.price+data.depositPrice;
           			scope.plansData[position].secondaryPrice = data.secondaryPrice;
           			if(scope.plansData[position].deposit == 0)
          				scope.plansData[position].isDeposit = 'yes';
           			else
           				scope.plansData[position].isDeposit = 'no';
  					localStorageService.add("bookingCount",bookingCount);
 				});
         };
    	 
    	 scope.autoRenewBtnFun = function(autoRenewBtn){
    		 scope.autoRenewBtn = autoRenewBtn;
    	 };
       scope.submitFun = function(){
    	   localStorageService.add("isAutoRenew",scope.autoRenewBtn);
    	   localStorageService.add("planType",'Y');
			  if(scope.totalAmount != 0 && scope.previewCheckoutList.length !=0){
				  var price = 0;
				  var finalPriceCheckOneByOneFun = function(val){
						 RequestSender.finalPriceCheckingResource.get({priceId:scope.previewCheckoutList[val].id,clientId:scope.clientId},function(data){
							 scope.previewCheckoutList[val].finalAmount = data.finalAmount;
							 //price += data.finalAmount;
							 price += scope.totalAmount;
							 console.log(price)
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
			  }/*else if(scope.price == 0){
				  (scope.screenName == "renewalorder") ?
							localStorageService.add("isAutoRenew",scope.orderRenew):
								localStorageService.add("isAutoRenew",autoRenew);
							
				  location.path( '/paymentprocess/'+scope.screenName+'/'+scope.planId+'/'+scope.priceId+'/'+scope.price);
			  }*/
				
			};
};

selfcareApp.controller('MultiroomPrepaidPlansController', ['$scope',
                                                           'RequestSender',
                                                           'localStorageService',
                                                           '$location',
                                                           '$modal',
                                                           '$route',
                                                           'dateFilter',
                                                           '$rootScope',
                                                           '$log',
                                                           MultiroomPrepaidPlansController]);




