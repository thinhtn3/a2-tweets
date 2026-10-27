function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	//count how many tweets there are for each activity type
	var counts = {};
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == 'completed_event') {
			var type = tweet_array[i].activityType;
			if (counts[type] === undefined) {
				counts[type] = 1;
			}
			else {
				counts[type] = counts[type] + 1;
			}
		}
	}

	//turn the counts into a list, so it can be sorted and graphed
	var activityData = [];
	for (var type in counts) {
		activityData.push({activity: type, count: counts[type]});
	}
	activityData.sort(function(a, b) {
		return b.count - a.count;
	});

	document.getElementById('numberActivities').innerText = activityData.length;
	document.getElementById('firstMost').innerText = activityData[0].activity;
	document.getElementById('secondMost').innerText = activityData[1].activity;
	document.getElementById('thirdMost').innerText = activityData[2].activity;

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
	    "x": {"field": "activity", "type": "nominal"},
	    "y": {"field": "count", "type": "quantitative"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	//get the day and distance for each tweet of the top 3 activities
	var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var distanceData = [];
	for (var i = 0; i < tweet_array.length; i++) {
		var type = tweet_array[i].activityType;
		if (type == activityData[0].activity || type == activityData[1].activity || type == activityData[2].activity) {
			distanceData.push({
				activity: type,
				day: days[tweet_array[i].time.getDay()],
				distance: tweet_array[i].distance
			});
		}
	}

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distance of each activity by day of the week.",
	  "data": {
	    "values": distanceData
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "ordinal", "sort": days},
	    "y": {"field": "distance", "type": "quantitative"},
	    "color": {"field": "activity", "type": "nominal"}
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	//same graph except y = the mean of the distances
	distance_mean_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distance of each activity by day of the week.",
	  "data": {
	    "values": distanceData
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "ordinal", "sort": days},
	    "y": {"field": "distance", "type": "quantitative", "aggregate": "mean"},
	    "color": {"field": "activity", "type": "nominal"}
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_mean_vis_spec, {actions:false});

	//means graph hidden initially, the button alternates between the 2 graphs
	document.getElementById('distanceVisAggregated').style.display = 'none';
	document.getElementById('aggregate').addEventListener('click', function() {
		var button = document.getElementById('aggregate');
		if (button.innerText == 'Show means') {
			document.getElementById('distanceVis').style.display = 'none';
			document.getElementById('distanceVisAggregated').style.display = 'block';
			button.innerText = 'Show all activities';
		}
		else {
			document.getElementById('distanceVis').style.display = 'block';
			document.getElementById('distanceVisAggregated').style.display = 'none';
			button.innerText = 'Show means';
		}
	});

	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
