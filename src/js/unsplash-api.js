export class UnsplashAPI {
  #BASE_URL = 'https://pixabay.com';
  #API_KEY = '35020167-a3dbb9d484c10f798b185affc';

  query = null;
  page = 1;
  count = 40;

  baseSearchParams = {
    per_page: this.count,
    key: this.#API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  fetchPhotos() {
    const searchParams = new URLSearchParams({
      page: this.page,
      q: this.query,
      ...this.baseSearchParams,
    });

    return fetch(`${this.#BASE_URL}/api/?${searchParams}`).then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return res.json();
    });
  }
}
