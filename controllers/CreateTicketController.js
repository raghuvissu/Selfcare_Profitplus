	  CreateTicketController = function(scope, RequestSender, location, dateFilter,rootScope,http,API_VERSION,$upload) {

			 scope.start = {};
			 //scope.minDate= scope.start.date;
			 scope.statusTypes = [];

			 scope.first = {};
		     
			 $('#timepicker1').timepicker({
		        	showInputs:false,
		        	showMeridian:false
		      });
			 
			 scope.formData={};						
			 if(rootScope.selfcare_sessionData){
			   scope.formData.assignedTo=1;
			   scope.clientId=rootScope.selfcare_sessionData.clientId;
			   
			   scope.priorityTypes = [];scope.problemsDatas = [];scope.usersDatas=[];scope.sourceData=[];
			   RequestSender.ticketResourceTemplate.get(function(data){ 
				   scope.start.date = new Date(data.date);
				   scope.minDate= scope.start.date;

				   scope.date = data.ticketDate;
				   scope.issue = data.ticketissue;
				   scope.priorityTypes=data.priorityType;
				   for(var i=0;i<scope.priorityTypes.length;i++){
					   
					   if(scope.priorityTypes[i].value=='LOW'){
						   scope.formData.priority=scope.priorityTypes[i].value;
					   }
				   }
				   scope.statusTypes=data.statusType;
		              for(var i=0;i<scope.statusTypes.length;i++){
		            	  
		              	if(scope.statusTypes[i].mCodeValue=='New Open'){
		              		scope.formData.status=scope.statusTypes[i].mCodeValue;
		              	}
		              }
		              
				   /*scope.statusTypes=data.statusType;
		              for(var i in scope.statusTypes){
		         		 if(scope.statusTypes[i].value== "active"){
		         			 scope.formData.status = scope.statusTypes[i].value;
		         		 }
		              }*/
		              
				   scope.problemsDatas=data.problemsDatas;
				   scope.usersDatas=data.usersData;
				   console.log(localStorageService.get("config-appUser"));
				   for(var i=0;i<scope.usersDatas.length;i++){
		            	  
		              	if(scope.usersDatas[i].userName=="Support"){
		              		scope.formData.assignedTo=scope.usersDatas[i].id;
		              	}
		              }
				   scope.sourceData=data.sourceData;
				   for(var i=0;i<scope.sourceData.length;i++){
					   
					   if(scope.sourceData[i].mCodeValue=='Phone'){
						   scope.formData.sourceOfTicket=scope.sourceData[i].mCodeValue;
					   }
				   }
			   });
			 }
			 scope.onFileSelect = function($files) {
			        scope.file = $files[0];
			      };
					        
			scope.submit = function() { 
				scope.first.time=$('#timepicker1').val();
				if(scope.first.date==null||scope.first.time==''){
					delete scope.formData.dueTime;
				}else{
					scope.formData.dueTime = dateFilter(scope.first.date,'yyyy-MM-dd')+" "+$('#timepicker1').val()+':00';
				}
	        	
				scope.formData.status = 'New Open';
	            scope.formData.ticketDate = dateFilter(scope.start.date,'dd MMMM yyyy');
				scope.formData.dateFormat = 'dd MMMM yyyy';
				scope.formData.ticketTime = ' '+new Date(scope.start.date).toLocaleTimeString().replace("IST","").trim();

				scope.formData.ticketURL=locationOrigin+''+locationPathname+"#/viewTicket/"+scope.clientId;
				
						scope.filedata = {};
						scope.filedata.assignedTo=scope.formData.assignedTo;
						scope.filedata.comments=scope.formData.comments;
						scope.filedata.status=scope.formData.status;
						scope.filedata.priority = scope.formData.priority;
						scope.filedata.problemCode = scope.formData.problemCode;
						scope.filedata.description=scope.formData.description;
						scope.filedata.issue=scope.formData.statusDescription;
						scope.filedata.dateFormat = scope.formData.dateFormat;
						if(scope.formData.dueTime) scope.filedata.dueTime = scope.formData.dueTime;
						scope.filedata.locale = rootScope.localeLangCode;
						scope.filedata.priority = scope.formData.priority;
						scope.filedata.sourceOfTicket = scope.formData.sourceOfTicket;
						scope.filedata.ticketDate = dateFilter(scope.start.date,'dd MMMM yyyy');
						scope.filedata.ticketTime = scope.formData.ticketTime;
						scope.filedata.ticketURL = scope.formData.ticketURL;
						
					  $upload.upload({
				          url: rootScope.hostUrl+ API_VERSION +'/tickets/'+scope.clientId,
				          data: scope.filedata,
				          file: scope.file
				        }).then(function(data) {
				        	if (!scope.$$phase) {
				                scope.$apply();
				              }
				        	location.path('/tickets');
				        });	
					};
					
    };

selfcareApp.controller('CreateTicketController', ['$scope', 
                                                  'RequestSender',
                                                  '$location',
                                                  'dateFilter', 
                                                  '$rootScope',
                                                  '$http',
                                                  'API_VERSION',
                                                  '$upload',
                                                  'localStorageService',
                                                  CreateTicketController]);

