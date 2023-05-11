//pixabay.com/api/
import axios from 'axios';
import Notiflix from 'notiflix';
const pixabayAPI = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '36261885-ace95c32b2b407d9c65e4399b',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  },
});

export async function getData(input, page = 1) {
  const { data } = await pixabayAPI({ params: { q: input, page } });
  console.log(data);
  if (!data) {
    throw new Error(data.status);
  }
  return data;
}
