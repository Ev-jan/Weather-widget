import style from "./style.module.css"
import { TWeatherData } from "../../../types/types"

type ForecastItemProps = {
    index: number,
    forecastDayData: TWeatherData,
    isActive: boolean,
    onClick: (index: number, activeDay: number) => void

}


const ForecastItem: React.FunctionComponent<ForecastItemProps> = ({ index, forecastDayData, isActive, onClick }) => {

    const handleClick = () => {
        onClick(index, forecastDayData.unix_dt);
      };
    return (
        <div 
        onClick={handleClick}
        className={isActive ? `${style.active}` : `${style.container}`}>
            <div className={style.iconBlock}>
                <i
                    className={`wi wi-owm-${forecastDayData.weather.id} ${style.icon}`}></i>
            </div>
            <div className={style.descriptBlock}>
                <div className={style.date}>{forecastDayData.formatted_dt}</div>
                <div className={style.description}>{forecastDayData.weather.description}</div>
            </div>
            <div className={style.tempBlock}>
                <div 
                className={style.tempDay}
                >{Math.round(forecastDayData.temp)}</div>
                {forecastDayData.temp_max === forecastDayData.temp_min ? null : <div className={style.tempNight}>{forecastDayData.temp_min} °</div>}

            </div>
        </div>
    )
}

export default ForecastItem