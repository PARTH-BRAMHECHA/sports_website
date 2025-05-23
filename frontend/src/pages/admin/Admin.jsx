import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import AdminSidebar from '../../components/AdminSidebar';
import Overview from './Overview';
import ManageEvents from './ManageEvents';
import ManageAchievements from './ManageAchievements';
import ManageGallery from './ManageGallery';
import ContactMessages from './ContactMessages';
import ManageRegistrations from './ManageRegistrations';
import ManageSchedule from './ManageSchedule';
import ManageSettings from './ManageSettings';

const Admin = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Routes>
            <Route index element={<Overview />} />            <Route path="events" element={<ManageEvents />} />
            <Route path="schedule" element={<ManageSchedule />} />
            <Route path="registrations" element={<ManageRegistrations />} />
            <Route path="achievements" element={<ManageAchievements />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="messages" element={<ContactMessages />} />
            <Route path="settings" element={<ManageSettings />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default Admin;