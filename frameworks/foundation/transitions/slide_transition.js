// ==========================================================================
// Project:   SproutCore
// Copyright: @2013 7x7 Software, Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


SC.mixin(SC.View,
  /** @scope SC.View */ {

  /** @class

    @extends SC.TransitionProtocol
    @see SC.View#animate for other timing functions.
    @since Version 1.10
  */
  SLIDE: {

    /** @private */
    runAdjust: function (view, options, finalLayout) {
      var key,
        value;

      view.animate(finalLayout, {
        delay: options.delay || 0,
        duration: options.duration || 0.4,
        timing: options.timing || 'ease'
      }, function (data) {
        this.didTransitionAdjust();
      });
    },

    /** @private Starts from outside of parent unless inPlace is true. */
    setupIn: function (view, options, inPlace) {
      var parentView = view.get('parentView'),
        parentFrame,
        viewFrame = view.get('borderFrame'),
        left,
        top,
        height,
        width;

      if (inPlace) {
        // Move from the current position.
      } else {
        // If there is no parentView, use the window's frame.
        if (parentView) {
          parentFrame = parentView.get('borderFrame');
        } else {
          parentFrame = SC.RootResponder.responder.currentWindowSize;
        }

        height = parentFrame.height;
        width = parentFrame.width;

        switch (options.direction) {
        case 'left':
          left = width;
          break;
        case 'up':
          top = height;
          break;
        case 'down':
          top = -height;
          break;
        default:
          left = -width;
        }
      }

      // Convert to a HW accelerate-able layout.
      view.adjust({ centerX: null, centerY: null, bottom: null, left: left || viewFrame.x, right: null, top: top || viewFrame.y, height: viewFrame.height, width: viewFrame.width });
    },

    /** @private */
    runIn: function (view, options, finalLayout, finalFrame) {
      var key,
        value;

      if (options.direction === 'up' || options.direction === 'down') {
        key = 'top';
        value = finalFrame.y;
      } else {
        key = 'left';
        value = finalFrame.x;
      }

      view.animate(key, value, {
        delay: options.delay || 0,
        duration: options.duration || 0.4,
        timing: options.timing || 'ease'
      }, function (data) {
        this.didTransitionIn();
      });
    },

    /** @private Starts from current position. */
    setupOut: function (view, options) {
      var viewFrame = view.get('borderFrame'),
        left = viewFrame.x,
        top = viewFrame.y,
        height = viewFrame.height,
        width = viewFrame.width;

      view.adjust({ centerX: null, centerY: null, bottom: null, left: left, right: null, top: top, height: height, width: width });
    },

    /** @private */
    runOut: function (view, options, finalLayout, finalFrame) {
      var viewFrame = view.get('borderFrame'),
        parentView = view.get('parentView'),
        parentFrame,
        key, value;

      // If there is no parentView, use the window's frame.
      if (parentView) {
        parentFrame = parentView.get('borderFrame');
      } else {
        parentFrame = SC.RootResponder.responder.currentWindowSize;
      }

      switch (options.direction) {
      case 'left':
        key = 'left';
        value = -viewFrame.width;
        break;
      case 'up':
        key = 'top';
        value = -viewFrame.height;
        break;
      case 'down':
        key = 'top';
        value = parentFrame.height;
        break;
      default:
        key = 'left';
        value = parentFrame.width;
      }

      view.animate(key, value, {
        delay: options.delay || 0,
        duration: options.duration || 0.4,
        timing: options.timing || 'ease'
      }, function (data) {
        this.didTransitionOut();
      });
    }
  }

});
