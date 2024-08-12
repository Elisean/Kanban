"use client"

import { FormReg } from '@/components/Form-reg/FormReg';
import styles from './page.module.scss'
import { FormAuth } from '@/components/Form-auth/FormAuth';
import { useState } from 'react';


export default function Home() {
  
 const [isForm, setIsForm] = useState(false)

  return (
    <main className={styles.wrapper}>
      <div className={styles.bgImage}></div>
      <div className={styles.inner}>
        <div className={styles.container}>
            {
              isForm ? <FormAuth/> : <FormReg/>
            }

            {
              isForm ?  <p className={styles.prompt}> Нет аккаунта?  <span onClick={() => setIsForm(!isForm)}>Зарегистрируйтесь</span></p> : <p className={styles.prompt}>  Есть аккаунт? <span onClick={() => setIsForm(!isForm)}>Войдите</span></p>    
            } 
        </div>
      </div>
    </main>
  );
}
