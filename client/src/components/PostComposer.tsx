import { useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { createPost } from '../features/posts/postsSlice';

export default function PostComposer() {
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    const res = await dispatch(createPost({ content, image }));
    if ((res as any).meta.requestStatus === 'fulfilled') {
      setContent('');
      setImage(null);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded p-4 mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full border rounded p-2 mb-2 resize-none"
        rows={3}
      />
      <div className="flex items-center gap-3">
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
        <button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Post</button>
      </div>
    </form>
  );
}

