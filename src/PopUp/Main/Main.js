import React from 'react';

import assets from '../../assets';

const Main = ({ setStep, setModalOpen }) => {
  const handleClick = () => {
    setStep(1);
  };
  return (
    <div className='main-screen'>
      <div className='close-icon-container'>
        <div
          className='close-icon'
          onClick={() => {
            setModalOpen(false);
          }}
        >
          <img src={assets.close} width={20} height={20} alt='' />
        </div>
      </div>
      <div className='content'>
        <div className='logo'>
          <img src={assets.logo} alt='' />
        </div>
        <div className='title'>
          <h1>
            Scan with your kresus wallet
            <br /> to connect
          </h1>
        </div>
        <div className='qr-code'>
          <img src={assets.qrCode} style={{ borderRadius: '20px' }} height={200} alt='' />
        </div>
      </div>
      <div className='footer'>
        <div>
          <button className='apple-store-button'>
            <img src={assets.appleLogo} alt='' />
          </button>
        </div>
        <div className='description'>
          <p>
            <b>Don't have Kresus?.</b> Get the best-in-class wallet to
            <br /> hold all of your digital collectiable
          </p>
        </div>
        <div>
          <button className='get-wallet-btn' onClick={handleClick}>
            Get my free wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
