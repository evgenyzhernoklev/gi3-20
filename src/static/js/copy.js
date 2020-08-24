"use strict";

import ClipboardJS from "clipboard";

class Copy {
  constructor(button) {
    this.button = button;
    this.init();
  }

  init() {
    new ClipboardJS(this.button);
  }
}

export default Copy;
