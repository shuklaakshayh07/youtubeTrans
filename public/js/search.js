
window.showTranscript = showTranscript;

var showTranscript=function(id){
	var transcriptDiv="viewMore-"+id;
 	// console.log($("."+transcriptDiv).show());
 	// console.log($("."+transcriptDiv).css("display","block"));
 	if($("#"+transcriptDiv).hasClass('hide'))
 	$("#"+transcriptDiv).removeClass('hide');
 	else
 	$("#"+transcriptDiv).addClass('hide');	
}
window.highlightWord = highlightWord;
var highlightWord=function(id){
	var searchInputId="search-"+id;
	var keywordQuery=$("#"+searchInputId).val().toUpperCase();
	var transcript=""+String($("#transcript-"+id).html());
	transcript=resetFormatting(transcript);
	console.log("transcript",transcript);
	var tempTranscript=transcript.toUpperCase();
	var index=tempTranscript.indexOf(keywordQuery);

	console.log("index",index);
	var queryLen=keywordQuery.length;
	var result="";
	while(index!=-1)
			{	
				result+=transcript.substring(0,index);
				transcript=transcript.substring(index);
				result+="<mark>"+transcript.substring(0,queryLen)+"</mark> ";
				transcript=transcript.substring(queryLen);
				tempTranscript=tempTranscript.substring(index+queryLen);
				index=tempTranscript.indexOf(keywordQuery);
				// console.log(result,":::::::");
			}
	result+=transcript;


	console.log(result);
	$("#transcript-"+id).find("p").replaceWith(result);
}

// exports.stopVidAndCloseModal = stopVidAndCloseModal;
