"use client";

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


interface User {
  name: string;
  avatar?: string;
  totalOrders?: number; 
}
interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
}

interface OverviewProps {
  currentUser?: User;
}

export default function OverviewPage({ currentUser }: OverviewProps) {
  
  const user = currentUser || { name:"fatu", avatar: "/default-avatar.png", totalOrders: 0 };

  const kpiData = {
    totalSales: 0,
    totalOrders: user.totalOrders || 0,
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold">Bienvenue, {user.name} !</h2>
            <p className="text-gray-500">
              Vous avez traité <span className="font-semibold">{user.totalOrders}</span> commandes.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-pink-50">
          <CardContent>
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-xl font-semibold">{kpiData.totalSales}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardContent>
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-xl font-semibold">{kpiData.totalOrders}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent>
            <p className="text-sm text-gray-500">Customers</p>
            <p className="text-xl font-semibold">{kpiData.totalCustomers}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-xl font-semibold">{kpiData.revenue} FCFA</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="h-64">
          <CardContent>
            <h2 className="font-semibold mb-2">Sales Over Time</h2>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#f43f5e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-64">
          <CardContent>
            <h2 className="font-semibold mb-2">Orders Over Time</h2>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent>
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
