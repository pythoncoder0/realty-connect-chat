import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

export function Navbar() {
  const { user, logout } = useAppStore();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-realty-navy">RealtyConnect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/listings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Listings
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/messages" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Messages
              </Link>
              <Link to="/publish">
                <Button size="sm" variant="outline" className="hidden md:inline-flex">
                  + Add Property
                </Button>
              </Link>
              <span className="text-sm font-medium">
                Welcome, {user.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
