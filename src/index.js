import SimpleLightbox from 'simplelightbox';
import { PixaApiService } from './js/api-pixa';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const buttonLoadMore = document.querySelector('.load-more');

let searchValue = '';
let page = 1;
let totalImages = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  animationSpeed: 250,
  captionPosition: 'bottom',
});
const pixaApiService = new PixaApiService();

function notifyFailure(message) {
  Notify.failure(message);
}

async function imagesSearch(event) {
  event.preventDefault();
  page = 1;
  searchValue = searchInput.value;
  gallery.innerHTML = '';
  totalImages = 0;
  buttonLoadMore.classList.add('is-hidden');

  try {
    const data = await pixaApiService.searchImages(searchValue, page);

    if (data.hits.length === 0 || searchValue === '') {
      notifyFailure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      displayGallery(data);
      lightbox.refresh();
      buttonLoadMore.classList.remove('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
}

searchForm.addEventListener('submit', imagesSearch);

function displayGallery(results) {
  const markup = results.hits
    .map(element => {
      return `
        <div class="photo-card">
          <a href="${element.largeImageURL}">
            <img class="photo-img" src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${element.likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${element.views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${element.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${element.downloads}
            </p>
          </div>
        </div>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

async function loadMoreImages() {
  try {
    page += 1;
    buttonLoadMore.classList.add('is-hidden');

    const data = await pixaApiService.searchImages(searchValue, page);

    if (data.hits.length === 0) {
      notifyFailure(
        'Sorry, there are no more images matching your search query.'
      );
    } else {
      displayGallery(data);
      buttonLoadMore.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

buttonLoadMore.addEventListener('click', loadMoreImages);
