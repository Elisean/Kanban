'use client'

import styles from './Input.module.scss'
import { Iinput } from '@/components/types'

export const Input:React.FC <Iinput> = ({onChange, type, placeholder, error, id, label}) =>{
    return (
        <label className={styles.label} htmlFor={label}>
            {label}
             <input placeholder={placeholder} type={type}  id={id} className={error ? styles.inputError : styles.input} onChange={onChange}/>   

        {
            error && (
                <div className={styles.error}>{error}</div>
            )
        }

        </label>
    )
}

