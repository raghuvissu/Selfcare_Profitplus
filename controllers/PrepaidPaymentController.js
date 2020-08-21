PrepaidPaymentController = function(scope,routeParams,RequestSender,localStorageService,location,modal,rootScope,dateFilter){
	
	
	//getting Payment Gateway names form constants.js
	var   kortaPG			=  paymentGatewayNames.korta || "",
		  dalpayPG			=  paymentGatewayNames.dalpay || "",
		  globalpayPG		=  paymentGatewayNames.globalpay || "",
		  paypalPG			=  paymentGatewayNames.paypal || "",
		  netellerPG		=  paymentGatewayNames.neteller || "",
		  internalPaymentPG	=  paymentGatewayNames.internalPayment || "",
		  two_checkoutPG	=  paymentGatewayNames.two_checkout || "",
		  interswitchPG		=  paymentGatewayNames.interswitch || "",
		  evoPG				=  paymentGatewayNames.evo || "",
		  autherizeNetPG	=  paymentGatewayNames.autherizeNet || "",
	          worldpayPG  =  paymentGatewayNames.worldpay || "";
		  //echeckPG          =  paymentGatewayNames.echeck || "";
		  
	 scope.optlang 			=  rootScope.localeLangCode;
	 var encrytionKey 		=  selfcareModels.encriptionKey;
	 scope.formData = {};
	
	rootScope.selfcare_sessionData ? scope.clientId = rootScope.selfcare_sessionData.clientId : null;
	scope.amountEmpty 		= true;
	//scope.isRedirecting 	= false;
	
	var statementsPayData   = localStorageService.get("statementsPayData") || "";
	if(statementsPayData){
		scope.payInvoice = statementsPayData[0];
		scope.amount = statementsPayData[1];
		scope.id = statementsPayData[2];
		localStorageService.add("StatementId",scope.id);
	}
	var depositPayData   = localStorageService.get("depositsPayData") || "";
	if(depositPayData){
		scope.payDeposit = depositPayData[0];
		scope.amount = depositPayData[1];
		scope.id = depositPayData[2];
	}
	scope.onlinePayAmount = localStorageService.get("onlinePayAmount") || "";
	localStorageService.remove("onlinePayAmount");
	if(scope.onlinePayAmount){
		if(scope.onlinePayAmount > 0)scope.amount = scope.onlinePayAmount;
	}
	var clientData			= {};
	if(scope.clientId){
	 RequestSender.clientResource.get({clientId: scope.clientId} , function(data) {
		clientData = data;
		scope.currencyCode = clientData.currency;
		scope.paymentgatewayDatas = [];
		
		//scope.isAutoBilling 	= clientData.selfcare.isAutoBilling == 'Y'? "true":"false";
	     //scope.formData.isautobilling  	= "true";
        //scope.formData.isautobilling  	= scope.isAutoBilling;

		
		
		RequestSender.paymentGatewayConfigResource.get(function(data) {
		  for(var i in data.globalConfiguration){
			   if(data.globalConfiguration[i].enabled && data.globalConfiguration[i].name != 'is-paypal-for-ios'  
				   && data.globalConfiguration[i].name != 'is-paypal' && data.globalConfiguration[i].name != 'paypal-recurring-payment-details'){
				   scope.paymentgatewayDatas.push(data.globalConfiguration[i]);
			   }
		  }
		  scope.paymentgatewayDatas.length==0 ?scope.paymentGatewayName="" : "";
		  if(statementsPayData){
				scope.amountFieldFun(statementsPayData[1]);
			}
		  if(depositPayData){
				scope.amountFieldFun(depositPayData[1]);
			}
	   });
	  });
	}
	
	//this function calls when comeout from amount field
	scope.planData			= {};
	scope.fromsource= localStorageService.get("fromsource");
	scope.amountFieldFun = function(amount){
		if(amount){
			if(amount<=0 || isNaN(amount)){
				scope.amountEmpty = true;
				delete scope.planData.price;
				delete scope.planData.planCode;
				delete scope.planData.id;
				delete scope.amount;
				delete scope.fromsource;
				if(amount <=0)alert("Amount Must be Greater than Zero");
				if(isNaN(amount))alert("Please enter digits only");
			}/*else if(amount > scope.onlinePayAmount && statementsPayData == "" && depositPayData == ""){
				alert("Amount Must be Less than or equal to AvailableBalanceAmount");
			}*/
			else{
				scope.amountEmpty 		= false;
				scope.planData.price 	= amount;
				scope.planData.planCode = 'Online Payment';
				scope.planData.id 		= 0;
				scope.paymentGatewayName = scope.paymentgatewayDatas.length>=1 ?scope.paymentgatewayDatas[0].name :"";
				scope.paymentGatewayFun(scope.paymentGatewayName);
			}
		}else{
			scope.amountEmpty 		= true;
			delete scope.planData.price;delete scope.planData.planCode;delete scope.planData.id;delete scope.amount;
			if(amount==0) alert("Amount Must be Greater than Zero");
		}
	};
	
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
	
	//this fun call when user select a particular PW 
	var hostName = selfcareModels.selfcareAppUrl;var screenName = "payment";
	scope.paymentGatewayFun  = function(paymentGatewayName){
			  localStorageService.remove("N_PaypalData");
			  scope.paymentGatewayName = paymentGatewayName;
			  scope.termsAndConditions = false;
			  var paymentGatewayValues = {};
			  for (var i in scope.paymentgatewayDatas){
			    if(scope.paymentgatewayDatas[i].name==paymentGatewayName && scope.paymentgatewayDatas[i].name !='internalPayment'){
				  paymentGatewayValues =  angular.fromJson(scope.paymentgatewayDatas[i].value);
				  break;
			    }
				  
			  }
			  
			/*  scope.isShowAutoBilling = "false";
			  if(scope.isAutoBilling=="false" && paymentGatewayName=='evo'){
				  scope.isShowAutoBilling = "true";
			  }
			  */
	     switch(paymentGatewayName){
	     
			case dalpayPG :
					var url = paymentGatewayValues.url+'?mer_id='+paymentGatewayValues.merchantId+'&pageid='+paymentGatewayValues.pageId+'&item1_qty=1&num_items=1';
				scope.paymentURL =  url+"&cust_name="+clientData.displayName+"&cust_phone="+clientData.phone+"&cust_email="+clientData.email+"&cust_state="+clientData.state+""+				
				  	"&cust_address1="+clientData.addressNo+"&cust_zip="+clientData.zip+"&cust_city="+clientData.state+"&item1_desc="+scope.planData.planCode+"&item1_price="+scope.planData.price+"" + 	  				
				  	"&user1="+scope.clientId+"&user2="+hostName+"&user3=orderbookingscreen/"+screenName+"/"+scope.clientId+"/0/0";
					break;
					
			case kortaPG :
				
			    var kortaStorageData = {clientData :clientData,planId:0,planData : scope.planData,screenName :screenName,paymentGatewayValues:paymentGatewayValues};	
				var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(kortaStorageData)),encrytionKey).toString();
				
				if(clientData.selfcare.token != null && clientData.selfcare.token != "") 
					scope.paymentURL = "#/kortatokenintegration/"+scope.planData.price+"?key="+encryptedData;		    		 
				else scope.paymentURL = "#/kortaintegration/"+scope.planData.price+"?key="+encryptedData;	    		
				break;
					
			case paypalPG :
				
				/*var query = {clientId :scope.clientId,returnUrl:hostName,screenName :screenName};*/
				localStorageService.add("N_PaypalData",{clientId:scope.clientId,screenName :screenName});
				scope.paymentURL = paymentGatewayValues.paypalUrl+'='+paymentGatewayValues.paypalEmailId+"&item_name="+scope.planData.planCode+"&amount="+scope.planData.price+"" +	  	  				
				  	  "&custom="+hostName;
					break;
					
			case globalpayPG :
				
				var globalpayStorageData = {clientData :clientData,planId:0,screenName :screenName,price :scope.planData.price,
											 priceId : 0, globalpayMerchantId:paymentGatewayValues.merchantId};	
				var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(globalpayStorageData)),encrytionKey).toString();
				
				scope.paymentURL = "#/globalpayintegration?key="+encryptedData;
				break;
				
			case netellerPG :
				
				var nettellerData = {currency:selfcareModels.netellerCurrencyType,total_amount:scope.planData.price,screenName:screenName};
				var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(nettellerData)),encrytionKey).toString();
				
				scope.paymentURL = "#/neteller/"+scope.clientId+"?key="+encryptedData;
				break;
				
			case internalPaymentPG :
				localStorageService.add("internalStorageData",{"email":clientData.email,"currency":clientData.currency});
				scope.paymentURL =  "#/internalpayment/"+screenName+"/"+scope.clientId+"/0/0/"+scope.planData.price;
				break;
				
			case two_checkoutPG :
				
				localStorageService.add("twoCheckoutStorageData",{screenName:"payment",clientId:scope.clientId,
				 											planId:0,priceId:0});
				var zipCode = clientData.zip || clientData.city || "";
				scope.paymentURL =  paymentGatewayValues.url+"?sid="+paymentGatewayValues.sid+"&mode=2CO&li_0_type=product&li_0_name=online payment&li_0_price="+scope.planData.price
									+"&card_holder_name="+clientData.displayName+"&street_address="+clientData.addressNo+"&city="+clientData.city+"&state="+clientData.state+"&zip="+zipCode
									+"&country="+clientData.country+"&phone="+clientData.phone+"&email="+clientData.email+"&quantity=1";
				
				break;
				
			case interswitchPG :
				
				scope.paymentURL =  "#/interswitchintegration/"+screenName+"/"+scope.clientId+"/0/0/"+scope.planData.price+"/"+paymentGatewayValues.productId+"/"+paymentGatewayValues.payItemId;
				
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
					
					if(depositPayData){
						scope.depositDistributions = [{
		    				depositId : depositPayData[2],
		    				amount    : depositPayData[1],
							clientId  : clientData.id,
							locale    : scope.optlang
		    			}];
						scope.paymentType = "Deposit";
					}else{
						//scope.paymentType = "";
						scope.depositDistributions = [];
					}
					
					if(statementsPayData){
						scope.statmentId = statementsPayData[2];
					}else{
						scope.statmentId = null;
					}
					
					//scope.processevofun = function(){
						var evoData = {screenName:screenName,planId:0,priceId:0,price:scope.planData.price,
								clientId:clientData.id,email:clientData.email,locale : scope.optlang,depositDistributions: scope.depositDistributions,
								paymentType : scope.paymentType, isautobilling:scope.formData.isautobilling,statmentId:scope.statmentId};
						//var userData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(evoData)),selfcareModels.encriptionKey).toString();
						var userData = evoData;

						var json = { clientId : clientData.id, RefNr : scope.transactionId,amount : scope.planData.price,obsCl:locationOrigin,
								OrderDesc : scope.planData.planCode,UserData : userData,origin : appURL,merchantId : paymentGatewayValues.merchantId,RTF : "",AccVerify : ""};
						
						RequestSender.evoPaymentResource.save(json,function(returnData){
							var data123 = angular.fromJson(returnData);
							console.log(data123);
							console.log(typeof(data123));
						  	var successData = {data:returnData.map.blowfishData,len:returnData.map.len,amount : scope.planData.price,
									clientData : clientData,planCode : scope.planData.planCode,merchantId : paymentGatewayValues.merchantId};
							var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(successData)),selfcareModels.encriptionKey).toString();
							scope.paymentURL = "#/evointegration?key="+encryptedData;
						});				
					//};
              
					/*scope.proceedevoupdateFun = function(value) {
						//if(value=="invoicingPay"){
						RequestSender.updateKortaToken.update({clientId : scope.clientId}, {isautobilling : scope.formData.isautobilling}, function(data) {
							console.log(data);
							console.log("fun:"+scope.formData.isautobilling);
							if(scope.formData.isautobilling=="true"){
								scope.RTF = 'I';
							}else{
								scope.RTF = "";
							}
							scope.processevofun();
						});	
						//}else{
						//	scope.processevofun();
						//}
					};
					scope.proceedevoupdateFun();*/
				
				break;
				
			case autherizeNetPG :
				localStorageService.add("AuthorizeData",{clientId:scope.clientId,screenName :screenName});
				RequestSender.getAuthorizedHash.get({amount: scope.planData.price},function(data){
					localStorageService.add('hashdata',data);
				});
				scope.paymentURL = "#/authorize";
				break;

			case worldpayPG :
				//alert(screenName);
			var authorized='N';
	        	scope.authorized=authorized;
	        	console.log(screenName);
	        	localStorageService.add("worlpayData",{clientId:scope.clientId,screenName :screenName,amount: scope.amount,authorized:scope.authorized});
				scope.paymentURL = "#/worldpay";
				console.log(scope.paymentURL);
				break;
				
			/*case echeckPG :
				localStorageService.add("echeckPGData",{screenName:screenName,planId:0,priceId:0,price:scope.planData.price,
					clientId:clientData.id,locale:scope.optlang,currency:scope.currencyCode});
				scope.paymentURL = "#/echeckpayment";
		    
		    break;*/	
					
			default : break;
			}
		    	  		 	
		  };
		  
		  /*scope.proceedToUpdate = function() {
				RequestSender.updateKortaToken.update({clientId : scope.clientId}, {isautobilling : scope.isAutoBilling}, function(data) {
					rootScope.goBack();
				});		
		   };*/
		  
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
    	    	$scope.termsAndConditionsText = autherizeNet[termsAndConditions]	: $scope.termsAndConditionsText = selectOnePaymentGatewayText[scope.optlang];
    	    	//$scope.termsAndConditionsText = echeck[termsAndConditions]	        : (scope.paymentGatewayName == echeckPG)?
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
    
    
};

selfcareApp.controller("PrepaidPaymentController",['$scope',
                                                   '$routeParams',
                                                   'RequestSender',
                                                   'localStorageService',
                                                   '$location',
                                                   '$modal',
                                                   '$rootScope',
                                                   'dateFilter',
                                                   PrepaidPaymentController]);
