require("dotenv").config();

//npm require
var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');


//twitter npm specific call to get keys to twitter account
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var input = process.argv;
var command = input[2];

//request
var name = "";
for (i = 3; i < input.length; i++) {
	name = name + " " + input[i];
}

name = name.trim().replace(" ", "+");
if (command === "my-tweets") {
	    		
	var params = {screen_name: 'lspro333', limit: 20};
	
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    for (var i = tweets.length - 1; i >= 0; i--) {
	    	var myTweets = 
	    		"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++" + "\r\n" + "\r\n" +
	    		"Tweet Number: " + (tweets.length-i) + "\r\n" +
	    		"Posted on: " + tweets[i].created_at + "\r\n" +
	    		"Tweet Posted: " + tweets[i].text + "\r\n" + "\r\n" + "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
	    	console.log(myTweets);
	    	writeToLog(myTweets);
			} 
		}
	})
}

else if (command === "spotify-this-song") {
	if (name === "") {
  		name = "The Sign"
  	}
	//same song info as above but looking at info for "The Sign" by Ace of Base.
	spotify.search({ type: 'track', query: name, limit: 6 }, function(err, data) {
 	if (err) {
    	return console.log('Error occurred: ' + err);
  	}
  	
  	// console.log(JSON.stringify(data, null, 2));
  	// console.log(data);
  	var track = data.tracks.items[5];
    var mySong =
		"-----------------------------------------------------------------------" + "\r\n" +
		"Song Title: " + name + "\r\n" +
		"Artist: " + track.artists[0].name + "\r\n" +
		"Album: " + track.album.name + "\r\n" + 
		"Preview Link: " + track.preview_url + "\r\n" +
		"-----------------------------------------------------------------------" + "\r\n"
		console.log(mySong);
		writeToLog(mySong);
	})

}

else if (command === "movie-this") {
 	//If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
 	if (name === "") {
 		name = "Mr. Nobody";
 	}

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy";


	request.get(queryUrl, function(error, response, body) {
		
    	// console.log(response);
	  	if (!error && response.statusCode === 200) {
	  		//var body = JSON.parse(body);
	  		for (i = 0; i < JSON.parse(body).Ratings.length; i++) {
	  			if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
	  				tomatoesRating = JSON.parse(body).Ratings[i].Value;
	  				// console.log(tomatoesRating);
	  			}
	  			if (JSON.parse(body).Ratings[i].Source === "Internet Movie Database") {
	  				internetRating = JSON.parse(body).Ratings[i].Value;
	  				// console.log(internetRating);
	  			}
	  		}
	  		// Display Title of the movie, Year the movie came out, IMDB Rating of the movie, Rotten Tomatoes Rating of the movie, Country where the movie was produced, Language of the movie, Plot of the movie, Actors in the movie.
	  		var myMovie =
  			"-----------------------------------------------------------------------" + "\r\n" +
    		"Movie Title: " + JSON.parse(body).Title + "\r\n" +
    		"Year movie released: " + JSON.parse(body).Year + "\r\n" +
    		"Movie rating: " + JSON.parse(body).Rated + "\r\n" + 
    		"Rotten Tomatoes Rating: " + tomatoesRating + "\r\n" +
    		"Internet Movie Database Rating: " + internetRating + "\r\n" +
    		"Country: " + JSON.parse(body).Country + "\r\n" + 
    		"Language: " + JSON.parse(body).Language + "\r\n" + 
    		"Movie Plot: " + JSON.parse(body).Plot + "\r\n" +
    		 "-----------------------------------------------------------------------" + "\r\n"
    		console.log(myMovie);
    		writeToLog(myMovie);

  		}
	});

}

if (command === "do-what-it-says") {
	// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
	// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
	// Feel free to change the text in that document to test out the feature for other commands.
	fs.readFile("random.txt", "utf8", function(error, data) {

  // If the code experiences any errors it will log the error to the console.
		if (error) {
			return console.log(error);
		}
		// console.log(data);
		// Then split it by commas (to make it more readable)
		var nameArr = data.split(",");
		// // We will then re-display the content as an array for later use.
		// console.log(nameArr);

		name = nameArr[1]
		// console.log(name);

		spotify.search({ type: 'track', query: name, limit: 1 }, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
			
			// console.log(JSON.stringify(data, null, 2));
			// console.log(data);
			var track = data.tracks.items[0];
			var randomSong =
				"-----------------------------------------------------------------------" + "\r\n" +
				"Song Title: " + name + "\r\n" +
				"Artist: " + track.artists[0].name + "\r\n" +
				"Album: " + track.album.name + "\r\n" + 
				"Preview Link: " + track.preview_url + "\r\n" +
				"-----------------------------------------------------------------------" + "\r\n"
			console.log(randomSong);
			writeToLog(randomSong);
		})

	});
}


