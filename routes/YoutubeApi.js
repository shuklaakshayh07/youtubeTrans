// var utils = require('../utils.js');
// var async = require('async');
// var client = utils.client;

var youtubeId = ["pL-cNDjZruE","5-vNmVor6Ug","M-8woWsHW-U"];
$.getJSON('https://www.googleapis.com/youtube/v3/videos?part=statistics&id=Qq7mpb-hCBY&key=AIzaSyDb1QhtiZVjW6EVSQoMSjx6ZhYWolpRhXQ', function(data) {
    alert("viewCount: " + data.items[0].statistics.viewCount);
  });