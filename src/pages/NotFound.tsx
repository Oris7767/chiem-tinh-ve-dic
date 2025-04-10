
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { SEO } from "@/utils/seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 px-4">
      <SEO 
        title="Page Not Found"
        description="The page you are looking for does not exist."
        noindex={true}
      />
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-amber-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-amber-800 mb-6">Page Not Found</h2>
        <p className="text-amber-700 mb-8">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg">
            <Link to="/" className="flex items-center">
              <Home className="mr-2" size={18} />
              Return to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/blog" className="flex items-center">
              <ArrowLeft className="mr-2" size={18} />
              Go to Blog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
