export default function getRefs() {
  return {
    searchFormEl: document.querySelector('#search-form'),
    loadMoreBtnEl: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery'),
    endOfResult: document.querySelector('.end-of-results')
  }
}