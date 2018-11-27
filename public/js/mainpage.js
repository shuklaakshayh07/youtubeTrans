var page=1;

window.addEventListener('scroll', function() {
	console.log("working");
   if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
   	console.log("trigger");
   	page++;
   	console.log(page);
   	console.log($(".videosRow").html());
   	$.get("?page="+page).done(function(data){
   		console.log("1st");
   		var newHtml=$(data);
   		console.log("data",newHtml);
   		$(".videosRow").html(newHtml[19]);		
   	})
   	console.log("2nd");
   }
});