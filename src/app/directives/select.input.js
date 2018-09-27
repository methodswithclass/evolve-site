


app.directive("selectInput", [function () {
	
	return {
		scope:{
			items:"=",
			elemID:"@",
			change:"=",
			model:"=",
			key:"@",
			ngClass:"@"
		},
		template:`
			<div class="{{ngClass}} width height">
				<select class="relative width80 padding-20 transparent-back white nooutline" ng-id="{{elemID}}" ng-model="model" ng-change="change(model)">
					<option class="black-back" ng-repeat="item in items" value="{{getValue(item, key)}}">{{getValue(item, key)}}</option>
				</select>
			</div>

		`,
		link:function ($scope, elemen, attrs) {


			$scope.getValue = function (item, key) {

				return item.hasOwnProperty(key) ? item[key] : item;
			}
		}
}
}])