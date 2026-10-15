import { NavLink } from 'react-router-dom';

const Navigation = () => {
  const baseClasses = "block px-4 py-2 rounded mb-2 transition-colors";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <nav className="p-4 flex-1">
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        Dashboard
      </NavLink>
      <NavLink 
        to="/salaries" 
        className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        Salaries
      </NavLink>
      <NavLink 
        to="/promotions" 
        className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        Promotions
      </NavLink>
      <NavLink 
        to="/export" 
        className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        Export
      </NavLink>
    </nav>
  );
};

export default Navigation;
