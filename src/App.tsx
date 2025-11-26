import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NewlyAddedUsersTable from './pages/Users/NewlyAddedUsersTable';
import ProductsTable from './pages/Products/ProductsTable';
import ProfilePage from './pages/Profile/ProfilePage';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/navbar/Navbar';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />

                {/* Main Content Area */}
                <div className="ml-64 flex-1 flex flex-col">
                  {/* Top Navigation Bar */}
                  <Navbar />

                  {/* Page Content */}
                  <main className="flex-1 p-8">
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/products" element={<ProductsTable />} />
                      <Route path="/users" element={<NewlyAddedUsersTable />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;