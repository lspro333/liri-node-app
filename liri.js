require("dotenv").config();

//npm require
var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');

//Twitter 
var getMyTweets = function () {
	var client = new Twitter(keys.twitter);
	var params = {screen_name: "lspro333"};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			// console.log(tweets);
			for(var i=0; i<tweets.length; i++) {
				console.log(tweets[i].created_at);
				console.log(' ');
				console.log(tweets[i].text);
			}
		}
	})
};

//Spotify
var spotify = new Spotify(keys.spotify);

var getArtistsNames = function(artist) {
	return artist.name;
};

var getSong = function (songName) {
	
	spotify.search({ type: 'track', query: songName }, function(err, data) {
		if ( err ) {
		  console.log('Error occurred: ' + err);
		  return;
		}
	   
	//   console.log(data.tracks.items[0]); 
		var songs = data.tracks.items;
		for(var i=0; i<songs.length; i++) {
			console.log(i);
			console.log('artist(s): ' + songs[i].artists.map(getArtistsNames));
			console.log('song name: ' + songs[i].name);
			console.log('preview song: ' + songs[i].preview_url);
			console.log('album: ' + songs[i].album.name);
			console.log('-----------------------------------');
			}
	})
};

var getMovie = function(movieName) {
	// OMDB API with the movie specified
	request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

	// If the request is successful (i.e. if the response status code is 200)
	if (!error && response.statusCode === 200) {
		var jsonData = JSON.parse(body);

		console.log('Title: ' + jsonData.Title);
		console.log('Year: ' + jsonData.Year);
		console.log('Rated: ' + jsonData.Rated);
		console.log('Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value);
		console.log('Country: ' + jsonData.Country);
		console.log('Language: ' + jsonData.Language);
		console.log('Plot: ' + jsonData.Plot);
		console.log('Actors: ' + jsonData.Actors);
		console.log('---------------------------------------');
		}
	})
};

var pick = function(caseData, functionData) {
	switch(caseData) {
		case 'my-tweets':
			getMyTweets();
			break;
		case 'spotify-this-song':
			getSong(functionData);
			break;
		case 'movie-this':
			getMovie(functionData);
			break;
		case 'do-what-it-says':
			doWhatItSays();
			break;
		default:
		console.log('Liri does not know that, please try again!');
	}
};

var doWhatItSays = function() {
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (err) throw err;
		
		var dataArr = data.split(',');
	
		if (dataArr.length == 2) {
			pick(dataArr[0], dataArr[1]);
		} else if (dataArr.length == 1) {
			pick(dataArr[0]);
			};
		}
	)};

var runThis = function(argOne, argTwo) {
	pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);