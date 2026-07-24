"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  Cog,
  Moon,
  Bell,
  Trash2,
  Smartphone,
} from "lucide-react";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

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
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


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

    }
  };


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

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Mot de passe mis à jour (simulation). Relie cette action à ton API pour le rendre réel.");
  };

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
    } catch (e) {
      console.error("Erreur purge localStorage", e);
    }

    alert("Compte supprimé localement. Tu vas être redirigé.");
    router.push("/");
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Cog className="text-blue-600" /> Paramètres du compte
      </h1>


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
