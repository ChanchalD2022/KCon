import React, { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import { verify } from '../../../api';
import axios from 'axios';

const EmailVerification = ({ setStep, token }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      setError('');
      const apiData = { token, code: otp };
      await verify(apiData);
      setStep(2);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response.data.message;
        setError(message);
      }
    }
  };
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);
  return (
    <div className='verify-email'>
      <h1 className='title'>
        Enter the 6-digit one-time <br />
        verification code below.
      </h1>
      <p className='description'>Verification code sent to example@gmail.com</p>
      <div className='otp-input'>
        <OTPInput
          shouldAutoFocus
          value={otp}
          inputStyle={'otp-input-styles'}
          onChange={setOtp}
          numInputs={6}
          renderInput={props => <input {...props} />}
          renderSeparator={() => <div style={{ width: '5px' }} />}
        />
        {error && <p className='error'>{error}</p>}
      </div>
      <p className='description'>
        A verification code has been sent to your phone. If didn't receive it,
        please wait 30 seconds and request a new one.
      </p>

      <p className='description'>
        <b>Didn't get a verification code?</b>{' '}
        <span onClick={() => setStep(0)}>Send Again</span> |{' '}
        <span onClick={() => setStep(0)}>Edit Email</span>
      </p>
    </div>
  );
};

export default EmailVerification;
