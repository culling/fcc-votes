$('document').ready(function() {
    console.log("javascript Loaded");

    showPolls();
});

function showPolls(){
    var pollsURL = "/api/polls";
    console.log(pollsURL);
    $.getJSON(pollsURL, function(returnValue){
        console.log(returnValue);
    });

};