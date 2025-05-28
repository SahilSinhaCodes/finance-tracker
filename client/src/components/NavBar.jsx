import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X } from 'lucide-react'; // Install lucide-react or use Heroicons
import { Moon, Sun } from 'lucide-react'; // icons

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const isHome = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setTimeout(() => navigate('/login'), 100);
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Personal Finance Tracker
        </h1>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex space-x-3">
          {isHome ? (
            <button
              onClick={() => navigate('/transactions')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              Manage Transactions
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Dashboard
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Log Out
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="sm:hidden mt-3 space-y-2">
          {isHome ? (
            <button
              onClick={() => {
                navigate('/transactions');
                setIsOpen(false);
              }}
              className="block w-full text-left bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              Manage Transactions
            </button>
          ) : (
            <button
              onClick={() => {
                navigate('/');
                setIsOpen(false);
              }}
              className="block w-full text-left bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Dashboard
            </button>
          )}
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;