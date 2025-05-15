"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import { getConversations, getMessages, createConversation, sendMessage } from "@/lib/api";
import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// MessagesPage: Implements real-time chat between users using Supabase and backend API.
// Displays conversations, messages, and allows sending/receiving messages in real time.

export default function MessagesPage() {
  // Get the current user from localStorage
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || '{}') : {};
  const userId = user.id;
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      // Fetch all conversations for the user
      const convoRes = await getConversations({ userId });
      let conversationsList = convoRes.data || [];
      let selectedConvo = null;

      const otherUserId = searchParams.get("conversationWith");
      // Transform conversations to include other user's name
      const userFriendlyConversations = conversationsList.map((convo: any) => {
        const isUser1 = convo.user1_id === userId;
        const otherUser = isUser1 ? convo.conversations_user2_id_fkey : convo.conversations_user1_id_fkey;
        return {
          ...convo,
          otherUserName: otherUser?.full_name,
          otherUserId: otherUser?.id,
        };
      });
      conversationsList = userFriendlyConversations;

      if (conversationsList.length > 0) {
        selectedConvo = conversationsList[0];
      } else {
        // If no conversation exists, create a new one
        const newConvoRes = await createConversation({ userId, otherUserId: otherUserId ?? undefined });
        selectedConvo = newConvoRes.data;
        conversationsList = [selectedConvo];
      }

      setConversations(conversationsList);
      setSelectedConversation(selectedConvo);
      console.log('selectedConvo', selectedConvo);  
      if (selectedConvo) {
        // Fetch messages for the selected conversation
        const msgRes = await getMessages({ conversationId: selectedConvo.id });
        setMessages(msgRes.data ? msgRes.data.reverse() : []);
      } else {
        setMessages([]);
      }
      setLoading(false);
    })();
  }, [userId, searchParams]);

  useEffect(() => {
    if (!selectedConversation) return;
    // Subscribe to real-time message inserts for the current conversation
    const subscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        payload => {
          // Only add if the message is for the current conversation
          if (payload.new.conversation_id === selectedConversation.id) {
            setMessages(prevMessages => [...prevMessages, payload.new]);
          }
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedConversation]);

  useEffect(() => {
    // Scroll to the latest message when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const content = (form.elements.namedItem('message') as HTMLInputElement).value;
    if (!content) return;
    // Send message to the backend
    await sendMessage({
      conversation_id: selectedConversation.id,
      sender_id: userId,
      content,
    });
    // setMessages(prevMessages => [...prevMessages, messageRes]);
    form.reset();
  };

  return (
    <div className="flex h-[70vh] border rounded-lg overflow-hidden animate-fade-in">
      <aside className="w-1/3 border-r p-4 bg-muted">
        <h2 className="font-semibold mb-4">Conversations</h2>
        <div className="space-y-2">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              className={`h-10 bg-white rounded px-2 flex items-center shadow hover:shadow-lg transition-shadow cursor-pointer ${selectedConversation?.id === convo.id ? 'border border-primary' : ''}`}
              onClick={() => setSelectedConversation(convo)}
            >
              {convo.otherUserName}
            </div>
          ))}
        </div>
      </aside>
      <section className="flex-1 flex flex-col">
        <header className="p-4 border-b font-semibold">
          Conversation
        </header>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-white">
          {loading ? (
            <div>Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-muted-foreground">No messages.</div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === userId;
              return (
                <div
                  key={msg.id + Math.random()}
                  className={`p-2 rounded-lg max-w-xs ${
                    isMe
                      ? 'bg-primary text-primary-foreground self-end text-right ml-auto'
                      : 'bg-muted self-start text-left mr-auto'
                  }`}
                  style={{ marginBottom: '8px' }}
                >
                  <div style={{ fontSize: '0.8em', fontWeight: 'bold', marginBottom: 2 }}>
                    {isMe ? 'You' : selectedConversation?.otherUserName || 'Other'}
                  </div>
                  {msg.content}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex p-4 border-t gap-2">
          <input name="message" className="flex-1 border rounded px-3 py-2" placeholder="Type a message" />
          <Button type="submit" className="transition-transform hover:scale-105">Send</Button>
        </form>
      </section>
    </div>
  );
} 