(function() {	

	$.validator.setDefaults({
		showErrors: function(map, list) {
			// there's probably a way to simplify this
			var focussed = document.activeElement;
			if (focussed && $(focussed).is("input, textarea")) {
				$(this.currentForm).tooltip("close", {
					currentTarget: focussed
				}, true)
			}
			this.currentElements.removeAttr("title").removeClass("ui-state-highlight");
			$.each(list, function(index, error) {
				$(error.element).attr("title", error.message).addClass("ui-state-highlight");
			});
			if (focussed && $(focussed).is("input, textarea")) {
				$(this.currentForm).tooltip("open", {
					target: focussed
				});
			}
		}
	});


	// use custom tooltip; disable animations for now to work around lack of refresh method on tooltip
	$("#creditcardform").tooltip({
		show: false,
		hide: false
	});
	$("#creditcardform input:not(:submit)").addClass("ui-widget-content");
	
	
	
	// Method to validate Card Expiration Date
	$.validator.addMethod("expiryDate", function (value, element) {
            var today = new Date();
			var startDate = new Date(today.getFullYear(),today.getMonth(),1,0,0,0,0);
            var expDate = value.replace(/ /g,'');
			var separatorIndex = expDate.indexOf('/');
			
			var month = expDate.substr( 0, separatorIndex );
			var year = expDate.substr(separatorIndex).replace('/', '');
			if (year.length == 2)
				year = '20' + year;
 			
            expDate = month + '/01/' + year;
			
			return Date.parse(startDate) <= Date.parse(expDate);			
        
	}, "Please enter a valid expiration date");


	
	
	// validate signup form on keyup and submit
	$("#creditcardform").validate({
		rules: {			
			number: { required: true, minlength: 19},
			name: "required",
			expiry: { required: true, expiryDate: true },
			cvc: { required: true, minlength: 3, maxlength: 4}
		},
		
		messages: {			
			number: { required: "Please enter your card number",
				      minlength: "Please enter a valid card number" },
			name: "Please enter the name as it appears on your credit card",
			expiry: { required: "Please enter the expiration date of your card" },
					  //exactlength: "Please enter a valid expiration date"},					  
			cvc: { required: "Please enter the CVC of your card",
				   minlength: "Please enter valid CVC number" }
		},
		
	});
																					
							
})();
