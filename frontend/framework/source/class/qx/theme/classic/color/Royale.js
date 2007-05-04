/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/* ************************************************************************

************************************************************************ */

/**
 * Windows Royale color theme
 */
qx.Theme.define("qx.theme.classic.color.Royale",
{
  title : "Windows Royale",

  colors :
  {
    // Unused
    activeborder        : [ 212, 208, 200 ],
    appworkspace        : [ 128, 128, 128 ],
    background          : [ 0, 0, 64 ],
    buttonhighlight     : [ 255, 255, 255 ],
    buttonshadow        : [ 167, 166, 170 ],
    inactiveborder      : [ 212, 208, 200 ],
    scrollbar           : [ 212, 208, 200 ],
    window              : [ 255, 255, 255 ],
    windowframe         : [ 0, 0, 0 ],
    windowtext          : [ 0, 0, 0 ],

    // Renamed
    activecaption       : [ 51, 94, 168 ],
    captiontext         : [ 255, 255, 255 ],
    inactivecaption     : [ 111, 161, 217 ],
    inactivecaptiontext : [ 255, 255, 255 ],
    buttonface          : [ 235, 233, 237 ],
    buttontext          : [ 0, 0, 0 ],
    graytext            : [ 167, 166, 170 ],
    highlight           : [ 51, 94, 168 ],
    highlighttext       : [ 255, 255, 255 ],
    infobackground      : [ 255, 255, 225 ],
    infotext            : [ 0, 0, 0 ],
    menu                : [ 255, 255, 255 ],
    menutext            : [ 0, 0, 0 ],

    // TODO
    threeddarkshadow    : [ 133, 135, 140 ],
    threedface          : [ 235, 233, 237 ],
    threedhighlight     : [ 255, 255, 255 ],
    threedlightshadow   : [ 220, 223, 228 ],
    threedshadow        : [ 167, 166, 170 ],

    // NEW
    "background" : [ 235, 233, 237 ],  // threedface

    "border-dark" : [ 133, 135, 140 ],  // threeddarkshadow
    "border-dark-shadow" : [ 167, 166, 170 ],  // threedshadow
    "border-light" : [ 255, 255, 255 ],  // threedhighlight
    "border-light-shadow" : [ 220, 223, 228 ],  // threedlightshadow

    "effect" : [ 254, 200, 60 ],
    "selected" : [ 51, 94, 168 ],  // highlight

    "text" : "black",  // NEW
    "text-disabled" : [ 167, 166, 170 ],  // graytext
    "text-selected" : [ 255, 255, 255 ],  //highlighttext

    "tooltip" : [ 255, 255, 225 ],  // infobackground
    "tooltip-text" : "black",  // infotext

    "menu" : "white",  // menu

    "button" : [ 235, 233, 237 ],  // buttonface
    "button-hover" : [ 135, 188, 229 ],
    "button-abandoned" : [ 255, 240, 201 ],

    "window-active-caption-text" : [ 255, 255, 255 ],  // captiontext
    "window-inactive-caption-text" : [ 255, 255, 255 ],  // inactivecaption
    "window-active-caption" : [ 51, 94, 168 ],  // activecaption
    "window-inactive-caption" : [ 111, 161, 217 ],  // inactivecaptiontext

    "button-view" : [ 250, 251, 254 ],
    "button-view-bar" : [ 225, 238, 255 ],

    "tab-view-pane" : [ 250, 251, 254 ],
    "tab-view-border" : [ 145, 165, 189 ],
    "tab-view-button" : [ 225, 238, 255 ],
    "tab-view-button-hover" : [ 250, 251, 254 ],
    "tab-view-button-checked" : [ 250, 251, 254 ],

    "radio-view-bar" : [ 225, 238, 255 ],
    "radio-view-button-checked" : [ 250, 251, 254 ],

    "list-view-border" : [ 167,166,170 ],
    "list-view-header" : [ 242, 242, 242 ],
    "list-view-header-border" : [ 214, 213, 217 ],
    "list-view-header-cell-hover" : [ 255, 255, 255 ],

    "date-chooser" : [ 255, 255, 255 ],
    "date-chooser-title" : [ 98, 133, 186 ],

    "table-pane" : [ 255, 255, 255 ],
    "table-header" : [ 242, 242, 242 ],
    "table-header-border" : [ 214, 213, 217 ],
    "table-header-cell" : [ 235, 234, 219 ],
    "table-header-cell-hover" : [ 255, 255, 255 ],
    "table-focus-indicator" : [ 197, 200, 202 ],
    "table-focus-indicator-active" : [ 179, 217, 255 ]
  }
});
