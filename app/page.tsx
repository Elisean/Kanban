"use client"

import { FormReg } from '@/components/Form-reg/FormReg';
import styles from './page.module.scss'
import { FormAuth } from '@/components/Form-auth/FormAuth';
import { observer } from 'mobx-react-lite';
import authStore from './Store/authStore';



export default observer(function Home() {
  
      return (
        <main className={styles.wrapper}>
          <div className={styles.bgImage}></div>
          <div className={styles.inner}>
            <div className={styles.container}>
                {
                  authStore.ISAUTH ? <FormAuth/> : <FormReg/>
                }
    
                {
                  authStore.ISAUTH ?  <p className={styles.prompt}> Нет аккаунта?  <span onClick={() => authStore.isAuth(false)}>Зарегистрируйтесь</span></p> : <p className={styles.prompt}>  Есть аккаунт? <span onClick={() => authStore.isAuth(true)}>Войдите</span></p>    
                } 
            </div>
          </div>
        </main>
      );
    }
) 
