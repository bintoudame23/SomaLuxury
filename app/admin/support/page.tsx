"use client";

import { useState, useEffect } from "react";
import { Client, Databases, ID } from "appwrite";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Trash, Search, Copy } from "lucide-react";

/* 🔥 APPWRITE CONFIG */
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_TABLE_SUPPORT_ID!;

/* TYPES */
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  reply?: string;
  repliedBy?: string;
  status: "Unread" | "Read";
  date: string;
}

const DEFAULT_REPLY =
  "Bonjour, merci pour votre message. Nous reviendrons vers vous très bientôt.";

export default function AdminContactPage({
  currentUser,
  currentUserRole,
}: {
  currentUser: string;
  currentUserRole: "admin" | "manager" | "employee";
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<"All" | "Unread" | "Read">("All");

  /* 🔥 LOAD FROM APPWRITE */
  const loadMessages = async () => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);

      const formatted = res.documents.map((doc: any) => ({
        id: doc.$id,
        name: doc.name,
        email: doc.email,
        subject: doc.subject,
        message: doc.message,
        reply: doc.reply,
        repliedBy: doc.repliedBy,
        status: doc.status,
        date: doc.date,
      }));

      setMessages(formatted);
    } catch (err) {
      console.error("Erreur load messages:", err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  /* 🔥 SELECT MESSAGE */
  const handleSelect = (msg: Message) => {
    setSelectedMessage(msg);

    if (msg.status === "Unread") {
      databases.updateDocument(DATABASE_ID, COLLECTION_ID, msg.id, {
        status: "Read",
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, status: "Read" } : m
        )
      );
    }

    setReplyText(msg.reply || DEFAULT_REPLY);
  };

  /* 🔥 SEND REPLY */
  const handleSendReply = async () => {
    if (!replyText.trim()) return alert("Le message de réponse est vide !");
    if (!selectedMessage) return;

    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        selectedMessage.id,
        {
          reply: replyText,
          repliedBy: currentUser,
          status: "Read",
        }
      );

      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id
            ? {
                ...m,
                reply: replyText,
                repliedBy: currentUser,
                status: "Read",
              }
            : m
        )
      );

      alert(
        `Réponse envoyée à ${selectedMessage.email} par ${currentUser} !`
      );

      setSelectedMessage(null);
      setReplyText("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi");
    }
  };

  /* 🔥 DELETE */
  const handleDelete = async (id: string) => {
    if (currentUserRole !== "admin" && currentUserRole !== "manager") {
      return alert("Pas de permission !");
    }

    if (!confirm("Supprimer ce message ?")) return;

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);

      setMessages((prev) => prev.filter((m) => m.id !== id));

      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    alert(`Email ${email} copié !`);
  };

  const filtered = messages
    .filter(
      (m) =>
        (filterStatus === "All" || m.status === filterStatus) &&
        (m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          m.subject.toLowerCase().includes(search.toLowerCase()))
    )
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const unreadCount = messages.filter((m) => m.status === "Unread").length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Mail className="w-8 h-8" />
        Gestion des Messages
        {unreadCount > 0 && (
          <Badge variant="destructive">{unreadCount}</Badge>
        )}
      </h1>

      {/* SEARCH */}
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Search className="w-5 h-5 text-gray-500" />

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as any)
          }
          className="border rounded px-2 py-1"
        >
          <option value="All">Tous</option>
          <option value="Unread">Non lus</option>
          <option value="Read">Lus</option>
        </select>
      </div>

      {/* TABLE */}
      <Card>
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
                {filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    className="bg-white hover:shadow rounded-xl cursor-pointer"
                    onClick={() => handleSelect(msg)}
                  >
                    <td>{msg.name}</td>

                    <td className="flex gap-1 items-center">
                      {msg.email}
                      <Copy
                        className="w-4 h-4 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyEmail(msg.email);
                        }}
                      />
                    </td>

                    <td>{msg.subject}</td>
                    <td>{msg.date}</td>

                    <td>
                      <Badge
                        variant={
                          msg.status === "Unread"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {msg.status}
                      </Badge>
                    </td>

                    <td>{msg.reply ? "Oui" : "Non"}</td>
                    <td>{msg.repliedBy || "-"}</td>

                    <td className="text-right">
                      {(currentUserRole === "admin" ||
                        currentUserRole === "manager") && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(msg.id);
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* DETAIL */}
      {selectedMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Détail message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Message :</strong>
              <p className="bg-gray-100 p-2 rounded">
                {selectedMessage.message}
              </p>
            </div>

            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Réponse..."
            />

            <Button onClick={handleSendReply}>
              <Send className="w-4 h-4 mr-2" />
              Envoyer
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}