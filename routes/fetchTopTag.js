var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({});
client.ping({
     requestTimeout: 30000,
 }, function(error) {
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });
exports.getTags=function (){
  var result = [];
client.search({  
  index: 'caption_you',
  type: 'wordCount',
  body: {
        sort: [{ "count": { "order": "desc" } }],
        size: 10,
        query: { match_all: {}}
     }
},function (error, response,status) {
    if (error){
      console.log("search error: "+error)
    }
    else {
      console.log("--- Response ---");
      console.log(response);
      console.log("--- Hits ---");
      response.hits.hits.forEach(function(hit){
      // console.log(hit._source.words,hit._source.count);
      result.push(hit._source.words);
        // result.push(hit._source.words);
      })
      // console.log(result);
      
      return result;
    }
});

}