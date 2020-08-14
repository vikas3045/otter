// Modules
const {BrowserWindow} = require('electron')

let offscreenWin

module.exports = (url, callback) => {
  offscreenWin = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: false
    }
  })

  offscreenWin.loadURL(url)

  // Wait for content to finish loading
  offscreenWin.webContents.on('did-finish-load', () => {
    let title = offscreenWin.getTitle()
    callback({title, url})
  })
}
