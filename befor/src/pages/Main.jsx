import React, { useState } from 'react';
import styles from './main.module.css';
import bgImg from '../assets/cyber-bg.png';
import bgPanel_1 from '../assets/recycle_nature.jpg';
import bgPanel_2 from '../assets/recycle_earth.jpg';
import bgPanel_3 from '../assets/recycle_light.jpg';
import bgPanel_4 from '../assets/recycle_tree.jpg';

const Hero = () => {

  // const [company, setCompany] = useState(false);
  // const eventactive = () => {
  //   setCompany(true);
  //   }
  //   if (company === true) {
  //     document.querySelector('.sub_list_company').sub_list_company.height = '100';
  //   }
  return (
    // 본문 페이지 좌측 Text 3줄, Get Started 버튼 배치 및 꾸미기
    <div className={styles.main_container}>
      <div className={styles.main_menu_container}>
        <div className={styles.main_menu}>
          <div className={styles.main_menu_list}>
            <button className={styles.main_menu_button} id="info">
              Information
            </button>
            <ul className={styles.sub_list_info}>
              <li>리스트</li>
              <li>리스트</li>
              <li>리스트</li>
              <li>리스트</li>
            </ul>
          </div>
          <div className={styles.main_menu_list}>
            <button className={styles.main_menu_button} id="news">
              News
            </button>
            <ul className={styles.sub_list_news}>
              <li>리스트</li>
              <li>리스트</li>
              <li>리스트</li>
              <li>리스트</li>
            </ul>
          </div>
          <div className={styles.main_menu_list}>
            <button className={styles.main_menu_button} id="recycle">
              Recycle
            </button>
            <ul className={styles.sub_list_recycle}>
              <li>리스트</li>
              <li>리스트</li>
              <li>리스트</li>
              <li>리스트</li>
            </ul>
          </div>
          <div className={styles.main_menu_list}>
            <button className={styles.main_menu_button} id="company">
              Company
            </button>
            <ul className={styles.sub_list_company}>
              <li>리스트</li>
              <li>리스트</li>
              <li>리스트</li>
              <li>리스트</li>
            </ul>
          </div>
          <div className={styles.main_menu_list}>
            <button className={styles.main_menu_button} id="service">
              Service
            </button>
            <ul className={styles.sub_list_service}>
              <li>리스트</li>
              <li>리스트</li>
              <li>리스트</li>
              <li>리스트</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.main_sub_container}>
        <div className={styles.main_subin_container}>
          <p className={styles.text_style}>
            친환경 제품 개발 및 환경 규제 대응을 위한
          </p>
          <h1 className="py-3 text-3xl md:text-4xl font-bold">
            친환경 제품 자원효율성 <br /> 평가 지원 통합 시스템
          </h1>
          <p className="text-lg font-bold">
            Material Efficiency Assessment Integrated System
          </p>
        </div>
      </div>
      <div className={styles.tool_container}>
        <div className={styles.tool_sub_container}>
          <div className={styles.tool1}>
            <p className={styles.tool_text}> Recyclability</p>
            <p className={styles.tool_sub_text}>
              EN 45555
              <br />
              General methods for assessing the recyclability and recoverability
              of energy related products
            </p>
          </div>
          <div className={styles.tool2}>
            <p className={styles.tool_text}> Reused</p>
            <p className={styles.tool_sub_text}>
              EN 45556
              <br />
              General methods for assessing the proportion of reused components
              in energy related products
            </p>
          </div>
          <div className={styles.tool3}>
            <p className={styles.tool_text}> Recycled Content</p>
            <p className={styles.tool_sub_text}>
              EN 45557
              <br />
              General method for assessing the proportion of recycled material
              content in energy related products
            </p>
          </div>
          <div className={styles.tool4}>
            <p className={styles.tool_text}>CRMs</p>
            <p className={styles.tool_sub_text}>
              EN 45558
              <br />
              General method to declare the use of critical raw materials in
              energy related products
            </p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;