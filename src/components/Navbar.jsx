import React from 'react';
import Logo from '../assets/ci_logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logOut } = UserAuth()
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const getNavbarStyle = (authority) => {
    switch (authority) {
      case '제품제조사':
        return {
          boxShadow: '0 10px 10px -5px #6AA7FF, 0 5px 5px -5px white',
        };
      case '부품공급사':
        return {
          boxShadow: '0 10px 10px -5px #FEC26D, 0 5px 5px -5px white',
        };
      default:
        return {};
    }
  };

  // Navbar의 동적 스타일을 결정하는 함수 (언더라인 그라데이션)
  const navbarStyle = getNavbarStyle(user?.authority);

  return (
    <div
      className='flex max-w-screen-2xl items-center justify-between p-1 z-[100] w-full bg-white absolute'
      style={navbarStyle}>
      <Link to='/'>
        <img src={Logo} alt='KITECH' style={{ width: '200px' }} />
      </Link>

      {/* menu */}
      {user?.email ? (
        <div>
          {user?.authority === "제품제조사" && (
            <>
              <Link to='/product'>
                <button className='text-indigo-500 bg-white border-indigo-500 px-4 py-2 hover:bg-indigo-500 hover:text-white'>제품목록</button>
              </Link>
              <Link to='/partlistinproduct'>
                <button className='text-green-500 bg-white border-green-500 px-4 py-2 mx-2 hover:bg-green-500 hover:text-white'>부품목록</button>
              </Link>
            </>
          )}
          {user?.authority === "부품공급사" && (
            <Link to='/part'>
              <button className='text-[#FF8000] bg-white border-[#FF8000] px-4 py-2 mx-2 hover:bg-[#FF8000] hover:text-white'>부품목록</button>
            </Link>
          )}

          <button onClick={handleLogout} className='px-4 py-2 ml-2 rounded text-white'>Logout</button>
        </div>
      ) : (
        <div>
          <Link to='/login'>
            <button className='text-indigo-500 bg-white border-indigo-500 px-4 py-2 mx-2 hover:bg-indigo-500 hover:text-white'>Log In</button>
          </Link>
          <Link to='/signup'>
            <button className='px-4 py-2 ml-2 rounded text-white'>Sign Up</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
