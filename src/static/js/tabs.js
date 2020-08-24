"use strict";

class Tabs {
  constructor(container) {
    this.$container  = $(container);
    this.$links      = this.$container.find('.js-tabs-link');
    this.$contents   = this.$container.find('.js-tabs-content');
    this.init();
  }

  init() {
    this.$links.on('click', this.switchContent.bind(this));
  }

  switchContent(e) {
    e.preventDefault();
    let $target = $(e.target).closest('.js-tabs-link'),
        targetAttr = $target.data('content'),
        targetContent;

    if ($target.hasClass('is-active')) { return; }

    this.cleanTabs();
    $target.addClass('is-active');
    this.$contents.each(function() {
      let itemAttr = $(this).data('content');

      if (itemAttr == targetAttr) {
        $(this).addClass('is-active');
      }
    });
  }

  cleanTabs() {
    this.$links.removeClass('is-active');
    this.$contents.removeClass('is-active');
  }
}

export default Tabs;
