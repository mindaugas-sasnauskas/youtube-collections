
function showSubscriptions2() {
  var q = $('#query').val();
  var request = gapi.client.youtube.subscriptions.list({
    q: q,
    part: 'snippet',
    type:'channel',
    mine:true,
    maxResults: 10
  });

  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    var channelTitle = JSON.stringify(response.result.items[0].snippet.title);
    $('#search-container2').html('<i>' + channelTitle + '</i>');
    $('#search-container').html('<pre>' + str + '</pre>');
    console.log(response.result);
  });
}
