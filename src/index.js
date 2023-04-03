import renderElements from './templates/imagesRender.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formEl = document.querySelector('#search-form');
const galerryEl = document.querySelector('.gallery');

const KEY_API = '35020167-a3dbb9d484c10f798b185affc';
const BASE_URL = 'https://pixabay.com/api/';
const PARAMETER_API = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};

formEl.addEventListener('submit', submitImages);

function submitImages(e) {
  e.preventDefault();

  let serchText = e.currentTarget.searchQuery.value;
  if (!serchText) {
    return;
  }

  searchImages(serchText).then(data => {
    console.log(data);
    if (!data.total) {
      onError();
      return;
    }
    manyMatches(data.totalHits);
    galerryEl.innerHTML = renderElements(data.hits);
  });
}

function searchImages(e) {
  return fetch(
    `${BASE_URL}?key=${KEY_API}&q=${e}&image_type=photo&pretty=true`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
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
