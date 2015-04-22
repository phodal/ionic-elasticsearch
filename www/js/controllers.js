angular.module('starter.controllers', ['elasticsearch'])

.controller('DashCtrl', function($scope) {
	var exampleNS = {};

	exampleNS.getRendererFromQueryString = function() {
		var obj = {}, queryString = location.search.slice(1),
			re = /([^&=]+)=([^&]*)/g, m;

		while (m = re.exec(queryString)) {
			obj[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		if ('renderers' in obj) {
			return obj['renderers'].split(',');
		} else if ('renderer' in obj) {
			return [obj['renderer']];
		} else {
			return undefined;
		}
	};

	var view = new ol.View({
		center: [0, 0],
		zoom: 2
	});

	var map = new ol.Map({
		layers: [
			new ol.layer.Tile({
				source: new ol.source.BingMaps({
					key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
					imagerySet: 'Road'
				})
			})
		],
		renderer: exampleNS.getRendererFromQueryString(),
		target: 'map',
		view: view
	});

	var geolocation = new ol.Geolocation({
		projection: view.getProjection(),
		tracking: true
	});
	geolocation.once('change:position', function() {
		view.setCenter(geolocation.getPosition());
		view.setResolution(100.0);
	});
})

.controller('ChatsCtrl', function($scope, recipeService) {
	$scope.results = [];
	recipeService.search("", 0).then(function(results){
		$scope.results = results;
	});
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
