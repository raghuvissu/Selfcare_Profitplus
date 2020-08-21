selfcareApp.directive("ngOnblur",function($parse){
            return function(scope, elm, attrs){
                var onBlurFunction = $parse(attrs['ngOnblur']);
                elm.bind("blur", function(event) {
                    scope.$apply(function() {
                        onBlurFunction(scope, { $event: event });
                    });});
            };
});