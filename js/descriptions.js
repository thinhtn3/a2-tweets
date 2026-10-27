//the tweets that the user wrote, filled in when the page loads
var written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	for (var i = 0; i < runkeeper_tweets.length; i++) {
		var tweet = new Tweet(runkeeper_tweets[i].text, runkeeper_tweets[i].created_at);
		if (tweet.written) {
			written_tweets.push(tweet);
		}
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	var searchBox = document.getElementById('textFilter');
	searchBox.addEventListener('input', function() {
		var searchText = searchBox.value;
		var rows = "";
		var count = 0;

		//if the box is empty, table stays empty
		if (searchText != "") {
			for (var i = 0; i < written_tweets.length; i++) {
				//lowercase both to commonize comparison
				if (written_tweets[i].writtenText.toLowerCase().includes(searchText.toLowerCase())) {
					count = count + 1;
					rows = rows + written_tweets[i].getHTMLTableRow(count);
				}
			}
		}

		document.getElementById('searchCount').innerText = count;
		document.getElementById('searchText').innerText = searchText;
		document.getElementById('tweetTable').innerHTML = rows;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
