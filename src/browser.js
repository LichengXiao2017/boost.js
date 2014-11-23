// =================================================================================================
// Boost.js | Browser Utilities
// (c) 2014 Mathigon / Philipp Legner
// =================================================================================================



if (typeof M !== 'object' || !M.core || !M.fermat)
	throw new Error('boost.js requires core.js and fermat.js.');
M.boost = true;


(function() {

	var isIE = navigator.appName.indexOf("Internet Explorer") >= 0;

	M.browser = {
	    width:    window.innerWidth,
	    height:   window.innerHeight,

	    isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
					.test(navigator.userAgent.toLowerCase()),
	    isRetina: ((window.devicePixelRatio || 1) > 1),
	    isTouch:  ('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch),
	    imgExt:   ((window.devicePixelRatio || 1) > 1.25) ? '@2x' : '',

	    isChrome: navigator.userAgent.toLowerCase().indexOf('chrome') > -1,
	    isIE: isIE,

	    // IE 9 doesn't support window.history
	    hasHistory: window.history && window.history.pushState && (!isIE || navigator.appVersion.indexOf("MSIE 1") >= 0),

	    speechRecognition: ('webkitSpeechRecognition' in window)
	};

	M.redraw = function() {
		/*jshint -W030 */
	    document.body.offsetHeight;
	};

	M.now = Date.now || function getTime () { return new Date().getTime(); };

	M.toCamelCase = function(str) {
	    return str.toLowerCase().replace(/^-/,'').replace(/-(.)/g, function(match, g) {
	        return g.toUpperCase();
	    });
	};

	// Generates a random ID string
	M.uid = function(){
	    return Math.random().toString(36).substr(2,10);
	};


	// ---------------------------------------------------------------------------------------------
	// ONLOAD EVENTS

	var loadQueue = [];
	var loaded = false;

	function afterLoad() {
		if (loaded) return;
		loaded = true;
		for (var i=0; i<loadQueue.length; ++i) loadQueue[i]();
	}

	window.onload = function() {
		afterLoad();
		if (M.resize()) M.resize();
	};

	document.addEventListener('DOMContentLoaded', function(event) {
		afterLoad();
	});

	M.onload = function(fn) {
		if (loaded) {
			fn();
		} else {
			loadQueue.push(fn);
		}
	};


	// ---------------------------------------------------------------------------------------------
	// CSS

	M.cssTimeToNumber = function(cssTime) {
	    var regex = /^([\-\+]?[0-9]+(\.[0-9]+)?)(m?s)$/;
	    var matches = regex.exec(cssTime.trim());
	    if (matches === null) return null;
	    return (+matches[1]) * (matches[3] === 's' ? 1000 : 1);
	};


	M.addCSSRule = function(selector, rules) {
	    var css = document.styleSheets[document.styleSheets.length-1];
	    var index = css.cssRules.length - 1;
	    if(css.insertRule) {
	        css.insertRule(selector + '{' + rules + '}', index);
	    } else {
	        css.addRule(selector, rules, index);
	    }
	};

    var cache = {};
    var style;
    var prefixes = {'webkit': 'webkit', 'moz': 'Moz', 'ms': 'ms'};

	// document.body doesn't exist if this file is included in the <head> of an html file
	M.onload(function(){ style = document.body.style; });

    var findCssPrefix = function(name) {
        var rule = M.toCamelCase(name);
        if (style[rule] != null) return name;
        rule = rule.toTitleCase();
        for (var v in prefixes) {
            if (style[prefixes[v] + rule] != null) return '-' + v + '-' + name;
        }
        return name;
    };

    M.prefix = function(name) {
        if (cache[name]) return cache[name];
        var rule = findCssPrefix(name);
        cache[name] = rule;
        return rule;
    };

})();
