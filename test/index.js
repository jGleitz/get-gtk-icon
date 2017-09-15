require('mocha');
const chai = require('chai');
const chaiFiles = require('chai-files');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiFiles);
chai.use(chaiAsPromised);
const should = chai.should();
const file = chaiFiles.file;

const gtk =  require('..');

describe('gtk-get-icon', () => {
	describe('promise', () => {
	})

	describe('callback', () => {
		it('queries an icon', done => {
			gtk.getIconPath('folder', 32, (err, folderIconPath) => {
				should.not.exist(err);
				should.exist(folderIconPath);
				file(folderIconPath).should.exist;
				done();
			});
		});

		it('returns an error for non-existing icons', done => {
			gtk.getIconPath('i-dont-exist', 32, (err, folderIconPath) => {
				should.exist(err);
				should.not.exist(folderIconPath);
				done();
			});
		})
	})
	/*it('queries an icon via promise', () =>
		gtk.getIconPath('folder', 32)
			.then(path => file(path))

			.should.eventually.exist
	);*/

	describe('synchronous', () => {
		it('queries an icon', () => {
			const folderIconPath = gtk.getIconPathSync('folder', 32);
			should.exist(folderIconPath);
			file(folderIconPath).should.exist;
		})

		it('returns null for non-existing icons', () => {
			const folderIconPath = gtk.getIconPathSync('i-dont-exist', 32);
			should.equal(null, folderIconPath);
		})
	})
});
