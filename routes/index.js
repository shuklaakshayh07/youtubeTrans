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
var async = require("async");
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
      // console.log(result);
     res.render('mainPage',{tags:result}); 
      
      // return result;
    }

});

// console.log(abc);
  // console.log(fetchTags.getTags());
     // console.log("abcd123",abc);


};
exports.searchVideo=function(req,res){ 
		var url=req.url;
		console.log("abc",url);
		// console.log(req);
		var result = [];
		var videoIds = [];
		var queryTerm={};
		console.log(url.lastIndexOf("/search?q="));
		if(url.lastIndexOf("/search?q=")!=-1)
		{	console.log("true");
			queryTerm=url.slice(url.lastIndexOf("/search?q"));
		}
		if(url=="/search")
        queryTerm=req.body['search_query'];
    	console.log(queryTerm);
 		client.search({
		  index: 'caption_you',
		  type: 'wordCount',
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
      response.hits.hits.forEach(function(hit){
       var count=videoIds.length;
       var flag=false;
    	for(var i=0;i<=count;i++)
    	{
        if(videoIds[i]==hit._source.videoId){
        	flag=true;
        }
    	}
    	if(!flag)
    		// result.push(populateVideo(hit._source.videoId);
    		videoIds.push(hit._source.videoId);
      })
      // console.log("videoIds",videoIds);
      // var videoIdCount = 9999999;
      var i=1;
      videoIds.forEach(function(videoId){
		client.search({
		  index: 'caption_you',
		  type: 'trans',
		  // sort: [{ "count": { "order": "desc" } }],
    //       size: 10,
	      body: {
        	size: 10,
        	query: {
            	match: {
                "_id":videoId
            }
        }
    		}
		},function (error, response,status) {
    if (error){
      console.log("search error: "+error)
   		 }
   		 else{	
   		 	var videoIdCount = videoIds.length;
   		 		// console.log(response.hits.hits);
   		 	var temp = {};
    		temp["videoId"]=response.hits.hits[0]._source.videoId;
    		temp["title"]=response.hits.hits[0]._source.title;
    		temp["description"]=response.hits.hits[0]._source.description;
    		// console.log("temp",temp);
    		result.push(temp);
    		if(i==videoIdCount)
    		{
    			 res.render('search',{links:result}); 
    		}
    		else{
    			i++
    		}
   		 	      // response.hits.hits.function() {}orEach(function(hit){
			      // console.log(hit);
			       
			     //   var flag=false;
			    	// for(var i=0;i<=count;i++)
			    	// {
			     //    if(videoIds[i]==hit._source.videoId){
			     //    	flag=true;
			     //    }
			    	// }
			    	// if(!flag)
			    	// 	videoIds.push(hit._source.videoId);
			    	  
			     //    // result.push(hit._source.words);
			     //  })



   		 // 	var temp = {};
    		// temp["videoId"]=hit._source.videoId;
    		// temp["title"]=hit._source.title;
    		// temp["description"]=hit._source.description;
    		// result.push(temp);})

   		 }      
   		})

      
      // return result;
    	

	})
     // console.log("result 123",result);
     // res.render('search',{links:result}); 

      
      // return result;
    	}

	});
};
