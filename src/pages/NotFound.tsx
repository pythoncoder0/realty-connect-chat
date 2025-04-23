
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-realty-navy">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          We couldn't find the page you were looking for. It might have been removed or doesn't exist.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
