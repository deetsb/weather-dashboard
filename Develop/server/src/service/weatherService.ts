import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  state: string;
}

// TODO: Define a class for the Weather object
class Weather {
  tempF: number;
  humidity: number;
  windSpeed: number;
  date: string;
  icon: string;
  iconDescription: string;
  city: string;
  constructor(
    tempF: number,
    humidity: number,
    windSpeed: number,
    date: string,
    icon: string,
    iconDescription: string,
    city: string) {
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.city = city;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
    constructor() {
      this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
      this.apiKey = '';
    }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(cityName: string) {
    const url = this.buildGeocodeQuery(cityName)
    const response = await fetch(url)
    return response.json()
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      name: locationData.name,
      latitude: locationData.coord.lat,
      longitude: locationData.coord.lon,
      country: locationData.sys.country,
      state: locationData.state || ''
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(cityName: string) {
    return `${this.baseURL}/data/2.5/weather?q=${cityName}&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(cityName: string) {
    const locationData = await this.fetchLocationData(cityName);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      return response.json();
    } catch(e: any) {
      throw new Error(e.message)
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const weatherData = response.list[0]
    const cityName = response.city.name
    const currentWeather = new Weather(
      weatherData.main.temp,
      weatherData.main.humidity,
      weatherData.wind.speed,
      weatherData.dt_txt.split(' ')[0],
      weatherData.weather[0].icon,
      weatherData.weather[0].description,
      cityName
    )
    return currentWeather
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[], name: string): Weather[] { 
    const forecast: { [key: string]: Weather } = {}
    weatherData.forEach((date) => {
      const day = new Date(date.dt * 1000).toISOString().split('T')[0];
      if (!forecast[day] && Object.keys(forecast).length < 5) {
        forecast[date] = new Weather(
          date.main.temp,
          date.main.humidity,
          date.wind.speed,
          date.dt_txt.split(' ')[0],
          date.weather[0].icon,
          date.weather[0].description,
          name,
        );
      }
    });
    return Object.values(forecast);
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(weatherData.list, weatherData.city.name);

    return [
      currentWeather,
      ...forecastArray
    ]
  }
}

export default new WeatherService();
