'use babel';

export default {
  config:{
    "styleObjectName":{
      type: 'string',
      default: 'style'
    },
    "classNamesType": {
      type: 'integer',
      default: 0,
      enum: [
        { value: 0, description: 'No classNames (className={`${s.foo} ${s.bar}`})' },
        { value: 1, description: 'No classNames (className={[s.foo, s.bar].join(\' \')})' },
        { value: 2, description: 'Imported classNames (className={classNames(s.foo, s.bar)}' },
        { value: 3, description: 'Webpack classNames (className={s(\'foo\', \'bar\')})' },
        { value: 4, description: 'Webpack classNames (className={s({ foo: true, bar: true })})' },
        { value: 5, description: 'Webpack classNames (className={s({ foo: 1, bar: 1 })})' }
      ]
    },
  },
  activate(state) {

    if (atom.packages.isPackageLoaded('emmet')) {
      const pkgDir  = path.resolve(atom.packages.resolvePackagePath('emmet'), 'node_modules', 'emmet', 'lib')
      const emmet   = require(path.join(pkgDir, 'emmet'))
      const filters = require(path.join(pkgDir, 'filter', 'main'))
      const classNamesType = atom.config.get('emmet-jsx-css-modules.classNamesType') || 0;
      const styleObjectName = atom.config.get('emmet-jsx-css-modules.styleObjectName') || 'style';
      const replFn = (_, item) => {
        const parts = item.trim().split(' ');
        let className = '';
        if (parts.length > 1) {
          if (classNamesType === 0) {
            className = '`' + parts.map(c => '${' + styleObjectName + '.' + c + '}').join(' ') + '`';
          }
          else if (classNamesType === 1) {
            className = `[${parts.map(c => `${styleObjectName}.${c}`).join(', ')}].join(' ')`;
          }
          else if (classNamesType === 2) {
            className = `classNames(${parts.map(c => `${styleObjectName}.${c}`).join(', ')})`;
          }
          else if (classNamesType === 3) {
            className = `${styleObjectName}('${parts.join('\', \'')}')`;
          }
          else if (classNamesType === 4) {
            className = `${styleObjectName}({ ${parts.map(c => `${c}: true`).join(', ')} })`;
          }
          else if (classNamesType === 5) {
            className = `${styleObjectName}({ ${parts.map(c => `${c}: 1`).join(', ')} })`;
          }
        } else {
          className = `${styleObjectName}.${item}`;
        }

        return `className={${className}}`;
      }

      filters.add('jsx-css-modules', (tree) => {
        tree.children.forEach((item) => {
          item.start = item.start.replace(/className=["'](.*?)["']/, replFn);
        })
      })

      // Apply jsx-css-modules after html so we can use a simple string replacement
      // and not have to mess with how the the html filter wraps attribute values with
      // quotation marks rather than curly brace pairs
      emmet.loadSnippets({"jsx": { "filters": "jsx, html, jsx-css-modules" }})
    }
  }
}
