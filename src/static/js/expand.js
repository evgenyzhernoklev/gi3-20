"use strict";

class Expand {
  constructor() {
    this.DURATION = 400;
    this.body     = $('body');
    this.init();
  }

  init() {
    this.listenEvents();
  }

  listenEvents() {
    this.body.on('click', '.js-expand-link', this._checkExpand.bind(this));
  }

  _checkExpand(e) {
    let $target = $(e.target).closest('.js-expand-link');

    ($target.hasClass('is-active')) ? this._expandUp($target) : this._expandDown($target);
  }

  _expandUp($link) {
    let $container = $link.closest('.js-expand'),
        $content = $container.find('.js-expand-content');

    $link.removeClass('is-active');
    $container.removeClass('is-active');
    $content.stop().slideUp(this.DURATION);
  }

  _expandDown($link) {
    let $container = $link.closest('.js-expand'),
        $content = $container.find('.js-expand-content');

    $link.addClass('is-active');
    $container.addClass('is-active');
    $content.stop().slideDown(this.DURATION);
  }
}

export default Expand;
