import React from 'react'

import bgImg from '../assets/cyber-bg.png'

const Hero = () => {
  return (
    // 본문 페이지 좌측 Text 3줄, Get Started 버튼 배치 및 꾸미기
    <div className='w-full h-screen bg-zinc-200 flex flex-col justify-between'>
      <div className='grid md:grid-cols-2 max-w-[1240px] m-auto'>
        <div className='flex flex-col justify-center md:items-start w-full px-2 py-8'>
          <p className='text-xl font-bold text-indigo-400'>친환경 제품 개발 및 환경 규제 대응을 위한</p>
          <h1 className='py-3 text-3xl md:text-4xl font-bold'>친환경 제품 자원효율성 <br /> 평가 지원 통합 시스템</h1>
          <p className='text-lg font-bold text-zinc-400'>Material Efficiency Assessment Integrated System</p>
          {/* <button className='py-3 px-6 sm:w-[60%] my-4'>Get Started</button> */}
        </div>
        {/* 우측 cyber-bg.png 그림 배치 */}
        <div>
          <img className='w-full' src={bgImg} alt="/" />
        </div>
        {/* 하단 박스 배치 및 꾸미기 */}
        {/* <div className='absolute flex flex-col py-8 md:min-w-[760px] bottom-[5%] mx-1 md:left-1/2 transform md:-translate-x-1/2 bg-zinc-200 border border-slate-300 rounded-xl text-center shadow-xl'>
          <p>Data Services</p>
          <div className='flex justify-between flex-wrap px-4' >
            <p className='flex px-4 py-2 text-slate-500'><CloudUploadIcon className='h-6 text-indigo-600' /> App Security</p>
            <p className='flex px-4 py-2 text-slate-500'><DatabaseIcon className='h-6 text-indigo-600' /> Deshboard Design</p>
            <p className='flex px-4 py-2 text-slate-500'><ServerIcon className='h-6 text-indigo-600' /> Cloud Data</p>
            <p className='flex px-4 py-2 text-slate-500'><PaperAirplaneIcon className='h-6 text-indigo-600' /> API</p>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Hero