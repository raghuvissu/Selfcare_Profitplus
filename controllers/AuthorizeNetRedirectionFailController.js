 AuthorizeNetRedirectionFailController = function(scope,location,rootScope,$timeout) {
	    		
	    		scope.cardNumber           =   location.search().cardno;
	    		scope.cardType             =   location.search().cardtype;
	    		scope.clientId 			   =   location.search().clientId;
	    		scope.currency 			   =   'USD';
	    		scope.emailId              =   location.search().emailId;
	    		scope.locale 			   =   rootScope.localeLangCode;
	    		scope.source               =   paymentGatewaySourceNames.autherizeNet;
	    		scope.Amount 		       =   location.search().amount;	
	    		scope.TransactionId 	   =   location.search().transId;
	    		scope.Description          =   location.search().responseText;
	    		scope.dateFormat 		   =   'dd MMMM yyyy';
	    		
	    		//for redirection time out
				 $timeout(function() {
					 location.path('/viewclient/'+scope.clientId);
				    }, 10000);
	};

selfcareApp.controller('AuthorizeNetRedirectionFailController', ['$scope',
	                                                  '$location', 
	                                                  '$rootScope',
	                                                  '$timeout',
	                                                  AuthorizeNetRedirectionFailController]);