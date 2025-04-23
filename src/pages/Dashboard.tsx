
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useAppStore } from "@/lib/store";
import { PropertyCard } from "@/components/PropertyCard";

const Dashboard = () => {
  const { user, properties } = useAppStore();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Filter user's properties
  const userProperties = properties.filter(property => property.ownerId === user?.id);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-2">Manage your real estate portfolio</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userProperties.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>
        
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Listed Properties</h2>
            {userProperties.length > 0 && (
              <button
                onClick={() => navigate('/listings')}
                className="text-primary hover:underline"
              >
                View All →
              </button>
            )}
          </div>
          
          {userProperties.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">You haven't listed any properties yet.</p>
              <button
                onClick={() => navigate('/publish')}
                className="text-primary hover:underline"
              >
                + Add Your First Property
              </button>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
