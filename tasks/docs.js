import path from 'path';
import colors from 'colors';
import concatFiles from 'concat-files';

export default function docs() {
	return new Promise((resolve) => {
		concatFiles([
			path.join(__dirname, '..', 'docs', 'schema.md'),
			path.join(__dirname, '..', 'docs', 'introduction.md'),
			path.join(__dirname, '..', 'docs', 'installation.md'),
			path.join(__dirname, '..', 'docs', 'api.md'),
			path.join(__dirname, '..', 'docs', 'gotchas.md'),
			path.join(__dirname, '..', 'docs', 'examples.md'),
			path.join(__dirname, '..', 'docs', 'license.md')
		],
			path.join(__dirname, '..', 'README.md')
		, () => {
			console.log('Docs task complete'.cyan);
			resolve();
		});
	});
}
