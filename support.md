{ import { useRouter } from "next/navigation"

  push('pages/dashboard'); } - Данная функция для того когда пользователь зарегистрировался, сразу перенести его на нужую страницу



  

import axios, { AxiosError } from 'axios';
import { useRouter } from "next/navigation"

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
      event.preventDefault();
  
      const payload = {
        username: event.currentTarget.userName.value,
        email: event.currentTarget.userEmail.value,
        password: event.currentTarget.userPassword.value,
      };
     
  
      try {
        const {data} = await axios.post("/api/auth/login", payload);
  
        alert(JSON.stringify(data));
  
        push('pages/dashboard');
  
  
      } catch (e) {
          const error = e as AxiosError;
        console.log(payload)
          alert(error.message);
      } 
    };