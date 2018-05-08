# atom-furby

Watches various atom text editor and workspace events and pushes them to a
running Furby watcher. Currently emits the following:

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

Get the prereqs:

* In atom, install the plugin: `linter-js-standard`. Install the dependencies

Then clone and install:

```bash
git clone https://github.com/tclem/atom-furby
cd atom-furby
npm install
apm ln
```

We may also use `linter-eslint` but that requires a `.eslint.rc`.
