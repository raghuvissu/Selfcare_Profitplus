WorldPayController = function(scope,RequestSender,rootScope,localStorageService,sessionManager,location,$timeout,compile) {
	
		  scope.formData = {};scope.pwdData = {};
		  scope.btnPayName = "Confirm";
		  
		  if(localStorageService.get("statementsPayData")){
		     scope.statementId = localStorageService.get("StatementId");
		  }
		  
		  if(rootScope.selfcare_sessionData){
			RequestSender.clientResource.get({clientId: rootScope.selfcare_sessionData.clientId} , function(data) {
			 // console.log(data);
			  scope.email = data.selfcare.uniqueReference;
			  scope.userName = data.selfcare.userName;
			  scope.password = data.selfcare.password;
			  scope.clientId=data.selfcare.clientId;
			  scope.worldpayData = localStorageService.get('worlpayData');
			  scope.balanceAmount=scope.worldpayData.amount;
			  scope.isSameCard=scope.worldpayData.isSameCard;
			  scope.currency=data.currency;
			  scope.authorized=scope.worldpayData.authorized;
			  scope.formData.auth='N'; 
			  //console.log("default...........auth"+scope.authorized);
			  //console.log("defatlt is worldpay "+data.selfcare.isWorldpayBilling);
			  scope.isWorldpayBilling = data.selfcare.isWorldpayBilling == 'Y'? true:false;
			  //console.log(".... is worls pay "+scope.isWorldpayBilling);
			  
			  
			  if(scope.authorized == 'N' && scope.isWorldpayBilling){
				 // alert("oneoff");
				  scope.oneoffbutton='Y';
				  scope.isWorldpayBilling=false;
			  }
			  
			  if(scope.authorized == 'N' && !scope.isWorldpayBilling){
				 // alert("1");
				  scope.isWorldpayBilling=false;
				  scope.oneoffbutton='Y';
			  }
			  if(scope.authorized == 'Y' && data.selfcare.isWorldpayBilling == 'N'){
				  scope.btnPayName = "Authorise card";
				  				  
				  //console.log("isSame card......."+scope.isSameCard);
				  scope.isSameCard;
				  scope.isWorldpayBilling = data.selfcare.isWorldpayBilling == 'Y'? true:false;
				  scope.formData.auth='Y'; 
				  scope.isWorldpayBilling=true;
				  //console.log("formdata auth value ...."+scope.formData.auth);
				  scope.isSameCard;
			  }
			  if(scope.authorized == 'Y' && data.selfcare.isWorldpayBilling == 'Y' && scope.isSameCard == 'Y'){
				  scope.btnPayName = "Authorise card";
				  // alert("card excange ");
				  //console.log("isSame card......."+scope.isSameCard);
				  scope.isSameCard;
				  scope.isWorldpayBilling = data.selfcare.isWorldpayBilling == 'Y'? true:false;
				  scope.formData.auth='Y'; 
				  scope.isWorldpayBilling=true;
				  //console.log("formdata auth value ...."+scope.formData.auth);
				  scope.isSameCard;
			  }
			  scope.reusable=scope.isWorldpayBilling;
			  //console.log("autherization "+scope.authorized);
			  //console.log("reusble ..."+scope.reusable);
		    });
		  }
		  
		  
		  
		  //scope.cardTypeDatas = ['MASTERCARD','VISA','DISCOVERY','AMERICAN EXPRESS','OTHERS'];
		  
			var localCardType = '';
			
		    scope.selectCardType = function(number){
				if(number){
					if (globalCardType.toUpperCase() !== localCardType){
						localCardType = globalCardType.toUpperCase();
						
						//Reset Date, CVC, Boxes...
						scope.formValidDate = false;
						scope.formData.cvc = "";
						scope.expiryDate = "";
						scope.blockUI = false;
						scope.errorWP = false;
						
						if (globalCardType == 'gibbank')
							scope.cardType = "VISA";
						else
							scope.cardType = globalCardType.toUpperCase();
					}
				}
				else{
					globalCardType = "";
					localCardType = "";
					delete scope.cardType;
				}				
		        
		    };
		  	
		    
			scope.updateAutoBilling = function(isautopay){
		    	scope.reusable=isautopay;
		    	if (isautopay==isautopay)  
					scope.reusable = isautopay;
			}
		    
		    scope.isExpiryDateChangeFun = function(){
		    	scope.isNotValidDate = false; 
		    }
		  
		  
		  	scope.isExpirationDate_Valid = function(expiryDate){
				if (expiryDate){						
					var today = new Date();
					var startDate = new Date(today.getFullYear(),today.getMonth(),1,0,0,0,0);
					var expDate = expiryDate.replace(/ /g,'');
					var separatorIndex = expDate.indexOf('/');
					
					var month = expDate.substr( 0, separatorIndex );
					var year = expDate.substr(separatorIndex).replace('/', '');
					if (year.length == 2)
						year = '20' + year;
					
					expDate = month + '/01/' + year;
					
					if (Date.parse(startDate) > Date.parse(expDate))
						scope.formValidDate = false;
					else
						scope.formValidDate = true;										
				}				
			}
		  
		  
			scope.isCVC_Valid = function(cvc){
				if (cvc){
					cvc = String(cvc);
					if (globalCardType == 'amex') {
						if (cvc.length != 4)
							scope.formValidCVC = false;
						else
							scope.formValidCVC = true;
					}					
					else if (cvc.length != 3)
						scope.formValidCVC = false;
					else
						scope.formValidCVC = true;	
				}
				else
					scope.formValidCVC = false;
			}
		   
		   
		    scope.blockUI = false;
			scope.errorWP = false;
		      
			  
			  
			  
		    scope.submit = function(){
				
								
				if (scope.formValidDate == true && scope.formValidCVC  == true ){					
					  
					scope.isNotValidDate = false; 
					scope.formData.statementId=scope.statementId;
					scope.formData.isSameCard=scope.isSameCard;
					//scope.formData.auth='N';
					scope.formData.clientId=scope.clientId;
					scope.formData.totalamount = scope.balanceAmount;
					scope.formData.currency = scope.clientData.currency;
					scope.formData.reusable=scope.reusable;
					//scope.formData.name=scope.clientData.firstname;
					scope.formData.locale="en";

					
					//Get year Expiration Date
					var cMonYear = (scope.expiryDate).split("/"); 
					scope.formData.expiryMonth = (cMonYear[0]).replace(/\s+/,"");
					var yr = (cMonYear[1]).replace(/\s/g,"");
					if(yr.length == 3){
						scope.isNotValidDate = true;
						return "";
					}
					
					
					
					
					//Form VALIDATION OK -> Proceed with payment
					scope.blockUI = true; //Show Loading
					scope.errorWP = false;
				
					var pnW = angular.element(document.querySelector('#pnRedirectWorldpay p'));
					pnW.text('Connecting with our secure online payment gateway...');

					$timeout(function() {
													
						pnW.text('Processing payment...');				
											
						$timeout(function() {
							
							if(yr.length <= 2)
								scope.formData.expiryYear = ("20"+yr);
							else
								scope.formData.expiryYear = yr;
							
														
							var cardNumber = (scope.formData.cardNumber).replace(/\s/g,"");													
							if (scope.cardType == undefined){
								if (globalCardType == 'gibbank')
									scope.cardType = "VISA";
								else
									scope.cardType = globalCardType.toUpperCase();								
							}
							scope.formData.type = scope.cardType;
							
							console.log("scope.formData.type: " + scope.formData.type);							
							
							RequestSender.oneoffworldPayment.save({},scope.formData,function(recurringdata){
								
								var recurringdatas = angular.fromJson(recurringdata.resourceIdentifier);
								var cardtype = recurringdatas.cardtype;
								var status = recurringdatas.status;
								var transId = recurringdatas.transId;
								var customCode = recurringdatas.customCode;
								var message = recurringdatas.message;
									
								scope.message=message;
								scope.customCode=customCode;
								if(scope.message != null){
									scope.blockUI=false;
									scope.errorWP = true; 
									scope.apiError="";									
								}
								
								
								/*console.log("recurring data: " + JSON.stringify(recurringdata));								
								console.log("recurringdatas: " + JSON.stringify(recurringdatas));							
								console.log("Status: " + status);
								console.log("Message: " + message);
								console.log("CustomCode: " + customCode);*/
								
								
								if(status == "SUCCESS"){
									location.path('/worldpayredirection').search({clientId:scope.clientId,cardno:cardNumber,
											amnt:scope.formData.totalamount,emailId:scope.clientData.email,txnId:transId,
											currency:scope.currency,
											payStatus:status,
											pendingReason:status,cardtype:cardtype,name:scope.clientData.firstname});
								}
								else if(status == "AUTHORIZED"){
									location.path('/worldpayredirection').search({clientId:scope.clientId,cardno:cardNumber,
											amnt:scope.formData.totalamount,emailId:scope.clientData.email,txnId:transId,
											currency:scope.currency,
											payStatus:status,
											pendingReason:status,cardtype:cardtype,name:scope.clientData.firstname});
								}
								else if(status == "FAILED"){
									scope.blockUI=false;
									scope.errorWP = true; 
									
									var pnE = angular.element(document.querySelector('#pnErrorWorldpay p'));
									pnE.text(status + " - Error processing payment. Please try again later or use a different card.");
								}
								
								
								
								
								
								
								
							},function(errData){
								
								//Show error and stop loading
								scope.blockUI=false;
								scope.errorWP = true; 
								
								var pnE = angular.element(document.querySelector('#pnErrorWorldpay p'));
								scope.errData=errData.data.userMessageGlobalisationCode;
								
								if (scope.errData){
									
									console.log(scope.errData);
									
									var i=(scope.errData).split(":");
									scope.apiError=i[1];
									scope.message= "";
									scope.customCode= "";
									pnE.text(scope.apiError);
									
								}
								else
									pnE.text("Unknown error processing payment");
															
								
							});
							
							
						}, 2000);
				
					}, 2500);	
									
				}
				
				
		    	
		  	};
		  	
		  
    };

 selfcareApp.controller('WorldPayController',['$scope',
                                                    'RequestSender',
                                                    '$rootScope',
                                                    'localStorageService',
                                                    'SessionManager',
                                                    '$location',
                                                    '$timeout',
                                                    WorldPayController]);

													