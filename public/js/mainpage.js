var page=1;

window.addEventListener('scroll', function() {
	console.log("working");
   if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
   	console.log("trigger");
   	page++;
   	console.log(page);
   	$.get("?page="+page).done(function(data){
   		var newHtml=$(data);
   		$(".row").html(newHtml[20]);		
   	})
   }
});