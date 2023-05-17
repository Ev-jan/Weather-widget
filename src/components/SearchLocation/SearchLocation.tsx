import { useState } from "react";
import style from "./style.module.css"

type SearchLocationProps = {
  onChange: (cityName: string) => void,
  loading: boolean
}

const SearchLocation: React.FunctionComponent<SearchLocationProps> = ({ onChange, loading }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange(inputValue);
    setInputValue('');
  }

  return (
    <form className={style.searchInputContainer} onSubmit={onSubmit}>
      <input
        className={style.searchInput}
        type="text"
        placeholder="Search city"
        id="searchInput"
        name="cityName"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      ></input>
      <button
        className={style.searchBtn}
        type="submit"
        aria-label="Search"
        disabled={loading || inputValue.trim() === ''}
      ><svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.1507 16.5497L23 21.3979L21.3979 23L16.5497 18.1507C14.7458 19.5968 12.502 20.3833 10.19 20.38C4.56513 20.38 0 15.8149 0 10.19C0 4.56513 4.56513 0 10.19 0C15.8149 0 20.38 4.56513 20.38 10.19C20.3833 12.502 19.5968 14.7458 18.1507 16.5497ZM15.8794 15.7096C17.3164 14.2319 18.1188 12.2512 18.1156 10.19C18.1156 5.81171 14.5683 2.26445 10.19 2.26445C5.81171 2.26445 2.26445 5.81171 2.26445 10.19C2.26445 14.5683 5.81171 18.1156 10.19 18.1156C12.2512 18.1188 14.2319 17.3164 15.7096 15.8794L15.8794 15.7096Z" fill="#FAF0E6" />
      </svg>
      </button>
    </form>
  )
}


export default SearchLocation