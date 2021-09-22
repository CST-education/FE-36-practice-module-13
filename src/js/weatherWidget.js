// console.log(`hello`)
import axios from 'axios'
import template from '../templates/template.handlebars'
import refs from './refs'
// console.dir(axios)
import { setErrorMsg } from './notification'

let BASE_URL = `https://api.openweathermap.org/data/2.5/weather`
axios.defaults.baseURL = BASE_URL
// console.log(axios.defaults.baseURL)

const { showBtn, hideBtn, templateContainer, searchForm } = refs
// console.log(searchForm, widgetContainer, city, temp, icon, description, humidity, wind)
let API_key = `b17a2dddb01d7481fea6373f92c2e546`

class WeatherWidget {
  constructor(baseUrl, apiKey, formRef, searchInput, templateFunc, insertContainer) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
    this.formRef = formRef
    this.searchInput = searchInput
    this._cityName = 'Kyiv'
    this.templateFunc = templateFunc
    this.insertContainer = insertContainer
    this.isShowWidget = false
  }
  get cityName() {
    return this._cityName
  }
  set cityName(value) {
    return (this._cityName = value)
  }

  getSearchValue() {
    this.formRef.addEventListener('submit', this.handleSubmit)
  }

  handleSubmit = e => {
    e.preventDefault()
    let inputValue = e.target.elements[this.searchInput].value
    // проверяем, есть ли инпуте данные и не совпадают ли они с уже существующими
    if (inputValue && inputValue !== this.cityName) {
      // перед запросом чистим контейнер с рендером данных
      this.insertContainer.innerHTML = ''
      // если значение из формы отличается от сохраненного значения
      // перезаписываем его и делаем запрос
      this.cityName = inputValue
      // делаем запрос
      this.getFetch()
      // зачищаем форму после отправки запроса
      this.formRef.reset()
    } else {
      setErrorMsg(`Enter the City Name please!`)
    }
  }
  async getFetch() {
    // асинхронный запрос через axios
    let params = `?q=${this.cityName}&appid=${this.apiKey}`
    try {
      let r = await axios.get(params)
      //   console.log(r.data)
      localStorage.setItem('weatherData', JSON.stringify(r.data))
      this.renderData(r.data)
    } catch (e) {
      console.log(e)
    }

    // асинхронный запрос через fetch
    // let url = this.baseUrl + params
    // try {
    //   let r = await fetch(url)
    //   let d = await r.json()
    //   localStorage.setItem('weatherData', JSON.stringify(d))
    //   this.renderData(d)
    // } catch (err) {
    //   console.log(err)
    // }

    // классический запрос через fetch
    // fetch(url)
    //   .then(r => r.json())
    //   .then(d => {
    //     //
    //     console.log(d)
    //     localStorage.setItem('weatherData', JSON.stringify(d))
    //     renderData(d)
    //   })
    //   .catch(e => console.log(e))
  }
  renderData(obj) {
    let markup = this.templateFunc(obj)
    this.insertContainer.insertAdjacentHTML('beforeend', markup)
  }
  showWidget() {
    console.log('show', this.isShowWidget)
    if (this.isShowWidget) {
      return
    } else {
      this.insertContainer.style.display = 'block'
      let weatherDataFromLS = JSON.parse(localStorage.getItem('weatherData'))
      console.log('weatherDataFromLS', weatherDataFromLS)
      this.renderData(weatherDataFromLS)
      this.getSearchValue()
      this.isShowWidget = true
    }
  }
  hideWidget() {
    console.log(this.isShowWidget)
    if (this.isShowWidget) {
      // удаляем слушателя
      this.formRef.removeEventListener('submit', this.handleSubmit)
      // зачищаем и скрываем контейнер
      this.insertContainer.innerHTML = ''
      this.insertContainer.style.display = 'none'
      this.isShowWidget = false
    } else {
      return
    }
  }
}
const newWeatherWidget = new WeatherWidget(BASE_URL, API_key, searchForm, `search`, template, templateContainer)
// console.log(newWeatherWidget)
newWeatherWidget.showWidget()
showBtn.addEventListener('click', newWeatherWidget.showWidget.bind(newWeatherWidget))
hideBtn.addEventListener('click', newWeatherWidget.hideWidget.bind(newWeatherWidget))
