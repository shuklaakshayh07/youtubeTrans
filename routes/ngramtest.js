var nGram = require('n-gram');
var arr=nGram.bigram(['alpha', 'bravo', 'charlie','alpha', 'bravo']);
arr.forEach(function(element){
	console.log(element);
});
