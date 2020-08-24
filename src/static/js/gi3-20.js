"use strict";

import Copy       from "../js/copy";
import Dropdowns  from "../js/dropdown";
import Gallery    from "../js/gallery";
import Makeover   from "../js/makeover";
import Samples    from "../js/samples";
import Tabs       from "../js/tabs";

$(document).ready(function() {
  $('.js-copy-link').each(function() {
    new Copy(this);
  });
  new Dropdowns();
  $('.js-gallery').each(function() {
    new Gallery(this);
  });
  if ($('.killer-has-variants').length) {
    new Makeover();
  }
  if ($('.js-samples').length) {
    new Samples();
  }
  $('.js-tabs').each(function() {
    new Tabs(this);
  });
  $('.js-link-scroll').on('click', function(e) {
    e.preventDefault();
    let target = $(this).attr('href'),
        positionTop = $(target).offset().top;

    $('html, body').animate({
      scrollTop: positionTop
    }, 700);
  });
});
