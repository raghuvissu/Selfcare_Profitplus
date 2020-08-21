EvoPaymentController = function(scope, RequestSender,location, localStorageService,$timeout,rootScope,dateFilter) {

	var decryptedData 		= CryptoJS.AES.decrypt(location.search().key, selfcareModels.encriptionKey).toString(CryptoJS.enc.Utf8),
	   storageData 		= angular.fromJson(decodeURIComponent(decryptedData));

	scope.merchantId		= storageData.merchantId;
	scope.data				= storageData.data;
	scope.len				= storageData.len;
	scope.optlang 			= rootScope.localeLangCode;
	
	//for redirection time out
	 $timeout(function() {
		  $("#submitEvoPayment").click();
	  }, 1000);
};
selfcareApp.controller('EvoPaymentController', ['$scope', 
                                                'RequestSender',
                                                '$location', 
                                                'localStorageService',
                                                '$timeout',
                                                '$rootScope',
                                                'dateFilter',
                                                EvoPaymentController]);