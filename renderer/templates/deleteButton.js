let deleteBookmark = document.createElement('div')
deleteBookmark.innerText = 'Remove'

// Style button
deleteBookmark.style.position = 'fixed'
deleteBookmark.style.bottom = '15px'
deleteBookmark.style.right = '15px'
deleteBookmark.style.padding = '5px 10px'
deleteBookmark.style.fontSize = '20px'
deleteBookmark.style.fontWeight = 'bold'
deleteBookmark.style.background = '#07304C'
deleteBookmark.style.color = 'white'
deleteBookmark.style.borderRadius = '5px'
deleteBookmark.style.cursor = 'default'
deleteBookmark.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)'

// Attach click handler
deleteBookmark.onclick = e => {

  // Message parent (opener) window
  window.opener.postMessage({
    action: 'delete-reader-link',
    itemIndex: {{index}}
  }, '*')
}

// Append button to body
document.getElementsByTagName('body')[0].appendChild(deleteBookmark)