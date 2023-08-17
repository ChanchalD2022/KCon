import React from 'react';
import Index from './PopUp/Index';

const App = () => {
  try{
  return <Index />;
  }
  catch(e){
    return <Index />;

    console.log(e);
  }
};

export default App;
