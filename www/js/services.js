angular.module('starter.services', [])

.factory('ESService',
  ['$q', 'esFactory', '$location', function($q, elasticsearch, $location){
    var client = elasticsearch({
      host: $location.host() + ":9200"
      //host: "http://es.phodal.com/"
    });

    var search = function(term, offset){
      var deferred = $q.defer(), query;
      if(!term){
        query = {
          "match_all": {}
        };
      } else {
        query = {
          match: { title: term }
        }
      }

      client.search({
        "index": 'haystack',
        "body": {
          "query": query
        }
      }).then(function(result) {
        var ii = 0, hits_in, hits_out = [];
        hits_in = (result.hits || {}).hits || [];
        for(;ii < hits_in.length; ii++){
          hits_out.push(hits_in[ii]._source);
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
});
