export function preventDefault (e) {
  e = e || window.event;
  if (e.preventDefault)
    e.preventDefault();
  e.returnValue = false;
}

export function wheel (e) {
  preventDefault(e);
}

export function disableScroll () {
  let scrollTop = window.pageYOffset;
  document.body.classList.add('modal-open');
  document.body.style.top = -scrollTop + 'px';
}

export function enableScroll () {
  let scrollTop = window.pageYOffset;
  document.body.classList.remove('modal-open');
  document.scrollingElement.scrollTop = scrollTop;
}

export function getScrollTop () {
  return document.body.scrollTop || document.documentElement.scrollTop;
}

function isFF () {
  if (window.addEventListener) return true;
  return false;
}

export function toggleForbidScrollThrough (isForbide) {
  // if (isForbide) {
  //   // console.log(window);
  //   // if (isFF()) {
  //   //   document.body.style.overflow = 'hidden';
  //   // } else {
  //   //   document.documentElement.style.overflow = 'hidden';
  //   // }
  //   document.getElementById('app').style.overflow = 'hidden';
  // } else {
  //   document.getElementById('app').style.overflow = 'auto';

  //   // if (isFF()) {
  //   //   document.body.style.overflow = 'scroll';
  //   // } else {
  //   //   document.documentElement.style.overflow = 'scroll';
  //   // }
  // }
  // if (isForbide) {
  //   document.body.style.overflowY = 'hidden';
  // } else {
  //   document.body.style.overflowY = 'scroll';
  // }
}