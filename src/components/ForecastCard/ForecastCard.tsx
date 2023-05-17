import React, { useState } from "react"
import ForecastItem from "./ForecastItem/ForecastItem"
import style from "./style.module.css"
import { TWeatherData } from "./../../types/types"

type ForecastCardProps = {
    forecast: TWeatherData[],
    setActiveDay: (day: number) => void
}

const ForecastCard: React.FunctionComponent<ForecastCardProps> = ({ forecast, setActiveDay }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (index: number, activeDay: number) => {
        setActiveIndex(index);
        setActiveDay(activeDay)
      };

    return (
        <div className={style.forecastCard}>
        {forecast.map((dayWeather: TWeatherData, index: number) => (
          <ForecastItem
            key={dayWeather.unix_dt}
            index={index}
            forecastDayData={dayWeather}
            isActive={index === activeIndex}
            onClick={handleClick}
          />
        ))}
      </div>
    )
}

export default ForecastCard