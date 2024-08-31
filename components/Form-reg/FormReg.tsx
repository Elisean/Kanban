'use client'
import React, { FC, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import styles from './FormReg.module.scss'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signOut, updateProfile} from 'firebase/auth'
import { IUserData } from '../types';
import { app } from '@/app/configs/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import authStore from '@/app/Store/authStore';



export const FormReg:FC = observer(() => {

  const [userData, setUserData] = useState<IUserData>({
    userName: '',
    userEmail: '',
    userPassword: ''

} as IUserData)


  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const auth = getAuth(app);

  const router = useRouter();

  const pathName = usePathname()


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userData.userPassword) {
      alert('Password is required');
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        userData.userEmail,
        userData.userPassword,
      );

      await updateProfile(res.user, {
        displayName: userData.userName
      });
      await signOut(auth);

    } catch (error) {
      console.log(error);
    }

    onAuthStateChanged(auth, () => {
      if(auth){
        alert('User registered successfully');
      }
      authStore.isAuth(true);
    });

    setUserData({
      userName: '',
      userEmail: '',
      userPassword: ''
  })
};

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user && registrationSuccess) {
      alert('User registered successfully');
      authStore.isAuth(true);
      setRegistrationSuccess(false); // Сбросить флаг после отображения сообщения
    }
  });

  return () => unsubscribe(); // Отписаться от onAuthStateChanged при размонтировании компонента
}, [auth, registrationSuccess]);

  
  return (
    <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <Input type='text' id='name' placeholder='Your full name' label='Name' value={userData.userName ?? ''} onChange={event => setUserData({...userData, userName:event.target.value})} />
                </div>
                <div className='inner-form'>
                    <Input type='email' id='email' placeholder='Your email address' label='Email' value={userData.userEmail} onChange={event => setUserData({...userData, userEmail:event.target.value})} />
                </div>
                <div className='inner-form'>
                    <Input type='password' id='password'  placeholder='Your password' label='Password' value={userData.userPassword} onChange={event => setUserData({...userData, userPassword:event.target.value})} />
                </div>    
                    <Button type='submit'>sign up</Button>
            </form>
    </>
       
  )
})



