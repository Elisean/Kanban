'use client'
import { useEffect, useState } from 'react';
import styles from './profile.module.scss';
import Image from 'next/image'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/app/configs/firebase';
import { uploadUserImage, getUserImageURL } from '../../configs/uploadImageFireBase'; 
import { checkUserAuthentication } from '@/app/providers/authProvider';

function Userpage(){
    const [user, setUser] = useState<any>(null)
    const [imageUrl, setImageUrl] = useState('');
    const auth = getAuth(app);


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          setUser(
            auth ? {
              id: user?.uid, 
              name: user?.displayName  
            } : null
          )
        });

        return () => unsubscribeAuth();
      }, [auth]);
    
      
      const handleFileChange = async (event:any) => {
        const file = event.target.files[0];
        if (file) {
          const url = await uploadUserImage(file);
          setImageUrl(url);
          window.location.reload();
        }
      };
  
  
      useEffect(() => {
        const fetchImage = async (user:any) => {
          if (user) {
            const url = await getUserImageURL(user.uid);
            if (url) {
              setImageUrl(url);
            }
          }
        };
    
        checkUserAuthentication(setUser);
        fetchImage(auth.currentUser);
      }, [user]);


     
 
    return (
        <section className={styles.userPage}>
            <p>Profile</p>

            <div className={styles.userWraper}>
                <div className={styles.userAvatar}>

                  <label htmlFor="file" className={styles.imageWrapper}>
                    <input type="file" id='file' className={styles.inputFile} onChange={handleFileChange} />
                    {imageUrl ?  <Image src={imageUrl} alt='avatar' width={140} height={140}/> : <Image src="/static/first-user-avatar.png" alt='avatar' width={140} height={140}/> } 
                  </label>
               

                </div>
                <h2 className={styles.userName}>
                    {user ? <p>{user.displayName}</p> : <p>Loading...</p>}
                </h2>
                <div className={styles.userInner}>
                    <div className={styles.userHistory}>
                        <h4 className={styles.historyTitle}>History of completed tasks</h4>
                        <p className={styles.historyCount}>0</p>
                    </div>
                    <div className={styles.userLine}></div>
                    <div className={styles.userHistory}>
                        <h4 className={styles.historyTitle}>History of completed tasks</h4>
                        <p className={styles.historyCount}>0</p>  
                    </div>
                </div>                
            </div>
            <div className={styles.userData}>
                 
            </div>
           

        </section>
    )
}

export default Userpage

// userImage ?   <Image src="/static/first-user-avatar.png" alt='avatar' width={140} height={140}/> : <Image src={userImage} alt='avatar' width={140} height={140}/>


// : <Image src="/static/first-user-avatar.png" alt='avatar' width={140} height={140}/>