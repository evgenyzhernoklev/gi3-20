"use strict";

class Makeover {
  constructor() {
    this.pageType = $('.bounty__killers').data('bounty');

    this.init();
  }

  init() {
    this._initMakeover();
    this.listenEvents();
  }

  listenEvents() {
    var self = this;

    $('body').on('click', function(e) {
      if (!$(e.target).closest('.killer-has-variants').length) {
        self._hideAllDropdowns();
      }
    });
  }

  _initMakeover() {
    var self = this,
        $variants_title = $('.variants-title');

    if ($('.killer-has-variants').find('.variants-hidden').length) {
      return false;
    }

    $('.killer-has-variants').each(function() {
      $(this).find('.variants-list, .variants-chosen')
        .wrapAll('<div class="variants-hidden"></div>');
    });

    $variants_title
      .each(function() {
        var $list = $(this).parent().find('.variants-list'),
            type = $list.data('variantstype');

        switch(type) {
          case 'colors':
            $list.addClass('variants-list-colors');
            $(this).text('выберите оттенок');
            break;
          case 'sizes':
            $(this).text('выберите размер');
            break;
        }
      })
      .on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('is-active')) {
          self._hideAllDropdowns();
          $(this).addClass('is-active')
            .siblings('.variants-hidden').stop().slideDown();
        } else {
          self._hideAllDropdowns();
        }
      });

    $('.variant').on({
      'click': function(e) {
        e.preventDefault();
        var dimension = $(this).data('variant'),
            code = $(this).data('fsc'),
            $parent = $(this).closest('.killer-has-variants'),
            type = $parent.find('.variants-list').data('variantstype'),
            dropdown_title = '';

        switch(type) {
          case 'colors':
            dropdown_title = '';
            break;
          case 'sizes':
            dropdown_title = 'Размер ';
            break;
        }

        $parent.find('.variants-chosen').addClass('is-visible')
          .find('.chosen').text(dimension);
        $parent.find('.variants-title').text(dropdown_title + dimension)
          .addClass('is-chosen').trigger('click');
        $parent.siblings('.killer-fsc').find('.fsc').text(code);

        if (self.pageType == 'in-page') {
          $parent.closest('.killer').find('.killer-button').attr('href', 'javascript:ad_to_order("LN:' + code + ';Q:1");');
        }
      },
      'mouseenter': function() {
        var dimension = $(this).data('variant'),
            $parent = $(this).closest('.killer-has-variants');

        $parent.find('.variants-chosen').addClass('is-visible')
          .find('.chosen').text(dimension);
      },
      'mouseleave': function() {
        var $parent = $(this).closest('.killer-has-variants');

        $parent.find('.variants-chosen').removeClass('is-visible');
      }
    });
  }

  _hideAllDropdowns() {
    $('.variants-title').removeClass('is-active')
      .siblings('.variants-hidden').stop().slideUp();
  }
}

export default Makeover;
