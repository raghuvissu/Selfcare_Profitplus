AuthorizeGetController = function(scope,RequestSender,routeParams,$modal,route,localStorageService,rootScope,$timeout) {

	//for client information
	if(rootScope.selfcare_sessionData){
			 scope.clientId = rootScope.selfcare_sessionData.clientId;
			RequestSender.clientResource.get({clientId: scope.clientId} , function(clientTotalData) {
				scope.clientData = clientTotalData;
			});
	}
	//get localstorage data added in prepaidpaymentcontroller.js
	scope.authdata = localStorageService.get('hashdata');
	//get url up to index.html from constants.js
	scope.hostName = selfcareModels.selfcareAppUrl;
	//for redirection time out
	 $timeout(function() {
		  $("#authorize").click();
	    }, 1000);
}
selfcareApp.controller('AuthorizeGetController', ['$scope',
                                               'RequestSender',
                                               '$routeParams',
                                               '$modal',
                                               '$route', 
                                               'localStorageService', 
                                               '$rootScope', 
                                               '$timeout',
                                               AuthorizeGetController]);