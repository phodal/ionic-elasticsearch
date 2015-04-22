angular.module('starter.services', [])

.factory('recipeService',
  ['$q', 'esFactory', '$location', function($q, elasticsearch, $location){
    var client = elasticsearch({
      host: "es.phodal.com/"
    });

    /**
     * Given a term and an offset, load another round of 10 recipes.
     *
     * Returns a promise.
     */
    var search = function(term, offset){
      var deferred = $q.defer();
      var query = {
        "match": {
          "_all": term
        }
      };

      client.search({
        "index": 'haystack',
        "body": {
          "size": 10,
          "from": (offset || 0) * 10,
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

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
