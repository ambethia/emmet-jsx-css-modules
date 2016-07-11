'use babel';

export default {

  activate(state) {
    if (atom.packages.isPackageLoaded('emmet')) {
      const pkgDir  = path.resolve(atom.packages.resolvePackagePath('emmet'), 'node_modules', 'emmet', 'lib')
      const emmet   = require(path.join(pkgDir, 'emmet'))
      const filters = require(path.join(pkgDir, 'filter', 'main'))

      filters.add('jsx-css-modules', (tree) => {
        tree.children.forEach((item) => {
          item.start = item.start.replace(/className="(.*)"/, "className={style.$1}")
        })
      })

      // Apply jsx-css-modules after html so we can use a simple string replacement
      // and not have to mess with how the the html filter wraps attribute values with
      // quotation marks rather than curly brace pairs
      emmet.loadSnippets({"jsx": { "filters": "jsx, html, jsx-css-modules" }})
    }
  }
}
