import renderElements from './templates/imagesRender.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { UnsplashAPI } from './js/unsplash-api';

const searchFormEl = document.querySelector('#search-form');
const gallaryListEl = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const unsplashAPI = new UnsplashAPI();

searchFormEl.addEventListener('submit', submitImages);
btnLoadMore.addEventListener('click', handleLoadModeBtnClick);

function submitImages(e) {
  e.preventDefault();

  let searchText = e.currentTarget.searchQuery.value.trim();

  if (unsplashAPI.page > 1) {
    unsplashAPI.page = 1;
  }

  if (!searchText) {
    nonSearch();
    return;
  }

  e.currentTarget.searchQuery.value = '';

  unsplashAPI.query = searchText;

  unsplashAPI
    .fetchPhotos()
    .then(({ data }) => {
      console.log(data);
      if (!data.total) {
        onError();
        return;
      }

      manyMatches(data.totalHits);
      gallaryListEl.innerHTML = renderElements(data.hits);

      if (data.totalHits > unsplashAPI.count) {
        btnLoadMore.classList.remove('is-hidden');
        return;
      }
      btnLoadMore.classList.add('is-hidden');
    })
    .catch(err => {
      console.log(err);
    });
}

function handleLoadModeBtnClick() {
  unsplashAPI.page += 1;
  btnLoadMore.disabled = true;

  unsplashAPI
    .fetchPhotos()
    .then(({ data }) => {
      if (unsplashAPI.count * unsplashAPI.page >= data.totalHits) {
        btnLoadMore.classList.add('is-hidden');
      }
      gallaryListEl.insertAdjacentHTML('beforeend', renderElements(data.hits));
      btnLoadMore.disabled = false;
    })
    .catch(err => {
      console.log(err);
    });
}

function onError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function manyMatches(e) {
  Notify.info(`Hooray! We found ${e} images.`);
}

function nonSearch() {
  Notify.info(`Enter some data`);
}
