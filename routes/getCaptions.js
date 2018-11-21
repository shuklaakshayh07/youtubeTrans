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
// for(var i=0 ;i<videoIds.length;i++)
// {
// async.forEachOfSeries(videoIds, function(videoId, index, callback) {
var finalString='';

getYoutubeSubtitles(videoIds[0], {type: 'nonauto'})
.then(subtitles => { var transcript = '';
	var words = [];	
	// var words = [];
  subtitles.forEach(function(sub)
  {
  	var word;
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
  client.index({
     index: 'caption_you',
     id: 150015,
     type: 'trans',
     body: {
         "transcript": finalString,
         "videoId": videoIds[0],
         
     }
 }, function(err, resp, status) {
     if(!err)
     {console.log(resp);
 	  transcriptProcess(words);
 	 }
 });
})
.catch(err => {
  console.log(err)	
})
// }


function transcriptProcess(words)
{
 // words.forEach(function(word){
 // 	console.log(word);
 // })	
 var bigram = nGram.bigram(words);
 var trigram = nGram.bigram(words);
 var biMap=new Map();
 bigram.forEach(function(wordSet)
 {
 	if(biMap.has(wordSet))
 		{
 			biMap.set(wordSet,biMap.get(wordSet)+1);
 		}
 	else
 		biMap.set(wordSet,1);
 })	
 biMap.forEach(indexDoc);
 console.log("key:",k,"value:",val);

}

function indexDoc(value,key,map)
{	if(val<value)
	{
		val=value;
		k=key;
	}
	// console.log(key+" "+value);
}

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