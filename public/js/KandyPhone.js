/**
 * Anonymous function to setup Kandy embeddable widget
 */

(function () {
    /*!
     * domready (c) Dustin Diaz 2014 - License MIT
     */
    !function (e, t) {
        typeof module != "undefined" ? module.exports = t() : typeof define == "function" && typeof define.amd == "object" ? define(t) : this[e] = t()
    }("domready", function () {
        var e = [], t, n = document, r = "DOMContentLoaded", i = /^loaded|^i|^c/.test(n.readyState);
        return i || n.addEventListener(r, t = function () {
            n.removeEventListener(r, t), i = 1;
            while (t = e.shift())t()
        }), function (t) {
            i ? t() : e.push(t)
        }
    });

    /*
     * getelementsbyclassname 1.0.1 (c) robny...@gmail.com 2008 - License MIT
     */
    var getElementsByClassName = function (e, t, n) {
        if (document.getElementsByClassName) {
            getElementsByClassName = function (e, t, n) {
                n = n || document;
                var r = n.getElementsByClassName(e), i = t ? new RegExp("\\b" + t + "\\b", "i") : null, s = [], o;
                for (var u = 0, a = r.length; u < a; u += 1) {
                    o = r[u];
                    if (!i || i.test(o.nodeName)) {
                        s.push(o)
                    }
                }
                return s
            }
        } else if (document.evaluate) {
            getElementsByClassName = function (e, t, n) {
                t = t || "*";
                n = n || document;
                var r = e.split(" "), i = "", s = "http://www.w3.org/1999/xhtml", o = document.documentElement.namespaceURI === s ? s : null, u = [], a, f;
                for (var l = 0, c = r.length; l < c; l += 1) {
                    i += "[contains(concat(' ', @class, ' '), ' " + r[l] + " ')]"
                }
                try {
                    a = document.evaluate(".//" + t + i, n, o, 0, null)
                } catch (h) {
                    a = document.evaluate(".//" + t + i, n, null, 0, null)
                }
                while (f = a.iterateNext()) {
                    u.push(f)
                }
                return u
            }
        } else {
            getElementsByClassName = function (e, t, n) {
                t = t || "*";
                n = n || document;
                var r = e.split(" "), i = [], s = t === "*" && n.all ? n.all : n.getElementsByTagName(t), o, u = [], a;
                for (var f = 0, l = r.length; f < l; f += 1) {
                    i.push(new RegExp("(^|\\s)" + r[f] + "(\\s|$)"))
                }
                for (var c = 0, h = s.length; c < h; c += 1) {
                    o = s[c];
                    a = false;
                    for (var p = 0, d = i.length; p < d; p += 1) {
                        a = i[p].test(o.className);
                        if (!a) {
                            break
                        }
                    }
                    if (a) {
                        u.push(o)
                    }
                }
                return u
            }
        }
        return getElementsByClassName(e, t, n)
    };

    domready(function () {
        var widget_links, widget_link, iframe, i, domain;
        widget_links = getElementsByClassName('kandy-phone');

        domain = 'https://developer.kandy.io';

        var uri = window.location.protocol + '//' + window.location.host;

        for (i = 0; i < widget_links.length; i++) {
            widget_link = widget_links[i];

            var id = 'kandyWidget' + i;

            var kandyDomainApiId = widget_link.getAttribute('data-kandy-domain-api-id');
            var kandyUsername = widget_link.getAttribute('data-kandy-username');
            var kandyPassword = widget_link.getAttribute('data-kandy-password');

            iframe = document.createElement('iframe');
            iframe.setAttribute('src', domain + "/kandy/api/v1/kandy_phone_widget?kandy_domain_api_id=" + kandyDomainApiId + "&kandy_username=" + encodeURIComponent(kandyUsername) + "&kandy_password=" + encodeURIComponent(kandyPassword) + "&remote_uri=" + encodeURIComponent(uri) + "&kandy_widget_id=" + encodeURIComponent(id));
            iframe.setAttribute('width', '400');
            iframe.setAttribute('height', '340');
            iframe.setAttribute('id', id);

            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');
            widget_link.parentNode.appendChild(iframe);

            window['kandyWidgetSetHeight' + id] = function (height, id) {
                var iframe = document.getElementById(id);
                if (iframe) {
                    iframe.setAttribute('height', height);
                }
            };

            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

            // Listen to message from child window
            eventer(messageEvent, function (e) {
                try {
                    var message = e.data;
                    var messageItems = message.split(':');

                    var functionName = messageItems.shift();

                    window[functionName].apply(this, messageItems);
                }
                catch (ex) {
                    // any child windows will fire this event.  Some will
                    // throw errors because we are only looking for our iframe
                    // so we catch an errors here
                }

            }, false);
        }
    });
})();

