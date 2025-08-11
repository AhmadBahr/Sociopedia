import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchConversations, fetchMessages, receiveMessage, sendMessage, setActiveUser } from '../features/chat/chatSlice';
import { getSocket } from '../lib/socket';

export default function Chat() {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, messages, activeUserId } = useSelector((s: RootState) => s.chat);
  const me = useSelector((s: RootState) => s.auth.user);
  const [text, setText] = useState('');

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    const socket = getSocket();
    const onMessage = (msg: any) => dispatch(receiveMessage(msg));
    socket.on('chat:message', onMessage);
    return () => {
      socket.off('chat:message', onMessage);
    };
  }, [dispatch]);

  useEffect(() => {
    if (activeUserId) dispatch(fetchMessages(activeUserId));
  }, [activeUserId, dispatch]);

  const activeMessages = useMemo(() => (activeUserId ? messages[activeUserId] ?? [] : []), [messages, activeUserId]);

  const submit = () => {
    if (!text.trim() || !activeUserId) return;
    dispatch(sendMessage({ to: activeUserId, text }));
    setText('');
  };

  const onTyping = (typing: boolean) => {
    const socket = getSocket();
    if (activeUserId) socket.emit('chat:typing', { to: activeUserId, typing });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-140px)] flex gap-4">
      <aside className="w-64 bg-white border rounded p-3 overflow-auto">
        <h2 className="font-semibold mb-2">Conversations</h2>
        <ul className="space-y-1">
          {conversations.map((c) => {
            const other = c.participants.find((p) => p._id !== me?.id);
            if (!other) return null;
            const isActive = activeUserId === other._id;
            return (
              <li key={c._id}>
                <button
                  onClick={() => dispatch(setActiveUser(other._id))}
                  className={`w-full text-left px-2 py-1 rounded ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  {other.name}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto bg-white border rounded p-4 space-y-2">
          {activeMessages.map((m) => (
            <div key={m._id} className={`max-w-[70%] ${m.from === me?.id ? 'ml-auto bg-blue-50' : 'mr-auto bg-gray-50'} rounded px-3 py-2`}>
              <p>{m.text}</p>
              <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={text} onChange={(e) => { setText(e.target.value); onTyping(true); }} className="flex-1 border rounded px-3 py-2" placeholder="Type a message" />
          <button onClick={submit} className="bg-blue-600 text-white px-4 rounded">Send</button>
        </div>
      </section>
    </div>
  );
}

