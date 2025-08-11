import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import PostCard from '../components/PostCard';
import type { Post } from '../features/posts/postsSlice';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [u, p, f] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/posts/user/${id}`),
          api.get(`/users/${id}/friends`),
        ]);
        if (!isMounted) return;
        setProfile(u.data);
        setPosts(p.data);
        setFriends(f.data);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const follow = async () => {
    await api.post(`/users/${id}/follow`);
    const { data } = await api.get(`/users/${id}`);
    setProfile(data);
  };

  const unfollow = async () => {
    await api.post(`/users/${id}/unfollow`);
    const { data } = await api.get(`/users/${id}`);
    setProfile(data);
  };

  const addFriend = async () => {
    await api.post(`/users/${id}/friends`);
    const { data } = await api.get(`/users/${id}/friends`);
    setFriends(data);
  };

  const removeFriend = async () => {
    await api.delete(`/users/${id}/friends`);
    const { data } = await api.get(`/users/${id}/friends`);
    setFriends(data);
  };

  if (loading) return <div className="max-w-2xl mx-auto p-4">Loading...</div>;
  if (!profile) return <div className="max-w-2xl mx-auto p-4">User not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white border rounded p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200" />
          <div>
            <h1 className="text-xl font-semibold">{profile.name}</h1>
            <p className="text-gray-600">{profile.bio}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={follow} className="bg-blue-600 text-white px-3 py-1 rounded">Follow</button>
            <button onClick={unfollow} className="bg-gray-200 px-3 py-1 rounded">Unfollow</button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded p-4 mb-4">
        <h2 className="font-semibold mb-2">Friends</h2>
        {friends.length === 0 ? (
          <p className="text-sm text-gray-600">No friends yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-2">
            {friends.map((f: any) => (
              <li key={f._id} className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
                <span>{f.name}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex gap-2">
          <button onClick={addFriend} className="bg-green-600 text-white px-3 py-1 rounded">Add Friend</button>
          <button onClick={removeFriend} className="bg-gray-200 px-3 py-1 rounded">Remove Friend</button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

