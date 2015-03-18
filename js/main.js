(function() {
  'use strict';

  /**
   * Save default configuration
   */
  if (!localStorage.getItem('css-theme')) localStorage.setItem('css-theme', 'theme-dark-blue');
  if (!localStorage.getItem('show-releases')) localStorage.setItem('show-releases', 'false');
  if (!localStorage.getItem('show-searchbox')) localStorage.setItem('show-searchbox', 'true');
  if (!localStorage.getItem('use-glass')) localStorage.setItem('use-glass', 'false');
  if (!localStorage.getItem('text-outline')) localStorage.setItem('text-outline', 'false');

  /**
   * Load theme
   */
  $('#css-theme').attr('href', 'css/' + localStorage.getItem('css-theme') + '.css');


  /**
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

      if (matchMedia('(max-width: 768px)').matches) {
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
    }
  );

  $(document).ready(function() {
    /**
     * Load settings from localStorage
     */
    if (JSON.parse(localStorage.getItem('use-glass'))) {
      $('.main').addClass('glass');
    }
    if (JSON.parse(localStorage.getItem('text-outline'))) {
      $('body').addClass('text-outline');
    }

    /**
     * Automatically focus the search box when document is loaded
     */
    $('.search-input').focus();

    /**
     * Force buttons, and links to lose focus after they've been clicked
     */
    $(document).delegate("button, a", "click", function(event) {
      $(this).blur();
    });
  });
})();
