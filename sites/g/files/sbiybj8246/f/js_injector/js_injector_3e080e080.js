jQuery(document).ready(function($) {
  NProgress.configure({ showSpinner: false });

  // Set initial volume to 0.5
  Howler.volume(0.5);

  audio_links = $(".file").find("a");
  index = 0;

  audio_links.each(function(){
    song_url_full = $(this).attr("href");
    parent = $(this).parent().parent().parent().parent().prev().prev().parent();

    song_title = $(this).parent().parent().parent().parent().prev().prev().find("h2").text();
    btn_id = "song-button-" + index;
    // Create the play/pause button for the individual song and fill in different data attribute fields
    $("<i class=\"material-icons song_button indiv_song_button\" id=\"" + btn_id + "\" data-title=\""+ song_title + "\" data-song=\"" + song_url_full + "\" data-playing=\"false\" data-loaded=\"false\">play_circle_outline</i>").insertBefore(parent.children()[0]);       
    
    // Create loading progress cube
    $("<div class=\"spinner\" id=\"spinner-" + btn_id + "\"></div>").insertBefore(parent.children()[0]);
    
    // Add numbers to the song titles (Example: 1. Suzanne Vega)
    index = index + 1;
    song_title_w_num = index + ". " + song_title;
    $(this).parent().parent().parent().parent().prev().prev().find("h2").text(song_title_w_num);
  });

  // Global variables
  sounds = {};
  timers = {};
  last_btn_played = "";
  changed_pos_from_click = false;

  var loadSong = function(cur_btn) {
    // Function that loads the song - should only be called once per song
    cur_btn.data("playing", "false");
    song_url = cur_btn.data("song");
    NProgress.start();  // Show loading bar indicating that the song is loading
    $("#spinner-" + cur_btn.attr("id")).show(); // Show the song's loading cube
    cur_btn.hide();     // Hide the pause button while it loads

    (function(cur_btn, song_url) {  // Anonymous function
      sound = new Howl({
        buffer: true,
        urls: [song_url],
        onload: (function(cur_btn) {
          return function() {
            // Hide the song's loading cube
            $("#spinner-" + cur_btn.attr("id")).hide();

            // Should only happen once the song is done loading
            NProgress.done();

            // Make sure that the button is set to "loaded"
            cur_btn.data("loaded", "true");
            // Show the pause button
            cur_btn.show(); 
          };
        })(cur_btn),
        onend: (function(cur_btn) {
          return function() {
            cur_btn.data("playing", "false");
            cur_btn.text("play_circle_outline");
            cur_btn.css("color", "#2d353d");

            // Change bottom music player to reflect end of song
            $("#main_play_button").text("play_circle_outline");
            $("#main_play_button").data("playing", "false");
          };
        })(cur_btn),
        onplay: (function(song_url, cur_btn) {
          return function() {
            changed_pos_from_click = false;
            $("#footer").css("display", "inherit"); // Show footer

            var sound_obj = this;

            var updatePos = (function(sound_obj) {
              return function() {
                // Function updates the progress bar as the song
                // plays
                var progress_container_width = $("#song_container").width();
                var ratio = sound_obj.pos() / sound_obj._duration;
                var width_to_set = progress_container_width * ratio;
                $("#song_progress").css("width", width_to_set.toString());
              };
            })(sound_obj);

            // Every 50ms, get the updated position of the song
            timers[song_url] = setInterval(updatePos, 50);
            song_title = cur_btn.data("title"); 
            $(".song_title").text(song_title); // Show song title in footer

            // Update play button in music player
            $("#main_play_button").text("pause_circle_outline");  
            $("#main_play_button").data("playing", "true");

            // Keep track of last played button for use in the music player
            last_btn_played = cur_btn; 
          };
        })(song_url, cur_btn),
        onpause: (function(song_url, cur_btn) {
          return function() {
            if(timers[song_url] !== undefined) {
              // Stop updating the progress bar
              clearInterval(timers[song_url]);  
            }

            // Don't do anything if we manually changed the position of the song
            if(changed_pos_from_click === true) {
              changed_pos_from_click = false;
              return; 
            }
            changed_pos_from_click = false;
            cur_btn.text("play_circle_outline");
            cur_btn.data("playing", "false");
            cur_btn.css("color", "#2d353d");

            $("#main_play_button").text("play_circle_outline");
            $("#main_play_button").data("playing", "false");
          };
        })(song_url, cur_btn)
      });

      sounds[song_url] = sound;
    })(cur_btn, song_url);  // Anonymous Function call #1

  };  // End of Load Song Function

  $(".song_button").each(function() {
    $(this).on("click", function(){
      loaded = $(this).data("loaded").toString();
      if(loaded === "false") {
        loadSong($(this));  // Call the function to load the song
      }

      song_url = $(this).data("song").toString();
      playing = $(this).data("playing").toString();

      if(playing === "false") {
        sounds[song_url].play();

        // Set necessary play buttons
        $(this).data("playing", "true");
        $(this).text("pause_circle_outline");
        $(this).css("color", "#a6722c");

        // Pause all other songs
        $(".song_button").each(function() {
          cur_song_url = $(this).data("song");
          if(cur_song_url !== song_url) {
            if(sounds[cur_song_url] !== undefined) {
              // Only pause the songs that have been loaded
              sounds[cur_song_url].pause();
            }
          }
        });

        // We have to re-add the pause button on the bottom
        // because when we pause all other songs we also
        // affect the music player in the bottom
        $("#main_play_button").text("pause_circle_outline");
        $("#main_play_button").data("playing", "true");

      } else {
        sounds[song_url].pause();
        $(this).data("playing", "false");
        $(this).text("play_circle_outline");
        $(this).css("color", "#2d353d");
      }
    });
  });

  // Deals with event handlers for music player in footer
  $("#main_play_button").data("playing", "false");
  $("#main_play_button").on("click", function(){
    playing = $(this).data("playing");
    
    if(playing === "true") {
      last_btn_played.click(); // Stops current song playing
      $(this).data("playing", "false");
    } else {
      $(this).data("playing", "true");
      last_btn_played.click();
    }
  });

  // If we click on the hide button, hide the music player
  $("#hide-player").on("click", function(){
    $("#footer").css("display", "none"); // Hide footer
  });

  // Setup ToolTip!
  $('.tooltip').tooltipster({
     animation: 'grow',
     delay: 200,
     theme: 'tooltipster-default',
     touchDevices: true,
     trigger: 'hover'
  });
});