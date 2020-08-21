EditTicketController = function(scope, routeParams,
		RequestSender, location, http, API_VERSION, $rootScope,
		$upload, dateFilter,  $modal) {
	
			scope.formData = {};
			scope.data = {};
			scope.start = {};
			var locationOrigin = window.location.origin;
			var locationPathname = window.location.pathname;

			RequestSender.editTicketResource.get({
				clientId : routeParams.clientId,
				id : routeParams.id
			}, function(data) {
				scope.formData = data;
				scope.statusTypes = data.statusType;

				RequestSender.ticketResource.query({
					id : routeParams.id,
					clientId : routeParams.clientId
				}, function(data) {
					scope.ticket = data;
					scope.clientId = routeParams.clientId;
				});
				RequestSender.commentHistoryResource.get({
					id : routeParams.id, historyParam:"comment"
				}, function(data) {
					scope.historyData = data.masterData;
					scope.problemDescription = data.problemDescription;
					angular.forEach(scope.historyData,function(val,key){
						scope.historyData[key].createdDate= dateFilter(new Date(val.createdDate),'dd/MM/yyyy');
					});
				});

				if (angular.uppercase(data.status) == 'Closed') {
					scope.statusTypes = [];
					scope.statusTypes.push({
						mCodeValue : "Closed"
					});
					scope.statusTypes.push({
						mCodeValue : "Re-Open"
					});
					data.status = "Closed";
				}

				
				scope.problemsDatas = data.problemsDatas;
				scope.priorityTypes = data.priorityType;
				scope.ticketissue = data.ticketissue;
				scope.description = data.description;
				scope.usersData = data.usersData;
				scope.clientId = routeParams.clientId;
				scope.ticketId = routeParams.id;
				scope.data.ticketDate = dateFilter(new Date(data.ticketDate),'dd MMMM yyyy');
				var clientData = data.clientData;
				scope.displayName = clientData.displayName;
				scope.statusActive = clientData.statusActive;
				scope.hwSerialNumber = clientData.hwSerialNumber;
				scope.accountNo = clientData.accountNo;
				scope.officeName = clientData.officeName;
				scope.balanceAmount = clientData.balanceAmount;
				scope.currency = clientData.currency;
				scope.imagePresent = clientData.imagePresent;
				scope.categoryType = clientData.categoryType;
				scope.email = clientData.email;
				scope.phone = clientData.phone;
				scope.resolutionDescription=data.resolutionDescription;
			});

			scope.reset123 = function() {
				/*webStorage.add("callingTab", {
					someString : "Tickets"
				}*/
			};
			scope.onFileSelect = function($files) {
				scope.file = $files[0];
			};
			
			scope.comment = function() {

				$modal.open({
					templateUrl : 'comment.html',
					controller : CommentController,
					resolve : {}
				});
			};
			
			var CommentController = function($scope, $modalInstance) {

				$scope.formData={};
				$scope.formData.comments = scope.comments;
     	           $scope.submit = function () {
     	        	   scope.formData.comments = $scope.formData.comments;
     	        	   //adng cmnt at the tm show cmt view
     	        	  var assignedTo = "";
    	        	   for(var i in scope.usersData){
    	        		   if( scope.formData.userId == scope.usersData[i].id){
    	        			  assignedTo = scope.usersData[i].userName;
    	        		   }
    	        	   }
    	        	   scope.historyData.push({createdDate : dateFilter(new Date(scope.formData.ticketDate),'dd/MM/yy'),assignedTo:assignedTo,statusDescription:$scope.formData.comments});
     	        	  $modalInstance.dismiss('cancel');
                };
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};
						
			scope.submit = function() {
				scope.formData.dateFormat = 'dd MMMM yyyy';
				this.data.assignedTo = this.formData.userId;
				this.data.comments = this.formData.comments;
				this.data.status = this.formData.status;
				this.data.ticketDate = dateFilter(scope.data.tickeDate,'dd MMMM yyyy');
				this.data.priority = this.formData.priority;
				this.data.description = this.formData.description;
				this.data.issue = this.formData.issue;
				this.data.problemCode = this.formData.problemCode;
				this.data.ticketURL = locationOrigin + '' + locationPathname + "#/viewTicket/" + scope.clientId + "/";
				$upload.upload(
						{
							url : $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.clientId + '/documents/' + routeParams.id + '/attachment',
							data : scope.data,
							file : scope.file
						}).then(function(data) {
					if (!scope.$$phase) {
						scope.$apply();
					}
					location.path('/tickets');
				});
				scope.reset123();
			};
	};

selfcareApp.controller('EditTicketController', ['$scope', '$routeParams', 'RequestSender',
                            					'$location', '$http', 'API_VERSION', '$rootScope',
                            					'$upload', 'dateFilter', '$modal', EditTicketController]);
