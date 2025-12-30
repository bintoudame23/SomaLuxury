"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
  User,
  ShieldCheck,
  Cog,
  Moon,
  Bell,
  Trash2,
  Smartphone,
  Globe,
  Key,
} from "lucide-react";

/**
 * SettingsPage
 *
 * Stocke les préférences dans localStorage sous la clé "admin_settings".
 * Stocke aussi le profil (nom/prenom/email/phone/avatar) sous "admin_profile".
 * Les produits/utilisateurs/commandes restent inchangés : cette page ne gère
 * que les réglages et le profil.
 */

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string; // data URL
};

type Settings = {
  darkMode: boolean;
  language: string;
  emailsNotif: boolean;
  smsNotif: boolean;
  twoFA: boolean;
};

const PROFILE_KEY = "admin_profile_v1";
const SETTINGS_KEY = "admin_settings_v1";

export default function SettingsPage() {
  const router = useRouter();

  // Profile state
  const [profile, setProfile] = useState<Profile>({
    firstName: "Fatou",
    lastName: "Sylla",
    email: "fatou@example.com",
    phone: "77 123 45 67",
    avatar: undefined,
  });

  // Password fields (not persisted)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Settings state
  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    language: "fr",
    emailsNotif: true,
    smsNotif: false,
    twoFA: false,
  });

  // Loading saved data from localStorage
  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem(PROFILE_KEY);
      if (rawProfile) setProfile(JSON.parse(rawProfile));

      const rawSettings = localStorage.getItem(SETTINGS_KEY);
      if (rawSettings) {
        const parsed: Settings = JSON.parse(rawSettings);
        setSettings(parsed);
        // apply theme immediately
        applyTheme(parsed.darkMode);
      }
    } catch (e) {
      console.error("Erreur lecture localStorage", e);
    }
  }, []);

  // Helpers
  const saveProfile = (p: Profile) => {
    setProfile(p);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  };

  const saveSettings = (s: Settings) => {
    setSettings(s);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    // apply theme immediately
    applyTheme(s.darkMode);
  };

  const applyTheme = (dark: boolean) => {
    try {
      const root = document.documentElement;
      if (dark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } catch (e) {
      // in SSR-less contexts or during tests, ignore
    }
  };

  // Profile handlers
  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const next = { ...profile, avatar: dataUrl };
      saveProfile(next);
      alert("Avatar mis à jour.");
    };
    reader.onerror = () => alert("Erreur lors du chargement de l'image.");
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    // basic validation
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      alert("Le nom et le prénom sont requis.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      alert("Email invalide.");
      return;
    }
    saveProfile(profile);
    alert("Profil sauvegardé.");
  };

  // Password handlers (mock)
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Remplissez tous les champs mot de passe.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("La confirmation ne correspond pas.");
      return;
    }
    if (newPassword.length < 6) {
      alert("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    // Ici tu appellerais ton API pour changer le mot de passe.
    // Nous faisons une simulation côté client :
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Mot de passe mis à jour (simulation). Relie cette action à ton API pour le rendre réel.");
  };

  // 2FA toggle (mock) — show confirm when enabling
  const handleToggle2FA = async (enable: boolean) => {
    if (enable) {
      const ok = confirm(
        "Activer l'authentification à deux facteurs (2FA) ? Cela ajoutera une couche de sécurité."
      );
      if (!ok) return;
    } else {
      const ok = confirm("Désactiver la 2FA ?");
      if (!ok) return;
    }
    const next = { ...settings, twoFA: enable };
    saveSettings(next);
    alert(enable ? "2FA activée (simulation)." : "2FA désactivée.");
  };

  // Theme toggle
  const handleToggleDark = (val: boolean) => {
    saveSettings({ ...settings, darkMode: val });
  };

  // Notifications toggles
  const handleToggleEmailsNotif = (val: boolean) => saveSettings({ ...settings, emailsNotif: val });
  const handleToggleSmsNotif = (val: boolean) => saveSettings({ ...settings, smsNotif: val });

  // Language select
  const handleLanguageChange = (lang: string) => {
    saveSettings({ ...settings, language: lang });
  };

  // Delete account (mock)
  const handleDeleteAccount = () => {
    const ok = confirm(
      "Supprimer le compte ? Cela supprimera les données locales (profil & paramètres). Cette action est irréversible."
    );
    if (!ok) return;

    // Purge local storage keys we used
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      // optionally clear other app data if needed:
      // localStorage.removeItem("produits"); localStorage.removeItem("commandes"); etc.
    } catch (e) {
      console.error("Erreur purge localStorage", e);
    }

    alert("Compte supprimé localement. Tu vas être redirigé.");
    // redirect to home or login
    router.push("/");
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Cog className="text-blue-600" /> Paramètres du compte
      </h1>

      {/* ===== INFOS PERSONNELLES ===== */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="text-blue-600" /> Informations personnelles
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24">
                {profile.avatar ? (
                  <AvatarImage src={profile.avatar} />
                ) : (
                  <AvatarFallback>{(profile.firstName || "U").charAt(0)}</AvatarFallback>
                )}
              </Avatar>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => handleProfileChange("firstName", e.target.value)}
                />
              </div>

              <div>
                <Label>Nom</Label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => handleProfileChange("lastName", e.target.value)}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label>Téléphone</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-4">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-upload" />
                  <div className="px-3 py-2 border rounded-md bg-white hover:bg-gray-50 cursor-pointer text-sm">
                    Changer l'avatar
                  </div>
                </label>

                <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Enregistrer le profil
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== SÉCURITÉ ===== */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="text-green-600" /> Sécurité et confidentialité
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Password change */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Mot de passe actuel</Label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>

            <div>
              <Label>Nouveau mot de passe</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>

            <div>
              <Label>Confirmer nouveau mot de passe</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleChangePassword} className="bg-green-600 hover:bg-green-700 text-white">
              Mettre à jour le mot de passe
            </Button>

            <Button variant="outline" onClick={() => { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}>
              Annuler
            </Button>
          </div>

          {/* 2FA */}
          <Separator />

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Authentification à deux facteurs (2FA)</h3>
              <p className="text-sm text-gray-500">Augmente la sécurité de votre compte en demandant un second facteur.</p>
            </div>

            <div>
              <Switch checked={settings.twoFA} onCheckedChange={(v) => handleToggle2FA(Boolean(v))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== PRÉFÉRENCES ===== */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="text-purple-600" /> Préférences
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Moon />
              <div>
                <Label className="mb-0">Mode sombre</Label>
                <p className="text-sm text-gray-500">Active le thème sombre partout.</p>
              </div>
            </div>

            <Switch checked={settings.darkMode} onCheckedChange={(v) => handleToggleDark(Boolean(v))} />
          </div>

          {/* Language */}
          <div>
            <Label>Langue</Label>
            <div className="mt-2">
              <select value={settings.language} onChange={(e) => handleLanguageChange(e.target.value)} className="w-full p-2 border rounded-md">
                <option value="fr">Français</option>
                <option value="en">English</option>
               
              </select>
            </div>
          </div>

          {/* Notifications */}
          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell />
                <div>
                  <Label className="mb-0">Notifications par email</Label>
                  <p className="text-sm text-gray-500">Recevoir des emails pour les nouvelles commandes et alertes.</p>
                </div>
              </div>

              <Switch checked={settings.emailsNotif} onCheckedChange={(v) => handleToggleEmailsNotif(Boolean(v))} />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Smartphone />
                <div>
                  <Label className="mb-0">Notifications SMS</Label>
                  <p className="text-sm text-gray-500">Recevoir des notifications importantes par SMS.</p>
                </div>
              </div>

              <Switch checked={settings.smsNotif} onCheckedChange={(v) => handleToggleSmsNotif(Boolean(v))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== SUPPRESSION ===== */}
      <Card className="shadow-lg border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 /> Suppression du compte
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 mb-4">
            Cette action est définitive et irréversible. Assurez-vous de vouloir supprimer votre compte avant de continuer.
          </p>

          <div className="flex gap-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteAccount}>
              Supprimer mon compte
            </Button>

            <Button variant="outline" onClick={() => {
              // Undo: reload saved profile & settings
              const p = localStorage.getItem(PROFILE_KEY);
              const s = localStorage.getItem(SETTINGS_KEY);
              if (p) setProfile(JSON.parse(p));
              if (s) setSettings(JSON.parse(s));
              alert("Restauration depuis le stockage local (si existant).");
            }}>
              Annuler / Restaurer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
