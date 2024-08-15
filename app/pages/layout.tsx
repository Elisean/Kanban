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
import authProvider from "../providers/authProvider";
import { app } from "../configs/firebase";
import { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Image from 'next/image'



const plusJakartaSansFonts = Plus_Jakarta_Sans({
  subsets: ["latin", "cyrillic-ext"],
});

function DasboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const pathname = usePathname();
  const router = useRouter();
  const auth = getAuth(app);
  const storage = getStorage()
  

  const [user, setUser] = useState<any>(null)
  const [imageUrl, setImageUrl] = useState('')


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



  useEffect(() => {
      
    const fetchImageUrl = async () => {
      const storageRef = ref(storage, 'avatar.jpg');
      try {
        await getDownloadURL(storageRef);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Image does not exist or there was an error:', error);
      }
    };
    fetchImageUrl();
  }, [storage]);




  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


 

  return (
    <main className={plusJakartaSansFonts.className}>
      <section className={styles.wrapper}>
        <div className={styles.inner}>
          <Aside>
            <ul className={styles.aside__list}>
              <li className={styles.aside__item}>
                <Link
                  href={`/pages/dashboard`}
                  className={`${
                    pathname === `/pages/dashboard`
                      ? `${styles.aside__item_active_link}`
                      : `${styles.aside__item}`
                  }`}
                >
                  <div className={styles.iconWrapper} style={pathname === '/pages/dashboard' ? { background: '#0075FF' } : { background: '#1A1F37' }}>
                    <HomeIcon />
                  </div>
                  Dashboard
                </Link>
              </li>
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
                {user ? <p>{user.name}</p> : <p>Loading...</p>}
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