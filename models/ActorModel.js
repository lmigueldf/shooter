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
import src.shooter.models.EntityModel as EntityModel;

exports = Class(EntityModel, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);
		this._hpRatio = 1;
	};

	this.refreshOpts = function () {
		var opts = this._opts;

		if ('health' in opts) {
			this._health = opts.health;
		}
	};

	this.setHealth = function (health) {
		this._health = health;
		this._hpRatio = this._health / this._opts.health;
	};

	this.getHealth = function () {
		return this._health;
	};

	this.subHealth = function (health) {
		this._health -= health;
		this._hpRatio = this._health / this._opts.health;
		return (health < 0);
	};
});