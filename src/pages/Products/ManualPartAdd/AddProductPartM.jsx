import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { getItemsByUser } from '../../../components/getItemsByUser';
import { UserAuth } from '../../../context/AuthContext';
import ProductPartList from './ProductPartList';

export default function AddProductPartM() {
  const { user } = UserAuth(); // 현재 로그인된 사용자 가져오기
  const [parts, setParts] = useState([]); // 부품 목록 상태

  useEffect(() => {
    if (user) {
      getItemsByUser(user, 'users').then(setParts); // 로그인된 사용자의 제품 가져오기
    }
  }, [user]);

  return (
    <div className='mt-20'>
      <div className='flex-wrap align-items-center justify-self-center mb-4'>
        <div className='flex justify-start pt-10'>
          <p className='text-2xl font-bold '>등록부품 리스트</p>
        </div>
        <div className='mt-1'>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }} />
          <ProductPartList parts={parts} uid={user?.uid} /> {/* 부품 목록을 PartList에 전달 */}
        </div>
      </div>
    </div>
  );
}
