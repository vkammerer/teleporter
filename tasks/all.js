import colors from 'colors';
import build from './build';
import docs from './docs';
import site from './site';

build().then(docs).then(site).then(() => {
	console.log('All tasks complete'.cyan)
});
