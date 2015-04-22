angular.module('starter.controllers', ['ngCordova', 'elasticsearch'])

.controller('DashCtrl', function($scope, $cordovaGeolocation, $http, recipeService) {
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

	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
	var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
		element: container,
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	}));

	var map = new ol.Map({
		layers: [
			new ol.layer.Tile({
				source: new ol.source.BingMaps({
					key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
					imagerySet: 'Road'
				})
			})
		],
		overlays: [overlay],
		renderer: exampleNS.getRendererFromQueryString(),
		target: 'map',
		view: view
	});

	var posOptions = {timeout: 10000, enableHighAccuracy: false};
	$cordovaGeolocation
		.getCurrentPosition(posOptions)
		.then(function (position) {
			view.setCenter(ol.proj.transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857'));
			view.setResolution(1000.0);
		}, function (err) {
			console.log(err)
		});

	recipeService.search("", 0).then(function(results){
		var position = results[0].location.split(",");
		var long = parseFloat(position[1]).toFixed(2);
		var lat = parseFloat(position[0]).toFixed(2);

		console.log(long, lat)
		var pos = ol.proj.transform([long, 34.216151], 'EPSG:4326', 'EPSG:3857');
		console.log(pos);
		content.innerHTML = "<p>Hello World</p>";
		overlay.setPosition(pos);
	});
})

.controller('ChatsCtrl', function($scope, $http, recipeService) {
	$scope.results = [];
	recipeService.search("", 0).then(function(results){
		console.log(results);
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
