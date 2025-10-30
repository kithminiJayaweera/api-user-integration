// DemoPage was previously used directly; routes now point to UsersTable and NewlyAddedUsersTable
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import NewlyAddedUsersTable from './pages/pageA/NewlyAddedUsersTable';
import UsersTable from './pages/pageA/UsersTable';
import { Button } from '@/components/ui/button';
import { Database, UserPlus } from 'lucide-react';

function App() {
  const location = useLocation();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 mt-6">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">API Data Table</h1>

        <nav className="flex gap-2 border-b border-gray-200 pb-4">
          <Button
            asChild
            variant={location.pathname === '/' ? 'default' : 'ghost'}
            className="gap-2"
          >
            <Link to="/">
              <Database className="h-4 w-4" />
              API Users
            </Link>
          </Button>

          <Button
            asChild
            variant={location.pathname === '/newly-added' ? 'default' : 'ghost'}
            className="gap-2"
          >
            <Link to="/newly-added">
              <UserPlus className="h-4 w-4" />
              Newly Added Users
            </Link>
          </Button>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<UsersTable />} />
        <Route path="/newly-added" element={<NewlyAddedUsersTable />} />
      </Routes>
    </div>
  );
}

export default App;
