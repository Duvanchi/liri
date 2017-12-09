var keyList = require("./keys.js");
var fs = require('fs');
var request = require("request");
var Spotify = require('node-spotify-api');
var twitter = require('twitter');
var params = {
	screen_name: 'authentic_ham',
	count: 20
}
var client  = new twitter(keyList.twitterKeys);

var command = process.argv[2];
var action = process.argv[3];

var spotify = new Spotify({
	id: '5e93e783f4d64a539ba204c35acfab18',
	secret: '0eaf9fd9c3624781b215fbe7da783f4f'
});

switch (command) {
	case 'spotify-this-song':
		spotifyThis();
		break;
	case 'movie-this':
		omdbSearch();
		break;
	case 'my-tweets':
		getTweets();
		break;
	case 'do-what-it-says':
		doIt();
		break;
	}

function spotifyThis() {
if (command === 'spotify-this-song') {
		
		if (action == null) {
			action = 'The Sign';
		}
			spotify.search({ 
				type: 'track', 
				query: action, 
			}, function(err, data) {
			  if (err) {
			    return console.log('Error occurred: ' + err);
			  }
			  console.log('Artist: ' + data.tracks.items[0].artists[0].name);
		      console.log('Song: ' + data.tracks.items[0].name);
		      console.log('Preview Link: ' + data.tracks.items[0].preview_url);
		      console.log('Album: ' + data.tracks.items[0].album.name);
		});	
	}
}

function omdbSearch() {
if (command === 'movie-this') {

	if (action == null) {
			action = 'Mr. Nobody';
		}
	
		request("http://www.omdbapi.com/?t="+action+"&y=&plot=short&apikey=trilogy", function (error, response, body) {
		   if (error) {
		   	console.log('error:', error);
		   	console.log('statusCode:', response && response.statusCode);
		   }
		   	jsonBody = JSON.parse(body);
			  console.log('Title: ' + jsonBody.Title);
		            console.log('Year: ' + jsonBody.Year);
		            console.log('IMDb Rating: ' + jsonBody.imdbRating);
		            console.log('Country: ' + jsonBody.Country);
		            console.log('Language: ' + jsonBody.Language);
		            console.log('Plot: ' + jsonBody.Plot);
		            console.log('Actors: ' + jsonBody.Actors);
		            console.log('Rotten Tomatoes Rating: ' + jsonBody.tomatoRating);
		            console.log('Rotten Tomatoes URL: ' + jsonBody.tomatoURL);
				});
		 	}
		 }

// this function's giving me 'error: [ { code: 34, message: 'Sorry, that page does not exist.' } ]' or 
// error: [ { code: 89, message: 'Invalid or expired token.' } ] when I'm trying to run the search.
// I've been looking for fixes for quite a while now, focusing on both errors on my end and 
// potential errors from the module side.  Haven't been able to find anything solid yet.

function getTweets() {
if (command === 'my-tweets') {

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		
		if (error) { 
				console.log('error:', error);
			}

			// this is my guess of what I need for displaying the tweets properly.
			console.log('Last 20 Tweets:')
			for (var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text);
				console.log([i + 1] + '. ' + tweets[i].text);
                console.log('Created on: ' + tweets[i].created_at);
                
			}
		});
	}
}

function doIt() {

	fs.readFile("random.txt", "utf8", function(error, data) {

		if (error) {
			return console.log(error);
		}

		var dataArr = data.split(",");
		command = dataArr[0];
		action = dataArr[1];
		spotifyThis();
	});
}

