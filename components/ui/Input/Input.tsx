'use client'

import styles from './Input.module.scss'
import { Iinput } from '@/components/types'

export const Input:React.FC <Iinput> = ({onChange, type, placeholder, error, id, label, value}) =>{
    return (
        <label className={styles.label} htmlFor={label}>
            {label}
             <input placeholder={placeholder} type={type} value={value} id={id} className={error ? styles.inputError : styles.input} onChange={onChange}/>   

        {
            error && (
                <div className={styles.error}>{error}</div>
            )
        }

        </label>
    )
}