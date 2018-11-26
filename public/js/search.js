window.showTranscript = showTranscript;

var showTranscript = function(id){
	var transcriptDiv = "viewMore-"+id;
 	if($("#"+transcriptDiv).hasClass('hide')){
 		$("#"+transcriptDiv).removeClass('hide');
 	}
 	else{
 		$("#"+transcriptDiv).addClass('hide');	
 	}
}

window.highlightWord = highlightWord;

var highlightWord = function(id){
	var searchInputId = "search-"+id;
	var keywordQuery = $("#"+searchInputId).val().toUpperCase();
	var transcript = ""+String($("#transcript-"+id).html());
	transcript = resetFormatting(transcript);
	var tempTranscript = transcript.toUpperCase();
	var index = tempTranscript.indexOf(keywordQuery);

	var queryLen = keywordQuery.length;
	var result = "";
	while(index != -1){	
		result += transcript.substring(0,index);
		transcript = transcript.substring(index);
		result += "<mark>"+transcript.substring(0,queryLen)+"</mark> ";
		transcript = transcript.substring(queryLen);
		tempTranscript = tempTranscript.substring(index+queryLen);
		index = tempTranscript.indexOf(keywordQuery);
	}
	result += transcript;
	$("#transcript-"+id).find("p").replaceWith(result);
}

window.clearSearchText = clearSearchText;

var clearSearchText = function(){
    $('.search-box').val("");
}

var resetFormatting = function(temp){
	var transcript = "";
	var index = temp.indexOf("<mark>");
	while(index != -1){
		transcript += temp.substring(0,index);
		temp = temp.substring(index+6);
		var secIndex = temp.indexOf("</mark>");
		transcript += temp.substring(0,secIndex);
		temp = temp.substring(secIndex+7);
		index = temp.indexOf("<mark>");
	}
	transcript += temp;
	return transcript;
}
