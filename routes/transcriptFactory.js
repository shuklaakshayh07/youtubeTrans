var getCaption = require('../routes/getCaptions.js')
let videoIds = ['5-vNmVor6Ug','FdIrbyMGvmw'];
for(var i = 0;i<videoIds.length;i++)
{	console.log("abc");
    var id = videoIds[i];
	getCaption.processVideo(id,i);
	console.log("def");
}



function processVideo(videoId,index){
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
  console.log(videoIds[0],transcript.slice(0,100));
  client.index({
     index: 'caption_you',
     id: 60+index,
     type: 'trans',
     body: {
         "transcript": transcript,
         "videoId": videoIds[0],
         
     }
 }, function(err, resp, status) {
     if(!err)
     {console.log(resp);
 	  transcriptProcess(words);
 	  console.log("okay");
 	 }
 });
})
.catch(err => {
  console.log(err)	
})
}


function transcriptProcess(words)
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
 biMap.forEach(indexDoc);
 // console.log("key:",k,"value:",val);

}

function indexDoc(value,key,map)
{	if(val<value)
	{
		val=value;
		k=key;
	}

	client.index({
	 index: 'caption_you',
     id: 15,
     type: 'wordCount',
     body: { 
         "words": key,
         "count": value,
         "videoId":videoIds[0],
     }
	},function(err, resp, status) {
     if(!err)
     {console.log(resp);
 	  // transcriptProcess(words);
 	  console.log("okay");
 	 }
 });
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