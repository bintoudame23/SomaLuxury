"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { useUser } from "@clerk/nextjs";


export default function OverviewPage() {

  const { user, isLoaded } = useUser();


  if (!isLoaded) {
    return (
      <div className="p-6">
        Chargement...
      </div>
    );
  }


  const userData = {
    name: user?.fullName ?? "Utilisateur",
    avatar: user?.imageUrl ?? "/default-avatar.png",
    totalOrders: 0,
  };


  const kpiData = {
    totalSales: 0,
    totalOrders: userData.totalOrders,
    totalCustomers: 0,
    revenue: 0,
  };


  const salesData = [
    { month: "Jan", sales: 0 },
    { month: "Feb", sales: 0 },
    { month: "Mar", sales: 0 },
    { month: "Apr", sales: 0 },
    { month: "May", sales: 0 },
    { month: "Jun", sales: 0 },
  ];


  return (

    <div className="p-6 space-y-6">


      {/* HEADER USER */}

      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-4">

          <Image
            src={userData.avatar}
            alt={userData.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />


          <div>

            <h2 className="text-2xl font-bold">
              Bienvenue, {userData.name} !
            </h2>


            <p className="text-gray-500">

              Vous avez traité{" "}

              <span className="font-semibold">
                {userData.totalOrders}
              </span>

              {" "}commandes.

            </p>


          </div>

        </div>


      </div>



      {/* KPI */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


        <Card className="bg-pink-50">

          <CardContent className="p-6">

            <p className="text-sm text-gray-500">
              Total Sales
            </p>

            <p className="text-xl font-semibold">
              {kpiData.totalSales}
            </p>

          </CardContent>

        </Card>




        <Card className="bg-blue-50">

          <CardContent className="p-6">

            <p className="text-sm text-gray-500">
              Orders
            </p>

            <p className="text-xl font-semibold">
              {kpiData.totalOrders}
            </p>

          </CardContent>

        </Card>





        <Card className="bg-green-50">

          <CardContent className="p-6">

            <p className="text-sm text-gray-500">
              Customers
            </p>

            <p className="text-xl font-semibold">
              {kpiData.totalCustomers}
            </p>

          </CardContent>

        </Card>





        <Card className="bg-yellow-50">

          <CardContent className="p-6">

            <p className="text-sm text-gray-500">
              Revenue
            </p>

            <p className="text-xl font-semibold">
              {kpiData.revenue} FCFA
            </p>

          </CardContent>

        </Card>


      </div>




      {/* GRAPHIQUES */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        <Card className="h-64">

          <CardContent className="h-full p-6">

            <h2 className="font-semibold mb-2">
              Sales Over Time
            </h2>


            <ResponsiveContainer width="100%" height="80%">

              <LineChart data={salesData}>

                <XAxis dataKey="month"/>

                <YAxis/>

                <Tooltip/>


                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#f43f5e"
                  strokeWidth={2}
                />


              </LineChart>


            </ResponsiveContainer>


          </CardContent>


        </Card>





        <Card className="h-64">

          <CardContent className="h-full p-6">

            <h2 className="font-semibold mb-2">
              Orders Over Time
            </h2>


            <ResponsiveContainer width="100%" height="80%">


              <BarChart data={salesData}>


                <XAxis dataKey="month"/>

                <YAxis/>

                <Tooltip/>


                <Bar
                  dataKey="sales"
                  fill="#3b82f6"
                />


              </BarChart>


            </ResponsiveContainer>


          </CardContent>


        </Card>


      </div>





      {/* TABLE COMMANDES */}

      <Card>

        <CardContent className="p-6">


          <h2 className="font-semibold mb-4">
            Recent Orders
          </h2>



          <table className="w-full text-left border-collapse">


            <thead>

              <tr className="text-gray-500 text-sm border-b">


                <th className="py-2 px-4">
                  Order ID
                </th>


                <th className="py-2 px-4">
                  Customer
                </th>


                <th className="py-2 px-4">
                  Amount
                </th>


                <th className="py-2 px-4">
                  Status
                </th>


              </tr>


            </thead>


            <tbody>


              <tr>

                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-400"
                >
                  Aucune commande récente
                </td>


              </tr>


            </tbody>


          </table>


        </CardContent>


      </Card>



    </div>

  );
}