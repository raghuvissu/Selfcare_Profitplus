selfcareApp.service('PaginatorService', ['$rootScope', 'HttpService',function(scope, httpService) {
	      
	      this.paginate = function(fetchFunction, pageSize) {
	              var paginator = {
	              hasNextVar: false,
	              count : 0,
	              next: function() {
	                if (this.hasNextVar) {
	                  this.currentOffset += pageSize+1;
	                  this.count += pageSize + 1;
	                  this._load();
	                }
	              },
	              firstPage : function(){
	            	  if(this.hasPrevious()) {
	            		  this.currentOffset = 0;
	            		  this._load();
	            	  }
	              },
	              lastPage :function(){
	            	  if (this.hasNextVar) {
	            		  this.currentOffset = this.totalFilteredRecords - this.totalFilteredRecords % 15;
	            		  this.totalCount = this.currentOffset;
	            		  if(this.currentOffset == this.totalFilteredRecords)
	            			  this.currentOffset = this.totalFilteredRecords -15;
	            		  this._load();
	            	  }
	              },
	              _load: function() {
	                  var self = this;
	                  fetchFunction(this.currentOffset, pageSize + 1, function(items) {
	                  self.totalFilteredRecords = items.totalFilteredRecords;
	                  self.currentPageItems = items.pageItems;
	                  self.count = self.count == 0 ? pageSize + 1 : self.count;
	                  self.hasNextVar = (items.pageItems.length === pageSize + 1)&&
	                  					(!(self.totalCount == self.totalFilteredRecords))&&
	                  					(!(self.count == self.totalFilteredRecords));
	                  self.totalCount = 0;
	              });
	              },
	              hasNext: function() {
	              return this.hasNextVar;
	              },
	              hasLastPage :function(){
	            	  return this.hasNextVar;
	              },
	              hasFirstPage : function(){
	            	  return this.currentOffset !==0;
	              },
	              previous: function() {
	              if(this.hasPrevious()) {
	              this.currentOffset -= pageSize+1;
	              this.count -= pageSize + 1;
	              this._load();
	              }
	              },
	              hasPrevious: function() {
	              return this.currentOffset !== 0;
	              },
	              
	              currentPageItems: [],
	              currentOffset: 0,
	              
	              };
	              // Load the first page
	              paginator._load();
	              return paginator;
	        };

	    }
	    
]);

