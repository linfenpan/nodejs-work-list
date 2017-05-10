/*!
 * =====================================================
 * light7.modals - http://light7.org/
 *
 * =====================================================
 */
/* global $:true */
+ function($) {
  "use strict";

  //比较一个字符串版本号
  //a > b === 1
  //a = b === 0
  //a < b === -1
  $.compareVersion = function(a, b) {
    var as = a.split('.');
    var bs = b.split('.');
    if (a === b) return 0;

    for (var i = 0; i < as.length; i++) {
      var x = parseInt(as[i]);
      if (!bs[i]) return 1;
      var y = parseInt(bs[i]);
      if (x < y) return -1;
      if (x > y) return 1;
    }
    return 1;
  };

  $.getTouchPosition = function(e) {
    e = e.originalEvent || e; //jquery wrap the originevent
    if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend') {
      return {
        x: e.targetTouches[0].pageX,
        y: e.targetTouches[0].pageY
      };
    } else {
      return {
        x: e.pageX,
        y: e.pageY
      };
    }
  };

}($);

/*===========================
Device/OS Detection
===========================*/
/* global $:true */
;(function ($) {
    "use strict";
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
    
    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
        
    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webView &&
                            (ipod || iphone) &&
                            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
                            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
        device.statusBar = true;
    }
    else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os) {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }
        
    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    }
    else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    $.device = device;
})($);

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
    $.noop = function() {};
    
    //support
    $.support = (function() {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();

    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };

    $.getTranslate = function (el, axis) {
      var matrix, curTransform, curStyle, transformMatrix;

      // automatic axis detection
      if (typeof axis === 'undefined') {
        axis = 'x';
      }

      curStyle = window.getComputedStyle(el, null);
      if (window.WebKitCSSMatrix) {
        // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case
        transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
      }
      else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
      }

      if (axis === 'x') {
        //Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix)
          curTransform = transformMatrix.m41;
        //Crazy IE10 Matrix
        else if (matrix.length === 16)
          curTransform = parseFloat(matrix[12]);
        //Normal Browsers
        else
          curTransform = parseFloat(matrix[4]);
      }
      if (axis === 'y') {
        //Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix)
          curTransform = transformMatrix.m42;
        //Crazy IE10 Matrix
        else if (matrix.length === 16)
          curTransform = parseFloat(matrix[13]);
        //Normal Browsers
        else
          curTransform = parseFloat(matrix[5]);
      }

      return curTransform || 0;
    };
    $.requestAnimationFrame = function (callback) {
      if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
      else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
      else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
      else {
        return window.setTimeout(callback, 1000 / 60);
      }
    };

    $.cancelAnimationFrame = function (id) {
      if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
      else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
      else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
      else {
        return window.clearTimeout(id);
      }
    };


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
    $.fn.data = function(key, value) {
        if (typeof value === 'undefined') {
            // Get value
            if (this[0] && this[0].getAttribute) {
                var dataKey = this[0].getAttribute('data-' + key);
                if (dataKey) {
                    return dataKey;
                } else if (this[0].smElementDataStorage && (key in this[0].smElementDataStorage)) {
                    return this[0].smElementDataStorage[key];
                } else {
                    return undefined;
                }
            } else return undefined;

        } else {
            // Set value
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                if (!el.smElementDataStorage) el.smElementDataStorage = {};
                el.smElementDataStorage[key] = value;
            }
            return this;
        }
    };
    $.fn.animationEnd = function(callback) {
        var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
            i, dom = this;

        function fireCallBack(e) {
            callback(e);
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
    $.fn.transition = function(duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };
    $.fn.transform = function(transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return this;
    };
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
    var KEY_MODAL_OPTIONS = 'modal-options';

    // 获取弹窗参数
    function getModalOptions(modal) {
      var $modal = $(modal);
      return $.extend({}, defaults, $modal.data(KEY_MODAL_OPTIONS));
    }
    // 设置弹窗参数
    // @param {jQuery} [modal] 弹窗 jquery dom 对象
    // @param {Object} [opts] 参数，例如: { modalCloseByOutside: false, closePrevious: false }
    function setModalOptions(modal, opts) {
      var $modal = $(modal);
      var defOpts = $modal.data(KEY_MODAL_OPTIONS);
      $modal.data(KEY_MODAL_OPTIONS, $.extend(defOpts, opts || {}));
    }

    // 修正位置
    function fixPosition($modal) {
      $modal.css({
        marginTop: - Math.round($modal.outerHeight() / 2) + 'px',
        marginLeft: - Math.round($modal.outerWidth() / 2) + 'px'
      });
    }

    $.modal = function (params) {
        params = params || {};
        var modalHTML = '';
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

        _modalTemplateTempDiv.innerHTML = modalHTML;

        var modal = $(_modalTemplateTempDiv).children();

        $(defaults.modalContainer).append(modal[0]);

        // Add events on buttons
        modal.find('.modal-button').each(function (index, el) {
          $(el).on('click', function (e) {
            if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
            if (params.buttons[index].event) modal.trigger(params.buttons[index].event, [modal]);
            if (params.onClick) params.onClick(modal, index);
            if (params.buttons[index].close !== false) $.closeModal(modal);
          });
        });

        // 给 modal 额外方法，用于设置参数，用法: $.modal(dom).options({ closePrevious: true }) 之类的
        modal.options = function(opts) {
          setModalOptions(this, opts);
          return this;
        };

        // 让 modal.options 充分执行
        setTimeout(function() {
          $.openModal(modal);
        });

        return modal;
    };

    $.alert = function (text, title, callbackOk) {
        if (typeof title === 'function') {
          callbackOk = arguments[1];
          title = undefined;
        }
        var modal = $.modal({
          text: text || '',
          title: typeof title === 'undefined' ? defaults.modalTitle : title,
          buttons: [
            { text: defaults.modalButtonOk, bold: true, event: EVENTS.CONFIRM, onClick: callbackOk }
          ]
        });

        var closeEvent = defaults.closeEvent;
        modal.options({ closeAsConfirm: true })
          .one(EVENTS.CONFIRM, function() {
            modal.off(closeEvent);
          })
          .one(closeEvent, function() {
            var options = getModalOptions(modal);
            options.closeAsConfirm && modal.trigger(EVENTS.CONFIRM, [modal]);
          });

        return modal;
    };

    $.confirm = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
          callbackCancel = arguments[2];
          callbackOk = arguments[1];
          title = undefined;
        }
        var modal = $.modal({
          text: text || '',
          title: typeof title === 'undefined' ? defaults.modalTitle : title,
          buttons: [
            {text: defaults.modalButtonCancel, onClick: callbackCancel, event: EVENTS.CANCEL},
            {text: defaults.modalButtonOk, bold: true, onClick: callbackOk, event: EVENTS.CONFIRM}
          ]
        });

        var closeEvent = defaults.closeEvent;
        modal.options({ closeAsCancel: true })
          .one(EVENTS.CANCEL, function() {
            modal.off(closeEvent);
          })
          .one(EVENTS.CONFIRM, function() {
            modal.off(closeEvent);
          })
          .one(closeEvent, function() {
            var options = getModalOptions(modal);
            options.closeAsCancel && modal.trigger(EVENTS.CANCEL, [modal]);
          });

        return modal;
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
        modal.on(defaults.closeEvent, function () {
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
        // if (modal.find('.' + defaults.viewClass).length > 0) {
        //     $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        // }

        // TODO 这里应该独立弹窗!!!!!!!!!

        modal.addClass('modal-single');
        return $.openModal(modal, true);
    };

    //显示一个消息，会在2秒钟后自动消失
    $.toast = function(msg, time) {
      var $toast = $("<div class='toast'>"+msg+"</div>").appendTo(document.body);

      $toast.show();
      fixPosition($toast);

      //Make sure that styles are applied, trigger relayout;
      var clientLeft = $toast[0].clientLeft;
      $toast.addClass('toast-in').transitionEnd(function (e) {
        $toast.trigger('opened');
      });

      setTimeout(function() {
        $toast.trigger(defaults.closeEvent, [$toast]);
        $toast.addClass('toast-out').transitionEnd(function() { $toast.remove(); });
      }, time || 2000);
    };

    $.pickerModal = function (pickerModal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof pickerModal === 'string' && pickerModal.indexOf('<') >= 0) {
            pickerModal = $(pickerModal);
            if (pickerModal.length > 0) {
                if (removeOnClose) pickerModal.addClass('remove-on-close');
                $(defaults.modalContainer).append(pickerModal[0]);
            }
            else return false; //nothing found
        }
        pickerModal = $(pickerModal);
        if (pickerModal.length === 0) return false;
        pickerModal.show();
        $.openModal(pickerModal);
        return pickerModal[0];
    };

    $.modalStack = [];
    $.openModal = function (modal) {
        var options = getModalOptions(modal);

        if(options.closePrevious) {
          $.closeModal();
        } else if (!options.singleModal) {
          // 不然此弹窗关闭时，应该把上一个弹窗，重新载入
          var $oldModal = $('.modal-in:not(.modal-out)').filter(':not(.modal-single)');
          if ($oldModal.length > 0) {
            $.modalStack.unshift($oldModal);
            $oldModal.addClass('modal-out');
          }
        }

        modal = $(modal);
        var isModal = modal.hasClass('modal');
        var isPopover = modal.hasClass('popover');
        var isPopup = modal.hasClass('popup');
        var isLoginScreen = modal.hasClass('login-screen');
        var isPickerModal = modal.hasClass('picker-modal');
        if (isModal) {
            modal.show();
            modal.css({
                marginTop: - Math.round(modal.outerHeight() / 2) + 'px',
                marginLeft: - Math.round(modal.outerWidth() / 2) + 'px'
            });
            // @notice 以免动画导致宽度计算失败
            modal.addClass('modal-ready');
        }

        var overlay;
        if (!isLoginScreen && !isPickerModal) {
            if ($('.modal-overlay').length === 0 && !isPopup) {
                $(options.modalContainer).append('<div class="modal-overlay"></div>');
            }
            if ($('.popup-overlay').length === 0 && isPopup) {
                $(options.modalContainer).append('<div class="popup-overlay"></div>');
            }
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        }

        //Make sure that styles are applied, trigger relayout;
        var clientLeft = modal[0].clientLeft;

        // Trugger open event
        modal.trigger('open');

        // Picker modal body class
        if (isPickerModal) {
            $(options.modalContainer).addClass('with-picker-modal');
        }

        // Classes for transition in
        if (!isLoginScreen && !isPickerModal) overlay.addClass('modal-overlay-visible');
        modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');
        });
        return true;
    };

    $.closeModal = function (modal) {
        modal = $(modal || '.modal-in:not(.modal-out)');
        var options = getModalOptions(modal);

        if (modal && modal.length === 0) {
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

        modal.trigger(options.closeEvent);

        // Picker modal body class
        if (isPickerModal) {
            $(options.modalContainer).removeClass('with-picker-modal');
            $(options.modalContainer).addClass('picker-modal-closing');
        }

        if (!isPopover) {
            modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
                if (modal.hasClass('modal-out')) modal.trigger('closed');
                else modal.trigger('opened');

                if (isPickerModal) {
                    $(options.modalContainer).removeClass('picker-modal-closing');
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
        }
        else {
            modal.removeClass('modal-in modal-out').trigger('closed').hide();
            if (removeOnClose) {
                modal.remove();
            }
        }

        if ($.modalStack.length > 0) {
          $.openModal($.modalStack.shift());
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
            $.closeModal('.popover.modal-in:not(.modal-out)');
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
            else popup = '.popup.modal-in:not(.modal-out)';
            $.closeModal(popup);
        }

        // Close Modal
        if (clicked.hasClass('modal-overlay')) {
          var $modal = $('.modal.modal-in:not(.modal-out)');
          if ($modal.length > 0) {
            var options = getModalOptions($modal);
            options.modalCloseByOutside && $.closeModal($modal);
          }

          var $popover = $('.popover.modal-in:not(.modal-out)');
          if ($popover.length > 0) {
            $.closeModal($popover);
          }
        }
        if (clicked.hasClass('popup-overlay')) {
          var $popup = $('.popup.modal-in:not(.modal-out)');
          if ($popup.length > 0) {
            var options = getModalOptions($popup);
            options.popupCloseByOutside && $.closeModal($popup);
          }
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
      closePrevious: true,  //close all previous modal before open
      closeEvent: 'close'
    };

    $(function() {
      $(document).on('click', ' .modal-overlay, .popup-overlay, .close-popup, .open-popup, .open-popover, .close-popover, .close-picker', handleClicks);
      defaults.modalContainer = defaults.modalContainer || document.body;  //incase some one include js in head
    });
}($);

/*======================================================
************   Picker   ************
======================================================*/
/* global $:true */
/* jshint unused:false */
/* jshint multistr:true */
+ function($) {
  "use strict";
  var Picker = function (params) {
      var p = this;
      var defaults = {
          updateValuesOnMomentum: false,
          updateValuesOnTouchmove: true,
          rotateEffect: false,
          momentumRatio: 7,
          freeMode: false,
          // Common settings
          scrollToInput: true,
          inputReadOnly: true,
          // convertToPopover: true,
          // onlyInPopover: false,
          toolbar: true,
          toolbarCloseText: 'OK',
          toolbarTemplate: '<header class="bar bar-nav">\
          <button class="button button-link pull-right close-picker">OK</button>\
          <h1 class="title"></h1>\
          </header>',
          separator: ' '
      };
      params = params || {};
      for (var def in defaults) {
          if (typeof params[def] === 'undefined') {
              params[def] = defaults[def];
          }
      }
      p.params = params;
      p.cols = [];
      p.initialized = false;

      // Inline flag
      p.inline = p.params.container ? true : false;

      // 3D Transforms origin bug, only on safari
      var originBug = $.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !$.device.android;

      // Should be converted to popover
      // function isPopover() {
      //     var toPopover = false;
      //     if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
      //     if (!p.inline && p.params.input) {
      //         if (p.params.onlyInPopover) toPopover = true;
      //         else {
      //             if ($.device.ios) {
      //                 toPopover = $.device.ipad ? true : false;
      //             }
      //             else {
      //                 if ($(window).width() >= 768) toPopover = true;
      //             }
      //         }
      //     }
      //     return toPopover;
      // }
      // function inPopover() {
      //     if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
      //     else return false;
      // }

      // Value
      p.setValue = function (arrValues, transition) {
          var valueIndex = 0;
          for (var i = 0; i < p.cols.length; i++) {
              if (p.cols[i] && !p.cols[i].divider) {
                  p.cols[i].setValue(arrValues[valueIndex], transition);
                  valueIndex++;
              }
          }
      };
      p.updateValue = function () {
          var newValue = [];
          var newDisplayValue = [];
          for (var i = 0; i < p.cols.length; i++) {
              if (!p.cols[i].divider) {
                  newValue.push(p.cols[i].value);
                  newDisplayValue.push(p.cols[i].displayValue);
              }
          }
          if (newValue.indexOf(undefined) >= 0) {
              return;
          }
          p.value = newValue;
          p.displayValue = newDisplayValue;
          if (p.params.onChange) {
              p.params.onChange(p, p.value, p.displayValue);
          }
          if (p.input && p.input.length > 0) {
              var value;
              if (p.params.formatValue) {
                value = p.params.formatValue(p, p.value, p.displayValue);
              } else {
                value = p.displayValue.join(p.params.separator);
                while (value.endsWith(p.params.separator)) {
                  value = value.substr(0, value.length - p.params.separator.length);
                }
              }
              $(p.input).val(value);
              $(p.input).trigger('change');
              if (p.inputTarget) {
                p.inputTarget.val(p.value.join(''));
              }
          }
      };

      // Columns Handlers
      p.initPickerCol = function (colElement, updateItems) {
          var colContainer = $(colElement);
          var colIndex = colContainer.index();
          var col = p.cols[colIndex];
          if (col.divider) return;
          col.container = colContainer;
          col.wrapper = col.container.find('.picker-items-col-wrapper');
          col.items = col.wrapper.find('.picker-item');

          var i, j;
          var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
          col.replaceValues = function (values, displayValues) {
              col.destroyEvents();
              col.values = values;
              col.displayValues = displayValues;
              var newItemsHTML = p.columnHTML(col, true);
              col.wrapper.html(newItemsHTML);
              col.items = col.wrapper.find('.picker-item');
              col.calcSize();
              col.setValue(col.displayValues[0], 0, true);
              col.initEvents();
          };
          col.calcSize = function () {
              if (p.params.rotateEffect) {
                  col.container.removeClass('picker-items-col-absolute');
                  if (!col.width) col.container.css({width:''});
              }
              var colWidth, colHeight;
              colWidth = 0;
              colHeight = col.container[0].offsetHeight;
              wrapperHeight = col.wrapper[0].offsetHeight;
              itemHeight = wrapperHeight / col.items.length;
              itemsHeight = wrapperHeight;
              minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
              maxTranslate = colHeight / 2 - itemHeight / 2;
              if (col.width) {
                  colWidth = col.width;
                  if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                  col.container.css({width: colWidth});
              }
              if (p.params.rotateEffect) {
                  if (!col.width) {
                      col.items.each(function () {
                          var item = $(this);
                          item.css({width:'auto'});
                          colWidth = Math.max(colWidth, item[0].offsetWidth);
                          item.css({width:''});
                      });
                      col.container.css({width: (colWidth + 2) + 'px'});
                  }
                  col.container.addClass('picker-items-col-absolute');
              }
          };
          col.calcSize();

          col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);


          var activeIndex = 0;
          var animationFrameId;

          // Set Value Function
          col.setValue = function (newValue, transition, valueCallbacks) {
              if (typeof transition === 'undefined') transition = '';
              // var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
              var newActiveIndex = col.wrapper
                  .find('.picker-item')
                  .filter(function(){return this.innerHTML===newValue})
                  .index();
              if(typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                  return;
              }
              var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
              // Update wrapper
              col.wrapper.transition(transition);
              col.wrapper.transform('translate3d(0,' + (newTranslate) + 'px,0)');

              // Watch items
              if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex ) {
                  $.cancelAnimationFrame(animationFrameId);
                  col.wrapper.transitionEnd(function(){
                      $.cancelAnimationFrame(animationFrameId);
                  });
                  updateDuringScroll();
              }

              // Update items
              col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
          };

          col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
              if (typeof translate === 'undefined') {
                  translate = $.getTranslate(col.wrapper[0], 'y');
              }
              if(typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate)/itemHeight);
              if (activeIndex < 0) activeIndex = 0;
              if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
              var previousActiveIndex = col.activeIndex;
              col.activeIndex = activeIndex;
              /*
              col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');

              col.items.transition(transition);
              var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
              var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
              var nextItems = selectedItem.nextAll().addClass('picker-after-selected');
              */
              //去掉 .picker-after-selected, .picker-before-selected 以提高性能
              col.wrapper.find('.picker-selected').removeClass('picker-selected');
              if (p.params.rotateEffect) {
                col.items.transition(transition);
              }
              var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');

              if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                  // Update values
                  col.value = selectedItem.attr('data-picker-value');
                  col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                  // On change callback
                  if (previousActiveIndex !== activeIndex) {
                      if (col.onChange) {
                          col.onChange(p, col.value, col.displayValue);
                      }
                      p.updateValue();
                  }
              }

              // Set 3D rotate effect
              if (!p.params.rotateEffect) {
                  return;
              }
              var percentage = (translate - (Math.floor((translate - maxTranslate)/itemHeight) * itemHeight + maxTranslate)) / itemHeight;

              col.items.each(function () {
                  var item = $(this);
                  var itemOffsetTop = item.index() * itemHeight;
                  var translateOffset = maxTranslate - translate;
                  var itemOffset = itemOffsetTop - translateOffset;
                  var percentage = itemOffset / itemHeight;

                  var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                  var angle = (-18*percentage);
                  if (angle > 180) angle = 180;
                  if (angle < -180) angle = -180;
                  // Far class
                  if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');
                  else item.removeClass('picker-item-far');
                  // Set transform
                  item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
              });
          };

          function updateDuringScroll() {
              animationFrameId = $.requestAnimationFrame(function () {
                  col.updateItems(undefined, undefined, 0);
                  updateDuringScroll();
              });
          }

          // Update items on init
          if (updateItems) col.updateItems(0, maxTranslate, 0);

          var allowItemClick = true;
          var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
          function handleTouchStart (e) {
              if (isMoved || isTouched) return;
              e.preventDefault();
              isTouched = true;
              var position = $.getTouchPosition(e);
              touchStartY = touchCurrentY = position.y;
              touchStartTime = (new Date()).getTime();

              allowItemClick = true;
              startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
          }
          function handleTouchMove (e) {
              if (!isTouched) return;
              e.preventDefault();
              allowItemClick = false;
              var position = $.getTouchPosition(e);
              touchCurrentY = position.y;
              if (!isMoved) {
                  // First move
                  $.cancelAnimationFrame(animationFrameId);
                  isMoved = true;
                  startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                  col.wrapper.transition(0);
              }
              e.preventDefault();

              var diff = touchCurrentY - touchStartY;
              currentTranslate = startTranslate + diff;
              returnTo = undefined;

              // Normalize translate
              if (currentTranslate < minTranslate) {
                  currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                  returnTo = 'min';
              }
              if (currentTranslate > maxTranslate) {
                  currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                  returnTo = 'max';
              }
              // Transform wrapper
              col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

              // Update items
              col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

              // Calc velocity
              velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
              velocityTime = (new Date()).getTime();
              prevTranslate = currentTranslate;
          }
          function handleTouchEnd (e) {
              if (!isTouched || !isMoved) {
                  isTouched = isMoved = false;
                  return;
              }
              isTouched = isMoved = false;
              col.wrapper.transition('');
              if (returnTo) {
                  if (returnTo === 'min') {
                      col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                  }
                  else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
              }
              touchEndTime = new Date().getTime();
              var velocity, newTranslate;
              if (touchEndTime - touchStartTime > 300) {
                  newTranslate = currentTranslate;
              }
              else {
                  velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                  newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
              }

              newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

              // Active Index
              var activeIndex = -Math.floor((newTranslate - maxTranslate)/itemHeight);

              // Normalize translate
              if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

              // Transform wrapper
              col.wrapper.transform('translate3d(0,' + (parseInt(newTranslate,10)) + 'px,0)');

              // Update items
              col.updateItems(activeIndex, newTranslate, '', true);

              // Watch items
              if (p.params.updateValuesOnMomentum) {
                  updateDuringScroll();
                  col.wrapper.transitionEnd(function(){
                      $.cancelAnimationFrame(animationFrameId);
                  });
              }

              // Allow click
              setTimeout(function () {
                  allowItemClick = true;
              }, 100);
          }

          function handleClick(e) {
              if (!allowItemClick) return;
              $.cancelAnimationFrame(animationFrameId);
              /*jshint validthis:true */
              var displayValue = this.innerHTML;
              col.setValue(displayValue);
          }

          col.initEvents = function (detach) {
              var method = detach ? 'off' : 'on';
              col.container[method]($.touchEvents.start, handleTouchStart);
              col.container[method]($.touchEvents.move, handleTouchMove);
              col.container[method]($.touchEvents.end, handleTouchEnd);
              col.items[method]('click', handleClick);
          };
          col.destroyEvents = function () {
              col.initEvents(true);
          };

          col.container[0].f7DestroyPickerCol = function () {
              col.destroyEvents();
          };

          col.initEvents();

      };
      p.destroyPickerCol = function (colContainer) {
          colContainer = $(colContainer);
          if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
      };
      // Resize cols
      function resizeCols() {
          if (!p.opened) return;
          for (var i = 0; i < p.cols.length; i++) {
              if (!p.cols[i].divider) {
                  p.cols[i].calcSize();
                  p.cols[i].setValue(p.cols[i].displayValue, 0, false);
              }
          }
      }
      $(window).on('resize', resizeCols);

      // HTML Layout
      p.columnHTML = function (col, onlyItems) {
          var columnItemsHTML;
          var columnHTML;
          if (col.divider) {
              columnHTML = 'div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
          }
          else {
              var innerHTML;
              columnItemsHTML = [];
              for (var j = 0; j < col.values.length; j++) {
                  innerHTML = col.displayValues ? col.displayValues[j] : col.values[j];
                  columnItemsHTML.push([
                      '<div',
                        ' class="picker-item', (innerHTML.length > 6 ? ' picker-item-long' : ''), '"',
                        ' data-picker-value="', col.values[j], '">',
                          innerHTML,
                      '</div>'
                  ].join(''));
              }
              columnItemsHTML = columnItemsHTML.join('');
              columnHTML = [
                  '<div class="picker-items-col ', (col.cssClass || ''), '">',
                    '<div class="picker-items-col-wrapper">',
                      columnItemsHTML,
                    '</div>',
                  '</div>'
              ].join('');
          }
          return onlyItems ? columnItemsHTML : columnHTML;
      };
      p.layout = function () {
          var pickerHTML = '';
          var pickerClass = '';
          var i;
          p.cols = [];
          var colsHTML = '';
          for (i = 0; i < p.params.cols.length; i++) {
              var col = p.params.cols[i];
              colsHTML += p.columnHTML(p.params.cols[i]);
              p.cols.push(col);
          }
          pickerClass = 'picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '');
          pickerHTML =
              '<div class="' + (pickerClass) + '">' +
                  (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '') +
                  '<div class="picker-modal-inner picker-items">' +
                      colsHTML +
                      '<div class="picker-center-highlight"></div>' +
                  '</div>' +
              '</div>';

          p.pickerHTML = pickerHTML;
      };

      // Input Events
      function openOnInput(e) {
          e.preventDefault();
          if (p.opened) return;
          p.open();
          if (p.params.scrollToInput/* && !isPopover()*/) {
              var pageContent = p.input.parents('.content');
              if (pageContent.length === 0) return;

              var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                  paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                  pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                  pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                  newPaddingBottom;
              var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
              if (inputTop > pageHeight) {
                  var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                  if (scrollTop + pageHeight > pageScrollHeight) {
                      newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                      if (pageHeight === pageScrollHeight) {
                          newPaddingBottom = p.container.height();
                      }
                      pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
                  }
                  pageContent.scrollTop(scrollTop, 300);
              }
          }
      }
      function closeOnHTMLClick(e) {
          // if (inPopover()) return;
          if (p.input && p.input.length > 0) {
              if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
          }
          else {
              if ($(e.target).parents('.picker-modal').length === 0) p.close();
          }
      }

      if (p.params.input) {
          p.input = $(p.params.input);
          if (p.input.length > 0) {
              if (p.input.data('target')) {
                p.inputTarget = $(p.input.data('target'));
              }
              if (p.params.inputReadOnly) p.input.prop('readOnly', true);
              if (!p.inline) {
                p.input.on("click.picker", function(e) {
                  openOnInput(e);
                  //修复部分安卓系统下，即使设置了readonly依然会弹出系统键盘的bug
                  if (p.params.inputReadOnly) {
                    this.focus();
                    this.blur();
                  }
                });
              }
              if (p.params.inputReadOnly) {
                  p.input.on('focus.picker mousedown.picker', function (e) {
                      e.preventDefault();
                  });
              }
          }

      }

      if (!p.inline) $('html').on('click', closeOnHTMLClick);

      // Open
      function onPickerClose() {
          p.opened = false;
          if (p.input && p.input.length > 0) {
            p.input.parents('.content').css({'padding-bottom': ''});
            p.input.trigger('close.picker');
          }
          if (p.params.onClose) p.params.onClose(p);

          // Destroy events
          p.container.find('.picker-items-col').each(function () {
              p.destroyPickerCol(this);
          });
      }

      p.opened = false;
      p.open = function () {
          // @notice 禁用 popover 操作
          // var toPopover = isPopover();
          var toPopover = false;

          if (!p.opened) {

              // Layout
              p.layout();

              // Append
              /*
              if (toPopover) {
                  p.pickerHTML = '<div class="popover popover-picker-columns"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
                  p.popover = $.popover(p.pickerHTML, p.params.input, true);
                  p.container = $(p.popover).find('.picker-modal');
                  $(p.popover).on('close', function () {
                      onPickerClose();
                  });
              }
              else */if (p.inline) {
                  p.container = $(p.pickerHTML);
                  p.container.addClass('picker-modal-inline');
                  $(p.params.container).append(p.container);
              }
              else {
                  p.container = $($.pickerModal(p.pickerHTML));
                  $(p.container)
                  .on('close', function () {
                      onPickerClose();
                  });
              }

              // Store picker instance
              p.container[0].f7Picker = p;

              // Init Events
              p.container.find('.picker-items-col').each(function () {
                  var updateItems = true;
                  if ((!p.initialized && p.params.value) || (p.initialized && p.displayValue)) updateItems = false;
                  p.initPickerCol(this, updateItems);
              });

              // Set value
              var displayValue;
              if (!p.initialized) {
                  displayValue = p.params.displayValue || p.params.value;
              }
              if (!displayValue) {
                displayValue = p.displayValue || p.value;
              }
              displayValue && p.setValue(displayValue, 0);
              if (!p.initialized) {
                // 地址控件要多初始化一次。否则第一次初始化的值不准确，待查因。
                p.setValue(displayValue, 0);
              }
          }

          // Set flag
          p.opened = true;
          p.initialized = true;

          if (p.params.onOpen) p.params.onOpen(p);
      };

      // Close
      p.close = function () {
          if (!p.opened || p.inline) return;
          // if (inPopover()) {
          //     $.closeModal(p.popover);
          //     return;
          // }
          // else {
              $.closeModal(p.container);
              return;
          // }
      };

      // Destroy
      p.destroy = function () {
          p.close();
          if (p.params.input && p.input.length > 0) {
              p.input.off('click.picker focus.picker mousedown.picker');
          }
          $('html').off('click', closeOnHTMLClick);
          $(window).off('resize', resizeCols);
      };

      if (p.inline) {
          p.open();
      }

      return p;
  };

  $(document).on("click", ".close-picker", function() {
    var pickerToClose = $('.picker-modal.modal-in');
    if (pickerToClose.length > 0) {
      $.closeModal(pickerToClose);
    }
    else {
      pickerToClose = $('.popover.modal-in .picker-modal');
      if (pickerToClose.length > 0) {
        $.closeModal(pickerToClose.parents('.popover'));
      }
    }
  });

  //修复picker会滚动页面的bug
  $(document).on($.touchEvents.move, ".picker-modal-inner", function(e) {
    e.preventDefault();
  });

  $.fn.picker = function(params) {
    var args = arguments;
    return this.each(function() {
      if(!this) return;
      var $this = $(this);

      var picker = $this.data("picker");
      if(!picker) {
        params = params || {};
        var inputValue = $this.val();
        if(params.value === undefined && inputValue !== "") {
          params.value = params.cols.length > 1 ? inputValue.split(p.params.separator) : [inputValue];
        }
        var p = $.extend({input: this}, params);
        picker = new Picker(p);
        $this.data("picker", picker);
      }
      if(typeof params === typeof "a") {
        picker[params].apply(picker, Array.prototype.slice.call(args, 1));
      }
    });
  };
}($);
