
// ON INITIALISE LES PARAMETRES DES LIGNES

;(function(window) {

	'use strict';

	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function Line(options) {
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}

	Line.prototype.options = {

		width: 1,
		height: '100%',
		left: '50%',
		top: '0%',
		color: '#000',
		hidden: false,
		animation: {
			duration: 500,
			easing: 'linear',
			delay: 0,
			direction: 'TopBottom'
		}
	};


	Line.prototype._init = function() {
		this.el = document.createElement('div');
		this.el.className = 'decoline';
		var opts = this.options;
		this.el.style.width = typeof opts.width === 'number' ? opts.width + 'px' : opts.width;
		this.el.style.height = typeof opts.height === 'number' ? opts.height + 'px' : opts.height;
		this.el.style.left = typeof opts.left === 'number' ? opts.left + 'px' : opts.left;
		this.el.style.top = typeof opts.top === 'number' ? opts.top + 'px' : opts.top;
		this.el.style.background = opts.color || opts.color;
		this.el.style.opacity = opts.hidden ? 0 : 1;
		this._setOrigin();
		this.rendered = !opts.hidden;
	};


	Line.prototype._setOrigin = function() {
		var opts = this.options, tOrigin = '50% 50%';

		if( opts.animation.direction === 'TopBottom' ) {
			tOrigin = '50% 0%';
		}
		else if( opts.animation.direction === 'BottomTop' ) {
			tOrigin = '50% 100%';
		}
		else if( opts.animation.direction === 'LeftRight' ) {
			tOrigin = '0% 50%';
		}
		else if( opts.animation.direction === 'RightLeft' ) {
			tOrigin = '100% 50%';
		}

		this.el.style.WebkitTransformOrigin = this.el.style.transformOrigin = tOrigin;
	};

	Line.prototype.animate = function(settings) {
		if( this.isAnimating ) {
			return false;
		}
		this.isAnimating = true;

		var animeProps = {
			targets: this.el,
			duration: settings && settings.duration != undefined ? settings.duration : this.options.animation.duration,
			easing: settings && settings.easing != undefined ? settings.easing : this.options.animation.easing,
			delay: settings && settings.delay != undefined ? settings.delay : this.options.animation.delay
		};

		if( settings && settings.direction ) {
			this.options.animation.direction = settings.direction;
		}

		this._setOrigin();

		if( this.options.animation.direction === 'TopBottom' || this.options.animation.direction === 'BottomTop' || this.options.animation.direction === 'CenterV' ) {
			animeProps.scaleY = this.rendered ? [1, 0] : [0, 1];
		}
		else {
			animeProps.scaleX = this.rendered ? [1, 0] : [0, 1];
		}

		if( !this.rendered ) {
			this.el.style.opacity = 1;
		}

		var self = this;
		animeProps.complete = function() {
			self.rendered = !self.rendered;
			self.isAnimating = false;
			if( settings && settings.complete ) {
				settings.complete();
			}
		}

		anime(animeProps);
	};

	Line.prototype.show = function() {
		this.el.style.opacity = 1;
		this.el.style.WebkitTransform = this.el.style.transform = 'scale3d(1,1,1)';
		this.rendered = true;
	};

	Line.prototype.hide = function() {
		this.el.style.opacity = 0;
		this.rendered = false;
	};

	function LineMaker(options) {
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}


	LineMaker.prototype.options = {
		parent: {element: document.body, position: 'prepend'},
		position: 'absolute',
		lines: []
	};


	LineMaker.prototype._init = function() {
		this.lines = [];

		this.decolines = document.createElement('div');
		this.decolines.className = 'decolines';
		if( this.options.position === 'fixed' ) {
			this.decolines.className += ' decolines--fixed';
		}

		for(var i = 0, len = this.options.lines.length; i < len; ++i) {
			var lineconfig = this.options.lines[i],
				line = new Line(lineconfig);

			this.decolines.appendChild(line.el);
			this.lines.push(line);
		}

		var p = this.options.parent,
			pEl = typeof p.element === 'string' ? document.querySelector(p.element) : p.element;

		if( p.position === 'prepend' ) {
			pEl.insertBefore(this.decolines, pEl.firstChild);
		}
		else {
			pEl.appendChild(this.decolines);
		}
	};

	LineMaker.prototype._animateLine = function(lineIdx, dir, settings) {
		var line = this.lines[lineIdx];
		if( line && dir === 'in' && !line.rendered || dir === 'out' && line.rendered ) {
			line.animate(settings);
		}
	};


	LineMaker.prototype._animateLines = function(dir, callback) {
		var completed = 0, totalLines = this.lines.length;

		if( totalLines === 0 ) {
			callback();
			return;
		}

		var checkCompleted = function() {
			completed++;
			if( completed === totalLines && typeof callback === 'function' ) {
				callback();
			}
		};

		for(var i = 0; i < totalLines; ++i) {
			var line = this.lines[i];
			if( dir === 'in' && !line.rendered || dir === 'out' && line.rendered ) {
				line.animate({
					complete: function() {
						checkCompleted();
					}
				});
			}
			else {
				checkCompleted();
			}
		}
	};


	LineMaker.prototype._toggleLine = function(lineIdx, action) {
		var line = this.lines[lineIdx];
		if( !line ) { return; }

		if( action === 'show' && !line.rendered ) {
			line.show();
		}
		else if( action === 'hide' && line.rendered ) {
			line.hide();
		}
	};

	LineMaker.prototype._toggleLines = function(action) {
		for(var i = 0, len = this.lines.length; i < len; ++i) {
			this._toggleLine(i, action);
		}
	};

	LineMaker.prototype.animateLineIn = function(lineIdx, settings) {
		this._animateLine(lineIdx, 'in', settings);
	};

	LineMaker.prototype.animateLineOut = function(lineIdx, settings) {
		this._animateLine(lineIdx, 'out', settings);
	};

	LineMaker.prototype.animateLinesIn = function(callback) {
		this._animateLines('in', callback);
	};

	/**
	 * Hides all lines with an animation.
	 */
	LineMaker.prototype.animateLinesOut = function(callback) {
		this._animateLines('out', callback);
	};


	LineMaker.prototype.showLine = function(lineIdx) {
		this._toggleLine(lineIdx, 'show');
	};

	LineMaker.prototype.hideLine = function(lineIdx) {
		this._toggleLine(lineIdx, 'hide');
	};

	LineMaker.prototype.showLines = function() {
		this._toggleLines('show');
	};


	LineMaker.prototype.hideLines = function() {
		this._toggleLines('hide');
	};


	LineMaker.prototype.removeLine = function(lineIdx) {
		var line = this.lines[lineIdx];
		if( line ) {
			this.lines.splice(lineIdx, 1);
			this.decolines.removeChild(this.decolines.children[lineIdx]);
		}
	};

	LineMaker.prototype.removeLines = function() {
		this.lines = [];
		this.decolines.innerHTML = '';
	};

	LineMaker.prototype.createLine = function(settings) {
		var line = new Line(settings);
		this.decolines.appendChild(line.el);
		this.lines.push(line);
	};

	LineMaker.prototype.getTotalLines = function() {
		return this.lines.length;
	}

	window.LineMaker = LineMaker;

})(window);


// LA ON MET LES CONDITIONS 3 LIGNES


(function() {
  var lineMaker = new LineMaker({
    position: 'fixed',
    lines: [{
        top: 0,
        left: '15%',
        width: .8,
        height: '100%',
        color: '#7599E4',
        hidden: true,
        animation: {
          duration: 1000,
          easing: 'easeInOutSine',
          delay: 20,
          direction: 'TopBottom'
        }
      },
      {
        top: 0,
        left: '85%',
        width: .8,
        height: '100%',
        color: '#7599E4',
        hidden: true,
        animation: {
          duration: 1000,
          easing: 'easeInOutSine',
          delay: 140,
          direction: 'TopBottom'
        }
      },
      {
        top: '90vh',
        left: 0,
        width: '100%',
        height: .8,
        color: '#7599E4',
        hidden: true,
        animation: {
          duration: 1000,
          easing: 'easeInOutSine',
          delay: 180,
          direction: 'LeftRight'
        }
      }
    ]
  });

  setTimeout(function() {
    lineMaker.animateLinesIn();
  }, 500);
})();
