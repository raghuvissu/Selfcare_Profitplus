PaymentProcessController = function(scope,routeParams,RequestSender,localStorageService,location,modal,rootScope,dateFilter,log){
	
	scope.screenName 		= routeParams.screenName;
	scope.planId 			= routeParams.planId;
	scope.priceId	 		= routeParams.priceId;
	scope.price		 	 	= routeParams.price;
	var encrytionKey 		= selfcareModels.encriptionKey;
	scope.isRedirecting 	= false;
	scope.formData 			= {};
	
	//getting Payment Gateway names from constants.js
	var  kortaPG			=	paymentGatewayNames.korta || "",
		 dalpayPG			=	paymentGatewayNames.dalpay || "",
	     globalpayPG		=	paymentGatewayNames.globalpay || "",
		 paypalPG			=	paymentGatewayNames.paypal || "",
		 netellerPG			=	paymentGatewayNames.neteller || "",
		 internalPaymentPG	=	paymentGatewayNames.internalPayment || "",
		 two_checkoutPG		=	paymentGatewayNames.two_checkout || "",
		 interswitchPG		=   paymentGatewayNames.interswitch || "",
		 evoPG				=	paymentGatewayNames.evo || "";
	     autherizeNetPG		=	paymentGatewayNames.autherizeNet || "";
	     echeckPG          =  paymentGatewayNames.echeck || "";
	     worldpayPG  =  paymentGatewayNames.worldpay || "";
	
	//getting locale value
	 scope.optlang 			= rootScope.localeLangCode;
	
	var storageData			= localStorageService.get("storageData") ||"";
	var clientData 			= storageData.clientData;
	var totalOrdersData		= storageData.totalOrdersData;
	var orderId				= storageData.orderId || 0;
	scope.clientId			= clientData.id;
	var chargeCodeData 		= localStorageService.get("chargeCodeData")||"";
	var isAutoRenew 		= localStorageService.get("isAutoRenew") || "";
	scope.planType 			= localStorageService.get("planType") || "";
	
	console.log(isAutoRenew)
	
	if(scope.screenName != 'additionalorders'){
		for(var i in totalOrdersData){
			if(totalOrdersData[i].planId == scope.planId){
				for(var j in totalOrdersData[i].pricingData){
					if(totalOrdersData[i].pricingData[j].id == scope.priceId){
						scope.planData = totalOrdersData[i].pricingData[j] || {};
						if(scope.planData.isPrepaid == 'N'){
							var contractsData = localStorageService.get("contractsData");
							if(contractsData){
								scope.planData.contractId = contractsData.contractId;
								scope.contractPeriod	  = contractsData.contractPeriod;
							}
						}
						break;
					}
				}
			  break;
			}
		}
	}else if(scope.screenName == 'additionalorders'){
		scope.plansData = [];scope.actualPlansPrice = 0 ;scope.finalPlansPrice = 0;
		scope.plansData = localStorageService.get("plansCheckoutList") || "";
		if(scope.plansData.length == 1){
			scope.planData = scope.plansData[0];
			scope.planData.price = scope.price;
			/*scope.actualPlansPrice = scope.plansData[0].price;
			scope.finalPlansPrice = scope.plansData[0].finalAmount;*/
			scope.actualPlansPrice = scope.price;
			scope.finalPlansPrice = scope.price;
		}else if(scope.plansData.length > 1){
			scope.planData = {id:0,planCode:'Adding Plans'};
			isAutoRenew = 'false';
			angular.forEach(scope.plansData,function(value,key){
				scope.actualPlansPrice += value.price;
				scope.finalPlansPrice += value.finalAmount;
			});
		}
	}
	
	/*scope.deleteSelectionPlan = function(id){
		angular.forEach(scope.plansData,function(value,key){
			if(value.id == id){
				scope.plansData.splice(key,1);
				scope.actualPlansPrice -= value.price;
				scope.finalPlansPrice -= value.finalAmount;
				scope.price -=value.finalAmount;
				localStorageService.add("plansCheckoutList",scope.plansData);
				if(scope.plansData.length > 1) isAutoRenew = 'false';
				else if(scope.plansData.length == 1){
					isAutoRenew 		= localStorageService.get("isAutoRenew");
				}
				scope.paymentGatewayFun(scope.paymentGatewayName);
			}
		});
	 };*/
		
	   if(clientData){
		 if(scope.price != 0){
		  scope.paymentgatewayDatas = [];
		   RequestSender.paymentGatewayConfigResource.get(function(data) {
			  if(data.globalConfiguration){
				  for(var i in data.globalConfiguration){
					   if(data.globalConfiguration[i].enabled && data.globalConfiguration[i].name != 'is-paypal-for-ios'  
						   && data.globalConfiguration[i].name != 'is-paypal'&& data.globalConfiguration[i].name != 'paypal-recurring-payment-details'){
						   scope.paymentgatewayDatas.push(data.globalConfiguration[i]);
					   }
				  }
				 scope.paymentGatewayName = scope.paymentgatewayDatas.length>=1 ?scope.paymentgatewayDatas[0].name :"";
				 scope.paymentGatewayFun(scope.paymentGatewayName);
			  }
		   });
		 }
		}
	
	   var randomFun = function() {
			var chars = "0123456789";
			var string_length = 6;
			var randomstring = dateFilter(new Date(),'yyMMddHHmmss');
			
			for (var i=0; i<string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum,rnum+1);	
			}	
			scope.transactionId = randomstring;
			
		};randomFun();
		
	var hostName = selfcareModels.selfcareAppUrl;
	
	   scope.paymentGatewayFun  = function(paymentGatewayName){
		   localStorageService.remove("N_PaypalData");
		   scope.errorRecurring = "";
		   scope.paymentGatewayName = paymentGatewayName;
			  scope.termsAndConditions = false;
			  var paymentGatewayValues = {};
			  for (var i in scope.paymentgatewayDatas){
			    if(scope.paymentgatewayDatas[i].name==paymentGatewayName && scope.paymentgatewayDatas[i].name !='internalPayment'){
				  paymentGatewayValues =  angular.fromJson(scope.paymentgatewayDatas[i].value);
				  break;
			    }
				  
			  }
	     switch(paymentGatewayName){
	     
			case dalpayPG :
					var url = paymentGatewayValues.url+'?mer_id='+paymentGatewayValues.merchantId+'&pageid='+paymentGatewayValues.pageId+'&item1_qty=1&num_items=1';
				scope.paymentURL =  url+"&cust_name="+clientData.displayName+"&cust_phone="+clientData.phone+"&cust_email="+clientData.email+"&cust_state="+clientData.state+""+				
				  	"&cust_address1="+clientData.addressNo+"&cust_zip="+clientData.zip+"&cust_city="+clientData.state+"&item1_desc="+scope.planData.planCode+"&item1_price="+scope.price+"" + 	  				
				  	"&user1="+scope.clientId+"&user2="+hostName+"&user3=orderbookingscreen/"+scope.screenName+"/"+scope.clientId+"/"+scope.planId+"/"+scope.priceId;
					break;
					
			case kortaPG :
				
			    var kortaStorageData = {clientData :clientData,planId:scope.planId,planData : scope.planData,screenName :scope.screenName,paymentGatewayValues:paymentGatewayValues};	
				var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(kortaStorageData)),encrytionKey).toString();
				
				if(clientData.selfcare.token != null && clientData.selfcare.token != "")
					scope.paymentURL = "#/kortatokenintegration/"+scope.price+"?key="+encryptedData;		    		 
				else scope.paymentURL = "#/kortaintegration/"+scope.price+"?key="+encryptedData;	    		
				break;
					
			case paypalPG :
				
				console.log(angular.fromJson(isAutoRenew));
				if(angular.fromJson(isAutoRenew)){
						 /*if(srtCountCheckingFun(chargeCodeData.data)<=1) 
							 scope.errorRecurring = "error.msg.paypal.recurring.notpossible"; 
						 else{*/
						   var paypalStorageData = {screenName:scope.screenName,clientId:scope.clientId,planId:scope.planId,priceId:scope.priceId,
								   	price:scope.price,paypalEmailId:paymentGatewayValues.paypalEmailId,contractId:scope.planData.contractId,
								   	chargeCodeData : chargeCodeData};
						   var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(paypalStorageData)),encrytionKey).toString();
							 scope.paymentURL = "#/paypalrecurring?key="+encryptedData;
						 //}
				}else{
					
						/*var query = {clientId :scope.clientId,planId: planId,screenName:scope.screenName,priceDataId:scope.priceId};*/
						localStorageService.add("N_PaypalData",{clientId:scope.clientId,screenName :scope.screenName,planId: scope.planId,priceId:scope.priceId});
						scope.paymentURL = paymentGatewayValues.paypalUrl+'='+paymentGatewayValues.paypalEmailId+"&item_name="+scope.planData.planCode+"&amount="+scope.price+"" +	  	  				
						  	  "&custom="+hostName;
				}
				break;
					
			case globalpayPG :
				
				var globalpayStorageData = {clientData :clientData,planId:scope.planId,screenName :scope.screenName,price :scope.price,
											 priceId : scope.priceId, globalpayMerchantId:paymentGatewayValues.merchantId};	
				var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(globalpayStorageData)),encrytionKey).toString();
				
				scope.paymentURL = "#/globalpayintegration?key="+encryptedData;
				break;
			case netellerPG :
				
				var nettellerData = {currency:selfcareModels.netellerCurrencyType,total_amount:scope.price,
									paytermCode:scope.planData.billingFrequency,planCode : scope.planId,
									contractPeriod : scope.planData.contractId,screenName:scope.screenName};
				var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(nettellerData)),encrytionKey).toString();
				
				scope.paymentURL = "#/neteller/"+scope.clientId+"?key="+encryptedData;
				break;
				
			case internalPaymentPG :
				localStorageService.add("internalStorageData",{"email":clientData.email,"currency":clientData.currency});
				scope.paymentURL =  "#/internalpayment/"+scope.screenName+"/"+scope.clientId+"/"+scope.planId+"/"+scope.priceId+"/"+scope.price;
				break;
				
			case two_checkoutPG :
				
				localStorageService.add("twoCheckoutStorageData",{screenName:scope.screenName,clientId:scope.clientId,
																 	planId:scope.planId,priceId:scope.priceId});
				var zipCode = clientData.zip || clientData.city || "";
				scope.paymentURL =  paymentGatewayValues.url+"?sid="+paymentGatewayValues.sid+"&mode=2CO&li_0_type=product&li_0_name="+scope.planData.planCode+"&li_0_price="+scope.price
									+"&card_holder_name="+clientData.displayName+"&street_address="+clientData.addressNo+"&city="+clientData.city+"&state="+clientData.state+"&zip="+zipCode
									+"&country="+clientData.country+"&phone="+clientData.phone+"&email="+clientData.email+"&quantity=1";
				
				break;
				
			case interswitchPG :
				
				scope.paymentURL =  "#/interswitchintegration/"+scope.screenName+"/"+scope.clientId+"/"+scope.planId+"/"+scope.priceId+"/"+scope.price+"/"+paymentGatewayValues.productId+"/"+paymentGatewayValues.payItemId;
				
				break;case worldpayPG :
					//alert(screenName);
					var authorized='N';
			        	scope.authorized=authorized;
			        	console.log(screenName);
			        	localStorageService.add("worlpayData",{clientId:scope.clientId,screenName :screenName,amount: scope.amount,authorized:scope.authorized});
						scope.paymentURL = "#/worldpay";
						console.log(scope.paymentURL);
						break;
			
			case evoPG :
				
				var appURL	= selfcareModels.selfcareAppUrl;

				var randomFun = function() {
						var chars = "0123456789";
						var string_length = 6;
						var randomstring = dateFilter(new Date(),'yyMMddHHmmss');
						
						for (var i=0; i<string_length; i++) {
							var rnum = Math.floor(Math.random() * chars.length);
							randomstring += chars.substring(rnum,rnum+1);	
						}	
						scope.transactionId = randomstring;
						
					};randomFun();

				var evoData = {screenName:scope.screenName,planId:scope.planId,priceId:scope.priceId,price:scope.planData.price,
							clientId:clientData.id,email:clientData.email};
				var userData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(evoData)),selfcareModels.encriptionKey).toString();


				var json = { clientId : clientData.id, RefNr : scope.transactionId,amount : scope.planData.price,obsCl:locationOrigin,
						OrderDesc : scope.planData.planCode,UserData : userData,origin : appURL,merchantId : paymentGatewayValues.merchantId};

				RequestSender.evoPaymentResource.save(json,function(returnData){
				
					var successData = {data:returnData.map.blowfishData,len:returnData.map.len,amount : scope.planData.price,
							clientData : clientData,planCode : scope.planData.planCode,merchantId : paymentGatewayValues.merchantId};
					var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(successData)),selfcareModels.encriptionKey).toString();
					scope.paymentURL = "#/evointegration?key="+encryptedData;
				});
				
				break;
			case autherizeNetPG :
		
				if(angular.fromJson(isAutoRenew)){				 
					scope.recurringAuthorize(); 			
				} else {
					RequestSender.getRecurringScbcriberIdResource.get({orderId:orderId},function(recurringdata){										
						var recurringData = angular.fromJson(angular.toJson(recurringdata));					 
						var subscriberId = recurringData.subscriberId;					 
						console.log("subId-->"+ subscriberId);			
						if(subscriberId){									
							var paymentFormData = {};					
							if(recurringData.gatewayName == "authorizenet") {				
								paymentFormData.orderId = orderId;					 
								paymentFormData.actionName = "cancel";				 
								paymentFormData.clientId = scope.clientId;					
								paymentFormData.subscriberId = subscriberId;					 
								RequestSender.getRecurringScbcriberIdResource.save({'orderId': orderId},paymentFormData,function(data){				 
									normalCreationFun();				
								});
							} else {												
								alert("Recurring Billing not Implemented for this PaymentGateway: "+ recurringData.gatewayName); }			
						}else normalCreationFun();										
					});

					function normalCreationFun (){
						localStorageService.add("AuthorizeData",{clientId:scope.clientId,screenName :scope.screenName,planId:scope.planId,					 
							priceId:scope.priceId,price:scope.price,clientData:clientData,planCode:scope.planData.planCode});
					
						RequestSender.getAuthorizedHash.get({amount: scope.price},function(data){					 
							console.log(data);					 
							localStorageService.add('hashdata',data);					 
						});					 
						scope.paymentURL = "#/authorize";				
					}	
					
				}			
				break;	
				
				
			case echeckPG :
				localStorageService.add("echeckPGData",{screenName:scope.screenName,planId:scope.planId,priceId:scope.priceId,
					price:scope.price, clientId:scope.clientId});
				scope.paymentURL = "#/echeckpayment";
		    
		    break;
				
			default : break;
			}
		    	  		 	
		  };
		  
		  
		  
		  scope.recurringAuthorize = function(){
			 
			  modal.open({
				  templateUrl: 'recurringauthorize.html',		
				  controller: RecurringAuthorizePopupController,			  
				  resolve:{}			 
			  });			  
		  };
		  
		  var randomFun = function() {		  
			  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";			  
			  var string_length = 5;			 
			  var randomstring = "";
			 
			  for (var i=0; i<string_length; i++) {			 
				  var rnum = Math.floor(Math.random() * chars.length);			  
				  randomstring += chars.substring(rnum,rnum+1);			  
			  }			 
			  return randomstring;		  
		  };


			  
		  var RecurringAuthorizePopupController = function($scope,$modalInstance){			  
			  $scope.formData = {};			  
			  $scope.paymentTypes = ["CreditCard","BankAccount"];
			  
			  $scope.accept = function () {
				  
				  function recurringCreationFun(){			  
					  var recurringName = scope.planData.planCode + "_" + scope.clientId + "_" + scope.planData.chargeCode + "_" + randomFun();			 
					  $scope.formData.payTermCode = scope.planData.billingFrequency;			  
					  $scope.formData.total_amount = scope.price;			  
					  $scope.formData.recurringName = recurringName;			  
					  $scope.formData.clientId = scope.clientId;
					  $scope.formData.locale = "en";
					  $scope.formData.actionName = "create";
		
					  RequestSender.recurringPaymentResource.save({}, $scope.formData, function(data){
						  var resultJson = angular.fromJson(data.resourceIdentifier);
						  $modalInstance.dismiss('cancel');
			  
						  if(angular.uppercase(resultJson.result) == "SUCCESS"){  	
							  localStorageService.add('authorizeProfile',resultJson.subscriberId);
							  location.path("/orderbookingscreen/"+scope.screenName+"/"+scope.clientId+"/"+scope.planId+"/"+scope.priceId).search({paymentType : "authorize"});
						  }else{
							  alert("Failure Reason :"+resultJson.response[0].errorText);
						  }
					  });
				  }

				  if(scope.screenName == "changeorder"){
					  RequestSender.getRecurringScbcriberIdResource.get({orderId:orderId},function(recurringdata){
			 
						  scope.recurringData = angular.fromJson(angular.toJson(recurringdata));
			  
						  scope.subscriberId	= scope.recurringData.subscriberId;
						  console.log("subId-->"+scope.subscriberId);
						  if(scope.subscriberId){
							  $scope.paymentFormData = {};
							  if(scope.recurringData.gatewayName == "authorizenet") {
								  $scope.paymentFormData.orderId = orderId;
								  $scope.paymentFormData.actionName = "cancel";
								  $scope.paymentFormData.clientId = scope.clientId;
								  $scope.paymentFormData.subscriberId = scope.subscriberId;

								  RequestSender.getRecurringScbcriberIdResource.save({'orderId': orderId},$scope.paymentFormData,function(data){
									  recurringCreationFun();
								  });						  
							  } else {
								  alert("Recurring Billing not Implemented for this PaymentGateway: "+ scope.recurringData.gatewayName);
							  }
						  }else recurringCreationFun();				  
					  });
				  }else{
					  recurringCreationFun();
				  }
			  };
			  
			  $scope.close = function () {			 
				  $modalInstance.dismiss('cancel');			  
			  };		  
		  };
		  
    var TermsandConditionsController = function($scope,$modalInstance){
    	var termsAndConditions = "termsAndConditions_"+scope.optlang+"_locale";
    	if(scope.optlang){
    		(scope.paymentGatewayName == kortaPG)?
    			$scope.termsAndConditionsText = korta[termsAndConditions] 	 		: (scope.paymentGatewayName == dalpayPG)?
    			$scope.termsAndConditionsText = dalpay[termsAndConditions] 	 		: (scope.paymentGatewayName == globalpayPG)?
    			$scope.termsAndConditionsText = globalpay[termsAndConditions] 		: (scope.paymentGatewayName == paypalPG)?
    			$scope.termsAndConditionsText = paypal[termsAndConditions] 	 		: (scope.paymentGatewayName == netellerPG)?
    			$scope.termsAndConditionsText = neteller[termsAndConditions] 	 	: (scope.paymentGatewayName == internalPaymentPG)?
    			$scope.termsAndConditionsText = internalPayment[termsAndConditions] : (scope.paymentGatewayName == two_checkoutPG)?
    			$scope.termsAndConditionsText = two_checkout[termsAndConditions]	: (scope.paymentGatewayName == interswitchPG)?
		    	$scope.termsAndConditionsText = interswitch[termsAndConditions]		: (scope.paymentGatewayName == evoPG)?
    	    	$scope.termsAndConditionsText = evo[termsAndConditions]				: (scope.paymentGatewayName == autherizeNetPG)?
    	    	$scope.termsAndConditionsText = autherizeNet[termsAndConditions]	: (scope.paymentGatewayName == echeckPG)?
    	    	$scope.termsAndConditionsText = echeck[termsAndConditions]	       :  $scope.termsAndConditionsText = selectOnePaymentGatewayText[scope.optlang];
    	}
    	$scope.done = function(){
    		$modalInstance.dismiss('cancel');
    	};
    };
   
    scope.termsAndConditionsFun = function(){
		    modal.open({
				 templateUrl: 'termsandconditions.html',
				 controller: TermsandConditionsController,
				 resolve:{}
		    });
    };
    
    function srtCountCheckingFun(chargeCodeData){
    	var contractType = 0, chargeType = 0;
		console.log("contractType**************>"+angular.lowercase(chargeCodeData.contractType));
		console.log("chargeType**************>"+angular.lowercase(chargeCodeData.chargeType));
    			switch (angular.lowercase(chargeCodeData.contractType)) {
							case "month(s)"	: contractType = 30;
											  break;
							case "day(s)"	: contractType = 1;
											  break;
							case "week(s)"	: contractType = 7;
											  break;
							case "year(s)"	: contractType = 365;
											  break;
							default			: break;
					};
				switch (angular.lowercase(chargeCodeData.chargeType)) {
							case "month(s)"	: chargeType = 30;
							  break;
							case "day(s)"	: chargeType = 1;
											  break;
							case "week(s)"	: chargeType = 7;
											  break;
							case "year(s)"	: chargeType = 365;
											  break;
							default			: break;
						};
						console.log("contractType-->"+contractType);
						console.log("contractDuration-->"+chargeCodeData.contractDuration);
						console.log("chargeType-->"+chargeType);
						console.log("chargeDuration-->"+chargeCodeData.chargeDuration);
				return (chargeCodeData.contractDuration * contractType) / (chargeType * chargeCodeData.chargeDuration);
    }
    
};

selfcareApp.controller("PaymentProcessController",['$scope',
                                                   '$routeParams',
                                                   'RequestSender',
                                                   'localStorageService',
                                                   '$location',
                                                   '$modal',
                                                   '$rootScope',
                                                   'dateFilter',
                                                   '$log',
                                                   PaymentProcessController]);