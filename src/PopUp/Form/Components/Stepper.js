import React from 'react';

const Stepper = ({ step }) => {
  return (
    <div className='stepper'>
      <div
        className='indicator'
        style={{ width: step === 0 ? '25%' : '52%' }}
      ></div>
      <div className='tags'>
        <div>
          <img src='' alt='' />
          <p className={`label ${(step === 0 || step > 0) && 'active'}`}>
            Email
          </p>
        </div>
        <div>
          <img src='' alt='' />
          <p className={`label ${step === 1 && 'active'}`}>Verify</p>
        </div>
        <div>
          <img src='' alt='' />
          <p className='label'>Download</p>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
