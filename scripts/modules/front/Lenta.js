let position = 0
let shiftSize = 0
let counter = 0
let size = 0
let pos_zIndex = 999
let neg_zIndex = -999

export function Create(imageLinks, width) {

  //если нет картинок
  size = imageLinks.length
  if(size == 0){
    return
  }

  let lenta = document.createElement('div')
  let list = document.createElement('ul')
  let prev = document.createElement('div')
  let next = document.createElement('div')

    //
    let lentaBorder = 4
    let innerLentaSize = width - lentaBorder*2
    let height = innerLentaSize * 0.6
    shiftSize = innerLentaSize
    
    lenta.style.border = 4 + 'px solid black';
    lenta.style.overflow = 'hidden'
    lenta.style.width = innerLentaSize + 'px'
    lenta.style.position = 'relative'
  
    list.style.display = 'flex'
    list.style.flexDirection = 'row';
    list.style.margin = 0;
    list.style.padding = 0;
    list.style.width = innerLentaSize + 'px'
    list.style.height = height +'px'

    prev.textContent = 'сюда'
    prev.style.position = 'absolute'
    prev.style.width = 50 + 'px'
    prev.style.height = 50 + 'px'
    prev.style.backgroundColor = '#FFFFFF'
    prev.style.borderRadius = 50+'%'
    prev.style.userSelect = 'none'
    prev.style.display = 'flex'
    prev.style.alignItems = 'center'
    prev.style.justifyContent = 'center'
    prev.style.left = '10%'
    prev.style.top = (height/2 - 25)+'px'
    prev.style.zIndex = neg_zIndex
    
    next.textContent = 'туда'
    next.style.position = 'absolute'
    next.style.width = 50 + 'px'
    next.style.height = 50 + 'px'
    next.style.backgroundColor = '#FFFFFF'
    next.style.borderRadius = 50+'%'
    next.style.userSelect = 'none'
    next.style.display = 'flex'
    next.style.alignItems = 'center'
    next.style.justifyContent = 'center'
    next.style.right = '10%'
    next.style.top = (height/2 - 25)+'px'
    next.style.zIndex = neg_zIndex
    //

  for(let link of imageLinks){
    let listElem = document.createElement('li')
    listElem.className = 'listElem'
    list.appendChild(listElem)

    let listElemImg = document.createElement('img')
    listElemImg.className = 'listElemImg'
    listElemImg.src = link
    listElem.appendChild(listElemImg)

    //
      listElem.style.listStyleType = 'none'
      listElem.style.backgroundColor = 'slategray'
      listElem.style.width = innerLentaSize+'px'
      listElem.style.height = height +'px'
      listElem.style.minWidth = innerLentaSize+'px'
      listElem.style.background = 'slategrey'
      listElem.style.display = 'flex'
      listElem.style.flexDirection = 'row'
      listElem.style.alignItems = 'center'
      listElem.style.justifyContent = 'center'
      
      listElemImg.style.maxHeight = '100%'
      listElemImg.style.maxWidth = '100%'      
    //
  } 

  lenta.id = 'lenta'
  list.id = 'list'
  prev.id = 'prev'
  next.id = 'next'
  
  lenta.appendChild(prev)
  lenta.appendChild(list)
  lenta.appendChild(next)

  //
  next.addEventListener('click', nextImg, false)
  prev.addEventListener('click', prevImg, false)
  lenta.addEventListener('mouseover', showPrevAndNext, false)
  lenta.addEventListener('mouseout', hidePrevAndNext, false)
  //

  return lenta
}


function nextImg(){
  if(counter < size -1){
    let list = document.getElementById("list");

    position = position - shiftSize;
    list.style.transform = 'translateX('+position+'px)';
    counter++;
  }
}

function prevImg(){
  if(counter > 0){
    let list = document.getElementById("list");

    position = position + shiftSize;
    list.style.transform = 'translateX('+position+'px)';
    counter--;
  }
}

function showPrevAndNext(){
  next.style.zIndex = pos_zIndex;
  prev.style.zIndex = pos_zIndex;
}

function hidePrevAndNext(){
  next.style.zIndex = neg_zIndex;
  prev.style.zIndex = neg_zIndex;
}