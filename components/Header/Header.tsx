import { ComponentTypes } from "../types"
import styles from './Header.module.scss'


export const Header:React.FC<ComponentTypes> = ({ children }) =>{
    return (
        <header className={styles.header}>
            {children}
        </header>
    )
}