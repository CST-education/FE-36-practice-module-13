const BASE_URL = `https://api.openweathermap.org/data/2.5/weather`
const API_KEY = `b17a2dddb01d7481fea6373f92c2e546`

class ClassicFetch {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }
  getFetch(cityName) {
    let url = `${this.baseUrl}?q=${cityName}&apiid=${this.apiKey}`
  }
}
