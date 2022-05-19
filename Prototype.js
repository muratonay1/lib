const { Pocket } = require("./Pocket");
const data = require("../test.json");
const data2 = require("../test1.json");
const { PocketList } = require("./PocketList");
/**
 * @returns {Pocket}
 * @description
 * JSON objesini Pocket objesine parse eden prototype metodu.
 */
Object.prototype.toPocket =
	Object.prototype.toPocket ||
	/**@returns {Pocket}*/ function () {
		var snapshot = json;
		var pocket = new Pocket();
		var pocketList = new PocketList();
		var memory = new String();
		function traverse(obj, callback, trail) {
			trail = trail || [];
			Object.keys(obj).forEach(function (key) {
				var value = obj[key];
				if (Object.getPrototypeOf(value) === Object.prototype) {
					traverse(value, callback, trail.concat(key));
				} else {
					callback.call(obj, key, value, trail);
				}
			});
		}

		traverse(snapshot, function (key, value, trail) {
			if (trail == "") {
				pocket.put(key, value);
			} else {
				if (trail.length == 1) {
					memory = memory + trail[0] + "." + key;
				} else if (trail.length >= 2) {
					for (let i = 0; i < trail.length; i++) {
						if (i == 0) {
							memory = trail[0];
						} else {
							memory = memory + "." + trail[i];
						}
					}
				}
				pocket.put(memory, value);
				memory = "";
			}
		});
		return pocket;
	};

//console.log(data2);
module.exports = Object;
