import {
  TCurrentFetched,
  TForecastFetched,
  THourlyForecastFiltered,
  TPollutionCurrentFetched,
  TPollutionForecastFetched,
  TWeatherData,
} from "../types/types";

export const formattedDate = (unixDate: number) => {
  const date = new Date(unixDate);
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const formattedDate = formatter.format(date);
  return formattedDate;
};

export const formattedTime = (unixDate: number) => {
  const date = new Date(unixDate);
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const formattedDate = formatter.format(date);
  return formattedDate;
};

export const mergeCurrentData = (
  current: TCurrentFetched,
  poll: TPollutionCurrentFetched
): TWeatherData => {
  return {
    unix_dt: current.dt,
    formatted_dt: formattedDate(current.dt * 1000),
    weather: {
      id: current.weather[0].id,
      main: current.weather[0].main,
      description: current.weather[0].description,
    },
    temp: Math.round(current.main.temp),
    feels_like: Math.round(current.main.feels_like),
    temp_min: Math.round(current.main.temp_min),
    temp_max: Math.round(current.main.temp_max),
    pressure: current.main.pressure,
    humidity: current.main.humidity,
    visibility: current.visibility,
    wind: { speed: current.wind.speed, deg: current.wind.deg },
    sunrise: current.sys.sunrise,
    sunset: current.sys.sunset,
    pollution: {
      aqi: poll.list[0].main.aqi,
      components: {
        co: poll.list[0].components.co,
        no2: poll.list[0].components.no2,
        o3: poll.list[0].components.o3,
        so2: poll.list[0].components.so2,
        pm2_5: poll.list[0].components.pm2_5,
      },
    },
  };
};

export function mergeForecastData(
  forecastData: TForecastFetched,
  pollutionData: TPollutionForecastFetched
): TWeatherData[] {
  const currentTime = new Date().getHours();
  const mergedForecastData: TWeatherData[] = [];

  const selectedForecast = filteredForecastByTime(forecastData, currentTime);
  const selectedPollution = filteredPollutionByTime(pollutionData, currentTime);
  if (selectedForecast && selectedPollution) {
    selectedForecast.list.forEach((forecast, index) => {
      const mergedData: TWeatherData = {
        unix_dt: forecast.dt,
        formatted_dt: formattedDate(forecast.dt * 1000),
        weather: {
          id: forecast.weather[0].id,
          main: forecast.weather[0].main,
          description: forecast.weather[0].description,
        },
        temp: Math.round(forecast.main.temp),
        feels_like: Math.round(forecast.main.feels_like),
        temp_min: Math.round(forecast.main.temp_min),
        temp_max: Math.round(forecast.main.temp_max),
        pressure: forecast.main.pressure,
        humidity: forecast.main.humidity,
        visibility: forecast.visibility,
        wind: {
          speed: forecast.wind.speed,
          deg: forecast.wind.deg,
        },
        sunrise: forecastData.city.sunrise,
        sunset: forecastData.city.sunset,
        pollution: {
          aqi: selectedPollution.list[index]?.main.aqi,
          components: {
            co: selectedPollution.list[index]?.components.co,
            no2: selectedPollution.list[index]?.components.no2,
            o3: selectedPollution.list[index]?.components.o3,
            so2: selectedPollution.list[index]?.components.so2,
            pm2_5: selectedPollution.list[index]?.components.pm2_5,
          },
        },
      };
      mergedForecastData.push(mergedData);
    });
  }
  return mergedForecastData;
}

function filteredForecastByTime(
  forecastData: TForecastFetched,
  desiredHours: number
): TForecastFetched {
  const { list, ...rest } = forecastData;

  const sortedList = list.sort((a, b) => a.dt - b.dt);

  const interval = 2;

  const filteredList = sortedList.filter((obj) => {
    const objTime = new Date(obj.dt * 1000).getHours();
    return objTime >= desiredHours && objTime <= desiredHours + interval;
  });

  return {
    list: filteredList,
    ...rest,
  };
}

function filteredPollutionByTime(
  pollutionData: TPollutionForecastFetched,
  desiredHours: number
): TPollutionForecastFetched {
  const { list, ...rest } = pollutionData;
  const sortedList = list.sort((a, b) => a.dt - b.dt);
  const interval = 0.5;
  const filteredList = sortedList.filter((obj) => {
    const objTime = new Date(obj.dt * 1000).getHours();
    return objTime >= desiredHours && objTime <= desiredHours + interval;
  });
  return {
    list: filteredList,
    ...rest,
  };
}

export const filteredForecastHours = (forecastData: TForecastFetched) => {
  const { list } = forecastData;
  const filteredList = list.map(
    ({ dt, main: { temp }, weather: [{ id }], wind: { speed, deg } }) => ({
      dt: dt,
      temp: Math.round(temp),
      weatherId: id,
      wind: {
        speed: speed,
        deg: deg,
      },
    })
  );
  return filteredList;
};

export const filteredHourlyForecastByDate = (
  fullHourlyData: THourlyForecastFiltered[],
  activeDateUnix: number
): THourlyForecastFiltered[] => {
  const date = new Date(activeDateUnix * 1000).getDate();
  return fullHourlyData.filter((obj) => {
    const objDate = new Date(obj.dt * 1000).getDate();
    return objDate === date;
  }, [] as THourlyForecastFiltered[]);
};

export const filteredHighlightByDate = (
  totalCurrentAndForecast: TWeatherData[],
  activeDateUnix: number
): TWeatherData => {
  const date = new Date(activeDateUnix * 1000).getDate();
  const activeDayHighlight = totalCurrentAndForecast.filter((obj) => {
    const objDate = new Date(obj.unix_dt * 1000).getDate();
    return objDate === date;
  });
  return activeDayHighlight[0]
};