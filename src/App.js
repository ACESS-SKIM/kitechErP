import {Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthContextProvider } from './context/AuthContext';
import Main from './pages/Main';
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute';
import Parts from './pages/Parts/Parts';
import Products from './pages/Products/Products';

// import Modal from './components/Modal';

function App() {
  return (
    <>
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          {/* 유저정보가 맞지 않으면(로그인을 하지 않으면) url을 입력해서 강제 접속을 시도해도 / 로 이동되도록 ProtectedRoute로 Product를 감싸줌 */}
          <Route path='/product' element={<ProtectedRoute> <Products /> </ProtectedRoute>} />
          <Route path='/part' element={<ProtectedRoute> <Parts /> </ProtectedRoute>} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
