StatementsController = function(scope,RequestSender,location,API_VERSION,paginatorService,rootScope,filter,localStorageService,dateFilter) {
		  
	   if(rootScope.selfcare_sessionData){
		 	scope.clientId = rootScope.selfcare_sessionData.clientId;
		 	/*if(rootScope.selfcare_sessionData){
		 		scope.balanceAmount = scope.clientData.balanceAmount;
		 	}*/
		 	console.log(rootScope.balanceAmount)
	     }
	
	    scope.getStatementsData = function(offset, limit, callback) {
			  RequestSender.statementResource.get({clientId: scope.clientId ,offset: offset, limit: limit} , function(data){
				  
				  angular.forEach(data.pageItems,function(val,key){
					  data.pageItems[key].billDate = filter('DateFormat')(val.billDate);
					  data.pageItems[key].dueDate = filter('DateFormat')(val.dueDate);
				  });
				  
				  callback(data);
			  });
	  	   };
		  
		  scope.getPaymentsData = function(offset, limit, callback) {
			  RequestSender.paymentsResource.get({clientId: scope.clientId ,offset: offset, limit: limit} , function(data){
				  
				  angular.forEach(data.pageItems,function(val,key){
					  data.pageItems[key].transDate = filter('DateFormat')(val.transDate);
				  });
				  
				  callback(data);
			  });
	  	   };
	  	   
	  	 scope.getDepositsData = function(offset, limit, callback) {
			  RequestSender.depositsResource.get({clientId: scope.clientId ,offset: offset, limit: limit,type:'DEPOSIT&REFUND'} , function(data){
				  
				  angular.forEach(data.pageItems,function(val,key){
					  data.pageItems[key].transDate = filter('DateFormat')(val.transDate);
				  });
				  
				  
				  callback(data);
			  });
	  	   }; 
	  	   
		  scope.invoicesTabSelFun = function(){
	    	   scope.statementsData = [];
	    	   scope.statementsData = paginatorService.paginate(scope.getStatementsData, 9);
	       };
	       
	       scope.transactionsTabSelFun = function(){
		    	  scope.paymentsData = [];
	    	  	  scope.paymentsData = paginatorService.paginate(scope.getPaymentsData, 9);
	       };
	       
	       scope.depositsTabSelFun = function(){
	    	   
	    	   scope.depositsDatas = paginatorService.paginate(scope.getDepositsData, 9);
	    	   /*RequestSender.creditDistributionTemplateResource.get({clientId : rootScope.selfcare_sessionData.clientId},function(data){
	    		   scope.payDeposits = data.depositDatas;
	    	   });*/
	    	   
	       };
		  
		  scope.fetchSearchStatements = function(offset, limit, callback) {
			  
	          RequestSender.statementResource.get({clientId: scope.clientId ,offset: offset, limit: limit,sqlSearch: scope.filterText} , function(data){
				  
				  angular.forEach(data.pageItems,function(val,key){
					  data.pageItems[key].billDate = filter('DateFormat')(val.billDate);
					  data.pageItems[key].dueDate = filter('DateFormat')(val.dueDate);
				  });
				  
				  callback(data);
			  });
	      };
	       
	       scope.searchStatements = function() {
	    	   scope.statementsData = [];
	    	   scope.statementsData = paginatorService.paginate(scope.fetchSearchStatements, 9);
	       };
	       
	       scope.fetchSearchPayments = function(offset, limit, callback) {
				  
	    	   RequestSender.paymentsResource.get({clientId: scope.clientId ,offset: offset, limit: limit,type:'PAYMENT',sqlSearch: scope.filterText1} , function(data){
					  
					  angular.forEach(data.pageItems,function(val,key){
						  data.pageItems[key].transDate = filter('DateFormat')(val.transDate);
					  });
					  
					  callback(data);
				  });
		      };
		       
		       scope.searchPayments = function() {
		    	   scope.paymentsData = [];
		    	   scope.paymentsData = paginatorService.paginate(scope.fetchSearchPayments, 9);
		       };
		       
		    $('#searchStatements').keypress(function(e) {
			          if(e.which == 13) {
			              scope.searchStatements();
			          }
			 });
		    $('#searchPayments').keypress(function(e) {
		    	if(e.which == 13) {
		    		scope.searchPayments();
		    	}
		    });
		    
		  scope.routeTostatement = function(statementid){
	             location.path('/viewstatement/'+statementid);
	      };
	      
	      scope.downloadFile = function (statementId, billDate){
               
              var year = dateFilter(new Date(billDate),'yyyy-MM-dd').split("-")[0];
	    	  var month = dateFilter(new Date(billDate),'yyyy-MM-dd').split("-")[1];
	    	  if(month == 1){
	    		  month = 12;
	    		  year = year-1;
	    	  }else{
	    		  month = month-1;
	    	  }
	    	  window.open(API_VERSION +'/runreports/talkReport?tenantIdentifier='+selfcareModels.tenantId+'&accessToken=c2VsZmNhcmU6c2VsZmNhcmU='
	    			  +'&output-type=PDF&locale=en&R_monthBill='+month+'&R_yearBill='+year+'&R_customerObsId='+scope.clientId+'&R_billId='+statementId);
	         /*  window.open(API_VERSION +'/billmaster/'+ statementId +'/print?tenantIdentifier='+selfcareModels.tenantId+'&accessToken=c2VsZmNhcmU6c2VsZmNhcmU='); */
	      };
	      
	      scope.payment = function(amount,statementid){
	    	  localStorageService.remove("depositsPayData");
	    	  localStorageService.add("statementsPayData",["invoicingPay",amount,statementid]);
	    	location.path('/prepaidpayment');  
	      };
	      
	      scope.depositPayment = function(amount,depositid){
	    	  localStorageService.remove("statementsPayData");
	    	  localStorageService.add("depositsPayData",["depositPay",amount,depositid]);
	    	location.path('/prepaidpayment');  
	      };
	      
          
    };
    
selfcareApp.controller('StatementsController', ['$scope',
                                                'RequestSender',
                                                '$location',
                                                'API_VERSION', 
                                                'PaginatorService', 
                                                '$rootScope', 
                                                '$filter', 
                                                'localStorageService',
                                                'dateFilter', 
                                                StatementsController]);
