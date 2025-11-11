import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Package, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getPageTitle = (pathname: string): { title: string; icon: React.ReactNode } => {
  switch (pathname) {
    case '/':
      return { title: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> };
    case '/users':
      return { title: 'Users Table', icon: <Users className="h-5 w-5" /> };
    case '/products':
      return { title: 'Products Table', icon: <Package className="h-5 w-5" /> };
    case '/profile':
      return { title: 'Profile', icon: <User className="h-5 w-5" /> };
    default:
      return { title: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> };
  }
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, icon } = getPageTitle(location.pathname);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Page Title */}
        <div className="flex items-center gap-3">
          <div className="text-gray-600">{icon}</div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Right side - User Profile */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative rounded-full p-0 w-10 h-10 hover:bg-transparent"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow">
                  <User className="h-5 w-5" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Astoria Black</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Astoria.black@gmail.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
