angular.module('starter.services', ['ngCordova', 'elasticsearch'])

.factory('ESService',
  ['$q', 'esFactory', '$location', '$localstorage', function($q, elasticsearch, $location, $localstorage){
    var client = elasticsearch({
      host: $location.host() + ":9200"
      //host: "http://es.phodal.com/"
    });

    var search = function(term, offset){
      var deferred = $q.defer(), query, sort;
      if(!term){
        query = {
          "match_all": {}
        };
      } else {
        query = {
          multi_match: {
            query: term ,
            fields:['shop_name', 'shop_category', 'shop_tags']
          }
        }
      }

      var position = $localstorage.get('position');

      if(position){
        //sort = [{
        //  "_geo_distance": {
        //    "location": position,
        //    "unit": "km"
        //  }
        //}];
      } else {
        sort = [];
      }

      client.search({
        "index": 'dianping',
        "size": 500,
        "body": {
          "query": query,
          "sort": sort
        }
      }).then(function(result) {
        var ii = 0, hits_in, hits_out = [];
        hits_in = (result.hits || {}).hits || [];
        for(;ii < hits_in.length; ii++){
          var data = hits_in[ii]._source;
          var distance = {};
          if(hits_in[ii].sort){
            distance = {"distance": parseFloat(hits_in[ii].sort[0]).toFixed(1)}
          }
          angular.extend(data, distance);
          hits_out.push(data);
        }
        deferred.resolve(hits_out);
      }, deferred.reject);

      return deferred.promise;
    };


    return {
      "search": search
    };
  }]
)
.factory('NSService', function(){
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

      return {
        "exampleNS": exampleNS
      };
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);