import axios from 'axios';

export class UnsplashAPI {
  #BASE_URL = 'https://pixabay.com';
  #API_KEY = '35020167-a3dbb9d484c10f798b185affc';

  query = null;
  page = 1;
  count = 12;

  baseSearchParams = {
    per_page: this.count,
    key: this.#API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  async fetchPhotos() {
    try {
      return await axios.get(`${this.#BASE_URL}/api/`, {
        params: {
          page: this.page,
          q: this.query,
          ...this.baseSearchParams,
        },
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
