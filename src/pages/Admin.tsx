import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, Award, X, Upload } from 'lucide-react';
import UserList from '@/components/admin/UserList';
import UserFavorites from '@/components/admin/UserFavorites';
import UserHistory from '@/components/admin/UserHistory';
import UniversityList from '@/components/admin/UniversityList';
import ScholarshipList from '@/components/admin/ScholarshipList';
import BulkImporterWizard from '@/components/admin/BulkImporter/BulkImporterWizard';
import { adminApi } from '@/services/adminApi';
import { useAuth0 } from '@auth0/auth0-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab = 'users' | 'universities' | 'scholarships' | 'import';

export default function Admin() {
  const { getAccessTokenSilently } = useAuth0();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');

  const handleUserSelect = async (userId: number) => {
    try {
      const user = await adminApi.getUser(userId, getAccessTokenSilently);
      setSelectedUserId(userId);
      setSelectedUserName(user.name);
    } catch (error) {
      console.error('Failed to fetch user details', error);
    }
  };

  const handleBackToList = () => {
    setSelectedUserId(null);
    setSelectedUserName('');
  };

  if (selectedUserId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBackToList} className="mb-4">
            <X className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold mb-6">User Details: {selectedUserName}</h1>
          
          <Tabs defaultValue="favorites" className="w-full">
            <TabsList>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="history">Activity History</TabsTrigger>
            </TabsList>
            <TabsContent value="favorites" className="mt-4">
              <UserFavorites userId={selectedUserId} userName={selectedUserName} />
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <UserHistory userId={selectedUserId} userName={selectedUserName} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, universities, and scholarships</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b">
        <Button
          variant={activeTab === 'users' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('users')}
          className="rounded-b-none"
        >
          <Users className="h-4 w-4 mr-2" />
          Users & Favorites
        </Button>
        <Button
          variant={activeTab === 'universities' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('universities')}
          className="rounded-b-none"
        >
          <GraduationCap className="h-4 w-4 mr-2" />
          Universities
        </Button>
        <Button
          variant={activeTab === 'scholarships' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('scholarships')}
          className="rounded-b-none"
        >
          <Award className="h-4 w-4 mr-2" />
          Scholarships
        </Button>
        <Button
          variant={activeTab === 'import' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('import')}
          className="rounded-b-none"
        >
          <Upload className="h-4 w-4 mr-2" />
          Bulk Import
        </Button>
      </div>

      {activeTab === 'users' && <UserList onUserSelect={handleUserSelect} />}
      {activeTab === 'universities' && <UniversityList />}
      {activeTab === 'scholarships' && <ScholarshipList />}
      {activeTab === 'import' && <BulkImporterWizard />}
    </div>
  );
}

