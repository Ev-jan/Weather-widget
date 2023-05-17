import React, { useCallback } from "react";
import style from "./style.module.css";
import CurrentWeatherCard from "../CurrentWeatherCard/CurrenWeatherCard"
import SearchLocation from "../SearchLocation/SearchLocation"
import ForecastCard from "../ForecastCard/ForecastCard"
import HourBlock from "../HourBlock/HourBlock";
import { useEffect, useState } from "react";
import { TCoords, TCoordsFetched, TWeatherData, TCurrentFetched, TPollutionCurrentFetched, TForecastFetched, TPollutionForecastFetched, THourlyForecastFiltered, TWarning } from "../../types/types"
import { filteredForecastHours, filteredHighlightByDate, filteredHourlyForecastByDate, mergeCurrentData, mergeForecastData } from "../../utils/utils"
import HighLights from "../Highlights/Highlights";


export const Widget: React.FunctionComponent = () => {
  const apiKey = "d6d87207f783be07e468af85485fcc03";
  const [expandedPanel, setExpandedPanel] = useState("Now");
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [city, setCity] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [coords, setCoords] = useState<TCoords | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<TWarning | null>(null);
  const [locationMethod, setLocationMethod] = useState<"searchInput" | "auto" | "notInitiated">("notInitiated")
  const [currentData, setCurrentData] = useState<TWeatherData | null>(null);
  const [forecastData, setForecastData] = useState<TWeatherData[] | null>(null);
  const [activeDayHighlight, setActiveDayHighlight] = useState<TWeatherData | null>(null);
  const [activeDayHours, setActiveDayHours] = useState<THourlyForecastFiltered[] | null>(null);
  const [totalHourlyForecast, setTotalHourlyForecast] = useState<THourlyForecastFiltered[] | null>(null);

  const handleSetActiveDay = useCallback((day: number) => {
    setActiveDay(day);
  }, []);


  const handleLocationClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lon: position.coords.longitude,
          lat: position.coords.latitude,
        });
        setLocationMethod("auto");
        setSearchSuccess(true);
        setWarning(null)
      },
      (error) => {
        setWarning({
          type: "geolocationDenied",
          message: "You have denied geolocation access. Please manually enter your location.",
        });
        setSearchSuccess(false)
        console.error(error);
      }
    );
  };

  const handleSearch = (cityName: string) => {
    if (cityName.trim() !== '') {
      setInputValue(cityName);
      setLocationMethod("searchInput");
      setWarning(null)
    } else setWarning({
      type: "invalidInput",
      message: "Please make sure you enter a valid city name.",
    });

  }

  useEffect(() => {
    if (inputValue) {
      const fetchCoordsFromAPI = async () => {
        setLoading(true);
        try {
          const fetchedCoordsStr = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=1&appid=${apiKey}`);
          const coordsObj: TCoordsFetched[] = await fetchedCoordsStr.json()
          const coords: TCoords = {
            lon: coordsObj[0].lon,
            lat: coordsObj[0].lat,
          }
          setSearchSuccess(true)
          setCoords(coords);
          setCity(coordsObj[0].name);

        } catch (error: any) {
          console.error("error fetching data:", error);
          setWarning({
            type: "invalidInput",
            message: "Sorry, we couldn't find a matching city for your search. Please make sure you enter a valid city name.",
          });
          setSearchSuccess(false);
        } finally {
          setLoading(false);
        }
      }
      fetchCoordsFromAPI()
    }
  }, [inputValue])


  useEffect(() => {
    if (searchSuccess && coords) {
      const { lon, lat } = coords;
      const fetchData = async () => {
        setLoading(true);

        try {
          const [weatherResponse, airPollutionResponse, forecastResponse, pollForecastResponse] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
          ]);

          try {

            const current: TCurrentFetched = await weatherResponse.json();
            const poll: TPollutionCurrentFetched = await airPollutionResponse.json();
            const forecast: TForecastFetched = await forecastResponse.json();
            const pollForecast: TPollutionForecastFetched = await pollForecastResponse.json();

            setCity(current.name);
            setActiveDay(current.dt)
            const curWeatherData = mergeCurrentData(current, poll)
            setCurrentData(curWeatherData);
            const forecastData = mergeForecastData(forecast, pollForecast);
            setForecastData(forecastData)
            const filteredHourlyForecast = filteredForecastHours(forecast);
            setTotalHourlyForecast(filteredHourlyForecast)
          } catch (error) {
            console.error('Error parsing JSON:', error);
            setWarning({
              type: "incompleteData",
              message: "Sorry, we encountered a temporary issue and couldn't retrieve the complete data. Please try again later.",
            });
          }

        } catch (error) {
          console.error("error fetching data:", error);
          setWarning({
            type: "incompleteData",
            message: "Sorry, we encountered a temporary issue and couldn't retrieve the complete data. Please try again later.",
          });
        } finally {
          setLoading(false);
        }
      }
      fetchData();
      
    }

  }, [coords, searchSuccess]);

  useEffect(() => {
    if (activeDay) {
      if (totalHourlyForecast) {
        const isHoursShown = filteredHourlyForecastByDate(totalHourlyForecast, activeDay);
        setActiveDayHours(isHoursShown)
      }
      if (currentData && forecastData) {
        setActiveDayHighlight(filteredHighlightByDate([currentData, ...forecastData], activeDay));
      }
    }
  }, [activeDay, totalHourlyForecast, currentData, forecastData]);

  return (
    <div className={style.outer}>
      <div className={style.restraining}>
        <header className={style.header}>
          <div className={style.logo}>AtmoVue</div>
          <button
            className={style.currentLocBtn}
            aria-label="Get weather for current location"
            onClick={handleLocationClick}
            disabled={loading}
          >Get weather for your current location</button>
          <SearchLocation
            onChange={handleSearch}
            loading={loading} />
        </header>
        {<div 
        className={style.warningMessage}
        style={{
          visibility: warning  !== null ? "visible" : "hidden",
          opacity: warning  !== null ? "1" : "0",
          transform: warning  !== null ? "translateY(0)" : "translateY(-10px)",
        }}
        >{warning?.message}</div>}
        {warning  === null && locationMethod !== "notInitiated" && <main className={style.main}>
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
                <h2 className={expandedPanel === "Now" ? `${style.activeHeading}` : `${style.panelTitle}`}
                  id="heading-now"
                >
                  <button
                    className={style.accordionTrigger}
                    aria-controls={style.content}
                    aria-expanded={expandedPanel === "Now" ? "true" : "false"}
                    onClick={() => {
                      setExpandedPanel("Now");
                      currentData && setActiveDay(currentData.unix_dt);
                    }
                    }
                  >
                    Now
                  </button>
                </h2>
                <h2 className={expandedPanel === "Forecast" ? `${style.activeHeading}` : `${style.panelTitle}`}
                  id="heading-forecast"
                >
                  <button
                    className={style.accordionTrigger}
                    aria-controls={style.content}
                    aria-expanded={expandedPanel === "Forecast" ? "true" : "false"}
                    onClick={() => {
                      setExpandedPanel("Forecast");
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
                    display: expandedPanel === "Now" ? "block" : "none",
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
                style={{ display: expandedPanel === "Forecast" ? "block" : "none" }}
              > {forecastData && <ForecastCard
                forecast={forecastData}
                setActiveDay={handleSetActiveDay}
              />}
              </div>
            </div>
          </section>
          <section className={style.highlightContainer}>
            {activeDayHighlight && (<HighLights
            {...activeDayHighlight as TWeatherData}
          />)}
          </section>
          <section className={style.hourly}
            style={{
              visibility: expandedPanel === "Forecast" ? "visible" : "hidden",
              opacity: expandedPanel === "Forecast" ? "1" : "0",
              transform: expandedPanel === "Forecast" ? "translateY(0)" : "translateY(-10px)",
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
        </main>}
      </div>
    </div>
  )
}

