'use client'
import { ChangeEvent, useEffect, useState } from 'react';
import styles from './profile.module.scss';
import Image from 'next/image'
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth';
import { app } from '@/app/configs/firebase';
import { uploadUserImage, getUserImageURL } from '../../configs/uploadImageFireBase'; 
import { checkUserAuthentication } from '@/app/providers/authProvider';
import { Input } from '@/components/ui/Input/Input';
import CheckIcon from '@/public/static/check.svg'
import { EmailAuthProvider } from 'firebase/auth/web-extension';


function Userpage() {
  const [user, setUser] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState('');
  const auth = getAuth(app);

  const [replaceName, setReplaceName] = useState('');
  const [replacePassword, setReplacePassword] = useState('');
  const [isOpenCurrentPassword, setIsOpenCurrentPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('');


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

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = await uploadUserImage(file);
      setImageUrl(url);
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchImage = async (user: any) => {
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

  const changeName = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: replaceName
        });
        setUser({
          id: auth.currentUser.uid,
          name: replaceName
        });
        window.location.reload();
      } catch (error) {
        console.error('Error updating display name:', error);
      }
    }
  };

  const changePassword = async () => {
    if (auth.currentUser && auth.currentUser.email) {
      try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, replacePassword);
        alert('Password updated successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Error updating password:', error);
        alert('Failed to update password. Please try again.');
      }
    } else {
      console.error('User email is null');
      alert('User email is not available. Please try again.');
    }
  };

  return (
    <section className={styles.userPage}>
      <p>Profile</p>
      <div className={styles.userWraper}>
        <div className={styles.userAvatar}>
          <label htmlFor="file" className={styles.imageWrapper}>
            <input type="file" id='file' className={styles.inputFile} onChange={handleFileChange} />
            {imageUrl ? <Image src={imageUrl} alt='avatar' width={140} height={140} /> : <Image src="/static/first-user-avatar.png" alt='avatar' width={140} height={140} />}
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
        <div className={styles.replaceWrapper}>
          <label htmlFor="replace-name" className={styles.replaceName}>
            <Input type='text' placeholder='name...' label='Replace-name' value={replaceName} onChange={event => setReplaceName(event.target.value)} />
            {
              replaceName && (
                <div className={styles.checkButton} onClick={changeName}>
                  <CheckIcon />
                </div>
              )
            }
          </label>

          <label htmlFor="replace-password" className={styles.replacePassword}>
            <Input type='password' placeholder='password...' label='Replace-password' value={replacePassword} onChange={event => setReplacePassword(event.target.value)} />
            {
              replacePassword && (
                <div className={styles.checkButton} onClick={() => setIsOpenCurrentPassword(true)}>
                  <CheckIcon />
                </div>
              )
            }
          </label>

          {
              isOpenCurrentPassword && (

                <label htmlFor="current-password" className={styles.currentPassword}>
                  <Input type='password' placeholder='Current password...' label='Current Password' value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} />

                  <div className={styles.checkButton} onClick={changePassword}>
                    <CheckIcon />
                  </div>

                </label>
              )
            }

        

        </div>
      </div>
    </section>
  );
}

export default Userpage;