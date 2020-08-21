ViewStatementController = function(scope,routeParams , RequestSender,API_VERSION,rootScope) {

        scope.billId=routeParams.billId;
        
		if(rootScope.selfcare_sessionData){
			scope.statementDatas = [];    
	        RequestSender.singleStatementResource.query({billId: scope.billId} , function(data) {
	            scope.statementDatas = data;
	        });
		 }
        
        scope.downloadFile = function (){
        	
        	 window.open(rootScope.hostUrl+ API_VERSION +'/billmaster/'+scope.billId+'/print?tenantIdentifier='+selfcareModels.tenantId+'&accessToken=c2VsZmNhcmU6c2VsZmNhcmU=');
        	
        };
        
        

       
    };
    
selfcareApp.controller('ViewStatementController', ['$scope',
	                                               '$routeParams', 
	                                               'RequestSender', 
	                                               'API_VERSION',
	                                               '$rootScope', 
	                                               ViewStatementController]);