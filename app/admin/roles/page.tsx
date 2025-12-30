"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Key, PlusCircle, Trash2 } from "lucide-react";

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "Administrateur",
      permissions: ["Gérer les produits", "Gérer les commandes", "Gérer les utilisateurs", "Voir les statistiques"],
    },
    {
      id: 2,
      name: "Manager",
      permissions: ["Gérer les produits", "Voir les commandes", "Voir les statistiques"],
    },
    {
      id: 3,
      name: "Employé",
      permissions: ["Voir les produits", "Créer une commande"],
    },
  ]);

  const [newRole, setNewRole] = useState("");
  const [newPermission, setNewPermission] = useState("");

  const addRole = () => {
    if (!newRole.trim()) return;
    setRoles([
      ...roles,
      { id: Date.now(), name: newRole, permissions: [] },
    ]);
    setNewRole("");
  };

  const deleteRole = (id: number) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  const addPermission = (roleId: number) => {
    if (!newPermission.trim()) return;

    const updated = roles.map((r) =>
      r.id === roleId
        ? { ...r, permissions: [...r.permissions, newPermission] }
        : r
    );

    setRoles(updated);
    setNewPermission("");
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <ShieldCheck size={34} className="text-indigo-600" />
          Rôles & Permissions
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <PlusCircle size={18} />
              Nouveau Rôle
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un rôle</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Nom du rôle"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />

            <Button className="mt-3 w-full" onClick={addRole}>
              Ajouter
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Gestion des rôles</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Rôle</th>
                <th className="p-3">Permissions</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-b">
                  <td className="p-3 font-semibold">{role.name}</td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((perm, i) => (
                        <Badge key={i} variant="secondary" className="text-sm">
                          <Key size={14} className="mr-1" /> {perm}
                        </Badge>
                      ))}
                    </div>

                    {/* Ajouter permission */}
                    <div className="flex gap-2 mt-3">
                      <Input
                        className="w-60"
                        placeholder="Nouvelle permission"
                        value={newPermission}
                        onChange={(e) => setNewPermission(e.target.value)}
                      />

                      <Button
                        variant="outline"
                        onClick={() => addPermission(role.id)}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </td>

                  <td className="p-3 text-right">
                    <Button
                      variant="destructive"
                      onClick={() => deleteRole(role.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
