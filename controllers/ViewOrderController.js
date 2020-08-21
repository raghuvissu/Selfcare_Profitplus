ViewOrderController = function(scope,RequestSender,routeParams,$modal,dateFilter,route,localStorageService,rootScope) {
	
		  scope.orderId = routeParams.orderId;
		  scope.clientId = routeParams.clientId;
		  
		  if(localStorageService.get('selfcare_sessionData')){
			  scope.orderData = {};
			  scope.orderPricingDatas = [];
			  RequestSender.getSingleOrderResource.get({orderId: scope.orderId},function(data){
				  scope.orderData=data.orderData;
				  scope.orderPricingDatas = data.orderPriceData;
				  if(data.orderData.isPrepaid == 'Y'){
		            	scope.orderData.isPrepaid="Pre Paid";
		            }else{
		            	scope.orderData.isPrepaid="Post Paid";
		            }
				  scope.orderGetDate = data.date;
			  });
		  }
		  
		 var OrderDisconnectPopupController = function ($scope, $modalInstance) {
              
			  $scope.flagOrderDisconnect=false;
        	  $scope.disconnectDetails = [{'id':1,'mCodeValue':'Not Interested'},
        	                              {'id':2,'mCodeValue':'Plan Change'},
							        	  {'id':3,'mCodeValue':'Wrong plan'}];
        	  $scope.start = {};
        	  $scope.start.date = new Date(scope.orderGetDate);
        	  $scope.formData = {};
        	  
        	  $scope.approveDisconnection = function () {
        		  $scope.flagOrderDisconnect=true;
        		  
        		  var reqDate = dateFilter($scope.start.date,'dd MMMM yyyy');
        	        $scope.formData.dateFormat = 'dd MMMM yyyy';
        	        $scope.formData.disconnectionDate = reqDate;
        	        $scope.formData.locale = rootScope.localeLangCode;
        		  
        	        RequestSender.bookOrderResource.update({'orderId': scope.orderDataId},$scope.formData,function(data){
        	        	$modalInstance.close('delete');
        	        	route.reload();
        	        },function(orderErrorData){
        	        	 $scope.flagOrderDisconnect=false;
        	        	$scope.orderError = orderErrorData.data.errors[0].userMessageGlobalisationCode;
        	        });
        		  
              };
              $scope.cancelDisconnection = function () {
                  $modalInstance.dismiss('cancel');
              };
              
              
          };
          
		  scope.orderDisconnect = function(orderId){
			  scope.orderDataId = orderId;
			  scope.errorStatus=[];scope.errorDetails=[];
        	  $modal.open({
                  templateUrl: 'OrderDisconnect.html',
                  controller: OrderDisconnectPopupController,
                  resolve:{}
              });
          };
          
    };
    
selfcareApp.controller('ViewOrderController', ['$scope',
                                               'RequestSender',
                                               '$routeParams',
                                               '$modal',
                                               'dateFilter',
                                               '$route', 
                                               'localStorageService', 
                                               '$rootScope', 
                                               ViewOrderController]);
