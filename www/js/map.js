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

var map = new ol.Map({
	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM()
		})
	],
	renderer: exampleNS.getRendererFromQueryString(),
	target: 'map',
	controls: ol.control.defaults({
		attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
			collapsible: false
		})
	}),
	view: new ol.View({
		center: [0, 0],
		zoom: 2
	})
});

jQuery('#map').after('<button type="button" ' +
'onclick="map.getView().setZoom(map.getView().getZoom() - 1);">' +
'Zoom out</button>');
jQuery('#map').after('<button type="button" ' +
'onclick="map.getView().setZoom(map.getView().getZoom() + 1);">' +
'Zoom in</button>');
