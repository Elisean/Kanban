"use client";
import styles from "./layout.module.scss";
import { Aside } from "@/components/Aside/Aside";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import HomeIcon from '@/public/static/home.svg';
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


const plusJakartaSansFonts = Plus_Jakarta_Sans({
  subsets: ["latin", "cyrillic-ext"],
});

function DasboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const [user, setUser] = useState<any>(null)
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
        <div className={styles.inner}>
          <Aside>
            <ul className={styles.aside__list}>
              <li className={styles.aside__item}>
                <Link
                  href={`/pages/kanban`}
                  className={`${
                    pathname === `/pages/kanban`
                      ? `${styles.aside__item_active_link}`
                      : `${styles.aside__item}`
                  }`}
                >
                  <div className={styles.iconWrapper} style={pathname === '/pages/kanban' ? { background: '#0075FF' } : { background: '#1A1F37' }}>
                    <KanbanIcon />
                  </div>
                  Kanban
                </Link>
              </li>
              <li className={styles.aside__item}>
                <Link
                  href={`/pages/profile`}
                  className={`${
                    pathname === `/pages/profile`
                      ? `${styles.aside__item_active_link}`
                      : `${styles.aside__item}`
                  }`}
                >
                  <div className={styles.iconWrapper} style={pathname === '/pages/profile' ? { background: '#0075FF' } : { background: '#1A1F37' }}>
                    <ProfileIcon />
                  </div>
                  Profile
                </Link>
              </li>
            </ul>
            <div className={styles.aside__action_user}>
              <Button id='sign-out' type="button" onClick={handleSignOut}>
                <SignOutIcon />
              </Button>
              <div className={styles.aside__action_inner}>
                 <Link href={`/pages/profile`} className={styles.aside__avatar}>
                 {
                  imageUrl ? <Image src={imageUrl} alt='avatar' width={50} height={50}/> :  <UserIcon /> 
                 } 
                 </Link>
                {user ? <p>{user.displayName}</p> : <p>Loading...</p>}
              </div>
            </div>
          </Aside>
          <div className={styles.container}>{children}</div>
        </div>
      </section>
    </main>
  );
}

const ProtectedLayout = authProvider(DasboardLayout);
export default ProtectedLayout;