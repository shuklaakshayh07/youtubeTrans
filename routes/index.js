var async = require("async");
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

exports.index = function(req, res){
	res.render('index', { title: 'Youtube Transcript & Keywords' });
};

exports.about = function(req,res){
	res.render('index',{title:'about'});
};

exports.mainPage = function(req,res){
	var result = [];
	client.search({  
		index: 'youtube_entities',
		type: 'entities',
		body: {
			sort: [{ "frequency": { "order": "desc" } }],
			size: 1000,
			query: { match_all: {}}
		}
	},function (error, response,status) {
		if (error){
			console.log("search error: "+error)
		}
		else {
			response.hits.hits.forEach(function(hit){
				if(result.indexOf(hit._source.text) == -1){
					result.push(hit._source.text);
				}
			});

			result = result.slice(0,32);
			var page;
			if(!req.query.page)
				{req.query.page=1;
				 page=1;
				}
			else{
				page=req.query.page;
			}
            var videos = [];
			client.search({
				index: 'youtube_entities',
				type: 'youtube_meta',
				body: {
					sort: [{ "createdAt": { "order": "desc" } }],
					size: 10*page
				}
			}).then(function(resp) {
				resp.hits.hits.forEach(function(doc){
					videos.push(doc._source);
				});
				res.render('mainPage',{tags:result,videos:videos}); 
			});
		}
	});
};

exports.showVideo = function(req,res){
	var url = req.url;
	var index = url.lastIndexOf('/');
	var videoId = url.slice(index + 1);
	client.search({
		index: 'youtube_entities',
		type: 'youtube_meta',
			body: {
				query: {
					match: {
						"videoId": videoId
					}
				}	
			}
	},function(error,response,status) {
		if(error){
			console.log("ES search error",error);
		}
		else{
			var data = response["hits"]["hits"][0]["_source"];
			data.entities = data.entities.split(",");
			res.render('videoInfo',{data:data}); 
		}
	});
}

exports.searchVideoTag = function(req,res){
	var url = req.url;
	var index = url.lastIndexOf('/');
	var tag = url.slice(index + 1);
	searchVideo(tag,req,res);
};

exports.searchVideo = function(req,res){ 
	var url = req.url;
	var queryTerm = {};
	if(url.lastIndexOf("/search?q=")!=-1){
		queryTerm = url.slice(url.lastIndexOf("/search?q"));
	}
	if(url == "/search"){
		queryTerm = req.body['search_query'];
	}
    searchVideo(queryTerm,req,res);
};

var searchVideo = function(queryTerm,req,res){
	var result = [];
	var videoIds = [];
	client.search({
		index: 'youtube_entities',
		type: 'entities',
		body: {
			sort: [{ "frequency": { "order": "desc" } }],
			size: 50,
			query: {
				term: {
					"text": queryTerm
				}
			}
		}
	},function (error, response,status) {
		if (error){
			console.log("search error: "+error)
		}
		else {
			response.hits.hits.forEach(function(hit){
				var count = videoIds.length;
			 	var flag=false;
				for(var i = 0;i <=count;i++)
				{
					if(videoIds[i] == hit._source.videoId){
						flag = true;
					}
				}
				if(!flag){
					videoIds.push(hit._source.videoId);
				}
			});

			var i = 1;
			videoIds.forEach(function(videoId){
				client.search({
					index: 'youtube_entities',
					type: 'youtube_meta',
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
						var temp = {};
						temp["videoId"] = response.hits.hits[0]._source.videoId;
						temp["title"] = response.hits.hits[0]._source.title;
						temp["description"] = response.hits.hits[0]._source.description;
						temp["thumbnail"] = response.hits.hits[0]._source.thumbnail;
						temp["transcript"] = response.hits.hits[0]._source.transcript;
						temp["entities"] = response.hits.hits[0]._source.entities.split(",");
						result.push(temp);
						if(i == videoIdCount){
							res.render('search',{links:result,term:queryTerm}); 
						}
						else{
							i++
						}
					}      
				})
			})
		}
	});
}
