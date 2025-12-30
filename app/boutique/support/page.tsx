"use client";

import { useState, useEffect } from "react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  reply?: string;
  status: "Unread" | "Read";
  date: string;
}

export default function ContactSupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  // Charger tous les messages depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem("messages");
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  // Envoyer un nouveau message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMessage: Message = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      status: "Unread",
      date: new Date().toLocaleString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem("messages", JSON.stringify(updatedMessages));

    setSuccess("Votre message a été envoyé avec succès !");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  // Messages ayant une réponse
  const repliedMessages = messages.filter((m) => m.reply);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {/* --- Formulaire Contact --- */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl mb-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Contactez-nous
        </h1>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              placeholder="exemple@email.com"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Sujet</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              placeholder="Sujet du message"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Message</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none h-32 resize-none"
              placeholder="Votre message..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
          >
            Envoyer
          </button>
        </form>
      </div>

    
      <div className="w-full max-w-2xl space-y-6">
        <h2 className="text-2xl font-bold mb-4">Réponses du support</h2>

        {repliedMessages.length === 0 && (
          <p className="text-gray-500">Aucune réponse pour le moment…</p>
        )}

        {repliedMessages.map((msg) => (
          <div key={msg.id} className="border p-4 rounded-xl shadow bg-white">
            <h3 className="font-bold text-lg">{msg.subject}</h3>
            <p className="text-sm text-gray-600 mt-1">Message envoyé : {msg.message}</p>

            <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded">
              <strong>Réponse du support :</strong>
              <p>{msg.reply}</p>
            </div>

            <div className="text-right text-xs text-gray-400 mt-2">
              Date : {msg.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
