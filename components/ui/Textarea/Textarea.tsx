'use client'
import  styled  from './Textarea.module.scss'
import { Iinput } from '@/components/types'


export const Textarea:React.FC<Iinput> = ({textChange, placeholder, name, error}) => {
  return (
    <>
       <textarea name={name} placeholder={placeholder} onChange={textChange} className={error ? styled.textareaError : styled.textarea }></textarea>
    {
      error && (
        <div className={styled.error}>{error}</div>
      )
    }
    </>
   
   
  );
}


