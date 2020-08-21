EcheckPaymentController = function(scope,RequestSender,routeParams,$modal,route,localStorageService,rootScope,location) {

		scope.formData = {};
		scope.formEncryptedData = {};
		var echeckPGData = localStorageService.get("echeckPGData") || "";
		scope.amount = echeckPGData.price;
		var screenName = echeckPGData.screenName;
		var planId = echeckPGData.planId;
		var priceId = echeckPGData.priceId;
		var clientId = echeckPGData.clientId;
		var locale = echeckPGData.locale;
		var currency = echeckPGData.currency;
        
		//var key = mifosX.models.encrptionKey;
		scope.reset123 = function () {
			location.path('/prepaidpayment/');
		}
		
        scope.submit = function () {
		    //this.formEncryptedData.type="ACH";
		    /*this.formEncryptedData.routingNumber = CryptoJS.AES.encrypt(this.formData.routingNumber, key).toString();
		    this.formEncryptedData.bankAccountNumber = CryptoJS.AES.encrypt(this.formData.bankAccountNumber, key).toString();
		    this.formEncryptedData.bankName = CryptoJS.AES.encrypt(this.formData.bankName, key).toString();*/
		    this.formEncryptedData.routingNumber = this.formData.routingNumber;
		    this.formEncryptedData.accountNumber = this.formData.bankAccountNumber;
		    this.formEncryptedData.bankName = this.formData.bankName;
		    this.formEncryptedData.name = this.formData.name;
		    this.formEncryptedData.bankAccountType = this.formData.accountType;
		    this.formEncryptedData.checkNumber = this.formData.checkNumber;
		  
		    //for client information
			if(rootScope.selfcare_sessionData){
					 scope.clientId = rootScope.selfcare_sessionData.clientId;
					RequestSender.clientResource.get({clientId: scope.clientId} , function(clientTotalData) {
						scope.clientData = clientTotalData;
						scope.currency = scope.clientData.currency;
					});
			}
			this.formEncryptedData.clientId = scope.clientId;
			this.formEncryptedData.currency = currency || "USD";
			this.formEncryptedData.amount = scope.amount;
			this.formEncryptedData.locale = locale || "en";
			RequestSender.echeckSaveResource.update(this.formEncryptedData,function(data){
				var result = angular.uppercase(data.Result) || "";
		    	localStorageService.add("paymentgatewayresponse", {data:data});
		    	if(screenName == 'payment'){
		    		location.path('/paymentgatewayresponse/'+scope.clientId);
		    	}else if(result == 'SUCCESS'|| result == 'PENDING'){
		    		localStorageService.add("gatewayStatus",result);
					location.path("/orderbookingscreen/"+screenName+"/"+clientId+"/"+planId+"/"+priceId);
		    	}
            });
        };
	};

selfcareApp.controller('EcheckPaymentController', ['$scope',
                                               'RequestSender',
                                               '$routeParams',
                                               '$modal',
                                               '$route', 
                                               'localStorageService', 
                                               '$rootScope',
                                               '$location',
                                               EcheckPaymentController]);