let cppgeticon;

export function hasGtk3() {
	return true;
}

export function getIconPath(name, size) {
	if (!hasGtk3()) {
		throw new Error('This system does not provide gtk 3!');
	}

	cppgeticon = cppgeticon || require('bindings')('geticon.node');
	return cppgeticon.getIcon(name, size);
}
