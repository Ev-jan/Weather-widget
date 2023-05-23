import style from "./style.module.css";
import { TWeatherData } from "../../../types/types";

type CurrentWeatherProps = {
  weatherData: TWeatherData
}

const CurrentWeatherCard: React.FunctionComponent<CurrentWeatherProps> = ({weatherData}) => {

  return (
    <div className={style.currentWeather}>
      <p className={`${style.dateGroup} ${style.smCardItem}`}>
        <span className={style.date}>{weatherData.formatted_dt}</span>
      </p>
      <p className={style.temperature}>{weatherData.temp}° C</p>
      <div className={style.specifics}>
        <p className={`${style.feels} ${style.smCardItem}`}>feels like {weatherData.feels_like} ° C</p>
        <p className={`${style.wind} ${style.smCardItem}`}>{weatherData.wind.speed} km/h</p>
        <p className={`${style.description} ${style.smCardItem}`}>{weatherData.weather.description}</p>
      </div>
    </div>

  )
}

export default CurrentWeatherCard