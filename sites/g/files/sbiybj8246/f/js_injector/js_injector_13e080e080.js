jQuery(document).ready(function($) {  
  // If we click on the main volume icon, we want to do one of two things:
  // 1) Mute sound if sound is playing
  // 2) Set volume to 0.5 if muted
  $("#main_volume_button").on("click", function(){
    cur_volume = parseFloat(parseFloat($("#main_volume_button").data("volume")).toFixed(1));
    $(".sound_bar").css("display", "none");
    if(cur_volume != 0) { // Case One
      Howler.volume(0); // Mute it
      $("#main_volume_button").text("volume_mute"); // Mute icon
      $(".vertical_sound_bar").css("height", "0"); // Height set to 0px
      $("#main_volume_button").data("volume", "0"); // Keep track of change
    } else {
      Howler.volume(0.5); // Set volume to half
      $("#main_volume_button").text("volume_up"); // Mute icon
      $(".vertical_sound_bar").css("height", "25"); // Height set to 25px
      $("#main_volume_button").data("volume", "0.5"); // Keep track of change
    }
  });

  var mouse_in_sound_bar = false;

  // If we hover over the volume button, we want to show the sound bar
  $("#main_volume_button").on("mouseenter", function(){
    $(".sound_bar").css("display", "inherit");
  });

  // If we leave the main_volume_button and don't enter the sound
  // bar, we want to hide the sound_bar
  $("#main_volume_button").on("mouseleave", function(){

    // We don't pass anything into the function because
    // we want the variable mouse_in_sound_bar to stay
    // up to date based on other mouse events
    var checkMouseLocation = (function() {
      return function() {
        if(mouse_in_sound_bar === false) {
          $(".sound_bar").css("display", "none");
        }
      };
    })();

    // Gives user 1 second to move mouse into the sound_bar
    setTimeout(checkMouseLocation, 1000);
  });

  // If we enter the sound bar, we want to keep track of that event
  $(".sound_bar").on("mouseenter", function(){
    mouse_in_sound_bar = true;
  });

  // If we leave the sound bar, we want to hide it
  $(".sound_bar").on("mouseleave", function(){
    mouse_in_sound_bar = false;
    $(".sound_bar").css("display", "none");
  });

  // If we click up, we increase the volume
  $("#up").on("click", function(){
    cur_volume = parseFloat(parseFloat($("#main_volume_button").data("volume")).toFixed(1));
    
    // If volume is muted, we change icon to unmuted one
    if(cur_volume >= 0.4) {
      $("#main_volume_button").text("volume_up");
    } else {
      $("#main_volume_button").text("volume_down");
    }

    if(cur_volume <= 0.9) {
      cur_volume = cur_volume + 0.1;
      Howler.volume(cur_volume); // Increase the system volume

      // Change height of volume bar
      height = cur_volume * 50;
      $(".vertical_sound_bar").css("height", height.toString());

      // Keep track of increased volume
      $("#main_volume_button").data("volume", cur_volume.toString());
    }
  });

  // If we click down, we decrease the volume
  $("#down").on("click", function(){
    cur_volume = parseFloat(parseFloat($("#main_volume_button").data("volume")).toFixed(1));
    if(cur_volume >= 0.1) {
      cur_volume = cur_volume - 0.1;
      Howler.volume(cur_volume); // Decrease the system volume

      // Change height of volume bar
      height = cur_volume * 50;
      $(".vertical_sound_bar").css("height", height.toString());

      // If volume is mute, we change icon to muted one
      if(cur_volume === 0) {
        $("#main_volume_button").text("volume_mute");
      } else if(cur_volume > 0.4) {
        $("#main_volume_button").text("volume_up");
      } else {
        $("#main_volume_button").text("volume_down");
      }
      // Keep track of decreased volume
      $("#main_volume_button").data("volume", cur_volume.toString());
    }
  });

  // If the user clicks on the sound bar itself, we want the volume to adjust
  $(".vertical_sound_bar_wrapper").on("click", function(event) {

    var offset_wrapper = $(".vertical_sound_bar_wrapper").offset();
    var top_clicked = event.pageY - offset_wrapper.top;

    // 50px is the height of the sound bar
    var cur_height = 5 * Math.round((50.0 - top_clicked)/5);

    var vol_to_set = cur_height / 50.0;
    Howler.volume(vol_to_set); // Decrease the system volume

    // Change height of volume bar
    $(".vertical_sound_bar").css("height", cur_height.toString());

    // Keep track of increased volume
    $("#main_volume_button").data("volume", vol_to_set.toString());

    // If volume is mute, we change icon to muted one
    if(vol_to_set === 0) {
      $("#main_volume_button").text("volume_mute");
    } else if(vol_to_set > 0.4) {
      $("#main_volume_button").text("volume_up");
    } else {
      $("#main_volume_button").text("volume_down");
    }
  }); 

  // If the user clicks on the progress bar, we adjust the position of the song
  $("#song_container").on("click", function(event) {
    // We only calculate when a song is playing
    if(last_btn_played.data("playing") === "true") {
      // We grab the Howler sound obj from the global variable that
      // keeps track of which song was last played
      var cur_howler = sounds[last_btn_played.data("song")];

      var offset_wrapper = $("#song_container").offset();
      var left_clicked = event.pageX - offset_wrapper.left;  // X-coord of where user clicked

      var progress_container_width = $("#song_container").width();
      var width_to_set = left_clicked;

      // We want to see what per
      var ratio = width_to_set / progress_container_width;
      var pos_to_set = cur_howler._duration * ratio;

      $("#song_progress").css("width", width_to_set.toString());
      
      if(cur_howler !== undefined) {
        changed_pos_from_click = true;
        cur_howler.pos(pos_to_set);
      }
    }
  }); 
});