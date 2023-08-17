import React from 'react';
import assets from '../../../assets';

const Success = () => {
  return (
    <div className='success'>
      <h1 className='title'>Your Kresusu wallet is ready!</h1>
      <p className='description'>
        Access it now by downloading Kresus from the
        <br /> App Store or scanning the QR code below.
      </p>
      <p className='small-text'>
        Log in using your email address:
        <br />
        <b>example@gmail.com</b>
      </p>
      <div className='qr-image'>
        <img src={assets.qr} alt='' />
      </div>
    </div>
  );
};

export default Success;
