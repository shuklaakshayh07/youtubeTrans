var elasticsearch = require('elasticsearch');
var nGram = require('n-gram');
var getYoutubeSubtitles = require('@joegesualdo/get-youtube-subtitles-node');
var async = require('async');
var request = require('request');

var client = new elasticsearch.Client({});
client.ping({
	requestTimeout: 30000,
		},function(error) {
	 	if (error) {
	     	console.error('elasticsearch cluster is down!');
	 	} else {
	     	console.log('Everything is ok');
	 	}
	});


fetchChannelVideos(function() {},'UCu3Ri8DI1RQLdVtU12uIp1Q',"");

var nextPageToken;
var val = 0;
var k;

function fetchChannelVideos(functionCallback, channelId, nextPageToken) {
	console.log("IN fetchChannelVideos method");
	var apiLink='https://www.googleapis.com/youtube/v3/search?key=AIzaSyDb1QhtiZVjW6EVSQoMSjx6ZhYWolpRhXQ&channelId=UCu3Ri8DI1RQLdVtU12uIp1Q&part=snippet,id&order=date&maxResults=50&pageToken='+nextPageToken;
	request(apiLink, function (error, response, body) { 
		var videos = [];
	    if (!error && response.statusCode == 200) {
	        body = JSON.parse(body);
	        var allVideos = body['items'];
	        if(body.nextPageToken){
				nextPageToken = body.nextPageToken;
	        }
	        else{
	        	nextPageToken = "";
	        }
	     	allVideos.forEach(function(video){
	     		var tempObj = {};
	     		tempObj["videoId"] = video.id["videoId"];
	     		tempObj["title"] = video.snippet["title"];
	     		tempObj["description"] = video.snippet["description"];
	     		tempObj["thumbnails"] = video.snippet["thumbnails"]["default"]["url"];
	     		videos.push(tempObj);
	     	})

			async.forEachOfSeries(videos, function(video, item, callback) {
				console.log("getYoutubeSubtitlesAndIndex");
				var transcript = '';
                var flag = false;

                //get transcript
				getYoutubeSubtitles(video.videoId, {type: 'nonauto'})
				.then(subtitles => { 
					subtitles.forEach(function(sub){
					  	transcript += sub.part + "";
					});
			        var date = new Date().getTime();

			        //process transcript
			        var url = 'http://data.cube365.net/free/entity/extract';
				    var formData = {
				    	freeText : transcript,
				    	select_method : 4,
				    	frequency_count : 1
				    };
				    var headers = { 
					    'Content-Type': 'application/x-www-form-urlencoded' 
					};
				    request.post({
					   	url: url,
					   	form: formData,
					   	headers: headers,
					   	method: 'POST'
					},function (e, r, body) {
						body = JSON.parse(body);
						var finalList = [];
						var frequencyMap = new Map();

						if(body["result"]["frequency_analysis"][0] && body["result"]["frequency_analysis"][0]["unigramsList"]){
							var unigramList = body["result"]["frequency_analysis"][0]["unigramsList"];
							unigramList.forEach(function(word){
								frequencyMap.set(word.word,word.frequency);
								finalList.push(word.word);
							});
						}

						if(body["result"]["frequency_analysis"][1] && body["result"]["frequency_analysis"][1]["bigramsList"]){
							var bigramsList = body["result"]["frequency_analysis"][1]["bigramsList"];
							bigramsList.forEach(function(word){
								frequencyMap.set(word.word,word.frequency);
								finalList.push(word.word);
							});
						}

						if(body["result"]["frequency_analysis"][2] && body["result"]["frequency_analysis"][2]["trigramsList"]){
							var trigramsList = body["result"]["frequency_analysis"][2]["trigramsList"];
							trigramsList.forEach(function(word){
								frequencyMap.set(word.word,word.frequency);
								finalList.push(word.word);
							});
						}	

						client.index({
					     	index: 'youtube_entities',
					     	id: video.videoId,
					     	type: 'youtube_meta',
					     	body: {
					         	"transcript": transcript,
					         	"videoId": video.videoId,
					         	"title" : video.title,
								"description" : video.description,
								"thumbnail" : video.thumbnails,
								"entities" : finalList.join(','),
								"createdAt" : new Date().getTime()
					     	}
					 	}, function(err, resp, status) {
					     	if(!err){
					     		indexEntities(frequencyMap,video.videoId).then(function(res){
					     			callback();
					     		}).catch(function(err){
					     			console.log(err);
					     			callback();
					     		})
					 	 	}
					 	});
				  	});
				})
				.catch(err => {
				  	console.log("has no subtitles",video.videoId);
				  	callback();	
				})
			}, function(err) {
                if(!err) {
                    if(nextPageToken && nextPageToken != "") {
                    	fetchChannelVideos(functionCallback, channelId, nextPageToken);
					}
				}
				else{
					console.log("error",err);
				}
			});
		}
	});
}

function indexEntities(frequencyMap,videoId){
	var bulk_operations_array = [];
	return new Promise( function (resolve, reject){
		async.forEachOfSeries(frequencyMap, function([key, value], index, callback) {
			var id = key.trim();
			id = id.replace(" ","_")+ ":" +videoId;

			var bulk_insert_data = {};
			bulk_insert_data["frequency"] = value;
			bulk_insert_data["text"] = key;
			bulk_insert_data["videoId"] = videoId;
            bulk_insert_data["createdAt"] = new Date().getTime();

            var bulk_insert_action = {
				"index": {
					_index : "youtube_entities",
					_type  : "entities",
					_id    : id,

				}
			}

			bulk_operations_array.push(bulk_insert_action, bulk_insert_data);
        	
        	callback();
		},function(err){
			if(!err){
				if(bulk_operations_array.length > 0){
					client.bulk({
						"body" : bulk_operations_array
					}).then(function(response) {
						resolve("response");
					}).catch(function(error) {
						console.log('error while performing bulk operations in ES', error.toString());
						reject(error.toString());
					});
				}
				else{
					resolve("found");
				}
			}
		});
	});
}