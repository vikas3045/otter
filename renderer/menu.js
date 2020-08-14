const {remote, shell} = require('electron')

// Menu template
const template = [
  {
    label: 'Saved Links',
    submenu: [
      {
        label: 'Read',
        accelerator: 'CmdOrCtrl+Enter',
        click: window.openItem
      },
      {
        label: 'Delete',
        accelerator: 'CmdOrCtrl+Backspace',
        click: window.deleteItem
      },
      {
        label: 'Open in Browser',
        accelerator: 'CmdOrCtrl+Shift+O',
        click: window.openLinkNative
      },
      {
        label: 'Search Links',
        accelerator: 'CmdOrCtrl+S',
        click: window.searchItems
      }
    ]
  },
  {
    role: 'editMenu'
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  // {
  //   role: 'help',
  //   submenu: [
  //     {
  //       label: 'Learn more',
  //       click: () => { shell.openExternal('https://github.com/stackacademytv/master-electron') }
  //     }
  //   ]
  // }
]

// Set Mac-specific first menu item
if (process.platform === 'darwin') {

  template.unshift({
    label: remote.app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator'},
      { role: 'services' },
      { type: 'separator'},
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator'},
      { role: 'quit' }
    ]
  })
}

// Build menu
const menu = remote.Menu.buildFromTemplate(template)

// Set as main app menu
remote.Menu.setApplicationMenu(menu)
