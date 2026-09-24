jQuery(document).ready(function($) {  
  // Waypoint to help stick the navbar to the top of the window
  var sticky = new Waypoint.Sticky({
    element: $("#sidebar-first")[0],
    handler: function(direction) {
      window_width = parseInt($( window ).  width());
      if(direction === "down") {
        if(window_width > 985) { // Window size must be > 960px
          $("#content").css("margin-left", "185px");
        }
      } else if (direction === "up") {
        if(window_width > 985) { // Window size must be > 960px
          $("#content").css("margin-left", "30px");
        }
      }
    }
  });
  // Off the bat, highlight the introduction link
  $('#sidebar_link_intro').addClass('active_link');

  // Automatically change the 'active' link in the sidebar 
  // based on where the mouse is
  $('.site_book_description').hover(function() {
    $('#sidebar_link_intro').addClass('active_link').siblings('.sidebar_link').removeClass('active_link');
  });

  $('.audio_section_description, #block-system-main').hover(function() {
    $('#sidebar_link_audio').addClass('active_link').siblings('.sidebar_link').removeClass('active_link');
  });

  $('.video_section_description, iframe').hover(function() {
    $('#sidebar_link_video').addClass('active_link').siblings('.sidebar_link').removeClass('active_link');
  });

  // Change the color of the link when you click on it - also animate scroll there
  $('.sidebar_link').click(function() {
    $(this).addClass('active_link').siblings('.sidebar_link').removeClass('active_link');
    $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top + 'px' }, 800, 'linear');    
  });

  // Smooth scroll setup
  $("#sidebar_link_intro").smoothScroll();
  $("#sidebar_link_audio").smoothScroll();

  // Setup id for the video smooth scrolling to work
  $(".video_section_description").attr("id", "video-tag");
  $("#sidebar_link_video").smoothScroll();
});