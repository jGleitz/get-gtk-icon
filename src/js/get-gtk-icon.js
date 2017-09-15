let cppgeticon;
let searchedGtk3 = false;
let foundGtk3 = true;

function hasGtk3() {
	if (!searchedGtk3) {
		searchedGtk3 = true;
	}
	return foundGtk3;
}

function getIconPath(name, size) {
	if (!hasGtk3()) {
		throw new Error('This system does not provide gtk 3!');
	}

	cppgeticon = cppgeticon || require('bindings')('geticon.node');
	return cppgeticon.getIcon(name, size);
}

module.exports = {
	hasGtk3,
	getIconPath
}
