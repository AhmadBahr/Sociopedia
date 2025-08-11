import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { fetchFeed } from '../features/posts/postsSlice';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { feed, loading, error } = useSelector((s: RootState) => s.posts);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Feed</h1>
      <PostComposer />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-4">
        {feed.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

