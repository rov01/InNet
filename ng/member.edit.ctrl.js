angular.module('InNet')
.controller('MemberEditCtrl', ['$scope', 'MemberSvc', 'BranchSvc', '$stateParams', '$window','$modal', '$state', 'UserSvc',
	function ($scope, MemberSvc, BranchSvc, $stateParams, $window, $modal, $state, UserSvc) {

		$scope.alerts = [];
		$scope.memberDeleted = false;
		var tempDelMember = null;
		
		var memberInit = function(){
			MemberSvc.findByBranch($stateParams.branch).success(function(members){
				$scope.members = members;
				$scope.members.forEach(function(member){
					member.workingTime = moment.duration(member.workingTime,'seconds');
				});
			});
		};

		memberInit();

		$scope.save = function(){
			var memberIds = [];
			var directors = [];
			for (var i = 0; i < $scope.members.length; i++) {
				memberIds.push($scope.members[i]._id);
				directors.push($scope.members[i].name);
				if ($scope.members[i].title == "分隊長" || $scope.members[i].title == "小隊長" || $scope.members[i].title == "中隊長" || $scope.members[i].title == "大隊長") {
					director = $scope.members[i].name;
				};
			};

			BranchSvc.update({
				branch : $stateParams.branch,
				members : memberIds,
				directors : directors,
				director : director
			});

			 $window.history.back();
		};

		$scope.addNewMember = function(){
			var modalInstance = $modal.open({
			    templateUrl: 'views/member/member.modal.html',
			    controller: 'MemberModalCtrl',
			    size: "md",
			    resolve : {
			    	branch : function(){
			    		return $stateParams.branch 
			    	},
			    	member : function(){
			    		return { workingTime : null };
			    	}
			    }
		    });

		    modalInstance.result.then(function(member){
		    	if (member) {
		    		memberInit();
		    	}
		    	$scope.alerts.push({ type : "success" ,  msg: '人員新增成功！ ' + member.name + ' 已加入 ' + member.branch});
		    })
		};

		$scope.update = function(member){
			var oldMember = member;
			var modalInstance = $modal.open({
			    templateUrl: 'views/member/member.modal.html',
			    controller: 'MemberModalCtrl',
			    size: "md",
			    resolve : {
			    	branch : function(){
			    		return $stateParams.branch 
			    	},
			    	member : function(){
			    		return {
			    			memberId : member._id,
			    			id : member.id,
			    			name : member.name,
			    			title : member.title,
			    			branches : member.branches,
			    			corps : member.corps,
			    			radioCode : member.radioCode, 
			    			workingTime : member.workingTime.minutes() * 60 + member.workingTime.seconds()
			    		}
			    	}
			    }
		    });

		    modalInstance.result.then(function(member){
		    	memberInit();
		    	$scope.alerts.push({ type : "info" ,  msg:  oldMember.name + '修改成功!' });
		    });
		};

		$scope.activateAccount = function(member){

			var users = $scope.members.filter(function(member) {
				return member.isUser;
			});

			if (users.length < 3 ) {
				var modalInstance = $modal.open({
				    templateUrl: 'views/member/member.account.html',
				    controller: 'MemberAccountModalCtrl',
				    size: "md",
				    resolve : {
				    	member : function(){
				    		return member
				    	}
				    }
				});

				modalInstance.result.then(function(member){
					memberInit();
					$scope.alerts.push({ type : "info" , msg : member.name + " 已開通為使用者" })
				});
			} else {
				$scope.alerts.push({ type : "warning" , msg : "無法開通" + member.name + " 因為使用者已超過3位，請解除其他人帳號後再開通 "});
			};
		};

		var deActivateAccount = function(index){
			UserSvc.removeUser(tempDelMember.name).success(function(user){
				MemberSvc.removeUser(user.username);
				$scope.closeAlert(index);
				memberInit();
			});
		}

		var deleteMember = function(index){
			$scope.memberDeleted = true;
			MemberSvc.deleteMember(tempDelMember).success(function(){
				$scope.memberDeleted = false;
			});
			$scope.closeAlert(index);
			memberInit();
		};

		var cancelDel = function(index){
			$scope.memberDeleted = false;
			$scope.closeAlert(index);
		};

		$scope.deleteAlert = function(member){
			$scope.alerts.push({ 	
				type : "danger" ,  
				msg: '是否確定要刪除！' + member.name, 
				execute : deleteMember,
				cancel :  cancelDel
			});
			tempDelMember = member;
		};

		$scope.deActivateAlert = function(member){
			var users = $scope.members.filter(function(member) {
				return member.isUser;
			});
			if (users.length == 1 ) {
				$scope.alerts.push({ 
					type : "warning",  
					msg: '每分隊至少要有1個使用者，無法取消' + member.name + "的登入權限",
				});
			} else{
				$scope.alerts.push({ 
					type : "danger",  
					msg: '是否確定要解除' + member.name + "登入權限",
					execute : deActivateAccount,
					cancel : cancelDel
				});
				tempDelMember = member;
			};
		};

		$scope.closeAlert = function(index){
			$scope.alerts.splice(index,1)
		};
}])