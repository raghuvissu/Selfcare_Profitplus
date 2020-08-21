    PayInvoiceController = function(scope, RequestSender, routeParams,location, dateFilter,
      localStorageService,rootScope, $upload, API_VERSION) {
            
       if(rootScope.selfcare_sessionData){
        scope.clientId = rootScope.selfcare_sessionData.clientId;
        scope.officeId = routeParams.officeId;
         scope.formData = {};
         scope.clientData={};
         scope.start={};
         scope.start.date = new Date();
         scope.minDate = scope.start.date;
         scope.maxDate = scope.start.date;
         RequestSender.clientResource.get({clientId: scope.clientId} , function(data) {
            if(data.walletAmount) scope.walletAmount  = data.walletAmount;
              else scope.walletAmount  =0;
         });

         RequestSender.paymentsTemplateResource.getPayments({clientId : scope.clientId}, function(data){
          scope.payments = data;
            scope.data = [data.data[0]];
            scope.paymentTypeData=function(value){
              for(var i=0;i<scope.data.length;i++){
                if(scope.data[i].id==value){
                  scope.paymentType=scope.data[i].mCodeValue;
                }
              }
            };

            scope.formData.paymentCode = scope.data[0].id;
            scope.formData.amountPaid = 0;
            scope.formData.isSubscriptionPayment = false;
            scope.paymentTypeData(scope.data[0].id);
        });
       }
       
       RequestSender.officeTemplateResource.get({} , function(data) {
           scope.offices = data.allowedParents;
           for(var i in scope.offices){
        	   if(scope.offices[i].id == scope.officeId){
        		   scope.selectedOffice = scope.offices[i].name;
        		   break;
        	   }
           }
           
       });

       scope.selectedWalletAmountUse = function(useWalletAmount){
        console.log(useWalletAmount)
          if(useWalletAmount) scope.getTotalAmount(scope.formData.amountPaid);
        }

        scope.amountChange =function(Amount){
          //scope.payAvailAmount=Amount;
          if(scope.useWalletAmount && Amount && Amount != "") scope.getTotalAmount(Amount);
          else scope.getTotalAmount(0);
        };

        scope.getTotalAmount = function(actualAmount){
          console.log(parseFloat(actualAmount)+parseFloat(scope.walletAmount));
          scope.totalPaidAmount =  parseFloat(isNaN(actualAmount)?0 : actualAmount)+parseFloat(scope.walletAmount);
        }

      scope.submit = function() {
        scope.formData.locale = rootScope.localeLangCode;
        scope.formData.dateFormat = 'dd MMMM yyyy';
        scope.formData.officeId = scope.officeId;

        var paymentDate = dateFilter(scope.start.date,'dd MMMM yyyy');
        scope.formData.paymentDate= paymentDate;

        scope.formData.useWalletAmount = scope.useWalletAmount;
        scope.formData.walletAmount = scope.walletAmount;
            
        RequestSender.makePaymentsResource.save({clientId: scope.clientId},scope.formData, function(data) {
          location.path('/shops');
         });
      };
    };

selfcareApp.controller('PayInvoiceController', ['$scope', 
                                                  'RequestSender',
                                                  '$routeParams',
                                                  '$location',
                                                  'dateFilter', 
                                                  'localStorageService', 
                                                  '$rootScope', 
                                                  'Upload',
                                                  'API_VERSION',
                                                  PayInvoiceController]);

