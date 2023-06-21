import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

// 만일 유저가 아니라면 홈으로 이동, 맞다면 children을 리턴
const ProtectedRoute = ({ children }) => {
  const {user} = UserAuth()
  
  if(!user) {
    return <Navigate to='/' />;
  } else {
    return children;
  }
};

export default ProtectedRoute