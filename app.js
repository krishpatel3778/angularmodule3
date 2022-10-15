(function(){
'use strict';
angular.module("NarrowItDownApp",[])
.controller("NarrowItDownController",narrowItDownController)
.service("MenuSearchService",menuSearchService)
.directive("foundItems",FoundItems)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function FoundItems() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: FoundItemDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };
  return ddo;
}

function FoundItemDirectiveController() {
  var list = this;
  list.showMessage=function(){
    if(list.found.length==0){
      return true;
    }
    else{
      return false;
    }
  }
}

narrowItDownController.$inject=["MenuSearchService"];
function narrowItDownController(MenuSearchService){
  var narrow=this;
  narrow.searchTerm="";
  narrow.found="";
  narrow.removeItem= function(index){
    console.log(index);
    narrow.found.splice(index,1);
  }
  narrow.search= function(){
    var searchTerm=narrow.searchTerm;
    if(searchTerm.trim()!=""){
      narrow.found=MenuSearchService.getMatchedMenuItems(searchTerm.toLowerCase().trim())
      .then(function(successResponse){
          narrow.found = successResponse;
        });
    }else{
      narrow.found=[]
    }
  }
}
menuSearchService.$inject=["$http","ApiBasePath"]
function menuSearchService($http,ApiBasePath){
  var service=this;
  service.getMatchedMenuItems=function (searchTerm){
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (result) {
          var items=result.data.menu_items;
          var foundItems=[];
          items.forEach(item=>{
            if(item.description.toLowerCase().indexOf(searchTerm)!=-1){
              foundItems.push(item);
            }
          })
          return foundItems;
      });
  }
}
})();
