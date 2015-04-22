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

		var pos = ol.proj.transform([16.3725, 48.208889], 'EPSG:4326', 'EPSG:3857');

		var marker = new ol.Overlay({
			position: pos,
			positioning: 'center-center',
			element: document.getElementById('marker'),
			stopEvent: false
		});
		map.addOverlay(marker);

		var vienna = new ol.Overlay({
			position: pos,
			element: document.getElementById('vienna')
		});
		map.addOverlay(vienna);

		var popup = new ol.Overlay({
			element: document.getElementById('popup')
		});
		map.addOverlay(popup);

		map.on('click', function(evt) {
			var element = popup.getElement();
			var coordinate = evt.coordinate;
			var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
				coordinate, 'EPSG:3857', 'EPSG:4326'));

			$(element).popover('destroy');
			popup.setPosition(coordinate);
			// the keys are quoted to prevent renaming in ADVANCED mode.
			$(element).popover({
				'placement': 'top',
				'animation': false,
				'html': true,
				'content': '<p>The location you clicked was:</p><code>' + hdms + '</code>'
			});
			$(element).popover('show');
		});

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
