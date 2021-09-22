// console.log(`hello`)
import axios from 'axios'
import template from '../templates/template.handlebars'
import refs from './refs'
console.dir(axios)

let BASE_URL = `https://api.openweathermap.org/data/2.5/weather`
axios.defaults.baseURL = BASE_URL
console.log(axios.defaults.baseURL)

const { searchContainer, searchForm, widgetContainer, city, temp, icon, description, humidity, wind } = refs
// console.log(searchForm, widgetContainer, city, temp, icon, description, humidity, wind)
let API_key = `b17a2dddb01d7481fea6373f92c2e546`
let cityName = 'Kyiv'

class WeatherWidget {
  constructor(baseUrl, apiKey, formRef, searchInput, templateFunc, insertContainer) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
    this.formRef = formRef
    this.searchInput = searchInput
    this._cityName = 'Kyiv'
    this.templateFunc = templateFunc
    this.insertContainer = insertContainer
  }
  get cityName() {
    return this._cityName
  }
  set cityName(value) {
    return (this._cityName = value)
  }

  getSearchValue() {
    this.formRef.addEventListener('submit', e => {
      e.preventDefault()
      this.insertContainer.innerHTML = ''
      this.cityName = e.target.elements[this.searchInput].value
    })
  }

  async getFetch() {
    let params = `?q=${this.cityName}&appid=${this.apiKey}`

    try {
      let r = await axios.get(params)
      console.log(r.data)
      localStorage.setItem('wetherData', JSON.stringify(r.data))
      this.renderData(r.data)
    } catch (e) {
      console.log(e)
    }

    // let url = this.baseUrl + params
    // try {
    //   let r = await fetch(url)
    //   let d = await r.json()
    //   localStorage.setItem('wetherData', JSON.stringify(d))
    //   this.renderData(d)
    // } catch (err) {
    //   console.log(err)
    // }

    // fetch(url)
    //   .then(r => r.json())
    //   .then(d => {
    //     //
    //     console.log(d)
    //     localStorage.setItem('wetherData', JSON.stringify(d))
    //     renderData(d)
    //   })
    //   .catch(e => console.log(e))
  }
  renderData(obj = null) {
    if (obj) {
      let markup = this.templateFunc(obj)
      this.insertContainer.insertAdjacentHTML('beforeend', markup)
    } else {
      let weatherDataFromLS = JSON.parse(localStorage.getItem('wetherData'))
      let markup = this.templateFunc(weatherDataFromLS)
      this.insertContainer.insertAdjacentHTML('beforeend', markup)
    }
  }
  showWidget() {
    this.getFetch()
    this.renderData()
  }
  hideWidget() {
    //   чистить слушателя
    // скрывать блок widgetContainer
  }
}
const newWeatherWidget = new WeatherWidget(BASE_URL, API_key, searchForm, `search`, template, searchContainer)
console.log(newWeatherWidget)

newWeatherWidget.showWidget()

// searchForm.addEventListener('submit', e => {
//   e.preventDefault()
//   cityName = e.target.elements.search.value
//   let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}`
//   cityName
//     ? fetch(url)
//         .then(r => r.json())
//         .then(d => {
//           console.log(d)
//           localStorage.setItem('wetherData', JSON.stringify(d))
//           renderWeatherData(d)
//         })
//     : alert(`введите данные`)
//   searchForm.reset()
// })
// let weatherDataFromLS = JSON.parse(localStorage.getItem('wetherData'))
// renderWeatherData(weatherDataFromLS)

// function renderWeatherData(obj) {
//   const {
//     name,
//     main: { temp: t, humidity: h },
//     weather,
//     wind: { speed },
//   } = obj
//   // удаляем класс loading, чтобы отобразить данные о погоде
//   widgetContainer.classList.remove('loading')
//   city.textContent = `Weather in ${name}`
//   temp.textContent = `${Math.round(t - 273.15)}°C`
//   icon.setAttribute('src', `https://openweathermap.org/img/wn/${weather[0].icon}.png`)
//   icon.setAttribute('alt', weather[0].description)
//   description.textContent = weather[0].description
//   humidity.textContent = `Humidity: ${h}%`
//   wind.textContent = `Wind speed: ${speed} km/h`
// }
