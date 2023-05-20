import React from "react";
import WeatherDataBox from "../WeatherDataBox/WeatherDataBox";
import style from "./style.module.css"
import { TWeatherData } from "../../types/types";
import { formattedTime } from "../../utils/utils";

const HighLights: React.FunctionComponent<TWeatherData> = (weatherData) => {
    const pollutionProps = Object.entries(weatherData.pollution.components).map(([key, value]) => ({
        name: key.toString().toUpperCase(),
        value: value,
    }));

    let aqi: string = ""
    switch (weatherData.pollution.aqi) {
        case 1:
            aqi = "good";
            break
        case 2:
            aqi = "fair";
            break
        case 3:
            aqi = "moderate";
            break
        case 4:
            aqi = "poor";
            break
        case 5:
            aqi = "very poor";
            break
    }
    return (
        <section className={style.highlights}>
            <h3 className={style.sectionHeading}>Day's Highlights</h3>
            <WeatherDataBox
                heading={pollutionProps.some((item) => item.value === undefined) ? "Air quality index is unavailable for this day" : "Air quality index" }
                value={pollutionProps}
                iconClass="wi wi-strong-wind"
                aqi={aqi}
            />
            <WeatherDataBox
                heading="Sunrise & Sunset"
                value={[{ name: "sunrise", value: formattedTime(weatherData.sunrise * 1000,) }, { name: "sunset", value: formattedTime(weatherData.sunset * 1000) }]}
                iconClass="wi wi-sunrise"
            />
            <WeatherDataBox
                heading="Humidity"
                value={`${weatherData.humidity} %`}
                iconClass="wi wi-humidity"
            />
            <WeatherDataBox
                heading="Pressure"
                value={`${weatherData.pressure} hPa`}
                iconClass="wi wi-barometer"
            />
            <WeatherDataBox
                heading="Visibility"
                value={`${weatherData.visibility / 1000} km`}
                iconClass="wi wi-alien"
            />
            <WeatherDataBox
                heading="Max / Min"
                value={weatherData.temp_min === weatherData.temp_max ? `${weatherData.temp_max} °C` : `${weatherData.temp_max} / ${weatherData.temp_max} °C`}
                iconClass="wi wi-thermometer"
            />
        </section>
    )
}

export default HighLights