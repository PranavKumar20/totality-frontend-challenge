"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'; // Use jsonwebtoken

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [emailFirstLetter, setEmailFirstLetter] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Decode the token
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
    <nav className="flex justify-between items-center p-4 bg-blue-500">
      <h1 
        className="text-white text-xl cursor-pointer" 
        onClick={() => router.push('/')} // Redirect to homepage
      >
        Property Rental
      </h1>
      <div className="flex items-center">
        <button 
          onClick={() => router.push('/cart')} // Redirect to cart page
          className="text-white mr-4"
        >
          🛒 {/* You can replace this with a cart icon from an icon library */}
        </button>
        {isLoggedIn ? (
          <div className="relative">
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 profile-icon"
              onClick={toggleDropdown}
            >
              <span className="font-bold">{emailFirstLetter}</span>
            </button>
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md profile-dropdown">
                <button 
                  onClick={() => router.push('/profile')} 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Profile
                </button>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={() => router.push('/signup')} className="text-white mr-4">Signup</button>
            <button onClick={() => router.push('/login')} className="text-white">Login</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
