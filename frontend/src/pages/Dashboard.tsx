import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/services/authApi';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logoutAction = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApi.logout();
    logoutAction();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.full_name || user?.email || 'Farmer'}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crop Disease Detection</CardTitle>
            <CardDescription>Upload an image to identify crop diseases</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/crop-disease">
              <Button className="w-full bg-[#1B5E20] hover:bg-[#1B5E20]/90">
                Go to Tool
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Irrigation Schedule</CardTitle>
            <CardDescription>Get AI-powered irrigation recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/crop-irrigation">
              <Button className="w-full bg-[#1B5E20] hover:bg-[#1B5E20]/90">
                Go to Tool
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
