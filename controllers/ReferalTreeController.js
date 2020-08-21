	  ReferalTreeController = function(scope, RequestSender, routeParams,location, dateFilter,localStorageService,rootScope, $modal) {
            
		 if(rootScope.selfcare_sessionData){
		 	console.log(rootScope.selfcare_sessionData);
			 scope.referals = [];
            scope.isTreeView = false;
            var idToNodeMap = {};

            scope.deepCopy = function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }

            RequestSender.referalByClientResource.getAllReferals({clientId: rootScope.selfcare_sessionData.clientId},function (data) {
                scope.referals = scope.deepCopy(data);
                for (var i in data) {
                	if(i == 0){
                		delete data[0].parentId;
            			delete data[0].parentName;
                	}
                	
                    data[i].children = [];
                    idToNodeMap[data[i].id] = data[i];
                }
                function sortByParentId(a, b) {
                    return a.parentId - b.parentId;
                }

                data.sort(sortByParentId);

                var root = [];
                for (var i = 0; i < data.length; i++) {
                    var currentObj = data[i];
                    if (currentObj.children) {
                        currentObj.collapsed = "true";
                    }
                    if (typeof currentObj.parentId === "undefined") {
                        root.push(currentObj);
                    } else {
                        parentNode = idToNodeMap[currentObj.parentId];
                        parentNode.children.push(currentObj);
                    }
                }
                scope.treedata = root;
                console.log(scope.treedata)
            });

            var ViewLargerPicCtrl = function ($scope, $modalInstance, image) {
                $scope.largeImage = image;
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.viewImg = function(img){
                $modal.open({
                        templateUrl: 'photo-dialog.html',
                        controller:  ViewLargerPicCtrl,
                        resolve: {
                            image: function () {
                              return img;
                            }
                          }
                    });
            }
		}
			 
    };

selfcareApp.controller('ReferalTreeController', ['$scope', 
                                                  'RequestSender',
                                                  '$routeParams',
                                                  '$location',
                                                  'dateFilter', 
                                                  'localStorageService', 
                                                  '$rootScope', 
                                                  '$modal', 
                                                  ReferalTreeController]);

