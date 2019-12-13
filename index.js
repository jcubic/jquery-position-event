/**@license
 *
 * Custom jQuery position event for textarea and input elements (version 0.1.0)
 *
 * Copyright (c) 2019 Jakub T. Jankiewicz <https://jcubic.pl/me>
 * Released under the MIT license
 *
 */
/* global module, define, global, require */
(function(factory, undefined) {
    var root = typeof window !== 'undefined' ? window : global;
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // istanbul ignore next
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function(root, jQuery) {
            if (jQuery === undefined) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if (window !== undefined) {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser
        // istanbul ignore next
        factory(root.jQuery);
    }
})(function($, undefined) {
    // ------------------------------------------------------------------------
    function getCursorPosition(element) {
        // ref: https://stackoverflow.com/a/19803814/387194
        var el = $(element).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }
    // ------------------------------------------------------------------------
    var re_line_begin = /(?:^|\n)([^\n]*)$/
    // ------------------------------------------------------------------------
    $.fn.on_cursor_position = function(action, callback) {
        if (action === 'unbind') {
            return this.each(function() {
                var self = $(this);
                if (self.is('textarea,input')) {
                    var callbacks;
                    callbacks = self.data('position_callbacks');
                    if (callback && callbacks) {
                        callbacks.remove(callback);
                        if (!callbacks.has()) {
                            callbacks = null;
                        }
                    } else {
                        callbacks = null;
                    }
                    if (!callbacks) {
                        self.removeData('callbacks');
                    }
                }
            });
        } else if (action === 'bind' || typeof action === 'function') {
            callback = callback || action;
            return this.each(function() {
                var self = $(this);
                if (self.is('textarea,input')) {
                    var callbacks = self.data('position_callbacks');
                    if (callbacks) {
                        callbacks.add(callback);
                    } else {
                        callbacks = $.Callbacks();
                        callbacks.add(callback);
                        var pos;
                        var events = 'keyup.cursor_position focus.cursor_' +
                            'position click.cursor_position';
                        self.on(events, function(e) {
                              var new_pos = getCursorPosition(self);
                              if (new_pos !== pos) {
                                  pos = new_pos;
                                  var node = self[0];
                                  var before = node.value.substring(0, pos);
                                  var event = {
                                      position: pos,
                                      column: before.match(re_line_begin)[1].length,
                                      line: before.split('\n').length - 1
                                  };
                                  callbacks.fireWith(self[0], [event]);
                              }
                        });
                    }
                }
            });
        }
    };
    $.event.special.position = {
        add: function(handleObj) {
            $(this).on_cursor_position(handleObj.handler);
        },
        trigger: function(event, data) {
            $(this).trigger('click');
            return false;
        },
        remove: function(handleObj) {
            $(this).on_cursor_position('unbind', handleObj.handler);
        }
    };
});