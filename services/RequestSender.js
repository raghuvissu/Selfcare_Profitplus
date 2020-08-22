selfcareApp.config(function($provide) {
    $provide.provider('RequestSender',function(){
      var baseUrl = "" , apiVer = selfcareModels.OBS_URL;
      this.setBaseUrl = function(url) {baseUrl = url;};
      this.$get = ['$resource','$rootScope', function(resource,$rootScope) {
        var defineResource = function(url, paramDefaults, actions) {
        	var tempUrl = baseUrl;
        	$rootScope.hostUrl = tempUrl;
          return resource(baseUrl+url, paramDefaults, actions);
        };
        return {
        	userResource: defineResource(apiVer + "/users/:userId", {userId : '@id'}, {}),
        	
        	registrationResource: defineResource(apiVer + "/selfcare/register", {}, {
        		update : {method: 'PUT', params: {}}
        	}),
        	configurationResource:defineResource(apiVer + "/configurations",{}, {}),
        	
        	addressTemplateResource: defineResource(apiVer + "/address/template/:city", {city:'@city'}, {}),

          addressEditResource: defineResource(apiVer + "/address/addressdetails/:clientId",{clientId:'@clientId'},  {
              get: {method: 'GET', params: {}},
              getAll: {method: 'GET', params: {clientId:'@clientId'}}
          }),

          addressResource: defineResource(apiVer + "/address/:clientId",{clientId:'@clientId'},  {
           getAllAddresses: {method: 'GET', params: {}},
            update: {method: 'PUT', params: {}}          
          }),
        	
        	allocateHardwareDetails: defineResource(apiVer + "/itemdetails/:oneTimeSaleId/:quantity", {oneTimeSaleId:'@saleId',quantity:'@quantity'},{}),
        	
        	authenticationClientResource: defineResource(apiVer + "/activationprocess/selfregistration", {}, {}),
        	
        	orderTemplateResource: defineResource(apiVer + "/prices", {}, {}),
        	
        	loginUser: defineResource(apiVer + "/selfcare/login", {username:'@username',password:'@password'}, {}),
        	
        	clients: defineResource(apiVer + "/clients/:clientId", {clientId:'@clientId'}, {}),
        	
        	forgotPwdResource: defineResource(apiVer + "/selfcare/forgotpassword", {}, {
        		update : {method : 'PUT',params : {}}
        	}),
        	ticketResourceTemplate: defineResource(apiVer + "/tickets/template",{},  {}),
        	
        	ticketResource: defineResource(apiVer + "/tickets/:clientId",{clientId:'@clientId'},  {}),
        	
        	TicketsResource: defineResource(apiVer + "/tickets/Tickets", {}, {
          	  get: {method: 'GET', params: {}, isArray: true},
          	  update: {method: 'PUT'}
              }),
        	
        	editTicketResource: defineResource(apiVer + "/tickets/:clientId/update/:id",{clientId:'@clientId', id:'@id'},  {
          	  get: {method: 'GET', params: {}},
          	  getAll: {method: 'GET', params: {}, isArray:true}
        	}),
          	  
        	changePwdResource: defineResource(apiVer + "/selfcare/changepassword",{},  {
        		update : {method: 'PUT', params: {}}
        	}),
        	vodEventsResource: defineResource(apiVer + "/assets",{},  {}),
        	
        	eventsResource: defineResource(apiVer + "/eventorder",{},  {}),
        	
        	bookOrderResource: defineResource(apiVer + "/orders/:clientId/:orderId",{clientId : '@clientId',orderId : '@orderId'},  {
        		update: { method: 'PUT' }
        	}),
        	
            getOrderResource: defineResource(apiVer + "/orders/:clientId/orders",{clientId : '@clientId'},  {}),
            
            paymentsResource: defineResource(apiVer + "/financialTransactions/:clientId/type", {clientId:'@clientId'}, {}),
            
		depositsResource: defineResource(apiVer + "/financialTransactions/:clientId/type", {clientId:'@clientId'}, {}),

            getSingleOrderResource: defineResource(apiVer + "/orders/:orderId/orderprice", {orderId:'@orderId'}, {
           	  update: { method: 'PUT' }
            }),
            
            getAuthorizedHash:defineResource(apiVer + "/paymentgateways/authorize", {}, {}),
            
            OrderDisconnectResource: defineResource(apiVer + "/orders/disconnect", {}, {}),
            
            OrderreconnectResource: defineResource(apiVer + "/orders/reconnect/:orderId", {orderId:'@orderId'},{
               	update: { method: 'PUT' }
            }),
            
            changeOrderResource: defineResource(apiVer + "/orders/changePlan/:orderId", {orderId:'@orderId'}, {
                update: { method: 'PUT' }
             }),
             
            clientTemplateResource: defineResource(apiVer + "/clients/template", {}, {}),
            
            clientResource: defineResource(apiVer + "/clients/:clientId/:anotherresource", {clientId:'@clientId',anotherresource:'@anotherresource'}, {
                getAllClientDocuments: {method: 'GET', params: {}, isArray: true},
                update: { method: 'PUT'},
                create: {method: 'POST', headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' }}
            }),
            
            orderRenewalResourceTemplate: defineResource(apiVer + "/orders/renewalorder/:orderId", {orderId:'@orderId'},{
            	update: { method: 'PUT' }
           }),
           
           orderRenewalResource: defineResource(apiVer + "/orders/renewal/:orderId", {orderId:'@orderId'},{
              	update: { method: 'PUT' }
            }),
            
            statementResource: defineResource(apiVer + "/billmaster/:clientId", {clientId:'@clientId'}, {
                update: { method: 'PUT'}
            }),
            creditDistributionTemplateResource:defineResource(apiVer + "/creditdistributions/template/:clientId", {clientId:'@clientId'},{
            	get: { method: 'GET', params: {}}
            }),
            eventOrderPriceTemplateResource: defineResource(apiVer + "/eventorder",{},  {}),
            
            currencyTemplateResource: defineResource(apiVer + "/countrycurrencys/template", {}, {}),
            
            updateKortaToken: defineResource(apiVer + "/selfcare/:clientId", {clientId:'@clientId'},  {
        		update : {method: 'PUT', params: {}}
        	}),
        	
        	gettingSerialNumbers: defineResource(apiVer + "/itemdetails/searchserialnum", {},  {}),
        	
        	paymentGatewayConfigResource: defineResource(apiVer + "/paymentgatewayconfigs",{},  {}),
        	
        	singleStatementResource: defineResource(apiVer + "/billmaster/:billId/billdetails", {billId:'@billId'}, {}),
        	
        	
        	statementEmailResource: defineResource(apiVer + "/billmaster/email/:statementId", {statementId:'@statementId'}, {
                update: { method: 'PUT'}
            }),
            
            cancelStatementResource: defineResource(apiVer + "/billmaster/:billId", {billId:'@billId'}, {}),
            
            paymentGatewayResource: defineResource(apiVer + "/paymentgateways/onlinepayment", {},  {
        		update : {method: 'PUT', params: {}}
        	}),
        	
        	netellerPaymentResource: defineResource(apiVer + "/paymentgateways/neteller", {}, {}),
        	
        	echeckSaveResource: defineResource(apiVer + "/paymentgateways/echeck", {}, {
        		update: { method: 'PUT'}
        	}),
        	
        	VoucherResource: defineResource(apiVer + "/vouchers/verify", {},  {}),
        	
        	redemptionResource: defineResource(apiVer + "/redemption", {}, {}),
        	
        	logoutResource: defineResource(apiVer + "/logout", {id:'@id'}, {}),
        	
        	scheduleOrderResource: defineResource(apiVer + "/orders/scheduling/:clientId", {clientId:'@clientId'}, {}),
        	
        	finalPriceCheckingResource: defineResource(apiVer + "/chargecode/:priceId/:clientId", {priceId:'@priceId',clientId:'@clientId'}, {}),
        	
        	getRecurringScbcriberIdResource: defineResource(apiVer + "/recurringpayments/:orderId", {orderId:'@orderId'}, {}),
        	
        	orderDisconnectByScbcriberIdResource: defineResource(apiVer + "/recurringpayments/delSubscription", {}, {
        		update : {method: 'PUT', params: {}}
        	}),

        	clientIdentifiersResource: defineResource(apiVer + "/clients/:clientId/identifiers", {clientId:'@clientId'}, {}),
        	
        	planServicesResource: defineResource(apiVer + "/plans/:planId", {planId:'@planId'}, {}),
        	
        	evoPaymentGatewayResource: defineResource(apiVer + "/evo/:method", {method:'@method'}, {}),
        	
        	clientDataResource: defineResource(apiVer + "/clients/additionalinfo/:clientId", {clientId:'@clientId'}, {
        		update : {method: 'PUT', params: {}}
        	}),
        	
        	gettingContractsResource: defineResource(apiVer + "/orders/:planId/template", {planId:'@planId'}, {}),
        	
        	evoPaymentResource: defineResource(apiVer + "/evo/encriptmode", {}, {}),
        	
        	orderaddonTemplateResource: defineResource(apiVer + "/orderaddons/template/:planId", {planId :'@planId',chargeCode :'@chargeCode'}, {}),
        	
        	orderaddonResource: defineResource(apiVer + "/orderaddons/:orderId", {orderId : '@orderId'}, {}),
        	
        	paymentTemplateResource: defineResource(apiVer + "/payments/template", {}, {}),
        	
        	paymentResource: defineResource(apiVer + "/payments/:clientId", {clientId : '@clientId'}, {}),
        	
        	ticketHistoryResource: defineResource(apiVer + "/tickets/:id/history",{id:'@id'},  {}),
        	commentHistoryResource: defineResource(apiVer + "/tickets/:id/history",{id:'@id'},  {}),
        	
        	HardwareResource: defineResource(apiVer + "/ownedhardware/:clientId", {clientId:'@clientId'}, {
       		 getAllOwnHardware: {method: 'GET', params: {}, isArray: true}
           }),
           oneTimeSaleResource: defineResource(apiVer + "/onetimesales/:clientId", {clientId:'@clientId'}, {
          	getOneTimeSale: {method: 'GET', params: {clientId:'@clientId'}}
            }),
            clientDocumentsResource: defineResource(apiVer + "/clients/:clientId/documents/:documentId", {clientId:'@clientId',documentId:'@documentId'}, {
                getAllClientDocuments: {method: 'GET', params: {}, isArray: true}
           }),
           clientIdentifierResource: defineResource(apiVer + "/client_identifiers/:clientIdentityId/documents", {clientIdentityId:'@clientIdentityId'}, {
              get: {method: 'GET', params: {}, isArray:true}
            }),
           orderBookingResource: defineResource(apiVer + "/orders/:planId/:clientId/price", {planId:'@planId',clientId:'@clientId'}, {
              get: {method: 'GET', params: {}},
           }),
           recurringPaymentResource: defineResource(apiVer + "/recurringpayments/authorize", {}, {}),
                 
           recurringPaymentSaveResource: defineResource(apiVer + "/recurringpayments", {}, {
              update : {method: 'PUT', params: {}}
           }),
           OrderrenewalResourceTemplate: defineResource(apiVer + "/orders/renewalorder", {},{
          	 get: {method: 'GET', params: {}},
          	update: { method: 'PUT' }
          }),
          orderRenewalPriceResource: defineResource(apiVer + "/orders/:planId/:clientId/:orderId", {planId:'@planId',clientId:'@clientId',orderId:'@orderId'}, {
              get: {method: 'GET', params: {}},
         }),
         creditCardSaveResource: defineResource(apiVer + "/clients/:clientId/carddetails/:identifier", {clientId:'@clientId', identifier:'@identifier'}, {              
      	   get: {method: 'GET', params: {},isArray: true},
      	   getCardType: {method: 'GET', params: {identifier:'@identifier'}},
         }),          
         creditCardUpdateResource: defineResource(apiVer + "/clients/:clientId/carddetails/:id/:cardType", {clientId:'@clientId',id:'@id',cardType:'@cardType'}, {                
      	   get: {method: 'GET', params: {}},   
      	   update: { method: 'PUT' }            
         }),
           oneoffworldPayment: defineResource(apiVer + "/worldpaypaymetgateway", {}, {
             get: {method: 'GET', params: {}},
             update: { method: 'PUT' }
          }),
         clientcarddeleteResource:defineResource(apiVer + "/clients/:clientId/carddetails/:id",{clientId:'@clientId',id:'@id',clientId:'@clientId'},{}),
         
         isExDirectoryResource: defineResource(apiVer + "/isexdirectory/:ordId", {ordId:'@ordId'}, {
        	 update : {method: 'PUT', params: {}}
         }),
         
         isExDirectoryResource: defineResource(apiVer + "/isexdirectory/:ordId", {ordId:'@ordId'},{update: { method: 'PUT' }}),

          getClientwithCafIdResource: defineResource(apiVer + "/referals/cafId/:cafId", {cafId: "@cafId"}, {
                get: {method: 'GET', headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' }}
          }),
          confirmPaymentResource: defineResource(apiVer + "/payments/confirmpayment/:paymentId", {paymentId:"@paymentId"}, {
            update: {method: 'PUT'}
         }),
         referalResource: defineResource(apiVer + "/referals/:referalId", {referalId: "@referalId"}, {
              getAllReferals: {method: 'GET', params: {}, isArray: true},
              getAllReferalsInAlphabeticalOrder: {method: 'GET', params: {orderBy: 'name', sortOrder: 'ASC'}, isArray: true},
              update: { method: 'PUT'}
          }),
         referalByClientResource: defineResource(apiVer + "/referals/:clientId/hierarchy", {clientId: "@clientId"}, {
              getAllReferals: {method: 'GET', params: {}, isArray: true}
          }),
         officeResource: defineResource(apiVer + "/offices/:officeId", {officeId: "@officeId"}, {
              getAllOffices: {method: 'GET', params: {}, isArray: true},
              getAllOfficesInAlphabeticalOrder: {method: 'GET', params: {orderBy: 'name', sortOrder: 'ASC'}, isArray: true},
              update: { method: 'PUT'}
          }),
         paymentsTemplateResource: defineResource(apiVer + "/payments/template", {}, {
              getPayments: {method: 'GET', params: {}}
          }),
          makePaymentsResource: defineResource(apiVer + "/payments/:clientId", {clientId:'@clientId'}, {
              get: {method: 'GET', params: {}}
          }),
          cancelPaymentResource: defineResource(apiVer + "/payments/cancelpayment/:paymentId", {paymentId:'@paymentId'}, {
              update: { method: 'PUT' }
          }),
          officeTemplateResource: defineResource(apiVer + "/offices/template", {}, {
              get: {method: 'GET', params: {}},
          }),
          getEntityPayments: defineResource(apiVer + "/entitypayments/:clientId/:officeId", {clientId:'@clientId', officeId:'@officeId'}, {
            get: {method: 'GET', params: {}}
          })
        };
      }];
    });
});
