import React, { useState } from 'react';
import Logo from '../assets/ci_logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logOut } = UserAuth()
  const navigate = useNavigate();
  // console.log(user)

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex max-w-screen-2xl items-center justify-between p-1 z-[100] w-full bg-white absolute'>
      <Link to='/'>
        <img src={Logo} alt='KITECH' style={{ width: '200px' }} />
      </Link>

      {/* menu */}
      {user?.email ? (
        <div>
          <Link to='/product'>
            <button className='text-indigo-600 bg-white border-white px-4 py-2 hover:border-indigo-600'>Products</button>
          </Link>
          <Link to='/part'>
            <button className='text-red-500 bg-white border-white px-4 py-2 mx-2 hover:border-red-500 hover:text-red-500'>Parts</button>
          </Link>
          <button onClick={handleLogout} className='px-4 py-2 ml-2 rounded text-white'>Logout</button>
        </div>
      ) : (
        <div>
          <Link to='/login'>
            <button className='text-indigo-600 bg-white border-white px-4 py-2 hover:border-indigo-600'>Sign In</button>
          </Link>
          <Link to='/signup'>
            <button className='px-4 py-2 rounded text-white'>Sign Up</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;


