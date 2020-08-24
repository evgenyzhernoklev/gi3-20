"use strict";

import pagination   from "paginationjs";
import autoComplete from "javascript-autocomplete";

class Samples {
  constructor() {
    this.PAGE_SIZE            = 12;
    this.$container           = $('.js-samples');
    this.$itemsContainer      = this.$container.find('.js-samples-items');
    this.$items               = this.$itemsContainer.find('.js-samples-item');
    this.$paginator           = this.$container.find('.js-samples-paginator');
    this.$autocompleteFields  = this.$container.find('.js-samples-search-field');
    this.init();
  }

  init() {
    this.initAutocompletes();
    this.initPagination(this.$items);
    this.listenEvents();
  }

  listenEvents() {
    this.$container.on('click', '.js-samples-search-cat', this._filterSubcategory.bind(this));
  }

  initAutocompletes() {
    let self = this;

    this.$autocompleteFields.each(function(index, element) {
      let category = $(element).closest('.js-samples-search').data('category'),
          $categoryItems = self.$items.filter(function() {
            return $(this).data('category') == category;
          }),
          choices = [];

      $categoryItems.each(function(index, element) {
        choices.push( $.trim($(element).find('.js-samples-item-name').text()) );
      });

      new autoComplete({
        selector: element,
        minChars: 2,
        source: function(term, response) {
          let matches = [];

          term = term.toLowerCase();
          for (var i = 0; i < choices.length; i++) {
            if (~choices[i].toLowerCase().indexOf(term)) {
              matches.push(choices[i]);
            }
          }
          response(matches);
        },
        onSelect: function(event, term, item) {
          let index = choices.indexOf(term);

          if (~index) {
            $(element).val('');
            self._updateContent($categoryItems.eq(index), $(element).closest('.js-dropdown').find('.js-dropdown-link'));
          }
        }
      });
    });
  }

  initPagination($items) {
    if (this.$paginator.hasClass('is-active')) {
      this.$paginator.removeClass('is-active').pagination('destroy');
    }
    if ($items.length <= this.PAGE_SIZE) {return false;}

    let self        = this,
      itemsOrderArr = [],
      counter       = 0;

    $items.each(function() {
      itemsOrderArr.push(counter);
      counter += 1;
    });

    this.$paginator.addClass('is-active').pagination({
      dataSource: itemsOrderArr,
      pageSize: self.PAGE_SIZE,
      prevText: '&#8249;',
      nextText: '&#8250;',
      formatResult: function(data) {
        let result = [];

        for (var i = 0, len = data.length; i < len; i++) {
          result.push($items.eq(data[i]).get(0));
        }

        return result;
      },
      callback: function(data) {
        self.$itemsContainer.html(data);
      },
      afterPageOnClick: function() {
        $('html, body').animate({scrollTop: self.$container.offset().top}, 700);
      }
    });
  }

  _filterSubcategory(e) {
    let $target = $(e.target),
        category = $target.closest('.js-samples-search').data('category'),
        subcategory = $target.data('subcategory'),
        $categoryItems = this.$items.filter(function() {
          return $(this).data('category') == category;
        }),
        $subcategoryItems = $categoryItems.filter(function() {
          return $(this).data('subcategory') == subcategory;
        });

    this._updateContent($subcategoryItems, $target);
  }

  _updateContent($items, $link) {
    $('html, body').animate({scrollTop: this.$container.offset().top}, 700);
    $link.closest('.js-dropdown').find('.js-dropdown-link').trigger('click');
    this.$itemsContainer.html($items);
    this.initPagination($items);
  }
}

export default Samples;
