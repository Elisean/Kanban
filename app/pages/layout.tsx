"use client";
import { usePathname } from "next/navigation";
import styles from "./layout.module.scss";
import { Footer } from "@/components/Footer/Footer";
import { Aside } from "@/components/Aside/Aside";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import HomeIcon from '@/public/static/home.svg';
import ProfileIcon from '@/public/static/profile.svg';
import KanbanIcon from '@/public/static/kanban-board.svg';
import SignOutIcon from '@/public/static/sign-out.svg';
import UserIcon from '@/public/static/user.svg';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import authProvider from "../providers/authProvider";
import { app } from "../configs/firebase";
import { getDatabase, ref, onValue } from 'firebase/database';
import { useEffect, useState } from "react";

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
  const database = getDatabase(app);
  const [user, setUser] = useState<any>(null)



  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(
        auth ? {
          id: user?.uid, 
          name: user?.displayName  
        } : null
      )
    });

    // Cleanup function to unsubscribe from auth state changes
    return () => unsubscribeAuth();
  }, [auth, database, user]);



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
                <div className={styles.aside__avatar}>
                  <UserIcon />
                </div>
                {user ? <p>{user.name}</p> : <p>Loading...</p>}
              </div>
            </div>
          </Aside>
          <div className={styles.container}>{children}</div>
        </div>
        <Footer>Footer</Footer>
      </section>
    </main>
  );
}

const ProtectedLayout = authProvider(DasboardLayout);
export default ProtectedLayout;