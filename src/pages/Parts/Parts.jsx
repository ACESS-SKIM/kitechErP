import React from 'react'
import { Box } from '@mui/material';
import PartList from './PartList';

const Parts = () => {



  return (
    <div className='w-full h-[140px]'>
      <div className='mt-20'>
        <div className='flex-wrap align-items-center justify-self-center mb-4'>
          {/* 제품등록/조회 Text */}
          <div div className='flex justify-start pt-10' >
            <p className='text-2xl font-bold '>등록부품 리스트</p>
          </div >
          {/* 제품목록 표 생성 */}
          <div className='mt-1'>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }} />

            <PartList />

          </div>
        </div >
      </div >
    </div >
  )
}

export default Parts