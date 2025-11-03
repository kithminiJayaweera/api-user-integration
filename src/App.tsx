import { Routes, Route } from 'react-router-dom';
import NewlyAddedUsersTable from './pages/Users/NewlyAddedUsersTable';
import UsersTable from './pages/Users/UsersTable';
import Navbar from '@/components/navbar/navItem';

function App() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Navbar />

      <Routes>
        <Route path="/" element={<UsersTable />} />
        <Route path="/newly-added" element={<NewlyAddedUsersTable />} />
      </Routes>
    </div>
  );
}

export default App;