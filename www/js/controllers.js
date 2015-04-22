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
		var vectorSource = new ol.source.Vector({ });
		$.each(results, function(index, result){
			console.log(index);

			for (var i=0;i<50;i++){

				var iconFeature = new ol.Feature({
					geometry: new
						ol.geom.Point(ol.proj.transform([Math.random()*360-180, Math.random()*180-90], 'EPSG:4326',   'EPSG:3857')),
					name: 'Null Island ' + i,
					population: 4000,
					rainfall: 500
				});
				vectorSource.addFeature(iconFeature);
			}
		});

		var iconStyle = new ol.style.Style({
			image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
				anchor: [0.5, 46],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				opacity: 0.75,
				src: 'img/icon.png'
			}))
		});

		var vectorLayer = new ol.layer.Vector({
			source: vectorSource,
			style: iconStyle
		});
		map.addLayer(vectorLayer);
		//
		//var popup = new ol.Overlay({
		//	element: document.getElementById('popup')
		//});
		//map.addOverlay(popup);
		//
		//map.on('click', function(evt) {
		//	var element = popup.getElement();
		//	var coordinate = evt.coordinate;
		//	var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
		//		coordinate, 'EPSG:3857', 'EPSG:4326'));
		//
		//	$(element).popover('destroy');
		//	popup.setPosition(coordinate);
		//	$(element).popover({
		//		'placement': 'top',
		//		'animation': false,
		//		'html': true,
		//		'content': '<p>The location you clicked was:</p><code>' + hdms + '</code>'
		//	});
		//	$(element).popover('show');
		//});

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
