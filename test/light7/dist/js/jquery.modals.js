/*!
 * =====================================================
 * light7.modals - http://light7.org/
 *
 * =====================================================
 */
/* global $:true */
/* global WebKitCSSMatrix:true */

(function($) {
     "use strict";
    // ['width', 'height'].forEach(function(dimension) {
    //     var  Dimension = dimension.replace(/./, function(m) {
    //         return m[0].toUpperCase();
    //     });
    //     $.fn['outer' + Dimension] = function(margin) {
    //         var elem = this;
    //         if (elem) {
    //             var size = elem[dimension]();
    //             var sides = {
    //                 'width': ['left', 'right'],
    //                 'height': ['top', 'bottom']
    //             };
    //             sides[dimension].forEach(function(side) {
    //                 if (margin) size += parseInt(elem.css('margin-' + side), 10);
    //             });
    //             return size;
    //         } else {
    //             return null;
    //         }
    //     };
    // });
    //
    // $.noop = function() {};
    //
    // //support
    // $.support = (function() {
    //     var support = {
    //         touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
    //     };
    //     return support;
    // })();
    //
    // $.touchEvents = {
    //     start: $.support.touch ? 'touchstart' : 'mousedown',
    //     move: $.support.touch ? 'touchmove' : 'mousemove',
    //     end: $.support.touch ? 'touchend' : 'mouseup'
    // };
    //
    // $.getTranslate = function (el, axis) {
    //   var matrix, curTransform, curStyle, transformMatrix;
    //
    //   // automatic axis detection
    //   if (typeof axis === 'undefined') {
    //     axis = 'x';
    //   }
    //
    //   curStyle = window.getComputedStyle(el, null);
    //   if (window.WebKitCSSMatrix) {
    //     // Some old versions of Webkit choke when 'none' is passed; pass
    //     // empty string instead in this case
    //     transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
    //   }
    //   else {
    //     transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    //     matrix = transformMatrix.toString().split(',');
    //   }
    //
    //   if (axis === 'x') {
    //     //Latest Chrome and webkits Fix
    //     if (window.WebKitCSSMatrix)
    //       curTransform = transformMatrix.m41;
    //     //Crazy IE10 Matrix
    //     else if (matrix.length === 16)
    //       curTransform = parseFloat(matrix[12]);
    //     //Normal Browsers
    //     else
    //       curTransform = parseFloat(matrix[4]);
    //   }
    //   if (axis === 'y') {
    //     //Latest Chrome and webkits Fix
    //     if (window.WebKitCSSMatrix)
    //       curTransform = transformMatrix.m42;
    //     //Crazy IE10 Matrix
    //     else if (matrix.length === 16)
    //       curTransform = parseFloat(matrix[13]);
    //     //Normal Browsers
    //     else
    //       curTransform = parseFloat(matrix[5]);
    //   }
    //
    //   return curTransform || 0;
    // };
    // $.requestAnimationFrame = function (callback) {
    //   if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
    //   else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
    //   else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
    //   else {
    //     return window.setTimeout(callback, 1000 / 60);
    //   }
    // };
    //
    // $.cancelAnimationFrame = function (id) {
    //   if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
    //   else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
    //   else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
    //   else {
    //     return window.clearTimeout(id);
    //   }
    // };


    $.fn.transitionEnd = function(callback) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, dom = this;

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };
    $.fn.dataset = function() {
        var el = this[0];
        if (el) {
            var dataset = {};
            if (el.dataset) {

                for (var dataKey in el.dataset) { // jshint ignore:line
                    dataset[dataKey] = el.dataset[dataKey];
                }
            } else {
                for (var i = 0; i < el.attributes.length; i++) {
                    var attr = el.attributes[i];
                    if (attr.name.indexOf('data-') >= 0) {
                        dataset[$.toCamelCase(attr.name.split('data-')[1])] = attr.value;
                    }
                }
            }
            for (var key in dataset) {
                if (dataset[key] === 'false') dataset[key] = false;
                else if (dataset[key] === 'true') dataset[key] = true;
                else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1;
            }
            return dataset;
        } else return undefined;
    };
    // $.fn.data = function(key, value) {
    //     if (typeof value === 'undefined') {
    //         // Get value
    //         if (this[0] && this[0].getAttribute) {
    //             var dataKey = this[0].getAttribute('data-' + key);
    //
    //             if (dataKey) {
    //                 return dataKey;
    //             } else if (this[0].smElementDataStorage && (key in this[0].smElementDataStorage)) {
    //
    //
    //                 return this[0].smElementDataStorage[key];
    //
    //             } else {
    //                 return undefined;
    //             }
    //         } else return undefined;
    //
    //     } else {
    //         // Set value
    //         for (var i = 0; i < this.length; i++) {
    //             var el = this[i];
    //             if (!el.smElementDataStorage) el.smElementDataStorage = {};
    //             el.smElementDataStorage[key] = value;
    //         }
    //         return this;
    //     }
    // };
    // $.fn.animationEnd = function(callback) {
    //     var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
    //         i, dom = this;
    //
    //     function fireCallBack(e) {
    //         callback(e);
    //         for (i = 0; i < events.length; i++) {
    //             dom.off(events[i], fireCallBack);
    //         }
    //     }
    //     if (callback) {
    //         for (i = 0; i < events.length; i++) {
    //             dom.on(events[i], fireCallBack);
    //         }
    //     }
    //     return this;
    // };
    // $.fn.transition = function(duration) {
    //     if (typeof duration !== 'string') {
    //         duration = duration + 'ms';
    //     }
    //     for (var i = 0; i < this.length; i++) {
    //         var elStyle = this[i].style;
    //         elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
    //     }
    //     return this;
    // };
    // $.fn.transform = function(transform) {
    //     for (var i = 0; i < this.length; i++) {
    //         var elStyle = this[i].style;
    //         elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
    //     }
    //     return this;
    // };
    // $.fn.prevAll = function (selector) {
    //   var prevEls = [];
    //   var el = this[0];
    //   if (!el) return $([]);
    //   while (el.previousElementSibling) {
    //     var prev = el.previousElementSibling;
    //     if (selector) {
    //       if($(prev).is(selector)) prevEls.push(prev);
    //     }
    //     else prevEls.push(prev);
    //     el = prev;
    //   }
    //   return $(prevEls);
    // };
    // $.fn.nextAll = function (selector) {
    //   var nextEls = [];
    //   var el = this[0];
    //   if (!el) return $([]);
    //   while (el.nextElementSibling) {
    //     var next = el.nextElementSibling;
    //     if (selector) {
    //       if($(next).is(selector)) nextEls.push(next);
    //     }
    //     else nextEls.push(next);
    //     el = next;
    //   }
    //   return $(nextEls);
    // };
    //
    // //重置zepto的show方法，防止有些人引用的版本中 show 方法操作 opacity 属性影响动画执行
    // $.fn.show = function(){
    //   var elementDisplay = {};
    //   function defaultDisplay(nodeName) {
    //     var element, display;
    //     if (!elementDisplay[nodeName]) {
    //       element = document.createElement(nodeName);
    //       document.body.appendChild(element);
    //       display = getComputedStyle(element, '').getPropertyValue("display");
    //       element.parentNode.removeChild(element);
    //       display === "none" && (display = "block");
    //       elementDisplay[nodeName] = display;
    //     }
    //     return elementDisplay[nodeName];
    //   }
    //
    //   return this.each(function(){
    //     this.style.display === "none" && (this.style.display = '');
    //     if (getComputedStyle(this, '').getPropertyValue("display") === "none");
    //       this.style.display = defaultDisplay(this.nodeName);
    //   });
    // };
    //
    // $.fn.scrollHeight = function() {
    //   return this[0].scrollHeight;
    // };
})($);

