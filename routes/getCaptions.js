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

let videoIds = ['5-vNmVor6Ug','FdIrbyMGvmw'];
var k;
var val=0;
async function fetchtans (videoIds) {
  videoIds.forEach(async videoId => {
// for(var i=0 ;i<videoIds.length;i++)
 console.log(videoId);
// async.forEachOfSeries(videoIds, function(videoId, index, callback) {
var finalString='';
var transcript = '';
getYoutubeSubtitles(videoId, {type: 'nonauto'})
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
  console.log(videoId,transcript.slice(0,100));
  client.index({
     index: 'caption_you',
     id: videoId,
     type: 'trans',
     body: {
         "transcript": transcript,
         "videoId": videoId,
         
     }
 }, function(err, resp, status) {
     if(!err)
     {console.log(resp);
     	  	  // console.log("transcript",transcript.slice(0,100));

 	  transcriptProcess(words,videoId);
 	  console.log("okay");
 	 }
 });
})
.catch(err => {
  console.log(err)	
})
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
  indexWord(key,value,i,videoId);
  i++;
}

}

function indexWord(key,value,i,videoId)
{	if(val<value)
	{
		val=value;
		k=key;
	}
	console.log(videoId);
	client.index({
	 index: 'caption_you',
     id: videoId+":"+i,
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
fetchtans(videoIds);
// console.log(words.length);

 // client.index({
 //     index: 'caption_you',
 //     id: 10001+id,
 //     type: 'trans',
 //     body: {
 //         "transcript": finalString,
 //         "videoId": videoId[i],
         
 //     }
 // }, function(err, resp, status) {
 //     console.log(resp);
 // });
// callback();
// }