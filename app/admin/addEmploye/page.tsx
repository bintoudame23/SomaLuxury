"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash, Edit, Download, X } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  dob?: string;
  gender?: "Male" | "Female" ;
  role: "Administrateur" | "Manager" | "employé";
  status: "Active" | "Inactive";
  permissions: string[];
  cv?: File;
}

const ROLE_DEFAULT_PERMISSIONS: Record<Employee["role"], string[]> = {
  Administrateur: ["Aperçu", "Analytique", "Rapports", "Produits", "Catégories", "Commandes", "Équipe", "Rôles et permissions", "Clients", "Système"],
  Manager: ["Aperçu", "Rapports", "Commerce électronique", "Produits", "Commandes", "Clients"],
  employé: ["Produits", "Commandes", "Clients"],
};

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newDob, setNewDob] = useState("");
  const [newGender, setNewGender] = useState<Employee["gender"]>("Male");
  const [newRole, setNewRole] = useState<Employee["role"]>("employé");
  const [newPermissions, setNewPermissions] = useState<string[]>([]);
  const [newCV, setNewCV] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Chargement depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem("employees");
    if (stored) setEmployees(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pwd: string) => pwd.length >= 6;
  const validatePhone = (phone: string) => /^[0-9]{8,15}$/.test(phone);

  const resetForm = () => {
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewPhone("");
    setNewAddress("");
    setNewDob("");
    setNewGender("Male");
    setNewRole("employé");
    setNewPermissions([]);
    setNewCV(null);
    setEditingId(null);
  };

  const handleAddOrEditEmployee = () => {
    if (!newName || !newEmail || !newPassword || !newPhone || !newAddress) {
      alert("Tous les champs sont requis !");
      return;
    }
    if (!validateEmail(newEmail)) {
      alert("Email invalide !");
      return;
    }
    if (!validatePassword(newPassword)) {
      alert("Mot de passe trop court !");
      return;
    }
    if (!validatePhone(newPhone)) {
      alert("Numéro de téléphone invalide !");
      return;
    }

    const employee: Employee = {
      id: editingId || employees.length + 1,
      name: newName,
      email: newEmail,
      password: newPassword,
      phone: newPhone,
      address: newAddress,
      dob: newDob,
      gender: newGender,
      role: newRole,
      status: "Active",
      permissions: newPermissions.length ? newPermissions : ROLE_DEFAULT_PERMISSIONS[newRole],
      cv: newCV || undefined,
    };

    if (editingId) {
      setEmployees(employees.map(e => e.id === editingId ? employee : e));
      alert("Employé mis à jour !");
    } else {
      setEmployees([...employees, employee]);
      alert(`Compte créé pour ${newName} !`);
    }

    resetForm();
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet employé ?")) return;
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const handleEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setNewName(emp.name);
    setNewEmail(emp.email);
    setNewPassword(emp.password);
    setNewPhone(emp.phone);
    setNewAddress(emp.address);
    setNewDob(emp.dob || "");
    setNewGender(emp.gender || "Male");
    setNewRole(emp.role);
    setNewPermissions(emp.permissions);
    setNewCV(emp.cv || null);
    setShowModal(true);
  };

  const toggleStatus = (id: number) => {
    setEmployees(prev =>
      prev.map(e =>
        e.id === id ? { ...e, status: e.status === "Active" ? "Inactive" : "Active" } : e
      )
    );
  };

  const downloadCV = (cv?: File) => {
    if (!cv) return;
    const url = URL.createObjectURL(cv);
    const a = document.createElement("a");
    a.href = url;
    a.download = cv.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = employees.filter(
    e => e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 relative">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" /> Team Management
        </h1>
        <div className="flex gap-2">
          <Input
            placeholder="Rechercher un membre…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Créer
          </Button>
        </div>
      </div>

      {/* TABLEAU TEAM */}
      <Card className="shadow-lg border">
        <CardHeader>
          <CardTitle>Liste des membres de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Status</th>
                  <th>Permissions</th>
                  <th>CV</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp.id} className="bg-white hover:shadow rounded-xl transition">
                    <td className="py-4 px-3 flex items-center gap-3">
                
                      <span className="font-medium">{emp.name}</span>
                    </td>
                    <td className="py-4 px-3">{emp.email}</td>
                    <td className="py-4 px-3 font-semibold">{emp.role}</td>
                    <td className="py-4 px-3">
                      <Badge variant={emp.status === "Active" ? "default" : "destructive"} onClick={() => toggleStatus(emp.id)}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-3">{emp.permissions.join(", ")}</td>
                    <td className="py-4 px-3">
                      {emp.cv ? (
                        <Button size="sm" onClick={() => downloadCV(emp.cv)}>
                          <Download className="w-4 h-4" /> {emp.cv.name}
                        </Button>
                      ) : (
                        "Aucun"
                      )}
                    </td>
                    <td className="py-4 px-3 text-right flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(emp)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(emp.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      Aucun résultat trouvé…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL CREATION / EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => { setShowModal(false); resetForm(); }}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4">{editingId ? "Modifier un employé" : "Créer un nouvel employé"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Nom " value={newName} onChange={e => setNewName(e.target.value)} />
              <Input placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              <Input placeholder="Mot de passe" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <Input placeholder="Téléphone" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
              <Input placeholder="Adresse" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
              <Input type="date" placeholder="Date de naissance" value={newDob} onChange={e => setNewDob(e.target.value)} />
              <select value={newGender} onChange={e => setNewGender(e.target.value as Employee["gender"])} className="rounded-lg border p-2">
                <option value="Male">Homme</option>
                <option value="Female">Femme</option>
               
              </select>
              <select value={newRole} onChange={e => setNewRole(e.target.value as Employee["role"])} className="rounded-lg border p-2">
                <option value="Administrateur">Administrateur</option>
                <option value="Manager">Manager</option>
                <option value="employé">Employé</option>
              </select>
                  {/* Permissions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(ROLE_DEFAULT_PERMISSIONS[newRole] || []).map(perm => (
                <Button
                  key={perm}
                  size="sm"
                  variant={newPermissions.includes(perm) ? "default" : "outline"}
                  onClick={() => {
                    if (newPermissions.includes(perm)) setNewPermissions(newPermissions.filter(p => p !== perm));
                    else setNewPermissions([...newPermissions, perm]);
                  }}
                >
                  {perm}
                </Button>
              ))}
            </div>
              <input type="file" accept=".pdf,.doc,.docx" onChange={e => setNewCV(e.target.files?.[0] || null)} className="col-span-2" />
            </div>

        

            <Button className="mt-4" onClick={handleAddOrEditEmployee}>
              {editingId ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
