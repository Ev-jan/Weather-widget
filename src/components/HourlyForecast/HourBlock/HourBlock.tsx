import { THourlyForecastFiltered } from '../../../types/types'
import { formattedTime } from '../../../utils/utils'
import style from './style.module.css'


const HourBlock: React.FunctionComponent<THourlyForecastFiltered> = (props) => {
    const fTime = formattedTime(props.dt * 1000)
    return (
        <>  
        <div className={style.time}>{fTime}</div>
            <div className={style.hourBlockSection}>
                <i
                    className={`wi wi-owm-${props.weatherId} ${style.icon}`}></i>
                <div className={style.temp}>{props.temp}°C</div>
            </div>
            <div className={style.hourBlockSection}>
                <i
                    className={`wi wi-wind towards-${props.wind.deg}-deg ${style.icon}`}></i>
                <div className={style.speed}>{props.wind.speed} km/h</div>
            </div>
        </>
    )
}

export default HourBlock