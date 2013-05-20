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
import ui.View as View;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(
			opts,
			{
				x: 0,
				y: 0,
				width: opts.superview.style.width,
				height: opts.superview.style.height,
				visible: false
			}
		);
		supr(this, 'init', arguments);
		this._dt = 0;
	};

	this.update = function (dt) {
		if (this._dt > 0) {
			this._dt -= dt;
			if (this._dt > 0) {
				this.style.opacity = Math.sin(this._dt / 200 * Math.PI);
				this.style.visible = true;
			}
		} else {
			this.style.visible = false;
		}
	};

	this.flash = function (color) {
		this.style.backgroundColor = color || '#FFFFFF';
		this._dt = 100;
	};
});