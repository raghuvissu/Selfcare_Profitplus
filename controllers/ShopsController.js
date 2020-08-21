ShopsController = function(scope,RequestSender,rootScope,filter,location, paginatorService, $modal, $http, API_VERSION) {
	
	 scope.shops = [];
     
		  if(rootScope.selfcare_sessionData){
			  scope.clientId = rootScope.selfcare_sessionData.clientId;
			  
			  scope.shops = [];
			  scope.cityDatas = [];
			  RequestSender.addressEditResource.getAll({clientId: scope.clientId} , function(data) {	
                    scope.clientCityInfo=data.datas[0];
                    scope.addressTypeData=data.addressOptionsData;
                    scope.cityDatas=data.cityData;
                    scope.selectedCity = scope.clientCityInfo.city; 
                    RequestSender.clientResource.get({clientId: scope.clientId} , function(clientData) {
                    	scope.walletAmount = clientData.walletAmount;
                    	scope.clientOfficeId = clientData.officeId;
                    	scope.changeOffice(scope.selectedCity);
					});
                    	
			  });
		  }

		  scope.changeOffice = function(city){
			RequestSender.officeResource.getAllOffices({city : city},function(data) {	        
			  	scope.shops = data;
			  	for(var i in scope.shops){
			  		if(scope.shops[i].id == scope.clientOfficeId){
			  			scope.shopSelectFun(scope.shops[i]);
			  		}
			  	}
			});
		  }
		  
		  scope.getImages = function(officeId){
         	 scope.imageArr = [];
         	 $http({
                  method: 'GET',
                  url: rootScope.hostUrl + API_VERSION + '/offices/images/' + officeId
              }).then(function (imageData) {
              	console.log(imageData);
              	if(imageData.data){
              		angular.forEach(imageData.data, function(img, fileName){
              			scope.imageArr.push({name: fileName, image: img});
              		});
              		if(scope.imageArr.length == 0){
              			scope.imageArr = scope.slides;
              		}
              	}
              	
              });
          }

		  scope.getPaymentsData = function(offset, limit, callback) {
			  RequestSender.paymentsResource.get({clientId: scope.clientId , officeId: scope.selectedShopObj.id, type: scope.selectedTab, offset: offset, limit: limit} , function(data){
				  
				  angular.forEach(data.pageItems,function(val,key){
					  data.pageItems[key].transDate = filter('DateFormat')(val.transDate);
				  });
				  
				  callback(data);
			  });
	  	   };

		  scope.transactionsTabSelFun = function(tabName){
		  		  scope.selectedTab = tabName
		  		  console.log(tabName);
		    	  scope.paymentsData = [];
	    	  	  scope.paymentsData = paginatorService.paginate(scope.getPaymentsData, 4);
	       };

	       scope.walletTabSelFun = function(){
	    	   	  scope.walletData = {};
		    	  RequestSender.referalByClientResource.getAllReferals({clientId: scope.clientId} , function(data){
				  	scope.walletData = data[0];
				  	scope.walletAmount = scope.walletData.totalAmount;
				  });
	       };

	       scope.cancelPayment = function(id) {
				var modalInstance = $modal.open({
					templateUrl : 'cancelpayment.html',
					controller : CancelPayment,
					resolve : {
						getPaymentId : function() {
							return id;
						}
					}
				});

				modalInstance.result.then(function () {
				   scope.transactionsTabSelFun('PAYMENT');
			    }, function () {
			      console.log('Modal dismissed at: ' + new Date());
			    });
			};

			var CancelPayment = function($scope,$modalInstance, getPaymentId) {
				$scope.accept = function(cancelRemark) {
					delete $scope.errorMsg;
					$scope.flagcancelpayment = true;
					RequestSender.cancelPaymentResource.update({'paymentId' : getPaymentId},{cancelRemark : cancelRemark},function(data) {
						$modalInstance.close('delete');
					},function(errData) {
						$scope.flagcancelpayment = false;
						$scope.errorMsg = errData.data.errors[0].userMessageGlobalisationCode;
					});
				};
				$scope.reject = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			scope.selectedShopObj = {};
			scope.shopSelectFun = function(shop, isFromUI){
				scope.selectedShopObj = shop;
				if(isFromUI)scope.transactionsTabSelFun(scope.selectedTab);
				scope.getImages(shop.id);
			}

			scope.slides = [
				{id: 0, image : '../images/wood-slate.jpg'},
				{id: 1, image : '../images/2.jpg'},
				{id: 2, image : '../images/3.jpg'},
				{id: 3, image : '../images/4.jpg'},
				{id: 4, image : '../images/5.jpg'}
			];

			scope.selectedSlide = 0;

			scope.slideLeftFun = function(){
				if(scope.selectedSlide > 0){
					scope.selectedSlide--;
				}
			}

			scope.slideRightFun = function(){
				if(scope.selectedSlide < 4){
					scope.selectedSlide++;
				}
			}

    };
    
selfcareApp.controller('ShopsController', ['$scope',
                                             'RequestSender',
                                             '$rootScope',
                                             '$filter',
                                             '$location',
                                             'PaginatorService',
                                             '$modal',
                                             '$http',
                                             'API_VERSION',
                                             ShopsController]);
