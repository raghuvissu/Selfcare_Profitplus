EventsController = function(scope,RequestSender,paginatorService,rootScope,filter) {
		
		var totalVODSData =[];var retrivingVODSData = {};scope.VODSDatas = [];
		scope.getVODSData = function(offset, limit, callback) {
	  		retrivingVODSData.pageItems = [];
	  		var itrCount = 0;
	  		for (var i=offset;i<totalVODSData.length;i++) {
	  			itrCount += 1;
	  			retrivingVODSData.pageItems.push(totalVODSData[i]);
	  			if(itrCount==limit){
	  				break;
	  			}
	  		}
	  		angular.forEach(retrivingVODSData.pageItems,function(val,key){
	  				retrivingVODSData.pageItems[key].bookedDate = filter('DateFormat')(val.bookedDate);
			  });
	  		callback(retrivingVODSData);
	  	};
		
		  if(rootScope.selfcare_sessionData){
			  scope.clientId = rootScope.selfcare_sessionData.clientId;
			  RequestSender.eventOrderPriceTemplateResource.query({clientId:scope.clientId},function(data){
				  totalVODSData = data;
				  retrivingVODSData.totalFilteredRecords = totalVODSData.length;
				  scope.VODSDatas = paginatorService.paginate(scope.getVODSData, 4);
			  });
		  }
    };
    
selfcareApp.controller('EventsController', ['$scope',
                                            'RequestSender',
                                            'PaginatorService',
                                            '$rootScope',
                                            '$filter',
                                             EventsController]);
