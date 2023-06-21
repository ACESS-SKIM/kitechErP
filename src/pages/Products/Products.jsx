import React from 'react'
import ProductList from '../Products/ProductList';
import { Box } from '@mui/material';

const Products = () => {
  // const [openModal, setOpenModal] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };



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

            <ProductList />

          </div>
        </div >
      </div >
    </div>
  )
}

export default Products





          // {/* 제품등록/조회 Text */}
          // <div div className='flex justify-start pt-10' >
          //   <p className='text-2xl font-bold '>제품등록/조회</p>
          // </div >
// {/* 제품등록 버튼 */ }
// {/* <!-- Modal toggle --> */ }
// {/* <div className='flex justify-end'>
//             <button
//               className="open-modal-button bg-indigo-600 px-3 py-1 mt-2"
//               onClick={() => {
//                 setOpenModal(true);
//               }}>
//               Create Product
//             </button>
//             {openModal && <Modal openModal={openModal} setOpenModal={setOpenModal} />}
//           </div> */}




// {/* 검색창 */ }
// {/* <div className="flex justify-end mt-5">
//             <label
//               htmlFor="search-dropdown"
//               className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
//             >
//               Your Email
//             </label>
//             <button
//               id="dropdown-button"
//               className="flex-shrink-0 z-5 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
//               onClick={toggleDropdown} // 버튼 클릭 시 드롭다운 토글 함수 호출
//               type="button"
//             >
//               All categories
//               <svg
//                 aria-hidden="true"
//                 className="w-4 h-4 ml-1"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 ></path>
//               </svg>
//             </button>
//             {isOpen && ( // 드롭다운이 열려있을 때만 보여줌
//               <div
//                 id="dropdown"
//                 className="z-5 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
//               >
//                 <ul
//                   className="py-2 text-sm text-gray-700 dark:text-gray-200"
//                   aria-labelledby="dropdown-button"
//                 >
//                   <li>
//                     <button
//                       type="button"
//                       className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                     >
//                       Product1
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       type="button"
//                       className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                     >
//                       Product2
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             )}
//             <div className="relative w-80">
//               <input
//                 type="search"
//                 id="search-dropdown"
//                 className="block p-2.5 w-full z-10 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
//                 placeholder="Search Items"
//                 required />
//               <button
//                 type="submit"
//                 className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//                 <svg
//                   aria-hidden="true"
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
//                   </path>
//                 </svg>
//                 <span className="sr-only">Search</span>
//               </button>
//             </div>
//           </div> */}

