import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NewlyAddedUsersTable from './pages/Users/NewlyAddedUsersTable';
import ProductsTable from './pages/Products/ProductsTable';
import Sidebar from '@/components/sidebar/Sidebar';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsTable />} />
          <Route path="/users" element={<NewlyAddedUsersTable />} />
        </Routes>
      </main>
      
      {/* Toast notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default App;