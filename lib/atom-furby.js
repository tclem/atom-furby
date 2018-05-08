'use babel';

import AtomFurbyView from './atom-furby-view';
import { CompositeDisposable } from 'atom';
import fetch from 'node-fetch';

const base = 'http://localhost:3872'

export default {

  atomFurbyView: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    uri: {
      type: 'string',
      default: base
    }
  },

  activate(state) {
    console.log('Activiate AtomFurby')
    this.atomFurbyView = new AtomFurbyView(state.atomFurbyViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomFurbyView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-furby:toggle': () => this.toggle()
    }));

    this.subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(item => {
      this.didStopChangingActivePaneItem(item)
    }))
    this.subscriptions.add(atom.workspace.onDidOpen(event => {
      this.didOpen(event)
    }))

    atom.workspace.observeTextEditors(editor => {
      this.subscriptions.add(editor.onDidChangeTitle(event => {
        this.didChangeTitle(editor, event)
      }))
      this.subscriptions.add(editor.onDidChangePath(event => {
        this.didChangePath(editor, event)
      }))
      this.subscriptions.add(editor.onDidStopChanging(event => {
        this.didStopChanging(editor, event)
      }))
      this.subscriptions.add(editor.onDidChangeCursorPosition(event => {
        this.didChangeCursorPosition(editor, event)
      }))
      this.subscriptions.add(editor.onDidChangeSelectionRange(event => {
        this.didChangeSelectionRange(editor, event)
      }))
      this.subscriptions.add(editor.onDidSave(event => {
        this.didSave(editor, event)
      }))
      this.subscriptions.add(editor.onDidDestroy(event => {
        this.didDestroy(editor, event)
      }))
    })
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomFurbyView.destroy();
  },

  serialize() {
    return {
      atomFurbyViewState: this.atomFurbyView.serialize()
    };
  },

  post(data) {
    let uri = atom.config.get('atom-furby.uri') || base
    console.log(`[POST] ${data.type}`, data)
    return fetch(`${uri}/notification`, { method: 'POST', body: JSON.stringify(data) })
      .then(data => { console.log(data) })
      .catch(error => {
        console.warn(error)
        // atom.notifications.addWarning(error.reason)
      })
  },

  provideLinterUI() {
    let subscription = this
    console.log('provideLinterUI')
    return {
      name: 'AtomFurby',

      didBeginLinting(linter, filePath) {
        if (filePath === null) {
          console.log('Project scoped linter started', linter.name)
        } else {
          console.log('File scoped linter started', linter.name, 'on', filePath)
        }
      },

      didFinishLinting(linter, filePath) {
        if (filePath === null) {
          console.log('Project scoped linter finished', linter.name)
        } else {
          console.log('File scoped linter finished', linter.name, 'on', filePath)
        }
      },

      render({ added, removed, messages }) {
        // For now we don't include messages
        subscription.post({
          type: 'linter',
          added: added,
          removed: removed
        })
      },

      dispose() {
        // Delete any registered panels and stuff here
      }
    }
  },

  didStopChangingActivePaneItem(item) {
    if (typeof item == 'undefined') return

    if (item.getPath) {
      this.post({
        type: 'active',
        path: item.getPath()
      })
    } else if (item.uri) {
      this.post({
        type: 'active',
        path: item.uri
      })
    }
  },

  didOpen(item) {
    this.post({
      type: 'open',
      path: item.uri
    })
  },

  didStopChanging(editor, event) {
    if (event.changes.length < 1) return;

    change = event.changes[0].newText

    this.post({
      type: 'change',
      path: editor.getPath(),
      change: change
    })
  },

  didChangeTitle(editor, event) {
    this.post({
      type: 'title',
      path: editor.getPath()
    })
  },

  didChangePath(editor, event) {
    this.post({
      type: 'path',
      path: editor.getPath()
    })
  },

  didChangeCursorPosition(editor, event) {
    this.post({
      type: 'cursor',
      old: event.oldBufferPosition,
      new: event.newBufferPosition,
      path: editor.getPath()
    })
  },

  didChangeSelectionRange(editor, event) {
    // For now, we only worry about cursor position
    // this.post({
    //   type: 'selection',
    //   old: event.oldBufferRange,
    //   new: event.newBufferRange,
    //   path: editor.getPath()
    // })
  },

  didSave(editor, event) {
    this.post({
      type: 'save',
      path: editor.getPath()
    })
  },

  didDestroy(editor, event) {
    this.post({
      type: 'destroy',
      path: editor.getPath()
    })
  },

  toggle() {
    console.log('AtomFurby was toggled!')
  }

};
