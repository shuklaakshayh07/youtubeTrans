var page = 1;

window.addEventListener('scroll', function() {
   if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
   	page++;
   	$.get("?page="+page).done(function(data){
   		var newHtml=$(data);
   		$(".videosRow").html(newHtml[19]);		
   	})
   }
});