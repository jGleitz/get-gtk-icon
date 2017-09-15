require('mocha');
const chai = require('chai');
const chaiFiles = require('chai-files');
chai.use(chaiFiles);
chai.should();

const gtk =  require('..');

describe('gtk-get-icon', () => {
	it('queries an icon', () => {
		const folderIconPath = gtk.getIconPath('folder', 33);
		folderIconPath.should.exist;
	});
});
