/**
 * @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with the Game Closure SDK.  If not, see <http://www.gnu.org/licenses/>.
 */
import math.geom.Point as Point;
import math.geom.Circle as Circle;
import math.geom.Rect as Rect;
import math.geom.intersect as intersect;

import event.Emitter as Emitter;

var circleAndCircle = function (circle1, circle2) {
		var x = circle2.x - circle1.x;
		var y = circle2.y - circle1.y;

		var d1 = (x * x) + (y * y);
		var d2 = circle1.radius + circle2.radius;

		return (d1 < d2 * d2);
	};

exports = Class(Emitter, function (supr) {
	this.init = function (opts) {
		opts = merge(
			opts,
			{
				shape: new Circle(0, 0, 10)
			}
		);

		this._opts = opts;
		this._game = opts.game;

		// Create collision shapes to prevent garbage...
		this._collideCircle = new Circle(0, 0, 0);
		this._collideRect = new Rect(0, 0, 0, 0);

		this.canCollide = true;

		supr(this, 'init', [opts]);
	};

	this.refreshOpts = function () {
	};

	this.updatePos = function (pt) {
		var opts = this._opts;

		if (opts.pos) {
			opts.pos.x = pt.x;
			opts.pos.y = pt.y;
		} else {
			opts.pos = new Point(pt.x, pt.y);
		}

		opts.x = opts.pos.x;
		opts.y = opts.pos.y;
	};

	this.destroy = function () {
		this._opts.releaseView();
		this.removeAllListeners('Update');
	};

	this.isOffscreen = function () {
		return this._opts.pos.y > GC.app.baseHeight + this._opts.height;
	};

	this.tick = function (dt) {
		var opts = this._opts;
		var pct = dt / 1000;

		// Apply motion vector
		opts.pos.x += opts.velocity.x * pct;
		opts.pos.y += opts.velocity.y * pct;

		this.emit('Update', opts);

		return this.isOffscreen();
	};

	this.getShape = function () {
		var pos = this._opts.pos;
		var shape = this._opts.shape;

		if (shape instanceof Circle) {
			this._collideCircle.x = shape.x + pos.x;
			this._collideCircle.y = shape.y + pos.y;
			this._collideCircle.radius = shape.radius;

			return this._collideCircle;
		} else if (shape instanceof Rect) { // It's a rectangle...
			this._collideRect.x = shape.x + pos.x - shape.width * 0.5;
			this._collideRect.y = shape.y + pos.y - shape.height * 0.5;
			this._collideRect.width = shape.width;
			this._collideRect.height = shape.height;

			return this._collideRect;
		}

		console.error('Warning: unknown collision shape!');

		return {x: 0, y: 0};
	};

	this.getPosition = function () {
		return this._opts.pos;
	};

	this.getOpts = function () {
		if (!this._opts) {
			this._opts = {};
		}
		return this._opts;
	};

	this.getHealth = function () {
		return this._health;
	};

	this.subHealth = function (health) {
		this._health -= health;
	};

	this.subLaserDT = function (dt) {
		this._laserDT -= dt;
	};

	this.collidesWith = function (item) {
		var shape = this.getShape();
		var itemShape = item.getShape();

		if (shape instanceof Circle) {
			if (itemShape instanceof Circle) {
				return circleAndCircle(shape, itemShape);
			}
			return intersect.circleAndRect(shape, itemShape);
		} else {
			if (itemShape instanceof Circle) {
				return intersect.rectAndCircle(shape, itemShape);
			}
			return intersect.rectAndRect(shape, itemShape);
		}
	};

	this._collidesWithModelPool = function (modelPool, intersect1, intersect2) {
		var result = [];
		var shape = this.getShape();
		var pos = this._opts.pos;
		var items = modelPool.getItems();
		var i = modelPool.length;

		while (i) {
			var item = items[--i];
			if (item && item.canCollide) {
				var itemShape = item.getShape();

				if (((itemShape instanceof Circle) ? intersect1 : intersect2)(shape, itemShape)) {
					result.push(item);
				}
			}
		}

		return result;
	};

	this.collidesWithModelPool = function (modelPool) {
		var shape = this.getShape();

		return (shape instanceof Circle) ?
				this._collidesWithModelPool(modelPool, circleAndCircle, intersect.circleAndRect) :
				this._collidesWithModelPool(modelPool, intersect.rectAndCircle, intersect.rectAndRect);
	};
});