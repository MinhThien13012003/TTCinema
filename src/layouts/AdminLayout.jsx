import {
  Box
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/Admin/Header';
import Sidebar from '../components/Admin/SideBar';

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ p: 3, mt: 8 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
