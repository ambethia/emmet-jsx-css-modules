# emmet-jsx-css-modules package

Atom package to extend Emmet's JSX expansions to use CSS modules.

For example: `.foo` will now expand to `<div className={style.foo}></div>` instead of `<div className="foo"></div>`.

## TODO

- [x] Allow the `style` variable name to be customized via Atom's preferences.
