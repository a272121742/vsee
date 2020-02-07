export function preventDefault (event) {
  const e = event || window.event;
  if (e.preventDefault) { e.preventDefault(); }
  e.returnValue = false;
}

export function wheel (e) {
  preventDefault(e);
}

export function disableScroll () {
  // console.log('disableScroll');
  const scrollTop = getScrollTop();
  // console.log(scrollTop);
  document.body.classList.add('modal-open');
  document.body.style.top = `${-scrollTop}px`;
  // document.documentElement.scrollTop = `${-scrollTop}px`;
}

export function enableScroll () {
  // console.log('enableScroll');
  const scrollTop = getScrollTop();
  // console.log(scrollTop);
  document.body.classList.remove('modal-open');
  document.documentElement.scrollTop = scrollTop;
}

export function getScrollTop () {
  return document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
}

export function toggleForbidScrollThrough () {

}
