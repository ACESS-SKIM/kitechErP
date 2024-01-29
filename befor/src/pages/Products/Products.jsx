import React, { useEffect, useState } from 'react'
import ProductList from '../Products/ProductList';
import { Box } from '@mui/material';
import { getItemsByUser } from '../../components/getItemsByUser';
import { UserAuth } from '../../context/AuthContext';

const Products = () => {
  const { user } = UserAuth(); // 현재 로그인된 사용자 가져오기
  console.log(user);
  const [products, setProducts] = useState([]); // 제품 목록 상태

  // useEffect 코드의 목적 : 현재 로그인된 사용자의 정보가 변경될 때마다 Firebase에서 해당 사용자의 제품 정보를 가져와 products 상태에 설정
  useEffect(() => {
    if (user) {
      console.log(user);
      getItemsByUser(user, 'users').then(setProducts); // 로그인된 사용자의 제품 가져오기
    }
  }, [user]);

  return (
    <div className='w-full h-[140px]' >
      <div className='mt-20'>
        <div className='flex-wrap align-items-center justify-self-center mb-4'>
          {/* 제품등록/조회 Text */}
          <div div className='flex justify-start pt-10' >
            <p className='text-2xl font-bold '>등록제품 리스트</p>
          </div >
          {/* 제품목록 표 생성 */}
          <div className='mt-1'>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }} />

            <ProductList products={products} uid={user?.uid} />

          </div>
        </div >
      </div >
    </div>
  )
}

export default Products