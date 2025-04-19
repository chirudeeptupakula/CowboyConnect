// src/components/MainLayout.jsx
import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../App.css'; // make sure the background styles are in here

function MainLayout() {
  const location = useLocation();
  const hideBackground = location.pathname === '/' || location.pathname === '/register';

  return (
    <>
      <Header />
      <div className={hideBackground ? '' : 'with-background main-wrapper'}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default MainLayout;
