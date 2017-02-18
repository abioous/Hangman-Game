var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " "];

var bands = [
	{
		name: "Pink Floyd",
		songTitle:"Echoes",
		songUrl:"assets/audio/echoes.mp3",
		imageUrl:"assets/images/pinkfloyd.jpg",
	},
	{
		name:"Queen",
		songTitle:"Hero",
		songUrl:"assets/audio/hero.mp3",
		imageUrl:"assets/images/queen.jpg",

	},
	{
		name:"Genesis",
		songTitle:"The Knife",
		songUrl:"assets/audio/knife.mp3",
		imageUrl:"assets/images/genessis.jpg",
	}
];



function counterUniqueLetters(word) {
	var uniqueLetters = {};
	for(var i =0;i<word.length;i++) {
		uniqueLetters[word[i]] = true;
	}
	var result = 0;
	for(var k in uniqueLetters) {
		result++;
	}
	return result;
}



var game = {
	currentBand:{},
	bandIndex:-1,
	currentWord:'',
	guessedBandSong:'',
	guessedBandImageUrl:'',
	gameImageUrl:'assets/images/guess.jpg',	
	winCount:0,
	guessCount:0,
	remainingCount:0,
	letterGuessed:'',
	letterMissed:'',
	data:[],

	clear:function() {
		this.currentBand = "";
		//this.guessedBandSong = "";
		//this.guessedBandImageUrl = "";
		this.currentWord = "";
		this.remainingCount = 0;
		this.guessCount =0;
		this.letterGuessed = "";
		this.letterMissed = ""
	},
	start:function(bands) {
		this.bands = bands;
		this.clear();
		this.selectBand();
		this.draw();
	},

	selectBand:function() {
		var bandIndex = parseInt(Math.random()*100) % self.bands.length;
		//make suere to select another word each time.
		if(self.bandIndex == bandIndex && self.bands.length > 1) {
			this.selectBand();
			return;
		}
		self.bandIndex = bandIndex;
		this.currentBand = self.bands[bandIndex]; 
		this.currentWord = this.currentBand["name"].toUpperCase();
		this.remainingCount = counterUniqueLetters(this.currentWord);
	},


	playSong:function(url) {
			this.audio.trigger('pause');	
			this.audio.attr("src", url);
	      	this.audio.trigger('play');
	},

	selectLetter: function(selected) {

		var letter = selected.toUpperCase();
		if(this.letterGuessed.indexOf(letter) != -1) {
			return;
		}
		if(this.letterMissed.indexOf(letter) != -1) {
			return;
		}
		if(this.currentWord.indexOf(letter) != -1) {
			this.letterGuessed += letter;
			this.guessCount++;
			this.remainingCount--;
		} else {
			this.letterMissed += letter;
		}

		if(this.remainingCount == 0) {
			this.winCount++;
			this.guessedBandImageUrl = this.currentBand.imageUrl;
			this.guessedBandSong = this.currentBand.songTitle + ' by ' + this.currentBand.name;
			this.playSong(this.currentBand.songUrl);
			this.start(bands);
		}

		this.draw()
	},


	drawCurrentWord:function() {
		$('#currentWord').empty();
		//draw letters (empty of guess) for current word
		for(var i = 0; i<this.currentWord.length;i++) {
			 var letter = this.currentWord[i];
			 var letterBtn = $('<button>');
		     if(this.letterGuessed.indexOf(letter) == -1) {
			     letterBtn.html('_');
		     } else {
			     letterBtn.html(letter);
		     }
		     letterBtn.attr("disabled", true);
		     $('#currentWord').append(letterBtn);
		}
	},
	drawKeyboard:function() {
		$('#letters').empty();
	
		for(var i = 0;i<letters.length;i++) {
			 var letter = letters[i];
	         var letterBtn = $('<button>');

			if(this.letterGuessed.indexOf(letter) != -1) {
				letterBtn.attr("disabled", true);
				letterBtn.css('backgroundColor', 'lightgreen');
				letterBtn.css('textDecoration','line-through');	
			} 
			if(this.letterMissed.indexOf(letter) != -1) {
				letterBtn.attr("disabled", true);
				letterBtn.css('backgroundColor', '#ffd1dc');
				letterBtn.css('textDecoration','line-through');	
			}
			letterBtn.html('&nbsp;' + letters[i]+ '&nbsp;');
			letterBtn.attr('data-letter', letters[i]);
			letterBtn.click(function() {
				var currentButton = $(this);
				var letter = currentButton.attr('data-letter');
				game.selectLetter(letter);
			})

			$('#letters').append(letterBtn);
	  	}
	},

	drawQuessDetail:function() {
	  	$('#guessInfo').text(this.guessedBandSong)
	  	if(this.guessedBandImageUrl == '') {
	  		$('#guessImage').attr('src', this.gameImageUrl);
	  		$('#guessImage').attr('alt', 'Hangman game');
	  	} else {
	  		$('#guessImage').attr('src', this.guessedBandImageUrl);
	  		$('#guessImage').attr('alt', this.guessedBandSong);
	  	}
	
	},

	draw:function() {
		$('#currentWord').text(this.currentWord);
		$('#winCount').text(this.winCount);
		$('#guessCount').text(this.guessCount);
		$('#remainingCount').text(this.remainingCount);
		this.drawCurrentWord();
		this.drawKeyboard();
		this.drawQuessDetail();
	}

}



$(document).ready(function() {

	game.audio = $("<audio>")	;
	var started = false;
	$(document).keyup(function(e) {
		if(! started) {
			started = true;
			game.start(bands);
			return;
		}	
		var char = String.fromCharCode(e.which);
		//check if char is letter
		if(char == ' ' || char.toUpperCase() != char.toLowerCase()) {
			game.selectLetter(char);
		}
	});


});

