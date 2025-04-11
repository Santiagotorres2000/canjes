
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-7xl font-bold text-primary mb-6">404</h1>
        <p className="text-2xl font-semibold mb-4">Página no encontrada</p>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button asChild size="lg" className="gap-2">
          <a href="/">
            <Home size={18} />
            <span>Volver al inicio</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
