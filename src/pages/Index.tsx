
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { CardStat } from "@/components/ui/card-stat";
import { 
  Users, 
  Truck, 
  Trash2, 
  Award, 
  ShoppingBag, 
  Bell, 
  Leaf,
  BarChart3
} from "lucide-react";
import { 
  usuariosApi, 
  recoleccionesApi, 
  residuosApi, 
  puntosUsuarioApi, 
  canjePuntosApi, 
  notificacionesApi,
  Recoleccion
} from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const Index = () => {
  const [usuarios, setUsuarios] = useState(0);
  const [recolecciones, setRecolecciones] = useState(0);
  const [recoleccionCompletadas, setRecoleccionCompletadas] = useState(0);
  const [residuos, setResiduos] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [canjes, setCanjes] = useState(0);
  const [notificaciones, setNotificaciones] = useState(0);
  const [recoleccionesPorMes, setRecoleccionesPorMes] = useState<any[]>([]);
  const [residuosPorTipo, setResiduosPorTipo] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Get counts
      const usuariosData = await usuariosApi.getAll();
      setUsuarios(usuariosData.length);

      const recoleccionesData = await recoleccionesApi.getAll();
      setRecolecciones(recoleccionesData.length);
      setRecoleccionCompletadas(
        recoleccionesData.filter((r) => r.estado === "Completada").length
      );
      
      // Process recolecciones by month
      const monthlyData = processRecoleccionesPorMes(recoleccionesData);
      setRecoleccionesPorMes(monthlyData);

      // Process residuos by type
      const residuosData = await residuosApi.getAll();
      setResiduos(residuosData.length);
      
      const residuosTipoData = processResiduosPorTipo(recoleccionesData);
      setResiduosPorTipo(residuosTipoData);

      const puntosData = await puntosUsuarioApi.getAll();
      setPuntos(puntosData.reduce((sum, p) => sum + p.puntos, 0));

      const canjesData = await canjePuntosApi.getAll();
      setCanjes(canjesData.length);

      const notificacionesData = await notificacionesApi.getAll();
      setNotificaciones(notificacionesData.length);
    };

    fetchData();
  }, []);

  // Function to process recolecciones data by month
  const processRecoleccionesPorMes = (recolecciones: Recoleccion[]) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    const monthlyData: Record<string, { month: string, count: number }> = {};
    
    // Initialize all months
    months.forEach((month) => {
      monthlyData[month] = { month, count: 0 };
    });
    
    // Count recolecciones by month
    recolecciones.forEach((recoleccion) => {
      const date = new Date(recoleccion.fechaRecoleccion);
      const month = months[date.getMonth()];
      monthlyData[month].count += 1;
    });
    
    return Object.values(monthlyData);
  };

  // Function to process residuos data by type
  const processResiduosPorTipo = (recolecciones: Recoleccion[]) => {
    const tiposResiduos = ["Orgánico", "Inorgánico Reciclable", "Peligroso"];
    const residuoData: Record<string, { name: string, value: number }> = {};
    
    // Initialize all residuo types
    tiposResiduos.forEach((tipo) => {
      residuoData[tipo] = { name: tipo, value: 0 };
    });
    
    // Count recolecciones by residuo type
    recolecciones.forEach((recoleccion) => {
      if (recoleccion.residuo) {
        const tipo = recoleccion.residuo.tipoResiduo;
        residuoData[tipo].value += 1;
      }
    });
    
    return Object.values(residuoData);
  };

  return (
    <Layout>
      <PageHeader 
        title="Dashboard" 
        description="Bienvenido al sistema de gestión de Eco-Puntos" 
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <CardStat 
          title="Usuarios" 
          value={usuarios} 
          icon={<Users size={24} />} 
          description="Total de usuarios registrados" 
        />
        <CardStat 
          title="Recolecciones" 
          value={recolecciones} 
          icon={<Truck size={24} />} 
          description={`${recoleccionCompletadas} completadas`}
          trend={recolecciones ? { 
            value: Math.round((recoleccionCompletadas / recolecciones) * 100), 
            isPositive: true 
          } : undefined}
        />
        <CardStat 
          title="Puntos Acumulados" 
          value={puntos.toLocaleString()} 
          icon={<Award size={24} />} 
        />
        <CardStat 
          title="Canjes Realizados" 
          value={canjes} 
          icon={<ShoppingBag size={24} />} 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recolecciones por Mes
            </CardTitle>
            <CardDescription>
              Actividad de recolección durante el año
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={recoleccionesPorMes}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Distribución por Tipo de Residuo
            </CardTitle>
            <CardDescription>
              Comparativa de los tipos de residuos recolectados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={residuosPorTipo}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Cantidad" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <CardStat 
          title="Tipos de Residuos" 
          value={residuos} 
          icon={<Trash2 size={24} />} 
          className="md:col-span-1"
        />
        <CardStat 
          title="Notificaciones" 
          value={notificaciones} 
          icon={<Bell size={24} />} 
          className="md:col-span-1"
        />
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Eco-Puntos</CardTitle>
            <CardDescription>Sistema de Gestión de Residuos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Esta plataforma facilita la gestión de recolección de residuos domésticos, 
              permitiendo a los usuarios acumular puntos por su participación en el programa.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
