
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
// exports.stopVidAndCloseModal = stopVidAndCloseModal;
