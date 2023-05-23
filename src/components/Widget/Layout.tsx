import style from "./style.module.css";
import Header from "../Header/Header";
import WarningMessage from "../WarningMessage/WarningMessage";
import BriefInfo from "../BriefInfo/BriefInfo";
import HourlyForecast from "../HourlyForecast/HourlyForecast";
import { TLocationMethod, TWeatherData, THourlyForecastFiltered, TWarning } from "../../types/types"
import HighLights from "../Highlights/Highlights";
import Spinner from "./LoadingSpinner/Spinner";
import { Dispatch, SetStateAction } from "react";

type LayoutProps = {
  loading: boolean;
  handleSearch: (searchTerm: string) => void;
  handleLocationClick: () => void;
  warning: TWarning | null;
  display: boolean;
  city: string;
  currentData: TWeatherData | null;
  forecastData: TWeatherData[] | null;
  locationMethod: TLocationMethod;
  setActiveDay: (day: number) => void;
  activeWeatherType: "Now" | "Forecast";
  setActiveWeatherType: Dispatch<SetStateAction<"Now" | "Forecast">>;
  activeDayHighlight: TWeatherData | null;
  activeDayHours: THourlyForecastFiltered[] | null;
}

const Layout: React.FC<LayoutProps> = ({
  loading,
  handleSearch,
  handleLocationClick,
  warning,
  display,
  city,
  currentData,
  forecastData,
  locationMethod,
  setActiveDay,
  activeWeatherType,
  setActiveWeatherType,
  activeDayHighlight,
  activeDayHours
}) => {

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

export default Layout