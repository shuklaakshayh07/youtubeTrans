// var utils = require('../utils.js');
// var async = require('async');
// var client = utils.client;
// var request = require('request');
// var youtubeId = ["pL-cNDjZruE","5-vNmVor6Ug","M-8woWsHW-U"];
// var abc=getJSON('https://www.googleapis.com/youtube/v3/videos?part=statistics&id=Qq7mpb-hCBY&key=AIzaSyDb1QhtiZVjW6EVSQoMSjx6ZhYWolpRhXQ', function(data) {
//     alert("viewCount: " + data.items[0].statistics.viewCount);
//   });

var elasticsearch = require('elasticsearch');
var nGram = require('n-gram');
var getYoutubeSubtitles = require('@joegesualdo/get-youtube-subtitles-node');
var async = require('async');

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
var val=0;
var k;
 var videoIds=[];
 var check =true;
 var nextPageToken='';
 var i=0;
while(check)
{var apiLink="https://www.googleapis.com/youtube/v3/search?"+nextPageToken+"key=AIzaSyDb1QhtiZVjW6EVSQoMSjx6ZhYWolpRhXQ&channelId=UCu3Ri8DI1RQLdVtU12uIp1Q&part=snippet,id&order=date&maxResults=20";
var request = require('request');
request(apiLink, function (error, response, body) { var videos = [];
    if (!error && response.statusCode == 200) {
        // console.log(body);
        body = JSON.parse(body);
        if(body.nextPageToken)
        {
        	nextPageToken="pageToken="+body.nextPageToken+"&";
        }
        else{
        	nextPageToken='';
        	check = false;
        }
        console.log(nextPageToken);
        var allVideos=body['items']; // Print the google web page.
        // console.log(body.kind);
     	// console.log(allVideos);
     	allVideos.forEach(function(video){
     		var tempObj = {};
     		tempObj["videoId"]=video.id["videoId"];
     		tempObj["title"]=video.snippet["title"];
     		tempObj["description"]=video.snippet["description"];
     		tempObj["thumbnails"]=video.snippet["thumbnails"]["default"]["url"];
     		console.log(tempObj.videoId)
     		videos.push(tempObj);
     		
     	})
        videos.forEach(async video => {
			// for(var i=0 ;i<videos.length;i++)
			 console.log(video);
			// async.forEachOfSeries(videoIds, function(video, index, callback) {
			var finalString='';
			var transcript = '';
			getYoutubeSubtitles(video.videoId, {type: 'nonauto'})
			.then(subtitles => { 
				var words = [];	
				// var words = [];
			  subtitles.forEach(function(sub)
			  {
			  	var word
			  	var temps = sub.words
			  	temps.forEach(function(word)
			  	{
			  		words.push(word.word);
			  		 // caption_younsole.log("word",word);
			  	})
			  	 finalString += words.toString();
			  	 transcript += sub.part + "";
			  	 // console.log("finalString",finalString);
			  	  // console.log("transcript",transcript);
			  	  
			  	  // console.log("here",sub);
			  })
			  // console.log(video.videoId,transcript.slice(0,100));
			  client.index({
			     index: 'caption_you',
			     id: video.videoId,
			     type: 'trans',
			     body: {
			         "transcript": transcript,
			         "videoId": video.videoId,
			         "title" : video.title,
						"description" : video.description,
						"thumbnails" : video.thumbnails
			         
			     }
			 }, function(err, resp, status) {
			     if(!err)
			     {console.log(resp);
			     	  	  // console.log("transcript",transcript.slice(0,100));

			 	  transcriptProcess(words,video.videoId);
			 	  console.log("okay");
			 	 }
			 });
			})
			.catch(err => {
			  console.log(err)	
			})
			})
    }
			     })}
function transcriptProcess(words,videoId)
{console.log("transcriptProcess called");
 // words.forEach(function(word){
 // 	console.log(word);
 // })	
 var bigram = nGram.bigram(words);
 var trigram = nGram.bigram(words);
 var biMap=new Map();
 bigram.forEach(function(wordSet)
 {	var temp = wordSet[	0] + " " +wordSet[1];
 	if(biMap.has(temp))
 		{	//console.log(temp);
 			biMap.set(temp,biMap.get(temp)+1);
 		}
 	else
 		{	//console.log("!",temp);
 			biMap.set(temp,1);}
 	// console.log(wordSet,":",biMap.get(wordSet));
 })
 var i=0;
 for (var [key, value] of biMap) {
  console.log(key + ' = ' + value);
  indexWord(key,value,'bi',i,videoId);
  i++;
}

}

function indexWord(key,value,type,i,videoId)
{	if(val<value)
	{
		val=value;
		k=key;
	}
	console.log(videoId);
	client.index({
	 index: 'caption_you',
     id: videoId+":"+type+":"+i,
     type: 'wordCount',
     body: { 
         "words": key,
         "count": value,
         "videoId":videoId,
     }
	},function(err, resp, status) {
     if(!err)
     {console.log(resp);
 	  // transcriptProcess(words);
 	  console.log("okay");
 	 }
 });
}
			   

// var optionsget = {
//     host : 'graph.facebook.com', // here only the domain name
//     // (no http/https !)
//     port : 443,
//     path : '/youscada', // the rest of the url with parameters if needed
//     method : 'GET' // do GET
// };

// console.info('Options prepared:');
// console.info(optionsget);
// console.info('Do the GET call');

// // do the GET request
// var reqGet = https.request(optionsget, function(res) {
//     console.log("statusCode: ", res.statusCode);
//     // uncomment it for header details
// //  console.log("headers: ", res.headers);


//     res.on('data', function(d) {
//         console.info('GET result:\n');
//         process.stdout.write(d);
//         console.info('\n\nCall completed');
//     });

// });

// reqGet.end();
// reqGet.on('error', function(e) {
//     console.error(e);
// });
