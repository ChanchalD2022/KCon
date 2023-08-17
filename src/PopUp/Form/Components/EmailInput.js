import React, { useEffect, useState } from 'react';
import { signup } from '../../../api';
import axios from 'axios';

const EmailInput = ({ setStep, setEmail, email, setToken }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const dapp_id = urlParams.get('dapp_id');
  const [disalbed, setDisabled] = useState(true);
  const [error, setError] = useState('');
  const handleChange = e => {
    setEmail(e.target.value);
  };
  const handleClick = async e => {
    e.preventDefault();
    setError('');
    try {
      setDisabled(true);
      const { data } = await signup({ email, dapp_id });
      setToken(data.token);
      setStep(1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response.data.message;
        setError(message);
      }
    } finally {
      setDisabled(false);
    }
  };
  useEffect(() => {
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email]);
  return (
    <div className='email-input'>
      <h1 className='title'>What's your email address?</h1>
      <p className='description'>
        We'll send you a verification code to confirm your identity and set up your new Kresus
        Wallet.
      </p>
      <form onSubmit={handleClick}>
        <div className='input-container'>
          <input type='text' value={email} onChange={handleChange} placeholder='Please enter email' />
          {error && <p className='error'>{error}</p>}
        </div>
        <button className='submit-button' disabled={disalbed} type='submit'>
          Get my verification code
        </button>
      </form>
    </div>
  );
};

export default EmailInput;
