import axios from 'axios';

export class PixaApiService {
  constructor() {
    this.API_KEY = '38178451-254307e3c9254abeb25cb8814';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.DEFAULT_QUANTITY = 40;
  }

  async searchImages(query, page, perPage) {
    try {
      const url = `${this.BASE_URL}?key=${this.API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }
}
