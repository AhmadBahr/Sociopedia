import type { Post } from '../features/posts/postsSlice';

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded border p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-full bg-gray-200" />
        <p className="font-medium">{post.user.name}</p>
        <span className="text-gray-500 text-sm ml-auto">{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <p className="mb-2 whitespace-pre-wrap">{post.content}</p>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="rounded mb-2" />
      )}
      <div className="text-sm text-gray-600">{post.likes.length} likes • {post.comments.length} comments</div>
    </div>
  );
}

