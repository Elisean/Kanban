import { ComponentTypes } from "../types"
import styles from './Aside.module.scss'

export const Aside:React.FC<ComponentTypes> = ({ children }) =>{
    return (
        <aside className={styles.aside__wrapper}>
           {children}
        </aside>
    )
}