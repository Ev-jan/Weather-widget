import { THourlyForecastFiltered } from "../../types/types"
import HourBlock from "./HourBlock/HourBlock"
import style from "./style.module.css"

type HourlyForecastProps = {
    activeWeatherType: "Forecast" | "Now",
    activeDayHours: THourlyForecastFiltered[] | null
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({activeWeatherType, activeDayHours}) => {
    return (
        <section className={style.hourly}
        style={{
          visibility: activeWeatherType === "Forecast" ? "visible" : "hidden",
          opacity: activeWeatherType === "Forecast" ? "1" : "0",
          transform: activeWeatherType === "Forecast" ? "translateY(0)" : "translateY(-10px)",
        }}
      >
        <h3 className={style.sectionHeading}>Hourly Forecast</h3>
        <div className={style.blockBox}>
          {activeDayHours && (activeDayHours.map((block, index) => (
            <div className={style.hourBlock} key={index}>
              <HourBlock {...block} />
            </div>
          )))}
        </div>
      </section>

    )
}

export default HourlyForecast