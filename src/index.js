import renderElements from './templates/imagesRender.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { UnsplashAPI } from './js/unsplash-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('#search-form');
const gallaryListEl = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const unsplashAPI = new UnsplashAPI();

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  scrollZoom: false,
});

searchFormEl.addEventListener('submit', submitImages);
btnLoadMore.addEventListener('click', handleLoadModeBtnClick);

async function submitImages(e) {
  e.preventDefault();
  window.scrollTo(0, 0);

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

  try {
    const { data } = await unsplashAPI.fetchPhotos();

    if (!data.total) {
      onError();
      return;
    }

    manyMatches(data.totalHits);
    gallaryListEl.innerHTML = renderElements(data.hits);
    lightbox.refresh();

    if (data.totalHits > unsplashAPI.count) {
      btnLoadMore.classList.remove('is-hidden');
      return;
    }

    btnLoadMore.classList.add('is-hidden');
  } catch (err) {
    console.log(err);
  }
}

async function handleLoadModeBtnClick() {
  unsplashAPI.page += 1;
  btnLoadMore.disabled = true;

  try {
    const { data } = await unsplashAPI.fetchPhotos();

    if (unsplashAPI.count * unsplashAPI.page >= data.totalHits) {
      btnLoadMore.classList.add('is-hidden');
    }

    gallaryListEl.insertAdjacentHTML('beforeend', renderElements(data.hits));
    lightbox.refresh();
    btnLoadMore.disabled = false;
    scrollWindow();
  } catch (err) {
    console.log(err);
  }
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

function scrollWindow() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
