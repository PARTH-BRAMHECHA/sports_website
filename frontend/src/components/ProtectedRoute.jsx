import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  // Check if user exists and if they have admin privileges
  if (!user || user.userType !== 'admin') {
    console.log("Access denied: User is not an admin");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;