(function() {
  'use strict'

  /*
  * When viewing the page in a mobile device, the top bar is automatically hidden
  * when the user scrolls down, and is brought back as soon as the user scrolls up.
  * This way, screen real estate is maximized without affecting usability.
  */
  $(window).on('scroll', {
      previousTop: 0
    },
    function scrollTopbar() {
      var currentTop = $(window).scrollTop();
      var topbar = $('.topbar');

      if (window.matchMedia('(max-width: 768px)').matches) {
        if (currentTop < this.previousTop) {
          // scrolling up
          if (currentTop > 0) {
            topbar.addClass('animate visible');
          }
          else {
            topbar.removeClass('fixed animate visible');
          }
        }
        else {
          // scrolling down
          if (currentTop > topbar.height()) {
            // hide the animation when transitioning from position: absolute to position: fixed
            if (topbar.hasClass('fixed')) {
              topbar.addClass('animate');
            }
            else {
              topbar.addClass('fixed');
            }
            topbar.removeClass('visible');
          }
        }

        this.previousTop = currentTop;
      }
      console.log(topbar.position().top);
    }
  );

})();
