 PaymentGatewayResponseController = function(scope,localStorageService,$rootScope,API_VERSION,$upload,dateFilter,$timeout) {
 
	/*var clientdata = localStorageService.get("clientdata");
	localStorageService.remove("clientdata");
	scope.clientId = clientdata.clientinfo.id;
	scope.locale = clientdata.locale;*/
	 scope.clientId = $rootScope.selfcare_sessionData.clientId;
	 scope.locale = $rootScope.localeLangCode;
	//for ticket generation
	scope.ticketdata = {};
	         
	        //for ticket generation
	        var ticketresponsedata = localStorageService.get("ticketdataresponse") || "";
	        localStorageService.remove("ticketdataresponse");
	        
			scope.formData = {};
			
			var responseData = localStorageService.get("paymentgatewayresponse");
		     if(responseData){
		    	 scope.formData		 = responseData.data;
		    	 scope.cardType 	 = responseData.cardType || "";
		    	 scope.cardNumber 	 = responseData.cardNumber || "";
		    	 localStorageService.remove("paymentgatewayresponse");
		    	 localStorageService.remove("statementsPayData");
		     }
		     
		     scope.printPage = function(divName){
				 
				 var printContents = document.getElementById(divName).innerHTML;
			     var val1 = "<html><head><title></title></head><body> <div style='width: 21cm; margin:0 auto;'>" + 
		         printContents + "</div></body>";
			     var printWindow = window.open(location.href, 'OBS', 'left=50000,top=50000,width=800,height=600');
		         printWindow.document.body.innerHTML = val1;
		         printWindow.document.close();
		         printWindow.focus();
		         printWindow.print();
		         $timeout(function() {
		        	 printWindow.close();
		         }, 1000);
			 };
		     
        };
        
selfcareApp.controller('PaymentGatewayResponseController', [ '$scope','localStorageService','$rootScope','API_VERSION','$upload','dateFilter','$timeout',PaymentGatewayResponseController]);
