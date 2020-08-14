const {ipcRenderer} = require('electron')
const links = require('./links')

// Dom Nodes
let searchBar = document.getElementById('search-bar')

// Ref links.open globally
window.openLink = links.open

// Ref links.delete globally
window.deleteLink = () => {
  let selectedLink = links.getSelectedLink()
  links.delete(selectedLink.index)
}

// Open item in native browser
window.openLinkNative = links.openNative

// Focus to searchBar links
window.searchLinks = () => {
  searchBar.focus()
}

// Filter links with "searchBar"
searchBar.addEventListener('keyup', e => {
  searchLinks(searchBar.value)  
})

function searchLinks(searchText) {
  // Loop links
  Array.from(document.getElementsByClassName('read-link')).forEach(item => {

    // Hide links that don't match searchBar value
    let hasMatch = item.innerText.toLowerCase().includes(searchText)
    item.style.display = hasMatch ? 'flex' : 'none'
  })
}

// Navigate item selection with up/down arrows
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    links.changeSelection(e.key)
  }
})

// Handle new item
// addItem.addEventListener('click', e => {
//   // Check a url exists
//   if (itemUrl.value) {

//     // Send new item url to main process
//     ipcRenderer.send('new-item', itemUrl.value)
//   }
// })

// Listen for new item from main process
ipcRenderer.on('new-link-success', (e, newItem) => {
  // Add new item to "links" node
  links.addLink(newItem, true)

  // Clear searchBar input value
  searchBar.value = ''

  searchLinks(searchBar.value)
})

// Listen for keyboard submit and Browse the link
searchBar.addEventListener('keyup', e => {
  if(e.key === 'Enter') links.browse(e, searchBar.value)
})
