"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { updateProfilePicture, getProfile } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((user) => {
        setName(user.full_name || "");
        setEmail(user.email || "");
        setAvatarUrl(user.avatar_url || null);
        setUserId(user.id || null);
      })
      .catch((err) => setError(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    try {
      const { data, error } = await supabase.storage.from('avatars').upload(`public/${userId}_${file.name}`, file, { upsert: true });
      if (error) throw error;
      const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(data.path);
      const publicUrl = publicData.publicUrl;
      setAvatarUrl(publicUrl);
      await updateProfilePicture({ user_id: userId, avatar_url: publicUrl });
      setSuccess("Profile picture updated!");
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // TODO: Call backend to update name, etc.
    setSuccess("Profile updated (demo)");
  };

  if (loading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
      <form className="space-y-6" onSubmit={handleSave}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full bg-muted overflow-hidden flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="object-cover w-full h-full" />
            ) : (
              <span className="text-muted-foreground">No Image</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload New Picture"}
          </Button>
        </div>
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
            value={email}
            readOnly
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <Button className="w-full transition-transform hover:scale-105" type="submit">Save Changes</Button>
      </form>
    </div>
  );
} 