import React, { useState } from 'react';
import assets from '../../assets';
import EmailVerification from './Components/EmailVerification';
import Success from './Components/Success';
import EmailInput from './Components/EmailInput';
import Stepper from './Components/Stepper';

const Form = ({ setModalOpen }) => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  return (
    <div className='form-container'>
      {/* header */}
      <div className='header'>
        <div className='icon-container' onClick={() => {
          setModalOpen(false);
        }}>
          <img src={assets.close} alt='' />
        </div>
        <div className='logo'>
          <img src={assets.logo} alt='' />
        </div>
      </div>
      {/* form stepper */}
      {step !== 2 && <Stepper step={step} />}
      {/*  Form elements */}
      <div className='elements'>
        {step === 0 && (
          <EmailInput
            setStep={setStep}
            email={email}
            setEmail={setEmail}
            setToken={setToken}
          />
        )}
        {step === 1 && <EmailVerification setStep={setStep} token={token} />}
        {step === 2 && <Success />}
      </div>
    </div>
  );
};

export default Form;
