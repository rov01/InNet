/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.service('MemberSvc', ['$http',function ($http) {

	this.fetch = function(){
		return $http.get('/api/members')
	}

	this.findByBranch = function( branch ){
		return $http.get('/api/members/' + branch )
	}

	this.fetchOnDuty = function(branch){
		return $http.get('/api/members/onDuty?branch=' + branch);
	}

	this.create = function(member){
		return $http.post('/api/members/', member)
	}

	this.update = function(member){
		return $http.put('/api/members/', member.id)
	}

	this.updateByMemberId = function(updateMember){
		return $http.put('/api/members/findById/' + updateMember.memberId , updateMember)
	}

	this.updateIsChecked = function(memberData){
		return $http.put('/api/members?id=' + memberData.memberId, memberData)
	}

	this.delete = function(member){
		return $http.delete('/api/members/' + member.id)
	}

}])