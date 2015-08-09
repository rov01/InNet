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

	this.updateOnDuty = function(member){
		return $http.put('/api/members/onDuty/findById?memberId=' + member.memberId, member);
	};

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

	this.updateUser = function(username){
		return $http.put('/api/members/user?username='+ username);
	}

	this.removeUser = function(username){
		return $http.put('/api/members/user/remove?username=' + username)
	}

	this.deleteMember = function(member){
		return $http.delete('/api/members/' + member._id)
	}

	

}])