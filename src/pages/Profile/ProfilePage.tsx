import { User, Mail, Phone, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  // Mock user data - this would come from your auth context/API in real app
  const user = {
    name: 'Astoria Black',
    email: 'Astoria.black@gmail.com',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',
    department: 'Engineering',
    location: 'San Francisco, CA',
    joinDate: 'January 15, 2024',
    bio: 'Passionate about building great user experiences and leading development teams.',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Profile Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <User className="h-12 w-12" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                <p className="text-lg text-gray-600 mb-3">{user.role}</p>
                <p className="text-sm text-gray-500 max-w-2xl">{user.bio}</p>
              </div>
              <Button>Edit Profile</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
              <p className="text-sm font-medium text-gray-900">{user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
              <p className="text-sm font-medium text-gray-900">{user.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
              <p className="text-sm font-medium text-gray-900">{user.department}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Details</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Member Since</p>
                <p className="text-xs text-gray-500">{user.joinDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Account Status</p>
              <p className="text-xs text-gray-500">Your account is active</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 mt-6">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Irreversible and destructive actions
        </p>
        <Button variant="destructive" size="sm">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
