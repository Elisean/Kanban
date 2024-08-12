import { ComponentTypes } from "../types"
import styled from './Header.module.scss'


export const Header:React.FC<ComponentTypes> = ({ children }) =>{
    return (
        <header className={styled.header}>
            {children}
        </header>
    )
}