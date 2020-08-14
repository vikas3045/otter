const fs = require('fs')
const {shell, ipcRenderer} = require('electron')

// DOM nodes
let links = document.getElementById('links')
let searchBar = document.getElementById('search-bar')

// Get saveButtonJS contents
let saveButtonJS
fs.readFile(`${__dirname}/templates/saveButton.js`, (err, data) => {
  saveButtonJS = data.toString()
})

// Get deleteButtonJS contents
let deleteButtonJS
fs.readFile(`${__dirname}/templates/deleteButton.js`, (err, data) => {
  deleteButtonJS = data.toString()
})

// Listen for "Done" message from reader window
window.addEventListener('message', e => {

  // Check for correct message
  if (e.data.action === 'delete-reader-link') {

    // Delete link at given index
    this.delete(e.data.linkIndex)

    // Close the reader window
    e.source.close()
  }
})

// Listen for "Save pdf" message from reader window
window.addEventListener('message', e => {

  // Check for correct message
  if (e.data.action === 'new-link') {

    // Add it to list
    ipcRenderer.send('new-link', searchBar.value)

    // Close the reader window
    e.source.close()
  }
})

// Track links in storage
exports.storage = JSON.parse(localStorage.getItem('otter-links')) || []

// Delete link
exports.delete = linkIndex => {

  // Remove link from DOM
  links.removeChild(links.childNodes[linkIndex])

  // Remove from storage
  this.storage.splice(linkIndex, 1)

  // Persist
  this.save()

  // Select previous link or new first link if first was deleted
  if (this.storage.length) {

    // Get new selected link index
    let newselectedLinkIndex = (linkIndex === 0) ? 0 : linkIndex - 1

    // Set link at new index as selected
    document.getElementsByClassName('read-link')[newselectedLinkIndex].classList.add('selected')
  }
}

// Get selected link index
exports.getSelectedLink = () => {

  // Get selected node
  let currentLink = document.getElementsByClassName('read-link selected')[0]

  // Get link index
  let linkIndex = 0
  let child = currentLink
  while((child = child.previousSibling) != null ) {
    linkIndex++
  }

  // Return selected link and index
  return { node: currentLink, index: linkIndex }
}

// Persist storage
exports.save = () => {
  localStorage.setItem('otter-links', JSON.stringify(this.storage))
}

// Set link as selected
exports.select = e => {

  // Remove currently selected link class
  this.getSelectedLink().node.classList.remove('selected')

  // Add to clicked link
  e.currentTarget.classList.add('selected')
}

// Move to newly selected link
exports.changeSelection = direction => {

  // Get selected link
  let currentLink = this.getSelectedLink()

  // Handle up/down
  if (direction === 'ArrowUp' && currentLink.node.previousSibling) {
    currentLink.node.classList.remove('selected')
    currentLink.node.previousSibling.classList.add('selected')

  } else if (direction === 'ArrowDown' && currentLink.node.nextSibling) {
    currentLink.node.classList.remove('selected')
    currentLink.node.nextSibling.classList.add('selected')
  }
}

// Open link in native browser
exports.openNative = () => {

  // Only if we have links
  if( !this.storage.length ) return

  // Get selected link
  let selectedLink = this.getSelectedLink()

  // Open in system browser
  shell.openExternal(selectedLink.node.dataset.url)
}

// Open selected link
exports.open = (e) => {

  // Only if we have links (in case of menu open)
  if( !this.storage.length ) return

  // Get selected link
  let selectedLink = this.getSelectedLink()

  // Get link's url
  let contentURL = selectedLink.node.dataset.url

  // Open link in proxy BrowserWindow
  let readerWin = window.open(contentURL, '', `
    maxWidth=2000,
    maxHeight=2000,    
    nodeIntegration=no,
    contextIsolation=1
  `)

  // Inject JavaScript with specific link index (selectedLink.index)
  readerWin.eval(deleteButtonJS.replace('{{index}}', selectedLink.index))  
}

exports.browse = (e, contentURL) => {
  // Open link in proxy BrowserWindow
  let readerWin = window.open(contentURL, '', `
    maxWidth=2000,
    maxHeight=2000,    
    nodeIntegration=no,
    contextIsolation=1
  `)

  readerWin.eval(saveButtonJS)
}

// Add new link
exports.addLink = (link, isNew = false) => {

  // Create a new DOM node
  let linkNode = document.createElement('div')

  // Assign "read-link" class
  linkNode.setAttribute('class', 'read-link')

  // Set link url as data attribute
  linkNode.setAttribute('data-url', link.url)

  // Add inner HTML
  // change starts
  // linkNode.innerHTML = `<img src="${link.screenshot}"><h2>${link.title}</h2>`
  linkNode.innerHTML = `<h5>${link.title}</h5>`
  // change ends

  // Append new node to "links"
  links.appendChild(linkNode)

  // Attach click handler to select
  linkNode.addEventListener('click', this.select)

  // Attach open doubleclick handler
  linkNode.addEventListener('dblclick', this.open)

  // If this is the first link, select it
  if (document.getElementsByClassName('read-link').length === 1) {
    linkNode.classList.add('selected')
  }

  // Add link to storage and persist
  if(isNew) {
    this.storage.push(link)
    this.save()
  }
}

// Add links from storage when app loads
this.storage.forEach(link => {
  this.addLink(link)
})
