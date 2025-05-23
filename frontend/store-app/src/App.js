import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';

import Login from './pages/Login';
// import Signup from './pages/Signup';

import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import UserDashboard from './pages/UserDashboard';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';
import ChangePassword from './pages/ChangePassword';
import { useLocation } from 'react-router-dom';
import AddUser from './components/AddUser';
import AddStore from './components/AddStore';
import UserList from './components/UserList';
import UserDetails from './components/UserDetails';
import StoreList from './components/StoreList';
import StoreDetails from './components/StoreDetails';
// Protected route wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { authUser } = useAuthContext();
  const location = useLocation();
  // No user retun to login
  if (!authUser) return <Navigate to="/login" />;
  // for users created by admin they can change pass in 
  // the first login
  if (authUser.mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" />;
  }
  // if roles but role not matched with authUser role return 
  if (roles && !roles.includes(authUser?.role)) return <Navigate to="/unauthorized" />;


  return children;
};

const App = () => {
  const { authUser } = useAuthContext()
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={authUser ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={authUser ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/" element={<Navigate to={authUser ? "/dashboard" : "/login"} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['ADMIN', 'OWNER', 'USER']}>
                <RoleBasedDashboard />
              </ProtectedRoute>
            }
          />
          {/* change passs */}
          <Route
            path='/change-password'
            element={
              <ProtectedRoute roles={['ADMIN', 'OWNER', 'USER']}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          {/* admin - routes */}
          {/* create users */}
          <Route
            path='/admin/create-user'
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AddUser />
              </ProtectedRoute>
            }
          />
          {/* create store */}
          <Route
            path='/admin/create-store'
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AddStore />
              </ProtectedRoute>
            }
          />
          {/* List of users */}
          <Route
            path='/admin/users'
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <UserList />
              </ProtectedRoute>
            }
          />
          {/* single user details */}
          <Route
            path='/admin/users/:id'
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          {/* stores list */}
          <Route
            path='/admin/stores'
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <StoreList />
              </ProtectedRoute>
            }
          />
          {/* single store route */}
          <Route
            path='/stores/:id'
            element={
              <ProtectedRoute roles={['ADMIN', 'USER', 'OWNER']}>
                <StoreDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<h2 className="text-center mt-10 text-red-500">Unauthorized Access</h2>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
};


const RoleBasedDashboard = () => {
  const { authUser } = useAuthContext();

  switch (authUser?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'OWNER':
      return <OwnerDashboard />;
    default:
      return <UserDashboard />;
  }
};

export default App;
