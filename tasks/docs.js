import path from 'path';
import concatFiles from 'concat-files';
 
concatFiles([
  path.join(__dirname, '..', 'docs', 'introduction.md'),
  path.join(__dirname, '..', 'docs', 'installation.md'),
  path.join(__dirname, '..', 'docs', 'api.md'),
  path.join(__dirname, '..', 'docs', 'license.md')
],
  path.join(__dirname, '..', 'README.md')
, () => {});
