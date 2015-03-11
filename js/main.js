$(window).on('scroll', {
    previousTop: 0
  },
  function() {
    var currentTop = $(window).scrollTop();
    var topbar = $('.topbar');

    if (topbar.css('position') === 'absolute') {
      if (currentTop < this.previousTop) {
        // scrolling up
        if (currentTop < topbar.position().top) {
          topbar.css('top', currentTop + 'px');
        }
      }
      else {
        // scrolling down
        if (currentTop > parseInt(topbar.position().top + topbar.height())) {
          topbar.css('top', parseInt(currentTop - topbar.height() - 20) + 'px');
        }
      }

      this.previousTop = currentTop;
    }
  }
);
