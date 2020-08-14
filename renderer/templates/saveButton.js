// Save button
let saveBookmark = document.createElement('div')
saveBookmark.innerText = 'Save'

// Style button
saveBookmark.style.position = 'fixed'
saveBookmark.style.bottom = '15px'
saveBookmark.style.right = '85px'
saveBookmark.style.padding = '5px 10px'
saveBookmark.style.fontSize = '20px'
saveBookmark.style.fontWeight = 'bold'
saveBookmark.style.background = '#07304C'
saveBookmark.style.color = 'white'
saveBookmark.style.borderRadius = '5px'
saveBookmark.style.cursor = 'default'
saveBookmark.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)'

saveBookmark.onclick = e => {
  window.opener.postMessage({
    action: 'new-link'
  })
}

document.getElementsByTagName('body')[0].appendChild(saveBookmark)