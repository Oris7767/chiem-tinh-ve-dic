
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useBlog } from '@/context/BlogContext';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { logout } = useBlog();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Welcome, Admin!</h2>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={() => navigate('/subscribers')}
        >
          <Users className="mr-2 h-4 w-4" />
          Subscriber List
        </Button>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
