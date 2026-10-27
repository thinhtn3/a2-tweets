class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        //look at how the tweet starts to figure out what kind it is
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        else if (this.text.startsWith("Watch my")) {
            return "live_event";
        }
        else if (this.text.startsWith("Achieved") || this.text.startsWith("I just set a goal")) {
            return "achievement";
        }
        else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.source != 'completed_event') {
            return false;
        }
        //if it has one of these phrases then runkeeper wrote it, not the user
        if (this.text.includes("Check it out!") || this.text.includes("- TomTom MySports Watch")) {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        //the user's text is after the " - " and before the link
        let start = this.text.indexOf(" - ") + 3;
        let end = this.text.indexOf("http");
        return this.text.substring(start, end).trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        let words = this.text.split(" ");
        let type = "";
        if (words[4] == "km" || words[4] == "mi") {
            //like "Just completed a 4.87 km run with @Runkeeper"
            //the activity starts at word 5, some are two words like "mtn bike"
            let i = 5;
            while (words[i] != "with" && words[i] != "-" && !words[i].startsWith("http")) {
                type = type + words[i] + " ";
                i++;
            }
        }
        else {
            //like "Just posted a swim in 0:14", there is no distance here
            let i = 3;
            while (words[i] != "in" && words[i] != "-" && !words[i].startsWith("http")) {
                type = type + words[i] + " ";
                i++;
            }
        }
        return type.trim();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        let words = this.text.split(" ");
        //word 3 is the number and word 4 is km or mi
        if (words[4] == "km") {
            return parseFloat(words[3]) / 1.609;
        }
        else if (words[4] == "mi") {
            return parseFloat(words[3]);
        }
        else {
            //things like swims and workouts don't have a distance
            return 0;
        }
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        //change the link in the tweet into a clickable link
        let tweetText = this.text.replace(/(https?:\/\/\S+)/g, "<a href='$1'>$1</a>");
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + tweetText + "</td></tr>";
    }
}