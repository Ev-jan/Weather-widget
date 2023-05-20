import style from "./style.module.css";
import Header from "../Header/Header";
import WarningMessage from "../WarningMessage/WarningMessage";
import BriefInfo from "../BriefInfo/BriefInfo";
import HourlyForecast from "../HourlyForecast/HourlyForecast";
import { useEffect, useState } from "react";
import { TLocationMethod, TCoords, TCoordsFetched, TWeatherData, TCurrentFetched, TPollutionCurrentFetched, TForecastFetched, TPollutionForecastFetched, THourlyForecastFiltered, TWarning } from "../../types/types"
import { filteredForecastHours, filteredHighlightByDate, filteredHourlyForecastByDate, mergeCurrentData, mergeForecastData } from "../../utils/utils"
import HighLights from "../Highlights/Highlights";
import Spinner from "./LoadingSpinner/Spinner";

const Widget: React.FunctionComponent = () => {
  const apiKey = "d6d87207f783be07e468af85485fcc03";
  const [activeWeatherType, setActiveWeatherType] = useState<"Now" | "Forecast">("Now");
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [city, setCity] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [coords, setCoords] = useState<TCoords | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<TWarning | null>(null);
  const [locationMethod, setLocationMethod] = useState<TLocationMethod>("notInitiated")
  const [currentData, setCurrentData] = useState<TWeatherData | null>(null);
  const [forecastData, setForecastData] = useState<TWeatherData[] | null>(null);
  const [activeDayHighlight, setActiveDayHighlight] = useState<TWeatherData | null>(null);
  const [activeDayHours, setActiveDayHours] = useState<THourlyForecastFiltered[] | null>(null);
  const [totalHourlyForecast, setTotalHourlyForecast] = useState<THourlyForecastFiltered[] | null>(null);
  const [display, setDisplay] = useState(false)

  const clearCurrentData = () => {
    setCurrentData(null);
    setForecastData(null);
    setActiveDayHighlight(null);
    setActiveDayHours(null);
    setTotalHourlyForecast(null);
  }

  const handleSearch = (inputCityName: string) => {
    if (locationMethod === "notInitiated") {
      setLoading(true);
      setInputValue(inputCityName);
      setLocationMethod("searchInput");
      setWarning(null);
    } else if (locationMethod === "searchInput" && searchSuccess === false) {
      clearCurrentData();
      setInputValue(inputCityName);
      setLocationMethod("searchInput");
      setWarning({
        type: "invalidInput",
        message: "Please make sure you enter a valid city name.",
      });
    }
    else {
      setInputValue(inputCityName);
      setLocationMethod("searchInput");
      setWarning(null);
    }
  }

  const handleLocationClick = () => {
    setLoading(true)
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
        setLoading(false)
      }
    );
  };

  useEffect(() => {
    if (inputValue) {
      const fetchCoordsFromAPI = async () => {
        try {
          const fetchedCoordsStr = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=1&appid=${apiKey}`);
          const coordsObj: TCoordsFetched[] = await fetchedCoordsStr.json()
          const coords: TCoords = {
            lon: coordsObj[0].lon,
            lat: coordsObj[0].lat,
          }
          setSearchSuccess(true);
          setWarning(null);
          setCoords(coords);
        } catch (error: any) {
          console.error("error fetching data:", error);
          setWarning({
            type: "invalidInput",
            message: "Sorry, we couldn't find a matching city for your search. Please make sure you enter a valid city name.",
          });
          setSearchSuccess(false);

        } finally {
          setLoading(false)
        }
      }
      fetchCoordsFromAPI()
    }
  }, [inputValue])

  useEffect(() => {
    if (!searchSuccess) {
      setInputValue('');
      setCity('');
      clearCurrentData()
    }
  }, [searchSuccess])

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

  useEffect(() => {
    if (searchSuccess === false || loading === true || locationMethod === "notInitiated") {
      setDisplay(false)
    }
    else setDisplay(true)
  }, [searchSuccess, loading, locationMethod])

  return (

    <div className={style.outer}>
      <div className={style.restraining}>
        <Header
          loading={loading}
          onChange={handleSearch}
          onClick={handleLocationClick}
        />
        <WarningMessage warning={warning} />

        {display && <main className={style.main}>
          <BriefInfo
            city={city}
            currentData={currentData}
            forecastData={forecastData}
            locationMethod={locationMethod}
            setActiveDay={setActiveDay}
            activeWeatherType={activeWeatherType}
            setActiveWeatherType={setActiveWeatherType}
          />
          {activeDayHighlight && <HighLights {...activeDayHighlight as TWeatherData}
          />}
          <HourlyForecast
            activeWeatherType={activeWeatherType}
            activeDayHours={activeDayHours}
          />
        </main>}
        {loading && <Spinner />}
      </div>
    </div>

  )
}

export default Widget