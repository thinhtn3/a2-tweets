function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	//loop through all the tweets, get counts and dates for each type of tweets
	var earliest = tweet_array[0].time;
	var latest = tweet_array[0].time;
	var completed = 0;
	var live = 0;
	var achievements = 0;
	var miscellaneous = 0;
	var written = 0;
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].time < earliest) {
			earliest = tweet_array[i].time;
		}
		if (tweet_array[i].time > latest) {
			latest = tweet_array[i].time;
		}

		if (tweet_array[i].source == 'completed_event') {
			completed = completed + 1;
			if (tweet_array[i].written) {
				written = written + 1;
			}
		}
		else if (tweet_array[i].source == 'live_event') {
			live = live + 1;
		}
		else if (tweet_array[i].source == 'achievement') {
			achievements = achievements + 1;
		}
		else {
			miscellaneous = miscellaneous + 1;
		}
	}

	var dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-US', dateOptions);
	document.getElementById('lastDate').innerText = latest.toLocaleDateString('en-US', dateOptions);

	// classes in html, multiple span of diff class name to fill up
	setText('completedEvents', completed);
	setText('completedEventsPct', getPercent(completed, tweet_array.length));
	setText('liveEvents', live);
	setText('liveEventsPct', getPercent(live, tweet_array.length));
	setText('achievements', achievements);
	setText('achievementsPct', getPercent(achievements, tweet_array.length));
	setText('miscellaneous', miscellaneous);
	setText('miscellaneousPct', getPercent(miscellaneous, tweet_array.length));
	setText('written', written);
	setText('writtenPct', getPercent(written, completed));
}

//helper to round the percent to 2 decimal
function getPercent(part, total) {
	return math.format(part / total * 100, {notation: 'fixed', precision: 2}) + '%';
}

//replace the text in every span of the class name
function setText(className, text) {
	var spans = document.getElementsByClassName(className);
	for (var i = 0; i < spans.length; i++) {
		spans[i].innerText = text;
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
