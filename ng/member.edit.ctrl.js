angular.module('InNet')
.controller('MemberEditCtrl', ['$scope', 'MemberSvc', 'BranchSvc', '$stateParams', '$window','$modal',
	function ($scope, MemberSvc, BranchSvc, $stateParams, $window, $modal) {

		$scope.isDeleted = false;
		
		MemberSvc.findByBranch($stateParams.branch).success(function(members){
			$scope.members = members;
		});

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
			    		return {}
			    	}
			    }
		    });
		}

		$scope.update = function(member){
			var modalInstance = $modal.open({
			    templateUrl: 'views/member/member.modal.html',
			    controller: 'MemberModalCtrl',
			    size: "md",
			    resolve : {
			    	branch : function(){
			    		return $stateParams.branch 
			    	},
			    	member : function(){
			    		return member
			    	}
			    }
		    });
		}

		$scope.delete = function(){
			$scope.isDeleted = true; 
		};	
}])