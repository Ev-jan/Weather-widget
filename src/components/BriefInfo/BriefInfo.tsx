import { TLocationMethod, TWeatherData } from "../../types/types"
import style from "./style.module.css"
import ForecastCard from "../ForecastCard/ForecastCard";
import CurrentWeatherCard from "../CurrentWeatherCard/CurrenWeatherCard";

type BriefInfoProps = {
    locationMethod: TLocationMethod,
    city: string,
    currentData: TWeatherData | null,
    forecastData: TWeatherData[] | null,
    setActiveDay: (day: number) => void,
    activeWeatherType: "Now" | "Forecast",
    setActiveWeatherType: (weatherType: "Now" | "Forecast") => void,
}

const BriefInfo: React.FC<BriefInfoProps> = ({ locationMethod, city, currentData, forecastData, setActiveDay, setActiveWeatherType, activeWeatherType }) => {

    return (
        <section className={style.briefInfo}>
            <div className={style.cityWrapper}>
                <h1 className={style.cityName}>{city}</h1>
                <p
                    className={style.cityNameSource}
                    style={{
                        visibility: locationMethod === "auto" ? "visible" : "hidden",
                        opacity: locationMethod === "auto" ? "1" : "0",
                        transform: locationMethod === "auto" ? "translateY(0)" : "translateY(-10px)",
                    }}
                >Based on your current location</p>
                <p
                    className={style.cityNameSource}
                    style={{
                        visibility: locationMethod === "searchInput" ? "visible" : "hidden",
                        opacity: locationMethod === "searchInput" ? "1" : "0",
                        transform: locationMethod === "searchInput" ? "translateY(0)" : "translateY(-10px)",
                    }}
                >Based on your search</p>
            </div>
            <div className={style.accordion}>
                <div className={style.panel}>
                    <h2 className={activeWeatherType === "Now" ? `${style.activeHeading}` : `${style.panelTitle}`}
                        id="heading-now"
                    >
                        <button
                            className={style.accordionTrigger}
                            aria-controls={style.content}
                            aria-expanded={activeWeatherType === "Now" ? "true" : "false"}
                            onClick={() => {
                                setActiveWeatherType("Now");
                                currentData && setActiveDay(currentData.unix_dt);
                            }
                            }
                        >
                            Now
                        </button>
                    </h2>
                    <h2 className={activeWeatherType === "Forecast" ? `${style.activeHeading}` : `${style.panelTitle}`}
                        id="heading-forecast"
                    >
                        <button
                            className={style.accordionTrigger}
                            aria-controls={style.content}
                            aria-expanded={activeWeatherType === "Forecast" ? "true" : "false"}
                            onClick={() => {
                                setActiveWeatherType("Forecast");
                                forecastData && setActiveDay(forecastData[0].unix_dt);
                            }}
                        >
                            5-day forecast
                        </button>
                    </h2>
                    <div className={style.content}
                        id="content-now"
                        aria-labelledby="heading-now"
                        role="region"
                        style={{
                            display: activeWeatherType === "Now" ? "block" : "none",
                        }}
                    >
                        <div className={style.CurrentWeatherCard}>
                            {currentData && (<CurrentWeatherCard
                                weatherData={currentData}
                            />)}
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.panel}>
                <div className={style.content}
                    id="content-forecast"
                    aria-labelledby="heading-forecast"
                    role="region"
                    style={{ display: activeWeatherType === "Forecast" ? "block" : "none" }}
                > {forecastData && <ForecastCard
                    forecast={forecastData}
                    setActiveDay={setActiveDay}
                />}
                </div>
            </div>
        </section>
    )
}

export default BriefInfo