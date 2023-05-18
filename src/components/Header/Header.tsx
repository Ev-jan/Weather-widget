import SearchLocation from "../SearchLocation/SearchLocation";
import style from "./style.module.css"

type HeaderProps = {
    loading: boolean;
    onClick: () => void;
    onChange: (cityName: string) => void;
}

const Header: React.FC<HeaderProps> = ({ loading, onClick, onChange }) => {

    return (
        <header className={style.header}>
            <div className={style.logo}>AtmoVue</div>
            <button
                className={style.currentLocBtn}
                aria-label="Get weather for current location"
                onClick={onClick}
                disabled={loading}
            >
                Get weather for your current location
            </button>
            <SearchLocation
                onChange={onChange}
                loading={loading} />
        </header>
    )
}

export default Header