(function() {
  'use strict';

  function loadBackground() {
    var background = localStorage.getItem('background');

    if (background) {
      $('.background').css('background-image', 'url(' + background + ')');
      $('.background').trigger('background-set');
    }
  }

  function loadFile(event) {
    var reader = new FileReader();

    event.stopPropagation();
    event.preventDefault();

    reader.onload = function(e) {
      localStorage.setItem('background', reader.result);
      loadBackground();
    }

    reader.readAsDataURL(event.dataTransfer.files[0]);
  }

  function cancelDefault(event) {
    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  $(document).ready(function() {
    loadBackground();

    document.addEventListener('dragover', cancelDefault, false);
    document.addEventListener('dragenter', cancelDefault, false);
    document.addEventListener('drop', loadFile, false);
  });
})();
