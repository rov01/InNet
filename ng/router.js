/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.config([ '$stateProvider','$urlRouterProvider', '$locationProvider', 
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider
        .otherwise('/login');

    $stateProvider
        .state('anon',{
            url : "",
            abstract : true,
            template : "<ui-view>",
        })
        .state('anon.login',{
            url : "/login",
            templateUrl :"views/login.html",
            controller : "LoginCtrl",
        })
        .state('anon.404',{
            url : "/404",
            templateUrl : "views/404.html"
        })

    // duty desk 
	$stateProvider
		.state('dutyDesk', {
            abstract: true,
            url: "/dutyDesk",
            templateUrl: "views/common/content.html",
            data : {
                requiredLogin : true,
                role : ["admin"]
            }
        })
        .state('dutyDesk.dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
            controller : "DashboardCtrl",
            data : {
                requiredLogin : true,
                role : ["admin"]
            }
        })
        .state('dutyDesk.case', {
            url: "/case",
            templateUrl: "views/case/case.index.html",
            controller : "CaseCtrl",
        })
        .state('dutyDesk.safety',{
            url : "/case/:id",
            templateUrl : "views/summary/summary.index.html",
            controller : "SummaryCtrl"
        })
        .state('dutyDesk.dutylist',{
            abstract : true,
            template : "<ui-view>"
        })
        .state('dutyDesk.dutylist.show', {
            url: "/dutylist/:branch",
            templateUrl: "views/dutylist/dutylist.index.html",
            controller : "DutyListCtrl",
        })
        .state('dutyDesk.dutylist.edit', {
            url: "/dutylist/:branch/edit",
            templateUrl: "views/dutylist/dutylist.edit.html",
            controller : "DutyListEditCtrl",
        })
        .state('dutyDesk.member',{
            abstract : true,
            template : "<ui-view>"
        })
        .state('dutyDesk.member.show', {
            url: "/member/:branch",
            templateUrl: "views/member/member.index.html",
            controller : "MemberCtrl",
        })
        .state('dutyDesk.member.edit', {
            url: "/member/:branch/edit",
            templateUrl: "views/member/member.edit.html",
            controller : "MemberEditCtrl",
        })
        .state('dutyDesk.car', {
            abstract : true,
            template : "<ui-view>"
        })
        .state('dutyDesk.car.show',{
            url: "/car/:branch",
            templateUrl : "views/cars/car.index.html",
            controller : "CarIndexCtrl"
        })
        .state('dutyDesk.car.edit',{
            url: "/car/:branch/edit",
            templateUrl : "views/cars/car.edit.html",
            controller : "CarEditCtrl"
        })
    // director 
    $stateProvider
        .state('director',{
            abstract : true,
            url : "",
            templateUrl : "views/director/director.content.html",
            data : {
                requiredLogin : true,
                role : ["user"]
            }
        })
        .state('director.safety',{
            abstract : true,
            url : "/safety",
            template : "<ui-view>" 
        })
        .state('director.safety.index',{
            url : "/index",
            templateUrl : "views/safety/safety.index.html",
            controller : "SafetyIndexCtrl"
        })
        .state('director.safety.management',{
            url : "/index/:id",
            templateUrl : "views/safety/safety.manage.html",
            controller : "SafetyManageCtrl"         
        })
        .state('director.safety.summary',{
            url : "/summary/:id",
            templateUrl : "views/summary/summary.index.html",
            controller : "SummaryCtrl"
        })
        .state('director.map',{
            url : "/map",
            templateUrl : "views/map/map.index.html",
            controller : "MapIndexCtrl"
        })
        .state('director.dutylist',{
            abstract : true,
            url : "/dutylist",
            template : "<ui-view>" 
        })
        .state('director.dutylist.index',{
            url : "/index",
            templateUrl: "views/dutylist/director.dutylist.index.html",
            controller : "DirDutyListCtrl",
        })
        .state('director.dutylist.edit',{
            url : "/edit",
            templateUrl: "views/dutylist/director.dutylist.edit.html",
            controller : "DutyListEditCtrl",
        })	
}])

.run([ '$rootScope', '$state', '$stateParams', 'store', 'jwtHelper', 'UserSvc', 'SocketSvc',
    function ( $rootScope, $state, $stateParams, store, jwtHelper, UserSvc, SocketSvc) {

    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){

        if (toState.name == "anon.login") {
            store.remove('jwt');
        }else{
            if (toState.data && toState.data.requiredLogin) {

                if (!UserSvc.isLoggedIn()) {
                    event.preventDefault();
                    $state.go('anon.login');
                } 
                else if (toState.data.role.indexOf(jwtHelper.decodeToken(store.get('jwt')).role) == -1 ) {
                    event.preventDefault();
                    $state.go("anon.login")
                };
            }; 
        }

    });

    $rootScope.$on('$stateChangeError',function(event){
        event.preventDefault();
    });
}])