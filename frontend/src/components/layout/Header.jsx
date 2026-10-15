import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContextDef';

const Header = () => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center border-b">
      <h1 className="text-xl font-bold text-gray-800">Salary Growth Tracker</h1>
      <button 
        onClick={logout}
        className="text-sm bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
