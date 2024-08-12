'use client'
import { ReactNode } from 'react'
import styles from './Button.module.scss'

interface IButton {
    children: ReactNode | string;
    onClick?:() => void;
    style?:any
    type?: 'button' | 'submit';
    id?: string
}

export const Button:React.FC <IButton> = ({onClick, children, style, type, id}) =>{
    return (
        <button className={styles.button} id={id} onClick={onClick} style={style} type={type}>
           {children}
        </button>
    )
}