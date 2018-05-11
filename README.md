# atom-furby

![Mona and Furby](./mona.jpg)

This plugin is meant to communicate with a Furby connect. As you work,
your Furby connect should pair with you.

### Wait, I don't have a furby!

You should really get a [Hasbro Furby Connect](https://www.amazon.com/gp/product/B01EARLU16/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01EARLU16&linkCode=as2&tag=bigfuncoding-20&linkId=71f61074218432de05081fd12b27766c)!

> NOTE: Furbies need 4 AA batteries or you'll want to [hack in USB power](https://github.com/Jeija/bluefluff/issues/36)

# How it works

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
