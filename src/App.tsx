import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NewlyAddedUsersTable from './pages/Users/NewlyAddedUsersTable';
import ProductsTable from './pages/Products/ProductsTable';
import ProfilePage from './pages/Profile/ProfilePage';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/navbar/Navbar';

function App() {
  return (
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
          </Routes>
        </main>
      </div>
      
      {/* Toast notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default App;