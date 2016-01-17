import path from 'path';
import watch from 'watch';
import build from './build';
import docs from './docs';
import site from './site';

watch.watchTree(path.join(__dirname, '..', 'src'), (f, curr, prev) => {
	if (curr !== prev) {
		build().then(site).then(() => {
			console.log('\t');
		});
	}
});
watch.watchTree(path.join(__dirname, '..', 'docs'), (f, curr, prev) => {
	if (curr !== prev) {
		docs().then(site).then(() => {
			console.log('\t');
		});
	}
});
watch.watchTree(path.join(__dirname, '..', 'site', 'templates'), (f, curr, prev) => {
	if (curr !== prev) {
		site().then(() => {
			console.log('\t');
		});
	}
});
