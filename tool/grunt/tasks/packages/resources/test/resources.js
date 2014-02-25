/* *****************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Richard Sternagel (rsternagel)

***************************************************************************** */

'use strict';

var path = require("path");

module.exports = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  // TODO: don't hardwire paths and resolve dep to needed app
  collectImageInfoMaps: function (test) {
    var resources = require('../lib/resources.js');

    // real data should come from Manifest.json files
    var absQxPath = "/Users/rsternagel/workspace/qooxdoo.git/";
    var absAppPath = "/Users/rsternagel/workspace/deptest/";
    var relQxResourcePath = "framework/source/resource";
    var relAppResourcePath = "source/resource";

    var resBasePathMap = {
      "qx": path.join(absQxPath, relQxResourcePath),
      "deptest": path.join(absAppPath, relAppResourcePath)
    };

    // real data should come from dependencies package
    var assets = {
     'deptest.Application':
          [ 'deptest/*' ],
     'qx.ui.core.Widget':
          [ 'qx/static/blank.gif' ],
     'qx.theme.modern.Appearance':
          [ 'qx/icon/Tango/16/places/folder-open.png',
            'qx/icon/Tango/16/places/folder.png',
            'qx/icon/Tango/16/mimetypes/office-document.png',
            'qx/icon/Tango/16/actions/window-close.png',
            'qx/icon/Tango/22/places/folder-open.png',
            'qx/icon/Tango/22/places/folder.png',
            'qx/icon/Tango/22/mimetypes/office-document.png',
            'qx/icon/Tango/32/places/folder-open.png',
            'qx/icon/Tango/32/places/folder.png',
            'qx/icon/Tango/32/mimetypes/office-document.png',
            'qx/icon/Tango/16/apps/office-calendar.png',
            'qx/icon/Tango/16/apps/utilities-color-chooser.png',
            'qx/icon/Tango/16/actions/view-refresh.png',
            'qx/icon/Tango/16/actions/dialog-cancel.png',
            'qx/icon/Tango/16/actions/dialog-ok.png',
            'qx/decoration/Modern/cursors/*',
            'qx/decoration/Modern/scrollbar/scrollbar-left.png',
            'qx/decoration/Modern/scrollbar/scrollbar-right.png',
            'qx/decoration/Modern/scrollbar/scrollbar-up.png',
            'qx/decoration/Modern/scrollbar/scrollbar-down.png',
            'qx/decoration/Modern/toolbar/toolbar-handle-knob.gif',
            'qx/decoration/Modern/tree/open-selected.png',
            'qx/decoration/Modern/tree/closed-selected.png',
            'qx/decoration/Modern/tree/open.png',
            'qx/decoration/Modern/tree/closed.png',
            'qx/decoration/Modern/form/checked.png',
            'qx/decoration/Modern/form/undetermined.png',
            'qx/decoration/Modern/form/tooltip-error-arrow-right.png',
            'qx/decoration/Modern/form/tooltip-error-arrow.png',
            'qx/decoration/Modern/window/minimize-active-hovered.png',
            'qx/decoration/Modern/window/minimize-active.png',
            'qx/decoration/Modern/window/minimize-inactive.png',
            'qx/decoration/Modern/window/restore-active-hovered.png',
            'qx/decoration/Modern/window/restore-active.png',
            'qx/decoration/Modern/window/restore-inactive.png',
            'qx/decoration/Modern/window/maximize-active-hovered.png',
            'qx/decoration/Modern/window/maximize-active.png',
            'qx/decoration/Modern/window/maximize-inactive.png',
            'qx/decoration/Modern/window/close-active-hovered.png',
            'qx/decoration/Modern/window/close-active.png',
            'qx/decoration/Modern/window/close-inactive.png',
            'qx/decoration/Modern/splitpane/knob-horizontal.png',
            'qx/decoration/Modern/splitpane/knob-vertical.png',
            'qx/decoration/Modern/arrows/down.png',
            'qx/decoration/Modern/arrows/up.png',
            'qx/decoration/Modern/arrows/right.png',
            'qx/decoration/Modern/arrows/left.png',
            'qx/decoration/Modern/arrows/rewind.png',
            'qx/decoration/Modern/arrows/forward.png',
            'qx/decoration/Modern/arrows/up-invert.png',
            'qx/decoration/Modern/arrows/down-invert.png',
            'qx/decoration/Modern/arrows/right-invert.png',
            'qx/decoration/Modern/arrows/up-small.png',
            'qx/decoration/Modern/arrows/down-small.png',
            'qx/decoration/Modern/menu/checkbox-invert.gif',
            'qx/decoration/Modern/menu/checkbox.gif',
            'qx/decoration/Modern/menu/radiobutton-invert.gif',
            'qx/decoration/Modern/menu/radiobutton.gif',
            'qx/decoration/Modern/table/select-column-order.png',
            'qx/decoration/Modern/table/ascending.png',
            'qx/decoration/Modern/table/descending.png',
            'qx/decoration/Modern/table/boolean-true.png',
            'qx/decoration/Modern/table/boolean-false.png',
            'qx/decoration/Modern/colorselector/*' ],
     'qx.theme.modern.Decoration':
          [ 'qx/decoration/Modern/toolbar/toolbar-part.gif' ]
    };

    var imgsInfo = resources.collectImageInfoMaps(assets, resBasePathMap);
    console.log(imgsInfo, Object.keys(imgsInfo).length);

    test.ok(true);
    test.done();
  }
};
