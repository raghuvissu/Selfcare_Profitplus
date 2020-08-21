selfcareApp.directive('lateValidate', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (attr.type === 'radio' || attr.type === 'checkbox') return;
                    elm.bind('blur', function() {
                        scope.$apply(function() {
                            if (elm.val() == "") {
                                ctrl.$setValidity('req', false);
                            } else {
                                ctrl.$setValidity('req', true);
                            }
                        });
                    });
                }
            };
});