/*======================================================
************   Modals   ************
======================================================*/
/*jshint unused: false*/
/* global $:true */
+function ($) {
  "use strict";
    var _modalTemplateTempDiv = document.createElement('div');
    var EVENTS = { CONFIRM: 'confirm', CANCEL: 'cancel' };

    $.modalStack = [];
    var t7 = $.Template7;

    $.modalStackClearQueue = function () {
        if ($.modalStack.length) {
            ($.modalStack.shift())();
        }
    };
    $.modal = function (params) {
        params = params || {};
        var modalHTML = '';
        // if (defaults.modalTemplate) {
        //     if (!$._compiledTemplates.modal) $._compiledTemplates.modal = t7.compile(defaults.modalTemplate);
        //     modalHTML = $._compiledTemplates.modal(params);
        // }
        // else {
        var buttonsHTML = '';
        if (params.buttons && params.buttons.length > 0) {
          for (var i = 0; i < params.buttons.length; i++) {
            buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
          }
        }
        var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
        var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
        var afterTextHTML = params.afterText ? params.afterText : '';
        var className = params.className ? params.className + ' ' : '';
        var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
        var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
        modalHTML = '<div class="modal ' + className + noButtons + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="modal-buttons ' + verticalButtons + '">' + buttonsHTML + '</div></div>';
        // }

        _modalTemplateTempDiv.innerHTML = modalHTML;

        var modal = $(_modalTemplateTempDiv).children();

        $(defaults.modalContainer).append(modal[0]);

        // Add events on buttons
        modal.find('.modal-button').each(function (index, el) {
          $(el).on('click', function (e) {
            if (params.buttons[index].close !== false) $.closeModal(modal);
            if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
            if (params.buttons[index].event) modal.trigger(params.buttons[index].event, [modal]);
            if (params.onClick) params.onClick(modal, index);
          });
        });
        $.openModal(modal);
        return modal;
    };
    $.alert = function (text, title, callbackOk) {
        if (typeof title === 'function') {
          callbackOk = arguments[1];
          title = undefined;
        }
        return $.modal({
          text: text || '',
          title: typeof title === 'undefined' ? defaults.modalTitle : title,
          buttons: [ {text: defaults.modalButtonOk, bold: true, event: EVENTS.CONFIRM, onClick: callbackOk} ]
        });
    };
    $.confirm = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
          callbackCancel = arguments[2];
          callbackOk = arguments[1];
          title = undefined;
        }
        return $.modal({
          text: text || '',
          title: typeof title === 'undefined' ? defaults.modalTitle : title,
          buttons: [
            {text: defaults.modalButtonCancel, onClick: callbackCancel, event: EVENTS.CANCEL},
            {text: defaults.modalButtonOk, bold: true, onClick: callbackOk, event: EVENTS.CONFIRM}
          ]
        });
    };
    $.prompt = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
          callbackCancel = arguments[2];
          callbackOk = arguments[1];
          title = undefined;
        }
        return $.modal({
          text: text || '',
          title: typeof title === 'undefined' ? defaults.modalTitle : title,
          afterText: '<input type="text" class="modal-text-input">',
          buttons: [
            { text: defaults.modalButtonCancel },
            { text: defaults.modalButtonOk, bold: true }
          ],
          onClick: function (modal, index) {
          var _event = '';
          var $modal = $(modal);
          var value = $modal.find('.modal-text-input').val();

          if (index === 0) {
            callbackCancel && callbackCancel(value);
            _event = EVENTS.CANCEL;
          }
          if (index === 1) {
            callbackOk && callbackOk(value);
            _event = EVENTS.CONFIRM;
          }
          _event && $modal.trigger(_event, [modal, value]);
          }
        });
    };
    // $.modalLogin = function (text, title, callbackOk, callbackCancel) {
    //     if (typeof title === 'function') {
    //         callbackCancel = arguments[2];
    //         callbackOk = arguments[1];
    //         title = undefined;
    //     }
    //     return $.modal({
    //         text: text || '',
    //         title: typeof title === 'undefined' ? defaults.modalTitle : title,
    //         afterText: '<input type="text" name="modal-username" placeholder="' + defaults.modalUsernamePlaceholder + '" class="modal-text-input modal-text-input-double"><input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input modal-text-input-double">',
    //         buttons: [
    //             {
    //                 text: defaults.modalButtonCancel
    //             },
    //             {
    //                 text: defaults.modalButtonOk,
    //                 bold: true
    //             }
    //         ],
    //         onClick: function (modal, index) {
    //             var username = $(modal).find('.modal-text-input[name="modal-username"]').val();
    //             var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
    //             if (index === 0 && callbackCancel) callbackCancel(username, password);
    //             if (index === 1 && callbackOk) callbackOk(username, password);
    //         }
    //     });
    // };
    // $.modalPassword = function (text, title, callbackOk, callbackCancel) {
    //     if (typeof title === 'function') {
    //         callbackCancel = arguments[2];
    //         callbackOk = arguments[1];
    //         title = undefined;
    //     }
    //     return $.modal({
    //         text: text || '',
    //         title: typeof title === 'undefined' ? defaults.modalTitle : title,
    //         afterText: '<input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input">',
    //         buttons: [
    //             {
    //                 text: defaults.modalButtonCancel
    //             },
    //             {
    //                 text: defaults.modalButtonOk,
    //                 bold: true
    //             }
    //         ],
    //         onClick: function (modal, index) {
    //             var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
    //             if (index === 0 && callbackCancel) callbackCancel(password);
    //             if (index === 1 && callbackOk) callbackOk(password);
    //         }
    //     });
    // };
    $.showPreloader = function (title) {
      return $.modal({
        title: title || defaults.modalPreloaderTitle,
        text: '<div class="preloader"></div>'
      });
    };
    $.hidePreloader = function () {
      $.closeModal('.modal.modal-in');
    };
    $.showIndicator = function () {
      $(defaults.modalContainer).append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>');
    };
    $.hideIndicator = function () {
      $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
    };
    // // Action Sheet
    // $.actions = function (target, params) {
    //     var toPopover = false, modal, groupSelector, buttonSelector;
    //     if (arguments.length === 1) {
    //         // Actions
    //         params = target;
    //     }
    //     else {
    //         // Popover
    //         if ($.device.ios) {
    //             if ($.device.ipad) toPopover = true;
    //         }
    //         else {
    //             if ($(window).width() >= 768) toPopover = true;
    //         }
    //     }
    //     params = params || [];
    //
    //     if (params.length > 0 && !$.isArray(params[0])) {
    //         params = [params];
    //     }
    //     var modalHTML;
    //     if (toPopover) {
    //         var actionsToPopoverTemplate = defaults.modalActionsToPopoverTemplate ||
    //             '<div class="popover actions-popover">' +
    //               '<div class="popover-inner">' +
    //                 '{{#each this}}' +
    //                 '<div class="list-block">' +
    //                   '<ul>' +
    //                     '{{#each this}}' +
    //                     '{{#if label}}' +
    //                     '<li class="actions-popover-label {{#if color}}color-{{color}}{{/if}} {{#if bold}}actions-popover-bold{{/if}}">{{text}}</li>' +
    //                     '{{else}}' +
    //                     '<li><a href="#" class="item-link list-button {{#if color}}color-{{color}}{{/if}} {{#if bg}}bg-{{bg}}{{/if}} {{#if bold}}actions-popover-bold{{/if}} {{#if disabled}}disabled{{/if}}">{{text}}</a></li>' +
    //                     '{{/if}}' +
    //                     '{{/each}}' +
    //                   '</ul>' +
    //                 '</div>' +
    //                 '{{/each}}' +
    //               '</div>' +
    //             '</div>';
    //         if (!$._compiledTemplates.actionsToPopover) {
    //             $._compiledTemplates.actionsToPopover = t7.compile(actionsToPopoverTemplate);
    //         }
    //         var popoverHTML = $._compiledTemplates.actionsToPopover(params);
    //         modal = $($.popover(popoverHTML, target, true));
    //         groupSelector = '.list-block ul';
    //         buttonSelector = '.list-button';
    //     }
    //     else {
    //         if (defaults.modalActionsTemplate) {
    //             if (!$._compiledTemplates.actions) $._compiledTemplates.actions = t7.compile(defaults.modalActionsTemplate);
    //             modalHTML = $._compiledTemplates.actions(params);
    //         }
    //         else {
    //             var buttonsHTML = '';
    //             for (var i = 0; i < params.length; i++) {
    //                 for (var j = 0; j < params[i].length; j++) {
    //                     if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
    //                     var button = params[i][j];
    //                     var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
    //                     if (button.bold) buttonClass += ' actions-modal-button-bold';
    //                     if (button.color) buttonClass += ' color-' + button.color;
    //                     if (button.bg) buttonClass += ' bg-' + button.bg;
    //                     if (button.disabled) buttonClass += ' disabled';
    //                     buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
    //                     if (j === params[i].length - 1) buttonsHTML += '</div>';
    //                 }
    //             }
    //             modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
    //         }
    //         _modalTemplateTempDiv.innerHTML = modalHTML;
    //         modal = $(_modalTemplateTempDiv).children();
    //         $(defaults.modalContainer).append(modal[0]);
    //         groupSelector = '.actions-modal-group';
    //         buttonSelector = '.actions-modal-button';
    //     }
    //
    //     var groups = modal.find(groupSelector);
    //     groups.each(function (index, el) {
    //         var groupIndex = index;
    //         $(el).children().each(function (index, el) {
    //             var buttonIndex = index;
    //             var buttonParams = params[groupIndex][buttonIndex];
    //             var clickTarget;
    //             if (!toPopover && $(el).is(buttonSelector)) clickTarget = $(el);
    //             if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);
    //
    //             if (clickTarget) {
    //                 clickTarget.on('click', function (e) {
    //                     if (buttonParams.close !== false) $.closeModal(modal);
    //                     if (buttonParams.onClick) buttonParams.onClick(modal, e);
    //                 });
    //             }
    //         });
    //     });
    //     if (!toPopover) $.openModal(modal);
    //     return modal[0];
    // };
    $.popover = function (modal, target, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
            var _modal = document.createElement('div');
            _modal.innerHTML = modal.trim();
            if (_modal.childNodes.length > 0) {
                modal = _modal.childNodes[0];
                if (removeOnClose) modal.classList.add('remove-on-close');
                $(defaults.modalContainer).append(modal);
            }
            else return false; //nothing found
        }
        modal = $(modal);
        target = $(target);
        if (modal.length === 0 || target.length === 0) return false;
        if (modal.find('.popover-angle').length === 0) {
            modal.append('<div class="popover-angle"></div>');
        }
        modal.show();

        function sizePopover() {
            modal.css({left: '', top: ''});
            var modalWidth =  modal.width();
            var modalHeight =  modal.height(); // 13 - height of angle
            var modalAngle = modal.find('.popover-angle');
            var modalAngleSize = modalAngle.width() / 2;
            var modalAngleLeft, modalAngleTop;
            modalAngle.removeClass('on-left on-right on-top on-bottom').css({left: '', top: ''});

            var targetWidth = target.outerWidth();
            var targetHeight = target.outerHeight();
            var targetOffset = target.offset();
            var targetParentPage = target.parents('.page');
            if (targetParentPage.length > 0) {
                targetOffset.top = targetOffset.top - targetParentPage[0].scrollTop;
            }

            var windowHeight = $(window).height();
            var windowWidth = $(window).width();

            var modalTop = 0;
            var modalLeft = 0;
            var diff = 0;
            // Top Position
            var modalPosition = 'top';

            if ((modalHeight + modalAngleSize) < targetOffset.top) {
                // On top
                modalTop = targetOffset.top - modalHeight - modalAngleSize;
            }
            else if ((modalHeight + modalAngleSize) < windowHeight - targetOffset.top - targetHeight) {
                // On bottom
                modalPosition = 'bottom';
                modalTop = targetOffset.top + targetHeight + modalAngleSize;
            }
            else {
                // On middle
                modalPosition = 'middle';
                modalTop = targetHeight / 2 + targetOffset.top - modalHeight / 2;
                diff = modalTop;
                if (modalTop < 0) {
                    modalTop = 5;
                }
                else if (modalTop + modalHeight > windowHeight) {
                    modalTop = windowHeight - modalHeight - 5;
                }
                diff = diff - modalTop;
            }
            // Horizontal Position
            if (modalPosition === 'top' || modalPosition === 'bottom') {
                modalLeft = targetWidth / 2 + targetOffset.left - modalWidth / 2;
                diff = modalLeft;
                if (modalLeft < 5) modalLeft = 5;
                if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
                if (modalPosition === 'top') modalAngle.addClass('on-bottom');
                if (modalPosition === 'bottom') modalAngle.addClass('on-top');
                diff = diff - modalLeft;
                modalAngleLeft = (modalWidth / 2 - modalAngleSize + diff);
                modalAngleLeft = Math.max(Math.min(modalAngleLeft, modalWidth - modalAngleSize * 2 - 6), 6);
                modalAngle.css({left: modalAngleLeft + 'px'});
            }
            else if (modalPosition === 'middle') {
                modalLeft = targetOffset.left - modalWidth - modalAngleSize;
                modalAngle.addClass('on-right');
                if (modalLeft < 5) {
                    modalLeft = targetOffset.left + targetWidth + modalAngleSize;
                    modalAngle.removeClass('on-right').addClass('on-left');
                }
                if (modalLeft + modalWidth > windowWidth) {
                    modalLeft = windowWidth - modalWidth - 5;
                    modalAngle.removeClass('on-right').addClass('on-left');
                }
                modalAngleTop = (modalHeight / 2 - modalAngleSize + diff);
                modalAngleTop = Math.max(Math.min(modalAngleTop, modalHeight - modalAngleSize * 2 - 6), 6);
                modalAngle.css({top: modalAngleTop + 'px'});
            }

            // Apply Styles
            modal.css({top: modalTop + 'px', left: modalLeft + 'px'});
        }
        sizePopover();

        $(window).on('resize', sizePopover);
        modal.on('close', function () {
            $(window).off('resize', sizePopover);
        });

        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }

        $.openModal(modal);
        return modal[0];
    };
    $.popup = function (modal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
            var _modal = document.createElement('div');
            _modal.innerHTML = modal.trim();
            if (_modal.childNodes.length > 0) {
                modal = _modal.childNodes[0];
                if (removeOnClose) modal.classList.add('remove-on-close');
                $(defaults.modalContainer).append(modal);
            }
            else return false; //nothing found
        }
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);

        return modal[0];
    };
    // $.pickerModal = function (pickerModal, removeOnClose) {
    //     if (typeof removeOnClose === 'undefined') removeOnClose = true;
    //     if (typeof pickerModal === 'string' && pickerModal.indexOf('<') >= 0) {
    //         pickerModal = $(pickerModal);
    //         if (pickerModal.length > 0) {
    //             if (removeOnClose) pickerModal.addClass('remove-on-close');
    //             $(defaults.modalContainer).append(pickerModal[0]);
    //         }
    //         else return false; //nothing found
    //     }
    //     pickerModal = $(pickerModal);
    //     if (pickerModal.length === 0) return false;
    //     pickerModal.show();
    //     $.openModal(pickerModal);
    //     return pickerModal[0];
    // };
    // $.loginScreen = function (modal) {
    //     if (!modal) modal = '.login-screen';
    //     modal = $(modal);
    //     if (modal.length === 0) return false;
    //     modal.show();
    //     if (modal.find('.' + defaults.viewClass).length > 0) {
    //         $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
    //     }
    //     $.openModal(modal);
    //     return modal[0];
    // };
    //显示一个消息，会在2秒钟后自动消失
    $.toast = function(msg, time) {
      var $toast = $("<div class='modal toast'>"+msg+"</div>").appendTo(document.body);
      $.openModal($toast);
      setTimeout(function() {
        $.closeModal($toast);
      }, time || 2000);
    };
    $.openModal = function (modal) {
        if(defaults.closePrevious) $.closeModal();
        modal = $(modal);
        var isModal = modal.hasClass('modal');
        if ($('.modal.modal-in:not(.modal-out)').length && defaults.modalStack && isModal) {
            $.modalStack.push(function () {
                $.openModal(modal);
            });
            return;
        }
        var isPopover = modal.hasClass('popover');
        var isPopup = modal.hasClass('popup');
        var isLoginScreen = modal.hasClass('login-screen');
        var isPickerModal = modal.hasClass('picker-modal');
        var isToast = modal.hasClass('toast');
        if (isModal) {
            modal.show();
            modal.css({
                marginTop: - Math.round(modal.outerHeight() / 2) + 'px',
                marginLeft: - Math.round(modal.outerWidth() / 2) + 'px'
            });
        }
        if (isToast) {
            modal.show();
            modal.css({
                marginLeft: - Math.round(parseInt(window.getComputedStyle(modal[0]).width) / 2)  + 'px' //
            });
        }

        var overlay;
        if (!isLoginScreen && !isPickerModal && !isToast) {
            if ($('.modal-overlay').length === 0 && !isPopup) {
                $(defaults.modalContainer).append('<div class="modal-overlay"></div>');
            }
            if ($('.popup-overlay').length === 0 && isPopup) {
                $(defaults.modalContainer).append('<div class="popup-overlay"></div>');
            }
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        }

        //Make sure that styles are applied, trigger relayout;
        var clientLeft = modal[0].clientLeft;

        // Trugger open event
        modal.trigger('open');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).addClass('with-picker-modal');
        }

        // Classes for transition in
        if (!isLoginScreen && !isPickerModal && !isToast) overlay.addClass('modal-overlay-visible');
        modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');
        });
        return true;
    };
    $.closeModal = function (modal) {
        modal = $(modal || '.modal-in');
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }
        var isModal = modal.hasClass('modal');
        var isPopover = modal.hasClass('popover');
        var isPopup = modal.hasClass('popup');
        var isLoginScreen = modal.hasClass('login-screen');
        var isPickerModal = modal.hasClass('picker-modal');

        var removeOnClose = modal.hasClass('remove-on-close');

        var overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        if (isPopup){
            if (modal.length === $('.popup.modal-in').length) {
                overlay.removeClass('modal-overlay-visible');
            }
        }
        else if (!isPickerModal) {
            overlay.removeClass('modal-overlay-visible');
        }

        modal.trigger('close');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).removeClass('with-picker-modal');
            $(defaults.modalContainer).addClass('picker-modal-closing');
        }

        if (!isPopover) {
            modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
                if (modal.hasClass('modal-out')) modal.trigger('closed');
                else modal.trigger('opened');

                if (isPickerModal) {
                    $(defaults.modalContainer).removeClass('picker-modal-closing');
                }
                if (isPopup || isLoginScreen || isPickerModal) {
                    modal.removeClass('modal-out').hide();
                    if (removeOnClose && modal.length > 0) {
                        modal.remove();
                    }
                }
                else {
                    modal.remove();
                }
            });
            if (isModal &&  defaults.modalStack ) {
                $.modalStackClearQueue();
            }
        }
        else {
            modal.removeClass('modal-in modal-out').trigger('closed').hide();
            if (removeOnClose) {
                modal.remove();
            }
        }
        return true;
    };
    function handleClicks(e) {
        /*jshint validthis:true */
        var clicked = $(this);
        var url = clicked.attr('href');

        //Collect Clicked data- attributes
        var clickedData = clicked.dataset();

        // Popover
        if (clicked.hasClass('open-popover')) {
            var popover;
            if (clickedData.popover) {
                popover = clickedData.popover;
            }
            else popover = '.popover';
            $.popover(popover, clicked);
        }
        if (clicked.hasClass('close-popover')) {
            $.closeModal('.popover.modal-in');
        }
        // Popup
        var popup;
        if (clicked.hasClass('open-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup';
            $.popup(popup);
        }
        if (clicked.hasClass('close-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup.modal-in';
            $.closeModal(popup);
        }

        // Close Modal
        if (clicked.hasClass('modal-overlay')) {
            if ($('.modal.modal-in').length > 0 && defaults.modalCloseByOutside)
                $.closeModal('.modal.modal-in');
            if ($('.actions-modal.modal-in').length > 0 && defaults.actionsCloseByOutside)
                $.closeModal('.actions-modal.modal-in');

            if ($('.popover.modal-in').length > 0) $.closeModal('.popover.modal-in');
        }
        if (clicked.hasClass('popup-overlay')) {
            if ($('.popup.modal-in').length > 0 && defaults.popupCloseByOutside)
                $.closeModal('.popup.modal-in');
        }
    }

    var defaults = $.modal.prototype.defaults = {
      modalButtonOk: '确定',
      modalButtonCancel: '取消',
      modalPreloaderTitle: 'Loading...',
      modalContainer : document.body,
      modalCloseByOutside: true,
      actionsCloseByOutside: false,
      popupCloseByOutside: true,
      closePrevious: true  //close all previous modal before open
    };

    // TODO 添加 options 参数，控制点击空白关闭弹窗这些参数

    $(function() {
      $(document).on('click', ' .modal-overlay, .popup-overlay, .close-popup, .open-popup, .open-popover, .close-popover, .close-picker', handleClicks);
      defaults.modalContainer = defaults.modalContainer || document.body;  //incase some one include js in head
    });
}($);
