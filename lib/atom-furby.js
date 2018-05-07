'use babel';

import AtomFurbyView from './atom-furby-view';
import { CompositeDisposable } from 'atom';
import request from 'request';

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


  didStopChanging(editor, event) {
    console.log('AtomFurby didStopChanging()')
    console.log(event)
    if (event.changes.length < 1) return;

    change = event.changes[0].newText
    console.log(change)

    this.send('http://localhost:8001/_ping').then(data => {
      console.log(data)
    }).catch(error => {
      atom.notifications.addWarning(error.reason)
    })
  },

  send(url) {
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(body)
        } else {
          reject({
            reason: 'Failed to contact Furby',
            status: reponse.StatusCode
          })
        }
      })
    })
  },

  toggle() {
    console.log('AtomFurby was toggled!')
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let reversed = selection.split('').reverse().join('')
      editor.insertText(reversed)
    }
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
