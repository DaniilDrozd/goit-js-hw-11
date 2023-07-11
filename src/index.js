import SimpleLightbox from 'simplelightbox';
import { PixaApiService } from './js/api-pixa';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
let buttonLoadMore = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  animationSpeed: 250,
  captionPosition: 'bottom',
});

const pixaApiService = new PixaApiService();

function notifyFailure(message) {
  Notify.failure(message);
}

async function Images(event) {
  loader.style.display = 'block';
  event.preventDefault();
  page = 1;
  searchValue = searchInput.value;
  gallery.innerHTML = '';
  totalImages = 0;
  loader.style.display = 'none';

  try {
    const data = await getImages(searchValue);

    if (data.hits.length === 0 || searchValue === '') {
      notifyFailure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      notifySuccess(`Hooray! We found ${data.totalHits} images.`);
      createMarkup(data);
      lightbox.refresh();
    }
  } catch (err) {
    console.log(err);
  }
}

searchForm.addEventListener('submit', Images);

const displayGallery = results => {
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
};

// async function LoadMore() {
//     page = 1;
//   loader.style.display = 'none';
// }
// LoadMore.addEventListener('click', onClickLoadMore);
