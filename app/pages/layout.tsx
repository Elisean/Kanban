"use client";
import { usePathname } from "next/navigation";
import styled from "./layout.module.scss";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Aside } from "@/components/Aside/Aside";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo/Logo";
import HomeIcon from '@/public/static/home.svg';
import ProfileIcon from '@/public/static/profile.svg';
import KanbanIcon from '@/public/static/kanban-board.svg';
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation"
import { app } from "../layout";
import { Button } from "@/components/ui/Button/Button";
import authProvider from "../providers/authProvider";



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

  const handleSignOut = async () => {

    const auth = getAuth(app);

    try {
      await signOut(auth);
      
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  

  return (
    <main className={plusJakartaSansFonts.className}>
      <section className={styled.wrapper}>
        <Header>
          <Logo />
          <div className={styled.userPanel}>userPanel</div>
        </Header>
        <div className={styled.inner}>
          <Aside>
            <ul className={styled.aside__list}>
              <li className={styled.aside__item}>
                <Link
                  href={`/pages/dashboard`}
                  className={`${
                    pathname === `/pages/dashboard`
                      ? `${styled.aside__item_active_link}`
                      : `${styled.aside__item}`
                  }`}
                >

                  <div className={styled.iconWrapper} style={pathname === '/pages/dashboard' ? { background: '#0075FF' } : { background: '#1A1F37' }}>
                    <HomeIcon />
                  </div>
                
                  Dashboard

             
                </Link>
              </li>
              <li className={styled.aside__item}>
                <Link
                  href={`/pages/kanban`}
                  className={`${
                    pathname === `/pages/kanban`
                      ? `${styled.aside__item_active_link}`
                      : `${styled.aside__item}`
                  }`}
                >
                
                  <div className={styled.iconWrapper} style={pathname === '/pages/kanban' ? { background: '#0075FF' } : { background: '#1A1F37' }}>
                    <KanbanIcon />
                  </div>

                  Kanban
                </Link>
              </li>
              <li className={styled.aside__item}>
                <Link
                  href={`/pages/profile`}
                  className={`${
                    pathname === `/pages/profile`
                      ? `${styled.aside__item_active_link}`
                      : `${styled.aside__item}`
                  }`}
                >
                  <div className={styled.iconWrapper} style={pathname === '/pages/profile' ? { background: '#0075FF' } : { background: '#1A1F37' }}>
                    <ProfileIcon />
                  </div>
                
                  Profile
                </Link>
              </li>
            </ul>
            <div>
              <Button id='sign-out' type="button" onClick={handleSignOut}>SignOut</Button>
            </div>
             
          </Aside>
          <div className={styled.container}>{children}</div>
        </div>
        <Footer>Footer</Footer>
      </section>
    </main>
  );
}

const ProtectedLayout = authProvider(DasboardLayout);
export default ProtectedLayout