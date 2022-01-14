import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
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

refs.searchFormEl.addEventListener('submit', onSubmitSearchForm);
loadMoreBtn.refs.button.addEventListener('click', fetchPictures);



function onSubmitSearchForm(e) {
  e.preventDefault();


  console.log(e.currentTarget.elements.searchQuery.value);
  const searchQuery = e.currentTarget.elements.searchQuery.value;

  pictureApiService.query = searchQuery;
  pictureApiService.resetPage();
  clearGalleryContainer()
  fetchPictures();
  loadMoreBtn.show();
 

 
}
  
function fetchPictures() {

  loadMoreBtn.disable();
  
  return pictureApiService.fetchPictures()
    .then(response => {
      const { hits } = response;
      const page = response.totalHits / 3;
     
      if (response.totalHits === 0) {
         loadMoreBtn.hide();
      }
      if (pictureApiService.page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
      }
      
      console.log(response);
     
      console.log(page)
      pictureApiService.incrementPage();
      renderPicturesCard(hits)
      console.log(hits);

      
      loadMoreBtn.enable();

      if (pictureApiService.page > page && response.totalHits != 0) {
        console.log('no more picture');
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        loadMoreBtn.hide();
        return;
      }
    })
}

function renderPicturesCard(countries) {

  if (countries.length < 1) {
    refs.gallery.innerHTML = "";
    console.log("Sorry, there are no images matching your search query. Please try again.");
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return;
  }

  const markup = countries.map(country => `<div class="photo-card">
  <a href="${country.largeImageURL}"><img src="${country.webformatURL}" alt="${country.tags}" loading="lazy" /></a>
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

function clearGalleryContainer() {
  refs.gallery.innerHTML = "";
}
new SimpleLightbox('.gallery a');