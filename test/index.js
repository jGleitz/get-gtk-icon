require('mocha');
const chai = require('chai');
const chaiFiles = require('chai-files');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiFiles);
chai.use(chaiAsPromised);
const should = chai.should();
const file = chaiFiles.file;

const gtk = require('..');
const knownIfGtk = typeof process.env.HAS_GTK3 !== 'undefined';
const expectedToHaveGtk = process.env.HAS_GTK3 == 'TRUE';

describe('gtk-get-icon', () => {

	describe('GTK check', () => {
		it('has the same result for sync, async, and callback', done => {
			gtk.canQueryIcons((_, callbackResult) => {
				gtk.canQueryIcons().then(promiseResult => {
					const syncResult = gtk.canQueryIconsSync();
					promiseResult.should.equal(callbackResult);
					callbackResult.should.equal(syncResult);
				}).then(done, error => done(error));
			});
		});

		if (knownIfGtk) {
			it(`has the correct result for this environment (${expectedToHaveGtk})`, () => {
				gtk.canQueryIconsSync().should.equal(expectedToHaveGtk);
			});
		}

	});

	describe('with GTK', () => {

		describe('promise', () => {
			before(skipIfNoGtk);

			it('queries an icon', () =>
				gtk.getIconPath('folder', 32)
					.then(folderPath => {
						folderPath.should.exist;
						file(folderPath).should.exist;
					})
			);

			it('rejects for non-existing icons' , () =>
				gtk.getIconPath('i-dont-exist', 32).should.be.rejected);

			it('checks arguments', () => {
				(() => gtk.getIconPath()).should.throw;
				(() => gtk.getIconPath(undefined, 32)).should.throw;
				(() => gtk.getIconPath('folder', '32px')).should.throw;
			});
		});

		describe('callback', () => {
			before(skipIfNoGtk);

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
			});

			it('checks arguments', () => {
				(() => gtk.getIconPath()).should.throw;
				(() => gtk.getIconPath(undefined, 32)).should.throw;
				(() => gtk.getIconPath('folder', '32px')).should.throw;
				(() => gtk.getIconPath('folder', 32, 'not a function')).should.throw;
			});
		});

		describe('synchronous', () => {
			before(skipIfNoGtk);

			it('queries an icon', () => {
				const folderIconPath = gtk.getIconPathSync('folder', 32);
				should.exist(folderIconPath);
				file(folderIconPath).should.exist;
			});

			it('returns null for non-existing icons', () => {
				const folderIconPath = gtk.getIconPathSync('i-dont-exist', 32);
				should.not.exist(folderIconPath);
			});

			it('ckecksArguments', () => {
				(() => gtk.getIconPathSync()).should.throw;
				(() => gtk.getIconPathSync(undefined, 32)).should.throw;
				(() => gtk.getIconPathSync('folder', '32px')).should.throw;
			});
		});
	});
});

function skipIfNoGtk() {
	const testSuite = this;
	if ((knownIfGtk && !expectedToHaveGtk) || !gtk.canQueryIconsSync()) {
		testSuite.skip();
	}
}
