'use client'
import  styles  from './Textarea.module.scss'
import { Iinput } from '@/components/types'


export const Textarea:React.FC<Iinput> = ({textChange, placeholder, error, label}) => {
  return (
    <label className={styles.label}>
      {label}
       <textarea placeholder={placeholder} onChange={textChange} className={error ? styles.textareaError : styles.textarea}></textarea>
    {
      error && (
        <div className={styles.error}>{error}</div>
      )
    }
    </label>
   
   
  );
}


