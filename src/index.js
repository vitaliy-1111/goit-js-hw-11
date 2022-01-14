import './sass/main.scss';
import getRefs from './js/getRefs.js';
// import articlesTpl from './templates/articles.hbs';
import PictureApiService from './js/picture-service.js';
import LoadMoreBtn from './js/components/load-more-btn.js';

const refs = getRefs();
const pictureApiService = new PictureApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
// let page = 1;
// const totalPage = 3;

refs.searchFormEl.addEventListener('submit', onSubmitSearchForm);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtn);



function onSubmitSearchForm(e) {
  e.preventDefault();
  // page = 1;

  console.log(e.currentTarget.elements.searchQuery.value);
  const searchQuery = e.currentTarget.elements.searchQuery.value;

  pictureApiService.query = searchQuery;
  pictureApiService.resetPage();
  clearGalleryContainer()
  fetchPictures();
  loadMoreBtn.show();
 

 
}
  
function fetchPictures() {
  // page += 1;
  loadMoreBtn.disable();
  
  return pictureApiService.fetchPictures()
    .then(response => {
      console.log(response);
      const { hits } = response;
      const page = response.totalHits / 150;
      console.log(page)
      pictureApiService.incrementPage();
      loadMoreBtn.enable();
      renderPicturesCard(hits)
      console.log(hits);
      if (pictureApiService.page > page) {
        console.log('no more picture');
        loadMoreBtn.hide();
        return;
      }

    })
    // .then(({ hits }) => {
    //   console.log(hits);
    //   pictureApiService.incrementPage();
    //   return hits
    // }).
    // then(response => {
    //   loadMoreBtn.enable();
    //   return renderPicturesCard(response)
    // });

}
function renderPicturesCard(countries) {
  if (countries.length < 1) {
    refs.gallery.innerHTML = "";
    console.log("Sorry, there are no images matching your search query. Please try again.");
    return;
  }
  const markup = countries.map(country => `<div class="photo-card">
  <img src="${country.webformatURL}" alt="${country.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>likes ${country.likes}</b>
    </p>
    <p class="info-item">
      <b>views ${country.views}</b>
    </p>
    <p class="info-item">
      <b>comments ${country.comments}</b>
    </p>
    <p class="info-item">
      <b>downloads ${country.downloads}</b>
    </p>
  </div>
</div>`).join("");
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
// function appendPicturesMarkUp(pictures) {
//   refs.gallery.insertAdjacentHTML('beforeend', articlesTpl(pictures));
// }
function onLoadMoreBtn() {

  // if (page > totalPage) {
  //   console.log('no more pictures');
  //   loadMoreBtn.hide();
  //   return;
  // }
  // console.log(page)
  fetchPictures();

}
function clearGalleryContainer() {
  refs.gallery.innerHTML = "";
}