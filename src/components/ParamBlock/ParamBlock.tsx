import style from "./style.module.css"


export type ParamBlockProps = {
    name: string | number | undefined,
    value: string | number | undefined,
  }  
  
export const ParamBlock: React.FunctionComponent<ParamBlockProps> = ({ name, value }) => {
    return (
      <div className={style.parameterBlock}>
        <div className={style.parameter}>{name}</div>
        <div className={style.value}>{value}</div>
      </div>
    )
  }
  
  
  
  