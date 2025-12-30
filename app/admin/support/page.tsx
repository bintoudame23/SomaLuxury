"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Trash, Search, Copy } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  reply?: string;
  repliedBy?: string;
  status: "Unread" | "Read";
  date: string;
}

const DEFAULT_REPLY = "Bonjour, merci pour votre message. Nous reviendrons vers vous très bientôt.";

export default function AdminContactPage({ currentUser, currentUserRole }: { currentUser: string; currentUserRole: "admin" | "manager" | "employee" }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Unread" | "Read">("All");

  useEffect(() => {
    const stored = localStorage.getItem("messages");
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const handleSelect = (msg: Message) => {
    setSelectedMessage(msg);
    if (msg.status === "Unread") {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: "Read" } : m));
    }
    setReplyText(msg.reply || DEFAULT_REPLY);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return alert("Le message de réponse est vide !");
    if (!selectedMessage) return;

    setMessages(prev =>
      prev.map(m =>
        m.id === selectedMessage.id
          ? { ...m, reply: replyText, repliedBy: currentUser, status: "Read" }
          : m
      )
    );

    alert(`Réponse envoyée à ${selectedMessage.email} par ${currentUser} !`);
    setSelectedMessage(null);
    setReplyText("");
  };

  const handleDelete = (id: number) => {
    if (currentUserRole !== "admin" && currentUserRole !== "manager") {
      return alert("Vous n'avez pas la permission de supprimer ce message !");
    }
    if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    alert(`Email ${email} copié !`);
  };

  const filtered = messages
    .filter(m => 
      (filterStatus === "All" || m.status === filterStatus) &&
      (m.name.toLowerCase().includes(search.toLowerCase()) ||
       m.email.toLowerCase().includes(search.toLowerCase()) ||
       m.subject.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unreadCount = messages.filter(m => m.status === "Unread").length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Mail className="w-8 h-8" /> Gestion des Messages
        {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
      </h1>

      {/* Recherche et filtres */}
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          placeholder="Rechercher par nom, email ou sujet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Search className="w-5 h-5 text-gray-500" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="All">Tous</option>
          <option value="Unread">Non lus</option>
          <option value="Read">Lus</option>
        </select>
      </div>

      {/* Tableau des messages */}
      <Card className="shadow-lg border">
        <CardHeader>
          <CardTitle>Messages reçus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Sujet</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Réponse</th>
                  <th>Répondu par</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(msg => (
                  <tr
                    key={msg.id}
                    className={`bg-white hover:shadow rounded-xl transition cursor-pointer ${msg.status === "Unread" ? "font-bold" : ""}`}
                    onClick={() => handleSelect(msg)}
                  >
                    <td className="py-2 px-3">{msg.name}</td>
                    <td className="py-2 px-3 flex items-center gap-1">
                      {msg.email} 
                      <Copy className="w-4 h-4 cursor-pointer text-gray-500" onClick={(e) => { e.stopPropagation(); handleCopyEmail(msg.email); }} />
                    </td>
                    <td className="py-2 px-3">{msg.subject}</td>
                    <td className="py-2 px-3">{msg.date}</td>
                    <td className="py-2 px-3">
                      <Badge variant={msg.status === "Unread" ? "destructive" : "default"}>
                        {msg.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-3">{msg.reply ? "Oui" : "Non"}</td>
                    <td className="py-2 px-3">{msg.repliedBy || "-"}</td>
                    <td className="py-2 px-3 text-right flex justify-end gap-2">
                      {(currentUserRole === "admin" || currentUserRole === "manager") && (
                        <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-400">
                      Aucun message trouvé…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Détail du message sélectionné */}
      {selectedMessage && (
        <Card className="shadow-lg border mt-4">
          <CardHeader>
            <CardTitle>Détail du message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><strong>Nom :</strong> {selectedMessage.name}</div>
            <div><strong>Email :</strong> {selectedMessage.email}</div>
            <div><strong>Sujet :</strong> {selectedMessage.subject}</div>
            <div><strong>Date :</strong> {selectedMessage.date}</div>
            <div>
              <strong>Message :</strong>
              <p className="p-2 bg-gray-100 rounded">{selectedMessage.message}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 items-start">
              <Input
                placeholder="Votre réponse..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1"
              />
              <Button className="flex items-center gap-2" onClick={handleSendReply}>
                <Send className="w-5 h-5" /> Envoyer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
