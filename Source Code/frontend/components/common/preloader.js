import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../public/xx.json'; 
import animationData2 from '../../public/yoga.json'; 

const Preloader = ({ animateOut }) => {
  return (
    <div className={`preloader flex  ${animateOut ? 'slide-out' : ''}`}>
      <Lottie 
        animationData={animationData} 
        loop={true} 
        style={{ width: '70%', height: '70%' }}
      />
      <Lottie 
        animationData={animationData2} 
        loop={true} 
        style={{ width: '70%', height: '70%' }}
      />
      <style jsx>{`
        .preloader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #E67529;
          z-index: 9999;
          transition: transform 1s ease-in-out;
        }

        .preloader.slide-out {
          transform: translateY(-100%);
        }
      `}</style>
    </div>
  );
};

export default Preloader;
