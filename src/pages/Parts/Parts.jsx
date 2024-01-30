import React, { useEffect, useState } from 'react';
import PartList from './PartList';
import { Box } from '@mui/material';
import { getItemsByUser } from '../../components/getItemsByUser';
import { UserAuth } from '../../context/AuthContext';

const Parts = () => {
  const { user } = UserAuth(); // 현재 로그인된 사용자 가져오기
  console.log(user);
  const [parts, setParts] = useState([]); // 부품 목록 상태


  useEffect(() => {
    if (user) {
      console.log(user);
      getItemsByUser(user, 'users').then(setParts); // 로그인된 사용자의 제품 가져오기
    }
  }, [user]);

  return (
    <div className='w-full h-[140px]'>
      <div className='mt-20'>
        <div className='flex-wrap align-items-center justify-self-center mb-4'>
          <div div className='flex justify-start pt-10' >
            <p className='text-2xl font-bold '>등록부품 리스트</p>
          </div >
          <div className='mt-1'>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }} />
            <PartList parts={parts} uid={user?.uid} /> {/* 부품 목록을 PartList에 전달 */}
          </div>
        </div >
      </div >
    </div >
  )
}

export default Parts
