"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'; 
import { IoCartOutline } from "react-icons/io5";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [emailFirstLetter, setEmailFirstLetter] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwt.decode(token) as { email: string };
      setEmailFirstLetter(decodedToken.email.charAt(0).toUpperCase());
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown') && !target.closest('.profile-icon')) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-500 shadow-md">
      <h1 
        className="text-white text-2xl font-semibold cursor-pointer font-mono " 
        onClick={() => router.push('/')} 
      >
        Property Rental
      </h1>
      <div className="flex items-center">
        <button 
          onClick={() => router.push('/cart')} 
          className="text-white text-2xl mr-6 transition-transform transform hover:scale-110"
        >
          <IoCartOutline />
        </button>
        {isLoggedIn ? (
          <div className="relative">
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 bg-opacity-30 text-white backdrop-blur-md profile-icon shadow-md hover:bg-opacity-50 transition"
              onClick={toggleDropdown}
            >
              <span className="font-bold">{emailFirstLetter}</span>
            </button>
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-lg profile-dropdown transition">
                <button 
                  onClick={() => router.push('/profile')} 
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-300 hover:bg-opacity-50 transition-colors rounded-t-md"
                >
                  Profile
                </button>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-300 hover:bg-opacity-50 transition-colors rounded-b-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button 
              onClick={() => router.push('/signup')} 
              className="text-white text-lg mr-4 hover:text-gray-300 transition-colors"
            >
              Signup
            </button>
            <button 
              onClick={() => router.push('/login')} 
              className="text-white text-lg hover:text-gray-300 transition-colors"
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
