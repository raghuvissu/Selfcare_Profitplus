AddEventsController = function(scope,RequestSender,location,localStorageService,modal,rootScope,dateFilter) {
		  
		  scope.vodEventScreen 		= true;
		  scope.eventDetailsPreview = false;
		  scope.isRedirecting 		= false;
		  var encrytionKey 			= selfcareModels.encriptionKey;
		  scope.optlang 			= rootScope.localeLangCode;
		  
		//getting Payment Gateway names from constans.js
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
			
		  
		  var clientData = {};
		  if(rootScope.selfcare_sessionData){
			  scope.clientId = rootScope.selfcare_sessionData.clientId;
			  RequestSender.clientResource.get({clientId: scope.clientId} , function(data) {
				  clientData = data;
				  scope.mediaDetails = [];
				  RequestSender.vodEventsResource.get({'filterType':'ALL','pageNo':0,clientType :clientData.categoryType},function(data){
					  scope.mediaDetails = data.mediaDetails;
				  });
			  });
		  }
		  scope.mediaDatas = [];scope.totalAmount = 0;
		  scope.selectedEventsFun = function(mediaData,active){
			  if(active == true){
				  scope.totalAmount += mediaData.price;
				  scope.mediaDatas.push(mediaData);
			  }
			  else{
				  scope.totalAmount -=mediaData.price;
				  for(var i in scope.mediaDatas){
					  if(scope.mediaDatas[i].mediaId == mediaData.mediaId && scope.mediaDatas[i].quality == mediaData.quality &&
                      	   scope.mediaDatas[i].optType == mediaData.optType && scope.mediaDatas[i].price == mediaData.price &&
                      	   scope.mediaDatas[i].eventId == mediaData.eventId && scope.mediaDatas[i].mediaTitle == mediaData.mediaTitle){
						  scope.mediaDatas.splice(i,1);
					  }
				  }
			  }
		  };
	      
	  function pgFun (){
			  scope.paymentgatewayDatas = [];
			  RequestSender.paymentGatewayConfigResource.get(function(data) {
					  for(var i in data.globalConfiguration){
						   if(data.globalConfiguration[i].enabled && data.globalConfiguration[i].name != 'is-paypal-for-ios'  
							   && data.globalConfiguration[i].name != 'is-paypal' && data.globalConfiguration[i].name != 'paypal-recurring-payment-details'){
							   scope.paymentgatewayDatas.push(data.globalConfiguration[i]);
						   }
					  }
					 scope.paymentGatewayName = scope.paymentgatewayDatas.length>=1 ?scope.paymentgatewayDatas[0].name :"";
					 scope.paymentGatewayFun(scope.paymentGatewayName);
			  });
	  }
	  
	  scope.checkOutFun = function(){
		  
		  if(scope.mediaDatas.length != 0){
			  scope.vodEventScreen = !(scope.eventDetailsPreview = true);
			  localStorageService.add("storageData",{clientData:clientData,eventData:scope.mediaDatas});
			  pgFun();
			    
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
		  
	  var hostName = selfcareModels.selfcareAppUrl,screenName = 'vod';
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
		 switch(paymentGatewayName){
				case dalpayPG :
						var url = paymentGatewayValues.url+'?mer_id='+paymentGatewayValues.merchantId+'&pageid='+paymentGatewayValues.pageId+'&item1_qty=1&num_items='+scope.mediaDatas.length;
					scope.paymentURL =  url+"&cust_name="+clientData.displayName+"&cust_phone="+clientData.phone+"&cust_email="+clientData.email+"&cust_state="+clientData.state+""+				
					  	"&cust_address1="+clientData.addressNo+"&cust_zip="+clientData.zip+"&cust_city="+clientData.state+"&item1_desc=AddingEvents&item1_price="+scope.totalAmount+"" + 	  				
					  	"&user1="+scope.clientId+"&user2="+hostName+"&user3=orderbookingscreen/"+screenName+"/"+scope.clientId+"/0/0";
						break;
						
				case kortaPG :
					
					var planData = {id:0,planCode:"Adding Events"};
					var kortaStorageData = {clientData :clientData,planId:0,planData : planData,screenName :screenName,paymentGatewayValues:paymentGatewayValues};	
					var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(kortaStorageData)),encrytionKey).toString();
					
					if(clientData.selfcare.token != null && clientData.selfcare.token != "") 
						scope.paymentURL = "#/kortatokenintegration/"+scope.totalAmount+"?key="+encryptedData;		    		 
					else scope.paymentURL = "#/kortaintegration/"+scope.totalAmount+"?key="+encryptedData;	    		
					break;
						
				case paypalPG :
					
					localStorageService.add("N_PaypalData",{clientId:scope.clientId,screenName :screenName,planId: 0,priceId:0});
					scope.paymentURL = paymentGatewayValues.paypalUrl+'='+paymentGatewayValues.paypalEmailId+"&item_name=addingevents&amount="+scope.totalAmount+"" +	  	  				
					  	  "&custom="+hostName;
						break;
						
				case globalpayPG :
					
				    var globalpayStorageData = {clientData :clientData,planId:0,screenName :screenName,price :scope.totalAmount,
							 priceId : 0, globalpayMerchantId:paymentGatewayValues.merchantId};	
				    var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(globalpayStorageData)),encrytionKey).toString();
					
					scope.paymentURL = "#/globalpayintegration?key="+encryptedData;
					break;
				case netellerPG :
					
					var nettellerData = {currency:selfcareModels.netellerCurrencyType,total_amount:scope.totalAmount,screenName:screenName};
					var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(nettellerData)),encrytionKey).toString();
					
					scope.paymentURL = "#/neteller/"+scope.clientId+"?key="+encryptedData;
					break;
					
				case internalPaymentPG :
					
					localStorageService.add("internalStorageData",{"email":clientData.email,"currency":clientData.currency});
					scope.paymentURL =  "#/internalpayment/"+screenName+"/"+scope.clientId+"/0/0/"+scope.totalAmount;
					break;
					
				case two_checkoutPG :
					
					localStorageService.add("twoCheckoutStorageData",{screenName:screenName,clientId:scope.clientId,
																		planId:0,priceId:0});
					var zipCode = clientData.zip || clientData.city || "";
					scope.paymentURL =  paymentGatewayValues.url+"?sid="+paymentGatewayValues.sid+"&mode=2CO&li_0_type=product&li_0_name=Adding Event/s&li_0_price="+scope.totalAmount
										+"&card_holder_name="+clientData.displayName+"&street_address="+clientData.addressNo+"&city="+clientData.city+"&state="+clientData.state+"&zip="+zipCode
										+"&country="+clientData.country+"&phone="+clientData.phone+"&email="+clientData.email+"&quantity=1";
					
					break;
					
				case interswitchPG :
					
					scope.paymentURL =  "#/interswitchintegration/"+screenName+"/"+scope.clientId+"/0/0/"+scope.totalAmount+"/"+paymentGatewayValues.productId+"/"+paymentGatewayValues.payItemId;
					
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

					var evoData = {screenName:screenName,planId:0,priceId:0,price:scope.totalAmount,
								clientId:clientData.id,email:clientData.email};
					var userData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(evoData)),selfcareModels.encriptionKey).toString();


					var json = { clientId : clientData.id, RefNr : scope.transactionId,amount : scope.totalAmount,obsCl:locationOrigin,
							OrderDesc : "Adding Events",UserData : userData,origin : appURL,merchantId : paymentGatewayValues.merchantId};

					RequestSender.evoPaymentResource.save(json,function(returnData){
					
						var successData = {data:returnData.map.blowfishData,len:returnData.map.len,amount : scope.totalAmount,
								clientData : clientData,planCode : "Adding Events",merchantId : paymentGatewayValues.merchantId,numOfItems:scope.mediaDatas.length};
						var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(successData)),selfcareModels.encriptionKey).toString();
						scope.paymentURL = "#/evointegration?key="+encryptedData;
					});
					
					break;
					
			   case autherizeNetPG :
					console.log(scope.totalAmount);
					localStorageService.add("AuthorizeData",{clientId:scope.clientId,screenName :screenName,planId:0,
						priceId:0,price:scope.totalAmount,clientData:clientData,planCode:"Adding Events"});
					RequestSender.getAuthorizedHash.get({amount: scope.totalAmount},function(data){
						console.log(data);
						localStorageService.add('hashdata',data);
					});
					scope.paymentURL = "#/authorize";
					break;			
					
				default :
							break;
				}
			    	  		 	
			  };
			  
		   scope.subscribeBtnFun =function(){
			   localStorageService.add("storageData",{clientData:clientData,eventData:scope.mediaDatas});
			   location.path("/orderbookingscreen/"+screenName+"/"+scope.clientId+"/0/amountZero");
		    };
	    
		  scope.cancelBtnFun = function(){
			  scope.vodEventScreen =  !(scope.eventDetailsPreview = false);
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
		    	    	$scope.termsAndConditionsText = autherizeNet[termsAndConditions]    : $scope.termsAndConditionsText = selectOnePaymentGatewayText[scope.optlang];
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
    
selfcareApp.controller('AddEventsController', ['$scope',
                                               'RequestSender',
                                               '$location',
                                               'localStorageService',
                                               '$modal',
                                               '$rootScope',
                                               'dateFilter',
                                               AddEventsController]);
