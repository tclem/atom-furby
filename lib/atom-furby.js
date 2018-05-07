'use babel';

import AtomFurbyView from './atom-furby-view';
import { CompositeDisposable } from 'atom';
import fetch from 'node-fetch';

export default {

  atomFurbyView: null,
  modalPanel: null,
  subscriptions: null,

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

    atom.workspace.observeTextEditors(editor => {
      this.subscriptions.add(editor.onDidStopChanging(event => {
        this.didStopChanging(editor, event)
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


  provideLinterUI() {
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

      post(data) {
        return fetch('http://localhost:3872/cmd/action', { method: 'POST', body: JSON.stringify(data) })
        // fetch('http://localhost:8001/cmd/action', { method: 'POST', body: data })
          .then(data => { console.log(data) })
          .catch(error => {
            console.warn(error)
            // atom.notifications.addWarning(error.reason)
          })
      },

      render({ added, removed, messages }) {
        // console.log('added messages', added.length)
        // console.log('removed messages', removed.length)
        console.log('total messages', messages.length)
        // console.log(messages)

        if (messages.length > 0) {
          console.log('found errors, posting to furby')
          data = {
            params: {
              input: 32,
              index: 0,
              subindex: 1,
              specific: 0,
              target: ""
            }
          }
        } else {
          console.log('fixed everything, posting to furby')
          data = {
            params: {
              input: 8,
              index: 2,
              subindex: 1,
              specific: 4,
              target: ""
            }
          }
        }
        this.post(data)
      },

      dispose() {
        // Delete any registered panels and stuff here
      }
    }
  },

  didStopChanging(editor, event) {
    console.log('AtomFurby didStopChanging()')
    // console.log(event)
    // if (event.changes.length < 1) return;
    //
    // change = event.changes[0].newText
    // console.log(change)
    //
    // this.send('http://localhost:8001/_ping').then(data => {
    //   console.log(data)
    // }).catch(error => {
    //   atom.notifications.addWarning(error.reason)
    // })
  },

  toggle() {
    console.log('AtomFurby was toggled!')
  }

};
