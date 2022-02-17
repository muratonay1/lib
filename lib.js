var Base64 = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode: function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = Base64._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output =
				output +
				this._keyStr.charAt(enc1) +
				this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) +
				this._keyStr.charAt(enc4);
		}
		return output;
	},
	decode: function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = Base64._utf8_decode(output);
		return output;
	},
	_utf8_encode: function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if (c > 127 && c < 2048) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},
	_utf8_decode: function (utftext) {
		var string = "";
		var i = 0;
		var c = (c1 = c2 = 0);
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if (c > 191 && c < 224) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(
					((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
				);
				i += 3;
			}
		}
		return string;
	},
};

Object.prototype.jget =
    Object.prototype.jget ||
    function(params) {
        var snapshot = this;

        function isObject(p) {
            var flag;
            p.constructor.name == "Object" ? (flag = true) : (flag = false);
            return flag;
        }

        function recursion(_obj) {
            for (let i = 0; i < _obj.length; i++) {
                if (isObject(snapshot[_obj[i]])) {
                    snapshot = snapshot[_obj[i]];
                    recursion(snapshot);
                } else {
                    snapshot = snapshot[_obj[i]];
                    break;
                }
            }
            return snapshot;
        }
        return recursion(params.split("."));
    };

Object.prototype.jpush =
    Object.prototype.jpush ||
    function(property, value) {
        if (value == null) {
            if (typeof this == "object") {
                var key = Object.keys(property);
                for (var i = 0; i < key.length; i++) {
                    this[key[i]] = property[key[i]];
                }
            }
        } else {
            if (typeof this == "object") {
                this[property] = value;
            }
        }
    };

Object.prototype.jstring =
    Object.prototype.jstring ||
    function() {
        return JSON.stringify(this);
    };
Object.prototype.jparse =
    Object.prototype.jparse ||
    function() {
        return JSON.parse(this);
    };

Object.prototype.formatDate =
	Object.prototype.formatDate ||
	function (format = String, split = String) {
		if (format == "ddMMyyyy") {
			var datePart = this.split("/");
			for (let i = 0; i < datePart.length; i++) {
				if (datePart[i].length == 1) {
					datePart[i] = "0" + datePart[i];
				}
			}
			var swap = datePart[0];
			datePart[0] = datePart[1];
			datePart[1] = swap;
			var outDate = "";
			for (let i = 0; i < datePart.length; i++) {
				i != datePart.length - 1
					? (outDate += datePart[i] + split)
					: (outDate += datePart[i]);
			}
			return outDate;
		}
	};

String.prototype.encrypt = String.prototype.encrypt || function() {
    return Base64.encode(Base64.encode(Base64.encode(this)));
}

/** extend DECRYPT */
String.prototype.decrypt = String.prototype.decrypt || function() {
    return Base64.decode(Base64.decode(Base64.decode(this)));
}


String.prototype.toInt = String.prototype.toInt || function() {
    return parseInt(this);
}

String.prototype.equals = String.prototype.equals || function(params=String) {
    if (typeof(params) == "string") {
        var correct = true;
        if (this.length == params.length) {
            for (let i = 0; i < this.length; i++) {
                if (this.charCodeAt(i) != params.charCodeAt(i)) {
                    correct = false;
                }
            }
            return correct;
        } else {
            throw new TypeError;
        }
    }
}

String.prototype.equalsIgnoreCase = String.prototype.equalsIgnoreCase || function(params=String) {
    try {
        if (String(typeof(params)).equals("string") && String(typeof(this)).equals("string")) {
            var loweration = this.toLowerCase();
            var correct = true;
            params = params.toLowerCase();
            if (loweration.length == params.length) {
                for (let i = 0; i < this.length; i++) {
                    if (loweration.charCodeAt(i) != params.charCodeAt(i)) {
                        correct = false;
                    }
                }
                return correct;
            }
        } else {
            throw new TypeError;
        }

    } catch (error) {
        return error;
    }
}

String.prototype.jParse = String.prototype.jParse || function() {
    try {
        if (JSON.parse(this) == undefined) {
            return ""
        } else {
            return JSON.parse(this);
        }
    } catch (error) {

    }
}
Array.prototype.trimList = Array.prototype.trimList || function() {
    try {
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i].trim();
        }
        return this;
    } catch (error) {
        return error;
    }
}
Array.prototype.toUpperCaseList = Array.prototype.upperCaseList || function() {
    try {
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i].toUpperCase();
        }
        return this;
    } catch (error) {
        return error;
    }
}
Array.prototype.toLowerCaseList = Array.prototype.lowerCaseList || function() {
    try {
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i].toLowerCase();
        }
        return this;
    } catch (error) {
        return error;
    }
}
Object.prototype.findListMaxLength = Object.prototype.findListMaxLength || function(params=String) {
	var max=0;
	this.length>params.length ? max=this.length:max=params.length;
	return max;
}
Object.prototype.findListMinLength = Object.prototype.findListMinLength || function(params=String) {
	
}
String.prototype.equalsList = String.prototype.equalsList || function(eliteList) {
	var min = 0;
	var flag = false;
	function isBalanced(params = Boolean) {
		return params;
	}
	this.length > eliteList.length
		? (min = eliteList.length)
		: (min = this.length);
	for (let i = 0; i < min; i++) {
		this[i].equals(eliteList[i]) ? (flag = true) : (flag = false);
		isBalanced(true);
	}
	return flag;
}
Object.prototype.jget =
	Object.prototype.jget ||
	function (params) {
		var snapshot = this;

		function isObject(p) {
			var flag;
			p.constructor.name == "Object" ? (flag = true) : (flag = false);
			return flag;
		}

		function recursion(_obj) {
			for (let i = 0; i < _obj.length; i++) {
				if (isObject(snapshot[_obj[i]])) {
					snapshot = snapshot[_obj[i]];
					recursion(snapshot);
				} else {
					snapshot = undefined;
					break;
				}
			}
			return snapshot;
		}
		return recursion(params.split("."));
	};
Object.prototype.mergeWith =
	Object.prototype.mergeWith ||
	function (mergeToBe) {
		var snapshot = this;
		var balanced = balanced(Object.keys(snapshot),Object.keys(mergeToBe));
		var max = balanced.jget('max');
		var min = balanced.jget('min')
		merge(mergeToBe);
		function merge(merged) {
			console.log("\n\nMERGED:\n",merged)
			console.log("\n\nSNAPSHOT:\n",snapshot);
			for(let i=0;i<min;i++){
				for(let j=0;j<max;j++){
					if (Object.keys(snapshot)[i]==Object.keys(merged)[j]) {
						snapshot[Object.keys(snapshot)[i]] = merged[Object.keys(merged)[j]];
						continue;
					}
					else{
						snapshot[Object.keys(merged)[j]] = merged[Object.keys(merged)[j]];
					}
				}
			}
			return snapshot;
		}
		function isThisObject(ths) {
			var flag = false;
			ths.constructor.name == "Object" ? (flag = true) : (flag = false);
			return flag;
		}
		function balanced(obj1=Object,obj2=Object) {
			var data=null;
			if(obj1.length == obj2.length){
				return data={max:obj1.length,min:obj1.length};
			}
			else{
				obj1 > obj2
					? (data = { max: obj1.length, min: obj2.length })
					: (data = { max: obj2.length, min: obj1.length });
				return data;
			}
		}
	};
