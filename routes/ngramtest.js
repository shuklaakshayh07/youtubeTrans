// var nGram = require('n-gram');
// var async =require('async');
// var arr=nGram.bigram(['alpha', 'bravo', 'charlie','alpha', 'bravo']);
// // arr.forEach(function(element){
// // 	console.log(element);
// async.forEachOfSeries(arr, function(element, index, callback) {
// 	console.log(elements,index);
// }, function (){
// 			console.log('processed all the stats :) ');

// 		});

var output = '';
var array = ['h','e','l','l','o'];
// This is an example of an async function, like an AJAX call
var fetchData = function () {
 return new Promise(function (resolve, reject) {
    resolve();
  });
};
/* 
  Inside the loop below, we execute an async function and create
  a string from each letter in the callback.
   - Expected output: hello
   - Actual output: undefinedundefinedundefinedundefined
*/
for (var i = 0; i < array.length; i++) {
  fetchData(array[i]).then(function () {
    output += array[i];
  });

}
  console.log(output);