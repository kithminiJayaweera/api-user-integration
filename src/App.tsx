import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NewlyAddedUsersTable from './pages/Users/NewlyAddedUsersTable';
import UsersTable from './pages/Users/UsersTable';
import Sidebar from '@/components/sidebar/Sidebar';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<UsersTable />} />
          <Route path="/users" element={<NewlyAddedUsersTable />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;