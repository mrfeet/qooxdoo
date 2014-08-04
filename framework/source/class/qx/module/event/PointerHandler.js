/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Daniel Wagner (danielwagner)

************************************************************************ */

/**
 * TODOC
 *
 * @require(qx.module.Event)
 *
 * @group (Event_Normalization)
 */
qx.Bootstrap.define("qx.module.event.PointerHandler", {

  statics :
  {
    /**
     * List of events that require a pointer handler
     */
    TYPES : [
      "pointermove",
      "pointerover",
      "pointerout",
      "pointerdown",
      "pointerup",
      "pointercancel",

      "gesturebegin",
      "gesturemove",
      "gesturefinish",
      "gesturecancel"
    ],

    /**
     * Creates a pointer handler for the given element when a pointer event listener
     * is attached to it
     *
     * @param element {Element} DOM element
     * @param type {String} event type
     */
    register : function(element, type) {
      // force qx.bom.Event.supportsEvent to return true for this type so we
      // can use the native addEventListener (synthetic gesture events use the
      // native dispatchEvent).
      if (!element["on" + type]) {
        element["on" + type] = true;
      }

      if (!element.$$pointerHandler) {
        element.$$pointerHandler = new qx.event.handler.PointerCore(element, element.$$emitter);
      }
    },


    /**
     * Removes the pointer event handler from the element if there are no more
     * pointer event listeners attached to it
     * @param element {Element} DOM element
     */
    unregister : function(element) {
      // check if there are any registered listeners left
      if (element.$$pointerHandler) {
        var listeners = element.$$emitter.getListeners();
        for (var type in listeners) {
          if (qx.module.event.PointerHandler.TYPES.indexOf(type) !== -1) {
            if (listeners[type].length > 0) {
              return;
            }
          }
        }

        // no more listeners, get rid of the handler
        element.$$pointerHandler.dispose();
        element.$$pointerHandler = undefined;
      }
    }
  },

  defer : function(statics) {
    qxWeb.$registerEventHook(statics.TYPES, statics.register, statics.unregister);
  }
});
