import Home from '../pages/Home';
import { Outlet } from 'react-router-dom';
import AppBar from '../components/AppBar';
function MainLayout() {
  return (
    <>
    <AppBar />
    <Outlet/>
    </>
  );
}

export default MainLayout;