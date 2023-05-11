import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { getData } from './ourApi';
import debounce from 'lodash.debounce';

import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const inputLine = document.querySelector('[name="searchQuery"]');
const submitBtn = document.querySelector('submit');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

let currentPage = 1;
const perPage = 40;

loadMoreBtn.style.display = 'none';
loadMoreBtn.addEventListener('click', loadMoreResults);

form.addEventListener('submit', textInput);

async function textInput(event) {
  event.preventDefault();
  const inputText = event.target.elements.searchQuery.value.trim();
  currentPage = 1;
  const { hits, totalHits, error } = await getData(
    inputText,
    currentPage,
    perPage
  );

  const galleryList = renderGallery(hits);
  gallery.insertAdjacentHTML('afterbegin', galleryList.join(''));
  lightbox.refresh();
  if (!totalHits) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (totalHits > perPage) {
    loadMoreBtn.style.display = 'block';
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } else if (currentPage * 40 >= totalHits) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

const renderGallery = galleryItems => {
  return galleryItems.map(el => {
    return `<div class="photo-card" >
      <a class="gallery__link" href="${el.largeImageURL}">
      <img src="${el.webformatURL}" alt="${el.tags}" width="350" height ="250"  loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${el.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${el.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${el.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${el.downloads}
        </p>
      </div>
    </div>`;
  });
};

async function loadMoreResults() {
  currentPage++;
  const inputText = inputLine.value.trim();
  const { hits, totalHits, error } = await getData(inputText, currentPage);

  const galleryList = renderGallery(hits);
  gallery.insertAdjacentHTML('beforeend', galleryList.join(''));
  lightbox.refresh();
}
