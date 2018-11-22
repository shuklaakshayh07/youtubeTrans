var i;
var j = 10;
for (i = 0; i < j; i++) {

    asynchronousProcess(function() {
        alert(i);
    });
}