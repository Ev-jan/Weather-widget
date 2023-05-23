import style from "./style.module.css"
import { ParamBlock } from "../Highlights/ParamBlock/ParamBlock"


type WeatherDataBoxProps = {
    heading: string;
    value: string | { [key: string]: number | undefined | string }[];
    iconClass: string;
    aqi?: string
  };

const WeatherDataBox: React.FunctionComponent<WeatherDataBoxProps> = ({ heading, value, iconClass, aqi }) => {
    let color = "transparent"
    switch(aqi) {
        case "good":
            color = "#8BC34A";
            break
        case "fair":
            color = "#FFEB3B";
            break
        case "moderate":
            color = "#FF9800";
            break
        case "poor":
            color = "#F44336";
            break
        case "very poor":
            color = "#B71C1C";
            break
    }
    return (
        <div className={style.weatherDataBox} style={style}>
            <div className={style.top}>
                <h4 className={style.heading}>{heading}</h4>
                {aqi && (<div 
                className={style.aqi}
                style={{
                    backgroundColor: `${color}`,
                }}
                >{aqi}</div>)}
            </div>
            <div className={style.bottom}>
                <div className={style.iconWrapper}>
                    <i className={`${iconClass} ${style.icon}`}></i>
                </div>
                {typeof value !== "string" ? (
                    <>
                        {value.map((block) => (
                            <ParamBlock name={block.name} value={block.value} key={block.name} />
                        ))}
                    </>
                ) : (<div className={style.value}>
                    {value}
                </div>)}
            </div>
        </div>
    )
}

export default WeatherDataBox