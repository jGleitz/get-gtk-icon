require('mocha');
const chai = require('chai');
const chaiFiles = require('chai-files');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiFiles);
chai.use(chaiAsPromised);
const should = chai.should();
const file = chaiFiles.file;

const gtk = require('..');

describe('gtk-get-icon', () => {
	describe('promise', () => {
		it('queries an icon', () =>
			gtk.getIconPath('folder', 32)
				.then(folderPath => {
					folderPath.should.exist;
					file(folderPath).should.exist;
				}))

		it('rejects for non-existing icons' , () =>
			gtk.getIconPath('i-dont-exist', 32).should.be.rejected)
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
