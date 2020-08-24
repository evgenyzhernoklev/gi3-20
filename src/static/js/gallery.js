"use strict";

import $      from "jquery";
import slick  from "slick-slider";

class Gallery {
  constructor(container) {
    this.$container = $(container);
    this.init();
  }

  init() {
    this.initGallery();
  }

  initGallery() {
    let kind = this.$container.data('kind'),
        dots, arrows, slidesToShow, slidesToShowOnTablet;

    switch(kind) {
      case 'single':
        dots = true;
        arrows = false;
        slidesToShow = 1;
        slidesToShowOnTablet = 1;
      break;
      case 'catalogs':
        dots = false;
        arrows = true;
        slidesToShow = 4;
        slidesToShowOnTablet = 3;
      break;
    }

    this.$container.slick({
      dots: dots,
      arrows: arrows,
      slidesToShow: slidesToShow,
      infinite: true,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: slidesToShowOnTablet
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            arrows: false,
            dots: true
          }
        }
      ]
    });
  }
}

export default Gallery;
