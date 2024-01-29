import React from 'react';

const Modal = ({ openModal, setOpenModal }) => {
  // if (!open) return null;

  return (
    // Main Modal
    <div className="fixed inset-20 bg-black bg-opacity-25 z-20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-2 rounded w-72">
        <h1 className="font-semibold text-center text-xl text-gray-700">
          Create Product
        </h1>
        <p className="text-center text-gray-700 mb-5">제품을 등록하세요.</p>

        <div className="flex flex-col">
          <label hidden="">제품 카테고리</label>
          <select
            name="category"
            id="category"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"'>
            <option selected="">Select Category</option>
            <option value="AirConditional">에어컨</option>
            <option value="">세탁기</option>
            <option value="">냉장고</option>
          </select>
          <label htmlFor="">제품 중량(kg)</label>
          <input
            type="number"
            className=''
            placeholder='제품중량을 입력하세요.'
          />
          <label htmlFor="">제품명</label>
          <input
            type="text"
            className="border border-gray-700 p-2 rounded mb-5 "
            placeholder="제품명을 입력하세요."
          />
          <label htmlFor="">S/N</label>
          <input
            type="text"
            className="border border-gray-700 p-2 rounded mb-5"
            placeholder="S/N을 입력하세요."
          />
          <label htmlFor="">제품 사진</label>

          <label htmlFor="">제품등록시간</label>

          <label htmlFor="">메모</label>
          <textarea
            name="memo"
            id="memo"
            cols="30"
            rows="3"
            className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write product description here'></textarea>


        </div>
        <div className="text-center">
          <button className="px-5 py-2 mr-12 bg-gray-700 text-white rounded">
            Registration
          </button>
          <button
            className="px-5 py-2 bg-gray-700 text-white rounded"
            onClick={() => { setOpenModal(false); }}>
            Cancel
          </button>
        </div>
      </div>
    </div >
  );
};

export default Modal;



