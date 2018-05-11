# atom-furby

Watches various atom text editor and workspace events and pushes them to a
running [Furby menubar application](https://github.com/jeffrafter/furby).
Currently emits the following events:

* type: 'linter'
* type: 'active'
* type: 'open'
* type: 'change' - content was changed
* type: 'title' - title was changed
* type: 'path' - path was changed
* type: 'cursor'
* type: 'save'
* type: 'destroy'

# Developing

If you want linting support (Furby can point out errors) install a linter. We
recommend Atom IDE.

* In atom, install the plugin: `atom-ide-ui`.
* Add Atom IDE plugins like `ide-typescript` or `ide-python`

Then clone and install this repo:

```bash
git clone https://github.com/tclem/atom-furby
cd atom-furby
npm install
apm ln
```

You can also use `linter-eslint` (requires a `.eslint.rc`) or (`linter-js-standard`).
