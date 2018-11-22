var elasticsearch = require('elasticsearch');
var nGram = require('n-gram');
var getYoutubeSubtitles = require('@joegesualdo/get-youtube-subtitles-node');
var async = require('async');

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

var val=0;
var k;
var videoIds=[];
var request = require('request');
var nextPageToken;

fetchChannelVideos(function() {},'UCu3Ri8DI1RQLdVtU12uIp1Q',"");

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
				getYoutubeSubtitlesAndIndex(video);
				callback();
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

function getYoutubeSubtitlesAndIndex(video){
	var finalString = '';
	var transcript = '';
	getYoutubeSubtitles(video.videoId, {type: 'nonauto'})
	.then(subtitles => { 
		var words = [];	
		subtitles.forEach(function(sub){
		  	var word
		  	var temps = sub.words
		  	temps.forEach(function(word){
		  		words.push(word.word);
		  	});
		  	finalString += words.toString();
		  	transcript += sub.part + "";
		});
        var date = new Date().getTime();
	  	client.index({
	     	index: 'caption_you',
	     	id: video.videoId,
	     	type: 'trans',
	     	body: {
	         	"transcript": transcript,
	         	"videoId": video.videoId,
	         	"title" : video.title,
				"description" : video.description,
				"thumbnails" : video.thumbnails,
				"createdAt": date
	     	}
	 	}, function(err, resp, status) {
	     	if(!err){
	     		console.log(resp);
	 	  		transcriptProcess(words,video.videoId);
	 	 	}
	 	});
	})
	.catch(err => {
	  console.log(err);	
	})
}

function transcriptProcess(words,videoId){
 	var bigram = nGram.bigram(words);
 	var trigram = nGram.bigram(words);
 	var biMap=new Map();
 	bigram.forEach(function(wordSet){	
 		var temp = wordSet[	0] + " " +wordSet[1];
 		if(biMap.has(temp)){
 			biMap.set(temp,biMap.get(temp)+1);
 		}else{
 			biMap.set(temp,1);
 		}
 	})
 	var i=0;
 	for (var [key, value] of biMap) {
  		indexWord(key,value,'bi',i,videoId);
  		i++;
	}
}

function indexWord(key,value,type,i,videoId)
{	
	if(val<value){
		val=value;
		k=key;
	}
	
	client.index({
	 	index: 'caption_you',
     	id: videoId+":"+type+":"+i,
     	type: 'wordCount',
     	body: { 
         	"words": key,
         	"count": value,
         	"videoId":videoId,
     	}
	});
}