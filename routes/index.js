// var express = require('express');
// var router = express.Router();
// // var path = require('path');
// var fetchTags = require("./fetchTopTag.js");
// /* GET home page. */

// exports.tag=function(req,res){
//   var abc =[];
//   var abc=fetchTags.getTags();
    
//      res.render('todo',{todos:abc});

// };
// exports.index = function(req, res){
//   res.render('index', { title: 'TODO APP' });
// };

/* GET home page. */
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
var fetchTags = require("./fetchTopTag.js");


exports.index = function(req, res){
  res.render('index', { title: 'Youtube Transcript & Keywords' });
};
exports.about= function(req,res){
  res.render('index',{title:'about'});
};
exports.mainPage=function(req,res){
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
      // console.log("--- Response ---");
      // console.log(response);
      // console.log("--- Hits ---");
      response.hits.hits.forEach(function(hit){
      // console.log(hit._source.words,hit._source.count);
      result.push(hit._source.words);
        // result.push(hit._source.words);
      })
      console.log(result);
     res.render('mainPage',{tags:result}); 
      
      // return result;
    }

});

// console.log(abc);
  // console.log(fetchTags.getTags());
     // console.log("abcd123",abc);


};
exports.searchVideo=function(req,res){
		var result = [];
        var queryTerm={};
        queryTerm=req.body['search_query'];
 		client.search({
		  index: 'caption_you',
		  type: 'wordCount',
		  // sort: [{ "count": { "order": "desc" } }],
    //       size: 10,
	      body: {
	      	sort: [{ "count": { "order": "desc" } }],
        	size: 10,
        	query: {
            	match: {
                "words": queryTerm
            }
        }
    }
		},function (error, response,status) {
    if (error){
      console.log("search error: "+error)
    }
    else {
      // console.log("--- Response ---");
      // console.log(response);
      // console.log("--- Hits ---");
      response.hits.hits.forEach(function(hit){
      console.log(hit._source.videoId,hit._source.count);
       var count=result.length;
       var flag=false;
    	for(var i=0;i<=count;i++)
    	{
        if(result[i]==hit._source.videoId){
        	flag=true;
        }
    	}
    	if(!flag)
    		result.push(hit._source.videoId);
    	  
        // result.push(hit._source.words);
      })
      console.log("result",result);
      res.render('search',{links:result}); 
      
      // return result;
    	}

	});
};
