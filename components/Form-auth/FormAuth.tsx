import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import styles from './FormAuth.module.scss'
import { IUserData } from '../types';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/navigation"
import { app } from '@/app/configs/firebase';




export const FormAuth = () => {
  const [userData, setUserData] = useState<IUserData>({
    userEmail: '',
    userPassword: ''
} as IUserData)


const auth = getAuth(app);

const router = useRouter();

  const handleAuth =  async (event: React.FormEvent<HTMLFormElement>) =>{
      event.preventDefault();
        try {
         await signInWithEmailAndPassword(
              auth,
              userData.userEmail, 
              userData.userPassword,
            )


        } catch (error:any) {
            console.log(error.message)
        }
        
        setUserData({
            userEmail: '',
            userPassword: ''
        })
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push('pages/kanban'); 
    } else {
      console.log('No user is signed in');
    }
  });



  return (
      <form onSubmit={handleAuth} className={styles.form}>
          <div>
              <Input type='email' id='email' placeholder='Your email address' label='Email' value={userData.userEmail} onChange={event => setUserData({...userData, userEmail:event.target.value})}/>
          </div>
          <div className='inner-form'>
              <Input type='password' id='password'  placeholder='Your password' label='Password' value={userData.userPassword} onChange={event => setUserData({...userData, userPassword:event.target.value})}/>
          </div>    
            <Button type='submit'>Sign In</Button>
      </form>
  )
}


