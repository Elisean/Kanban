"use client";
import styles from "./layout.module.scss";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import ProfileIcon from '@/public/static/profile.svg';
import KanbanIcon from '@/public/static/kanban-board.svg';
import SignOutIcon from '@/public/static/sign-out.svg';
import UserIcon from '@/public/static/user.svg';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import authProvider, { checkUserAuthentication } from "../providers/authProvider";
import { app } from "../configs/firebase";
import { useEffect, useState } from "react";
import Image from 'next/image'
import {getUserImageURL } from '../configs/uploadImageFireBase'; 
import { Header } from "@/components/Header/Header";


const plusJakartaSansFonts = Montserrat({
  subsets: ["latin", "cyrillic-ext"],
});




function DasboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const [user, setUser] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState('')
  
  const pathname = usePathname();
  const router = useRouter();
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



  const handleSignOut = async () => {
    try {
     window.location.reload()
      await signOut(auth);
      router.push('/');
     
    } catch (error) {
      console.error('Error signing out:', error);
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
    <main className={plusJakartaSansFonts.className}>
      <section className={styles.wrapper}>
        <Header>
          <div className='container'>
       <div className={styles.header__wrapper}>
          <div className={styles.header__logo}>
          Elisean Kanban 
          </div>
            <ul className={styles.header__list}>
                <li className={styles.header__item}>
                  <Link
                    href={`/pages/kanban`}
                    className={`${
                      pathname === `/pages/kanban`
                        ? `${styles.header__item_active_link}`
                        : `${styles.header__item}`
                    }`}
                  >
                    <div className={styles.iconWrapper} style={pathname === '/pages/kanban' ? { background: '#0075FF' } : { background: '#1A1F37' }}>
                      <KanbanIcon />
                    </div>
                    Kanban
                  </Link>
                </li>
                <li className={styles.header__item}>
                  <Link
                    href={`/pages/profile`}
                    className={`${
                      pathname === `/pages/profile`
                        ? `${styles.header__item_active_link}`
                        : `${styles.header__item}`
                    }`}
                  >
                    <div className={styles.iconWrapper} style={pathname === '/pages/profile' ? { background: '#0075FF' } : { background: '#1A1F37' }}>
                      <ProfileIcon />
                    </div>
                    Profile
                  </Link>
                </li>
              </ul>
              <div className={styles.header__action_user}>
                <Button id='sign-out' type="button" onClick={handleSignOut}>
                  <SignOutIcon />
                </Button>
                <div className={styles.header__action_inner}>
                  <Link href={`/pages/profile`} className={styles.header__avatar}>
                  {
                    imageUrl ? <Image src={imageUrl} alt='avatar' width={50} height={50}/> :  <UserIcon /> 
                  } 
                  </Link>
                  {user ? <p className={styles.header__user_name}>{user.displayName}</p> : <p className={styles.header__user_name}>Loading...</p>}
                </div>
              </div>
          </div>
         </div>
          </Header>
          <div className={styles.inner}>
            <div className='container'>
              {children}
            </div>
          </div>
      </section>
    </main>
  );
}

const ProtectedLayout = authProvider(DasboardLayout);
export default ProtectedLayout;