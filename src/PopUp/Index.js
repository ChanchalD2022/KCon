import React, { useCallback, useState } from 'react';
import Main from './Main/Main';
import Form from './Form/Form';
import { KConnect } from '@kresuslabs/kconnect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo2 from "../assets/KResusHead.png";

const Modal = ({ open, setModalOpen }) => {
  const [step, setStep] = useState(0);

  if (!open) return null;

  return (
    <div className='overly-container'>
      <div className='modal'>
        <div className='modal-inner'>
          {step === 0 && <Main setStep={setStep} setModalOpen={setModalOpen} />}
          {step === 1 && <Form setModalOpen={setModalOpen} />}
        </div>
      </div>
    </div>
  );
};

const Index =  () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionOn, setsessionOn] = useState(false);
  const [session, setSession] = useState(undefined);
  const [signClient, setSignClient] = useState(undefined);
  const [walletAddress, setWalletAddress] = useState("");
  const [trimmedAddress, setTrimmedAddress] = useState("");
  let Session ;

  const kConnect = new KConnect();
  const projectId = '89b2f1c22353884b620cfe736b67f4cf';
  const dAppConfig = {
    name: 'Gaslur',
    description: 'Discover, collect, and charity in extraordinary NFT marketplace',
    url: 'https://www.gaslur.com',
    icons: ['https://i.ibb.co/MPJGbX8/image-9.png']
  }
  kConnect.Init(
    projectId, 
    dAppConfig.name, 
    dAppConfig.description, 
    dAppConfig.url, 
    dAppConfig.icons 
  ).then(data=>{
    setSignClient(data)
  });

  const onKConnectBtnClick = useCallback( async () => {
    try{
    console.log("signClient", signClient);
    const conSession = await kConnect.connect(signClient, "1");
    setsessionOn(true);
    if (conSession && !(conSession.code)) {
      toast.success("Connection Successfull", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        })
      console.log("Session ", conSession);
      console.log("Account ", (kConnect.getWalletAccount(conSession))[0]);
      setSession(conSession)
    
        setWalletAddress((kConnect.getWalletAccount(conSession))[0]);
        // setTrimmedAddress(walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4));

 
      // if(conSession.acknowledged){
      //   setWalletAddress((kConnect.getWalletAccount())[0])
      // }
    }
    else{
      toast.error("Connection Failed",{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  }
  catch(e){console.log(e);}
  }, [signClient])



  const onKConnectDisconnect = useCallback( async () => {
await kConnect.disconnect(signClient,session);
setWalletAddress("");
setsessionOn(false);
setSession(undefined);
toast.success("Disconnected Successfully", {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  })
}, [signClient])

async function KCSendTxn(){
  try{
  const tx = {
    from: walletAddress,
    to: "0xC36bd69A6555DD316E3A3293c9a9Dd1dc1578E7E",
    data: "0x",
    gasPrice: "0x8BB2C97000",
    gasLimit: "0x5208",
    value: "0x0000011",
  };
  let response = await kConnect.sendTransaction(signClient,session,tx);
  console.log("🚀 ~ file: Index.js:113 ~ KCSendTxn ~ response:", (response))
  if(response && !(response.code) && !((Object.keys(response))).includes("TypeError") && !((Object.keys(response))).includes("Error")){
    toast.success("Transaction Send Successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      })
    
  }
  else if (response && (response.code) ) {
    toast.error("Transaction Sending Failed",{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
    
  }
  else{
    toast.warn("Transaction Pending",{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
  }
}
catch(err){
  console.log(err);
}
}

  return (
    <>
    
      <div class='landingpage'>
        <div class='navbar'>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a class='navlogo'>GASLUR</a>
          <button class='hamburger'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
              class='feather feather-menu'
            >
              <path d='M3 12h18M3 6h18M3 18h18' />
            </svg>
          </button>
          <div class='navlinkwrap'>
            <span class='navlink selectedlink'>Home</span>
            <span class='navlink'>My Profile</span>
            <span class='navlink'>Activity</span>
            <span class='navlink'>How It Works</span>
          </div>
          {walletAddress.length>40 ? <h2 class='buttonwrap' hidden={!session} style={{"color":"white","fontFamily":"Poppins"}}>{walletAddress.substring(0,6)}....{walletAddress.substring(36,42)}</h2> : <p> </p>}
          <div class='buttonwrap'>
            { !sessionOn &&
            <button
              id='kresus'
              data-aid='YDnYlG'
              class='createbtn selectedbtn'
              // onClick={() => setModalOpen(true)}
              onClick={onKConnectBtnClick}
              hidden={session!==undefined}
              disabled={!signClient}
              style={{"font-size": "22px", "display": "flex", "justify-content": "center",  "align-items": "center" }}
            >
              <img src={Logo2} height="40" />  &nbsp; 
              Kresus Connect    
            </button>
          }
           { sessionOn &&
            <button
              id='kresus'
              data-aid='YDnYlG'
              class='createbtn selectedbtn'
              // onClick={() => setModalOpen(true)}
              onClick={onKConnectDisconnect}
              // hidden={session!==undefined}
              style={{"font-size": "22px", "display": "flex", "justify-content": "center",  "align-items": "center" }}

            >
              Disconnect
            </button>
          }

          </div>
         
        </div>
        <div class='box'>
          <div class='infobox'>
            <p class='infobox-boldtext'>
              Discover, collect, and charity in extraordinary NFT marketplace
            </p>
            <p class='infobox-slimtext'>
            Gaslur NFT marketplace is a decentralized NFT exchange to create, collect and trade extraordinary NFTs
            </p>
            <div class='infobox-btnwrapper'>
              <button class='infobox-explorebtn selected' style={{"padding": "24px 45px", "font-size": "20px"}}>Explore</button>
              <button class='infobox-createbtn' onClick={KCSendTxn} style={{"padding": "24px 45px", "font-size": "20px"}} >Create</button>
            </div>
          </div>
          <div class='display'>
            <img
              class='display-nft'
              src='https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
              alt='unsplash-OG44d93i-NJk'
              border='0'
            />
            <div class='infowrapper'>
              <div class='info'>
                <img
                  class='info-img'
                  src='https://images.unsplash.com/photo-1535207010348-71e47296838a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=385&q=80'
                  alt='unsplash-OG44d93i-NJk'
                  border='0'
                />
                <div>
                  <p>Laura</p>
                  <p>0.21 Weth</p>
                </div>
              </div>
              <div class='info2'>
                <p>WE ARE HERE</p>
                <div class='iconwrapper'>
                  <svg width='22' height='20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fill-rule='evenodd'
                      clip-rule='evenodd'
                      d='M5.7365 2C3.6575 2 1.5 3.8804 1.5 6.5135c0 3.1074 2.3236 5.9603 4.8612 8.1207 1.2458 1.0606 2.4954 1.9137 3.4352 2.5022.4692.2937.8593.5203 1.1305.6727L11 17.85l.0731-.0409a27.984 27.984 0 0 0 1.1304-.6727c.9399-.5885 2.1895-1.4416 3.4353-2.5022C18.1764 12.4738 20.5 9.6209 20.5 6.5135 20.5 3.8805 18.3425 2 16.2635 2c-2.1054 0-3.8008 1.389-4.552 3.6426a.75.75 0 0 1-1.423 0C9.5373 3.389 7.8418 2 5.7365 2ZM11 18.7027l.3426.6672a.7502.7502 0 0 1-.6852 0L11 18.7027ZM0 6.5135C0 3.052 2.829.5 5.7365.5 8.0298.5 9.8808 1.7262 11 3.6048 12.1192 1.7262 13.9702.5 16.2635.5 19.171.5 22 3.052 22 6.5135c0 3.8183-2.8014 7.06-5.3888 9.2628-1.3167 1.121-2.6296 2.0166-3.6116 2.6314-.4918.308-.9025.5467-1.1918.7092a19.142 19.142 0 0 1-.4301.2347l-.0248.013-.007.0036-.0021.0011c-.0003.0001-.0012.0006-.3438-.6666-.3426.6672-.3424.6673-.3426.6672l-.0033-.0017-.007-.0036-.0248-.013a19.142 19.142 0 0 1-.4301-.2347 29.324 29.324 0 0 1-1.1918-.7092c-.982-.6148-2.295-1.5104-3.6116-2.6314C2.8014 13.5735 0 10.3318 0 6.5135Z'
                      fill='#E0E0E0'
                    />
                  </svg>
                  25
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='started'>
          <p class='started-boldtext'>Getting started</p>
          <p class='started-slimtext'>
          Create, collect and trade extraordinary NFTs on Ethereum, Solana, Polygon, Immutable X, Arbitrum, Optimism networks.
        </p>
          <div class='started-items'>
            <div class='itemwrapper'>
              <div class='started-items-item'>
                <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'>
                  <path
                    style={{ stroke: 'none', fillRule: 'nonzero', fill: '#e0e0e0', fillOpacity: 1 }}
                    d='M24.7969 14.6719c.4375-.4414.4375-1.1524 0-1.5938-.4414-.4375-1.1524-.4375-1.5938 0L16.5 19.7851l-2.9531-2.957c-.4414-.4375-1.1524-.4375-1.5938 0-.4375.4414-.4375 1.1524 0 1.5938l3.75 3.75a1.1246 1.1246 0 0 0 1.5938 0Zm0 0'
                  />
                  <path
                    style={{ stroke: 'none', fillRule: 'evenodd', fill: '#e0e0e0', fillOpacity: 1 }}
                    d='M18.8086.957a2.6005 2.6005 0 0 0-1.6172 0L4.8164 4.9688C3.7344 5.3202 3 6.3241 3 7.4648V15c0 9.2852 5.6563 16.0586 14.1016 19.246a2.5853 2.5853 0 0 0 1.7968 0C27.3438 31.0587 33 24.2853 33 15V7.4648a2.6182 2.6182 0 0 0-1.8164-2.496Zm-.9219 2.1368a.3738.3738 0 0 1 .2266 0l12.375 4.0117c.1601.0547.2617.1992.2617.3593V15c0 8.1914-4.9219 14.2227-12.6445 17.1367a.2815.2815 0 0 1-.211 0C10.172 29.2227 5.25 23.1914 5.25 15V7.4648c0-.1601.1016-.3046.2617-.3593Zm0 0'
                  />
                </svg>
              </div>
              <p>Connect your wallet</p>
            </div>
            <div class='itemwrapper'>
              <div class='started-items-item'>
                <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'>
                  <path
                    style={{ stroke: 'none', fillRule: 'evenodd', fill: '#bdbdbd', fillOpacity: 1 }}
                    d='M4.125 3C2.6758 3 1.5 4.1758 1.5 5.625v5.25c0 1.4492 1.1758 2.625 2.625 2.625h27.75c1.4492 0 2.625-1.1758 2.625-2.625v-5.25C34.5 4.1758 33.3242 3 31.875 3Zm27.75 2.25H4.125c-.207 0-.375.168-.375.375v5.25c0 .207.168.375.375.375h27.75c.207 0 .375-.168.375-.375v-5.25c0-.207-.168-.375-.375-.375Zm0 0'
                  />
                  <path
                    style={{ stroke: 'none', fillRule: 'nonzero', fill: '#bdbdbd', fillOpacity: 1 }}
                    d='M4.125 15c.621 0 1.125.504 1.125 1.125v14.25c0 .207.168.375.375.375h24.75c.207 0 .375-.168.375-.375v-14.25c0-.621.504-1.125 1.125-1.125S33 15.504 33 16.125v14.25C33 31.8242 31.8242 33 30.375 33H5.625C4.1758 33 3 31.8242 3 30.375v-14.25C3 15.504 3.504 15 4.125 15Zm0 0'
                  />
                  <path
                    style={{ stroke: 'none', fillRule: 'nonzero', fill: '#bdbdbd', fillOpacity: 1 }}
                    d='M14.625 17.25c-.621 0-1.125.504-1.125 1.125s.504 1.125 1.125 1.125h6.75c.621 0 1.125-.504 1.125-1.125s-.504-1.125-1.125-1.125Zm0 0'
                  />
                </svg>
              </div>
              <p>Collect</p>
            </div>
            <div class='itemwrapper'>
              <div class='started-items-item'>
                <svg xmlns='http://www.w3.org/2000/svg' width='36' height='px' viewBox='0 0 36 31'>
                  <path
                    style={{ stroke: 'none', fillRule: 'evenodd', fill: '#bdbdbd', fillOpacity: 1 }}
                    d='M2.832 2.9219c-.2148 0-.3867.1758-.3867.3906v24.375c0 .2148.1719.3906.3867.3906h4.9453l13.332-14.1875c1.0548-1.121 2.8165-1.1445 3.8985-.0508l8.5469 8.6407V3.3125c0-.2148-.1719-.3906-.3867-.3906Zm30.336 27.5156H2.832c-1.5039 0-2.7226-1.2305-2.7226-2.75V3.3125c0-1.5195 1.2187-2.75 2.7226-2.75h30.336c1.5039 0 2.7226 1.2305 2.7226 2.75v24.375c0 1.5195-1.2187 2.75-2.7226 2.75ZM22.8008 15.5156 10.996 28.0781H33.168c.2148 0 .3867-.1758.3867-.3906v-1.871L23.3594 15.5077a.388.388 0 0 0-.5586.0078Zm-9.4688-4.3398c0 1.5195-1.2187 2.75-2.7226 2.75-1.5 0-2.7188-1.2305-2.7188-2.75 0-1.5196 1.2188-2.75 2.7188-2.75 1.5039 0 2.7226 1.2304 2.7226 2.75Zm2.336 0c0 2.8242-2.2657 5.1094-5.0586 5.1094-2.789 0-5.0547-2.2852-5.0547-5.1094s2.2656-5.1094 5.0547-5.1094c2.793 0 5.0586 2.2852 5.0586 5.1094Zm0 0'
                  />
                </svg>
              </div>
              <p>Create</p>
            </div>
            <div class='itemwrapper'>
              <div class='started-items-item'>
                <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'>
                  <path
                    style={{ stroke: 'none', fillRule: 'evenodd', fill: '#bdbdbd', fillOpacity: 1 }}
                    d='M30.9453.5a16.7245 16.7245 0 0 0-11.4687 4.5508l-2.0274 1.914a35.9135 35.9135 0 0 0-2.3984 2.4805h-7.836c-.957 0-1.8437.5-2.3359 1.3203L.668 17.7891c-.1952.3242-.2226.7226-.0702 1.0664.1523.3476.4609.5976.828.6758l7.1134 1.496c.0586.0782.125.1485.1992.2188l3.1054 2.914 2.9102 3.1016c.0703.0742.1406.1406.2188.1992l1.496 7.1133c.0782.3672.3282.6758.6758.8281a1.158 1.158 0 0 0 1.0664-.0703l7.0235-4.211a2.7222 2.7222 0 0 0 1.3203-2.3358v-7.836a36.8748 36.8748 0 0 0 2.4844-2.3984l1.9101-2.0274A16.7411 16.7411 0 0 0 35.5 5.0508l-.004-1.8281C35.496 1.7187 34.2774.5 32.7774.5Zm-6.7226 22.3398a39.89 39.89 0 0 1-1.582 1.1172l-5.2813 3.5196 1.0547 5.0156 5.621-3.3711c.1172-.0703.1876-.1992.1876-.336ZM8.5234 18.6406l3.5196-5.2812a34.8776 34.8776 0 0 1 1.1172-1.582H7.2148a.3952.3952 0 0 0-.3359.1913L3.508 17.586ZM21.0781 6.75a14.3862 14.3862 0 0 1 9.8672-3.918h1.832c.211 0 .3868.1758.3868.3907v1.828c0 3.672-1.3985 7.2032-3.9141 9.8712l-1.9102 2.0273a34.7388 34.7388 0 0 1-5.996 5.0664l-5.1133 3.4102-2.711-2.8906c-.0195-.0157-.0351-.0352-.0547-.0508l-2.8906-2.7149 3.4102-5.1172c1.457-2.1796 3.1523-4.1914 5.0625-5.9921Zm5.4766 5.0273c0 1.2891-1.043 2.332-2.332 2.332-1.2891 0-2.332-1.0429-2.332-2.332 0-1.289 1.0429-2.332 2.332-2.332 1.289 0 2.332 1.043 2.332 2.332ZM9.4453 32c1.3985-1.3984 1.3985-4.043 0-5.4453-1.4023-1.3985-4.0469-1.3985-5.4453 0-1.879 1.8828-2.246 6.0703-2.3164 7.3789a.3609.3609 0 0 0 .3828.3828C3.375 34.2461 7.5625 33.879 9.4454 32Zm0 0'
                  />
                </svg>
              </div>
              <p>Trade</p>
            </div>
          </div>
        </div>
        <div class='auction'>
          <div class='title'>
            <p class='titlebold'>Hot auctions</p>
            <p class='titleslim'>View all</p>
          </div>
          <div class='nft'>
            <div class='item'>
              <img
                class='item-img'
                src='https://i.ibb.co/RhpnYWV/Enis-cyberpunk-ottoman-sultan-in-a-cyberpunk-city-8-K-hyperreali-e7506c88-2574-487c-838e-5bb8618dd1c.png'
                alt='unsplash-OG44d93i-NJk'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
            <div class='item'>
              <img
                class='item-img'
                src='https://i.ibb.co/SrNRC0b/Erkan-Erdil-angry-soviet-officer-shouting-his-soldiers8k-octane-7b802966-9d4e-4c6e-ac37-d4f751419081.png'
                alt='unsplash-OG44d93i-NJk'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
            <div class='item'>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img
                class='item-img'
                src='https://i.ibb.co/YjzSzjk/Erkan-Erdil-very-technical-and-detailed-blueprint-of-wolf-carve-bd937607-6a4f-4525-b4f2-b78207e64662.png'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
            <div class='item'>
              <img
                class='item-img'
                src='https://i.ibb.co/VLfJ41h/MR-ROBOT-two-cyberpunk-cowboys-dueling-6ae4203d-3539-4033-a9d9-80d747ac6498.png'
                alt='unsplash-OG44d93i-NJk'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
          </div>
        </div>
        
        <div class='discover'>
          <div class='discover-title'>
            <p>Discover</p>
            <div class='filters'>
              <div class='filter'>
                <svg xmlns='http://www.w3.org/2000/svg' width='15' height='12' viewBox='0 0 14 12'>
                  <path
                    style={{
                      fill: 'none',
                      strokeWidth: 2,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      stroke: '#f2f2f2',
                      strokeOpacity: 1,
                      strokeMiterlimit: 4,
                    }}
                    d='M1.731 1.002h13.1976M1.731 4.998h9.134M1.731 9h6.0893m4.0636 0 4.0575-4.002m0 0L20.005 9m-4.0636-4.002v12'
                    transform='scale(.63636 .66667)'
                  />
                </svg>
                Category
              </div>
              <div class='filter'>
                Cheapest
                <svg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 11 6'>
                  <path
                    style={{
                      fill: 'none',
                      strokeWidth: 2,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      stroke: '#f2f2f2',
                      strokeOpacity: 1,
                      strokeMiterlimit: 4,
                    }}
                    d='M15.4787 1.002 8.3732 7.998 1.2678 1.002'
                    transform='scale(.64706 .66667)'
                  />
                </svg>
              </div>
              <div class='filter'>
                Newest
                <svg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 11 6'>
                  <path
                    style={{
                      fill: 'none',
                      strokeWidth: 2,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      stroke: '#f2f2f2',
                      strokeOpacity: 1,
                      strokeMiterlimit: 4,
                    }}
                    d='M15.4787 1.002 8.3732 7.998 1.2678 1.002'
                    transform='scale(.64706 .66667)'
                  />
                </svg>
              </div>
              <button class='filterbtn'>
                <svg xmlns='http://www.w3.org/2000/svg' width='15' height='14' viewBox='0 0 14 14'>
                  <path
                    style={{
                      fill: 'none',
                      strokeWidth: 2,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      stroke: '#fff',
                      strokeOpacity: 1,
                      strokeMiterlimit: 4,
                    }}
                    d='M1.1546 1.9978c0-.5525.4553-.999 1.0028-.999h16.273c.5537 0 1.0028.4465 1.0028.999v2.578c0 .2735-.1046.5358-.3014.72l-6.5092 6.4062c-.1846.1897-.2953.4464-.2953.7199V15l-4.0606 4.0011V12.422c0-.2735-.1046-.5302-.3015-.7199l-6.503-6.4062c-.1907-.1842-.3076-.4465-.3076-.72Zm0 0'
                    transform='matrix(.63492 0 0 .7 .3333 0)'
                  />
                </svg>
                Filter
              </button>
            </div>
          </div>
          <div class='discover-items'>
            <div class='item'>
              <img
                class='item-img'
                src='https://i.ibb.co/ZTZz9t0/Erkan-Erdil-Concept-art-of-collosal-dark-scaled-huge-winged-fir-09384960-3c02-48f6-ad40-76d179a7e0a3.png'
                alt='unsplash-OG44d93i-NJk'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
            <div class='item'>
              <img
                class='item-img'
                src='https://i.ibb.co/SrNRC0b/Erkan-Erdil-angry-soviet-officer-shouting-his-soldiers8k-octane-7b802966-9d4e-4c6e-ac37-d4f751419081.png'
                alt='unsplash-OG44d93i-NJk'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
            <div class='item'>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img class='item-img' src='https://i.ibb.co/2KsmyYm/m-djoourney.png' border='0' />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
            <div class='item'>
              <img
                class='item-img'
                src='https://i.ibb.co/VLfJ41h/MR-ROBOT-two-cyberpunk-cowboys-dueling-6ae4203d-3539-4033-a9d9-80d747ac6498.png'
                alt='unsplash-OG44d93i-NJk'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
            <div class='item'>
              <img
                class='item-img'
                src='https://i.ibb.co/J5QHZwY/MR-ROBOT-cyberpunk-rose-with-foggy-weather-5eb12baa-e7f6-4c4f-9cba-9654c0de3f51.png'
                alt='unsplash-OG44d93i-NJk'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
            <div class='item'>
              <img
                class='item-img'
                src='https://i.ibb.co/Trpxy8p/2123.png'
                alt='unsplash-OG44d93i-NJk'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
            <div class='item'>
              <img
                class='item-img'
                src='https://i.ibb.co/2FGw8Fc/Erkan-Erdil-male-warrior-with-huge-katana-fighting-hordes-of-en-02ca9519-3e0d-4aa5-9d70-f16ef0b0a0ff.png'
                alt='unsplash-OG44d93i-NJk'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
            <div class='item'>
              <img
                class='item-img'
                src='https://i.ibb.co/7Cc7PnV/Erkan-Erdil-futuristic-Tiger-I-tank-fires-explosive-shell-to-bu-b9868ef6-7525-493e-b0f5-0bb3200e5abb.png'
                alt='unsplash-OG44d93i-NJk'
                border='0'
              />
              <div class='item-title'>
                <p>Lorem Ipsum</p>
                <p>1.20 Weth</p>
              </div>
              <p class='item-date'>Ends in 01.34.45</p>
            </div>
          </div>
          <button class='discover-loadbtn'>LOAD MORE</button>
        </div>
        <div class='footer'>
          <div class='footer-main'>
            Etiam et id tincidunt faucibus mollis a sociis pretium fermentum quis magna faucibus
            lacus.
          </div>
          <div class='footer-navigate'>
            <div class='nav' >
              <h5>Marketplace</h5>
              <p>Home</p>
              <p>Activity</p>
              <p>Discover</p>
              <p>Learn more</p>
            </div>
            <div class='nav'>
              <h5>Company</h5>
              <p>About Us</p>
              <p>Services</p>
              <p>Portfolio</p>
            </div>
            <div class='nav'>
              <h5>Contact</h5>
              <p>Facebook</p>
              <p>Instagram</p>
              <p>Twitter</p>
              <p>Email</p>
            </div>
          </div>
        </div>
        <div class='footer2'>
          <div></div>
          <p>Copyright 2021 Gaslur</p>
        </div>
      </div>
      <ToastContainer/>

      <Modal open={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

export default Index;
