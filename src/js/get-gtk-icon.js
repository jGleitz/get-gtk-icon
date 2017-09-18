let cppgeticon;
let searchedGtk3 = false;
let foundGtk3 = true;

function hasGtk3() {
	if (!searchedGtk3) {
		searchedGtk3 = true;
	}
	return foundGtk3;
}

function getIconPath(name, size, callback) {
	checkFirstTwoArgs(name, size);
	checkGtk();

	const callbacktype = typeof callback;
	if (callbacktype === 'function') {
		cppgeticon.getIcon(name, size, wrapSimple(callback));
		return undefined;
	} else if (callbacktype === 'undefined') {
		return new Promise((resolve, reject) => {
			cppgeticon.getIcon(name, size, wrap(resolve, reject));
		});
	} else {
		throw new Error('The third argument, if given, must be a callback!');
	}
}

// callbacks must be called with a clear stack. Promise callbacks will fail
// otherwise.

function wrapSimple(callback) {
	return result => setImmediate(() => {
		if (result === null) {
			callback(new Error("No icon found"), null);
		} else {
			callback(null, result);
		}
	})
}

function wrap(resolve, reject) {
	return result => setImmediate(() => {
		if (result === null) {
			reject(new Error("No icon found"));
		} else {
			resolve(result);
		}
	})
}

function getIconPathSync(name, size) {
	checkFirstTwoArgs(name, size);
	checkGtk();

	return cppgeticon.getIconSync(name, size);
}

function checkFirstTwoArgs(iconName, iconSize) {
	if (typeof iconName !== 'string') {
		throw new Error('The icon name must be a string!');
	}
	if (typeof iconSize !== 'number') {
		throw new Error('The icon size must be a number!');
	}
}

function checkGtk() {
	if (!hasGtk3()) {
		throw new Error('This system does not provide gtk 3!');
	}
	cppgeticon = cppgeticon || require('bindings')('geticon.node');
}

module.exports = {
	hasGtk3,
	getIconPath,
	getIconPathSync
}
