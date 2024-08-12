import { ReactNode } from "react"
import { ComponentTypes } from "../types"

export const Footer:React.FC<ComponentTypes> = ({children}) =>{
    return (
        <footer>
            <h1>{children}</h1>
        </footer>
    )
}