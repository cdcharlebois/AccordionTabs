define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event"


], function(declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent) {
    "use strict";

    return declare("TabAccordion.widget.TabAccordion", [_WidgetBase], {

        breakpoint: null,
        accordionClass: null,
        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function() {
            this._handles = [];
            /**
             * Polyfill for Array.prototype.find to support IE 11
             */
            // https://tc39.github.io/ecma262/#sec-array.prototype.find
            if (!Array.prototype.find) {
                Object.defineProperty(Array.prototype, 'find', {
                    value: function(predicate) {
                        // 1. Let O be ? ToObject(this value).
                        if (this == null) {
                            throw new TypeError('"this" is null or not defined');
                        }
                        var o = Object(this);
                        // 2. Let len be ? ToLength(? Get(O, "length")).
                        var len = o.length >>> 0;
                        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                        if (typeof predicate !== 'function') {
                            throw new TypeError('predicate must be a function');
                        }
                        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                        var thisArg = arguments[1];
                        // 5. Let k be 0.
                        var k = 0;
                        // 6. Repeat, while k < len
                        while (k < len) {
                            // a. Let Pk be ! ToString(k).
                            // b. Let kValue be ? Get(O, Pk).
                            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                            // d. If testResult is true, return kValue.
                            var kValue = o[k];
                            if (predicate.call(thisArg, kValue, k, o)) {
                                return kValue;
                            }
                            // e. Increase k by 1.
                            k++;
                        }
                        // 7. Return undefined.
                        return undefined;
                    }
                });
            }
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this.ul = this.domNode.parentElement.querySelector('ul');
            this.tabs = this.ul.children;
            this.tabContent = this.ul.parentElement.querySelector('.tab-content.mx-tabcontainer-content');

            this._attachCSS();
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._updateRendering(callback);
            this._setInitialTab();
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
            if (window.innerWidth >= this.breakpoint) {
                //reset the DOM
                this.ul.parentElement.appendChild(this.tabContent);
                Array.from(this.tabs).forEach(lang.hitch(this, function(tab) {
                    dojoClass.remove(tab, this.accordionClass)
                }))
            } else {
                //move the tabContent to the active tab
                var activeTab = Array.from(this.tabs).find(function(e) { return e.className.indexOf('active') > -1 })
                this.ul.insertBefore(this.tabContent, activeTab.nextElementSibling)
                Array.from(this.tabs).forEach(lang.hitch(this, function(tab) {
                    dojoClass.add(tab, this.accordionClass)
                }))
            }
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _attachCSS: function() {
            var cssText =
                "@media screen and (max-width: " + this.breakpoint + "px){" +
                "    #" + this.ul.parentElement.id + "> ul > li {clear: both; width: 100%;}" +
                "    .profile-phone #" + this.ul.parentElement.id + " > ul {" +
                "        background: none;" +
                "    }" +
                "    .profile-phone #" + this.ul.parentElement.id + " > ul > li {" +
                "        display: inline-block;" +
                "    }" +
                "    .profile-phone #" + this.ul.parentElement.id + " > ul > li.active >a {" +
                "        font-weight: bold;" +
                "    }" +
                "    .profile-phone #" + this.ul.parentElement.id + " > ul > li > a {" +
                "        color: #111;" +
                "    }" +
                "    .profile-phone #" + this.ul.parentElement.id + " > ul > li > a:before," +
                "    .profile-phone #" + this.ul.parentElement.id + " > ul > li > a:after {" +
                "        border: none !important;" +
                "    }" +
                "}";
            var css = document.createElement("style");
            css.type = "text/css";
            css.innerHTML = cssText;
            document.body.appendChild(css);
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");

            Array.from(this.tabs).forEach(lang.hitch(this, function(el) {
                el.addEventListener('click', lang.hitch(this, this.__handleAccordionClick))
            }));
            this._executeCallback(callback);
        },

        _setInitialTab: function() {
            this.ul.insertBefore(this.tabContent, this.tabs[0].nextElementSibling)
        },

        __handleAccordionClick: function(e) {
            if (window.innerWidth < this.breakpoint) {
                e.target.parentElement.insertBefore(this.tabContent, e.target.nextElementSibling)
            }
        },

        _executeCallback: function(cb) {
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["TabAccordion/widget/TabAccordion"]);