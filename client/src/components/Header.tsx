import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';

export default function Header() {
  const { token, user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-semibold">Sociopedia</Link>
        <div className="ml-auto flex items-center gap-4">
          {token ? (
            <>
              <Link to="/" className="text-gray-700">Home</Link>
              {user && (
                <Link to={`/profile/${user.id}`} className="text-gray-700">Profile</Link>
              )}
              <Link to="/chat" className="p-2 rounded hover:bg-gray-100" aria-label="Messages">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                  <path d="M1.5 6.75A3.75 3.75 0 0 1 5.25 3h13.5A3.75 3.75 0 0 1 22.5 6.75v6A3.75 3.75 0 0 1 18.75 16.5H9.31l-3.9 3.25A1.125 1.125 0 0 1 3 18.875V16.5A3.75 3.75 0 0 1 1.5 12.75v-6Z"/>
                </svg>
              </Link>
              <button onClick={onLogout} className="text-gray-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600">Login</Link>
              <Link to="/register" className="text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

