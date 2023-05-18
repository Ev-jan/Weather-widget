import { TWarning } from "../../types/types";
import style from "./style.module.css"

type WarningMessageProps = {
    warning: TWarning | null;
}

const WarningMessage:React.FC<WarningMessageProps> = ({warning}) => {

    return (
        <div 
        className={style.warningMessage}
        style={{
          visibility: warning  !== null ? "visible" : "hidden",
          opacity: warning  !== null ? "1" : "0",
          transform: warning  !== null ? "translateY(0)" : "translateY(-10px)",
        }}
        >{warning?.message}</div>
    )
}

export default WarningMessage