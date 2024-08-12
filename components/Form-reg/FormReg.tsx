'use client'
import React, { FC, useState } from 'react'
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import styled from './FormReg.module.scss'
import { createUserWithEmailAndPassword, updateProfile, getAuth} from 'firebase/auth'
import { app } from '@/app/layout';
import { IUserData } from '../types';



export const FormReg:FC = () => {


  
  const [userData, setUserData] = useState<IUserData>({
    userName: '',
    userEmail: '',
    userPassword: ''

} as IUserData)

  const auth = getAuth(app);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        userData.userEmail,
        userData.userPassword
      );
    } catch (error) {
      console.log(error);
    }



    setUserData({
      userName: '',
      userEmail: '',
      userPassword: ''
  })

  };

    
    
  return (
    <>
            <form onSubmit={handleSubmit} className={styled.form}>
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
}



