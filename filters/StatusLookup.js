selfcareApp.filter('StatusLookup', function() {
	
	 return function(input) {
         var  cssClassNameLookup = {
           "true" : "statusactive" ,
           "false" : "statusdeleted",
           "Active" : "statusactive",
           "ACTIVE" : "statusactive",
           "PENDING" : "statuspending",
           "New" : "statuspending",
           "DISCONNECTED" :"statusbad",
           "CLOSE" :"close",
           "DeActive" : "statusbad",
           "loanStatusType.submitted.and.pending.approval" : "statuspending",
           "loanStatusType.approved" : "statusApproved",
           "loanStatusType.active" : "statusactive",
           "savingsAccountStatusType.submitted.and.pending.approval":"statuspending",
           "savingsAccountStatusType.approved":"statusApproved",
           "savingsAccountStatusType.active":"statusactive",
           "loanProduct.active":"statusactive",
           "clientStatusType.pending":"statuspending",
           "clientStatusType.active":"statusactive",
           "clientStatusType.submitted.and.pending.approval":"statuspending",
           "clientStatusTYpe.approved":"statusApproved",
           "clientStatusType.closed":"statusbad",
           "clientStatusType.transfer.in.progress":"statustransferprogress",
           "clientStatusType.transfer.on.hold":"statustransferonhold",
           "groupingStatusType.active":"statusactive",
           "groupingStatusType.pending":"statuspending",
           "groupingStatusType.submitted.and.pending.approval":"statuspending",
           "groupingStatusType.approved":"statusApproved"
        };

         
         return cssClassNameLookup[input];
     };
});
