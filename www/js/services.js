angular.module('starter.services', [])

.factory('recipeService',
  ['$q', 'esFactory', '$location', function($q, elasticsearch, $location){
    var client = elasticsearch({
      //host: $location.host() + ":9200"
      host: "http://es.phodal.com/"
    });

    var search = function(term, offset){
      var deferred = $q.defer();
      var query = {
        "match_all": {}
      };

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
;
