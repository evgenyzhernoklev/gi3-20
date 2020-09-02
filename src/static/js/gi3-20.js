"use strict";

import Dropdowns  from "../js/dropdown";
import Expand     from "../js/expand";
import Tabs       from "../js/tabs";
import Copy       from "../js/copy";

// import Gallery    from "../js/gallery";
// import Samples    from "../js/samples";

$(document).ready(function() {
  new Dropdowns();
  new Expand();
  $('.js-tabs').each(function() {
    new Tabs(this);
  });
  $('.js-copy-link').each(function() {
    new Copy(this);
  });
  $('.js-scroll-to').on('click', function(e) {
    e.preventDefault();
    let target = $(this).attr('href'),
        positionTop = $(target).offset().top;

    $('html, body').animate({
      scrollTop: positionTop
    }, 700);
  });

  // $('.js-gallery').each(function() {
  //   new Gallery(this);
  // });
  // if ($('.js-samples').length) {
  //   new Samples();
  // }
});
