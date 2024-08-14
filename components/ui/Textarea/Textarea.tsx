'use client'
import  styled  from './Textarea.module.scss'
import { Iinput } from '@/components/types'


export const Textarea:React.FC<Iinput> = ({textChange, placeholder, error}) => {
  return (
    <>
       <textarea placeholder={placeholder} onChange={textChange} className={error ? styled.textareaError : styled.textarea }></textarea>
    {
      error && (
        <div className={styled.error}>{error}</div>
      )
    }
    </>
   
   
  );
}


