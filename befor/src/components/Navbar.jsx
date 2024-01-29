import React from 'react';
import Logo from '../assets/ci_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import styles from './Nav.module.css';

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
          boxShadow: '0 25px 12px -5px #67a9ff, 0 13px 10px -5px white',
        };
      case '부품공급사':
        return {
          boxShadow: '0 25px 12px -5px #FFA07A, 0 13px 10px -5px white',
        };
      default:
        return {};
    }
  };

  // Navbar의 동적 스타일을 결정하는 함수 (언더라인 그라데이션)
  const navbarStyle = getNavbarStyle(user?.authority);

  return (
    <div className={styles.mainNav} style={navbarStyle}>
      <Link to="/">
        <img src={Logo} alt="KITECH" style={{ width: '200px' }} />
      </Link>

      {/* menu */}
      {user?.email ? (
        <div>
          {user?.authority === '제품제조사' && (
            <>
              <Link to="/product">
                <button className="transition-all text-indigo-500 bg-white font-medium  border-indigo-500 rounded-2xl border-2 px-4 py-2 hover:bg-blue-300 hover:text-gray-600 hover:scale-110 hover:font-semibold ">
                  제품목록
                </button>
              </Link>
              <Link to="/partlistinproduct">
                <button className="transition-all text-orange-400 bg-white font-medium  border-orange-400 border-2 rounded-2xl px-4 py-2 mx-2 hover:bg-orange-300 hover:border-orange-400 hover:text-gray-600 hover:scale-110 hover:font-semibold ">
                  부품목록
                </button>
              </Link>
            </>
          )}
          {user?.authority === '부품공급사' && (
            <Link to="/part">
              <button className="transition-all text-orange-400 bg-white font-medium  border-orange-400 border-2 rounded-2xl px-4 py-2 mx-2 hover:bg-orange-300 hover:border-orange-400 hover:text-gray-600 hover:scale-110 hover:font-semibold ">
                부품목록
              </button>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="transition-all px-4 py-2 ml-2 rounded-2xl border-2 font-medium  border-indigo-500 text-indigo-500 bg-white hover:bg-blue-300 hover:text-gray-600 hover:border-black hover:scale-110 hover:font-semibold"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className={styles.object}>
          <Link to="/login">
            <button className="transition-all px-4 py-2 ml-2 font-medium rounded-2xl border-2 border-indigo-500 text-indigo-500 bg-violet-50 hover:bg-blue-200 hover:text-gray-600 hover:border-black shadow-3xl hover:scale-110 hover:font-semibold">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="transition-all px-4 py-2 ml-2 rounded-2xl font-medium border-2 border-indigo-500 text-indigo-500 bg-violet-50 hover:bg-blue-200 hover:text-gray-600 hover:border-black hover:scale-110 hover:font-semibold">
              <p className="font-morg">Sign Up</p>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
