import './App.css';
import './Contact.css';
import React, { useState, useEffect, lazy } from 'react';
import { Nav, Container, Col, Row } from 'react-bootstrap';
import pink from './assets/images/pink.png';
import ocean from './assets/images/ocean.png';
import shofar from './assets/images/shofar.png';
import tongue from './assets/images/tongue.png';
import demon from './assets/images/demon.png';
import angry from './assets/images/angry.png';
import bat from './assets/images/bat.png';
import back from './assets/images/part/back.png';
import body from './assets/images/part/body.png';
import eyes from './assets/images/part/eyes.png';
import hom from './assets/images/part/hom.png';
import mouth from './assets/images/part/mouth.png';
import tail from './assets/images/part/tail.png';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import { Button } from '@mui/material';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;


function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    var textWrapper = document.querySelector('.ml10 .letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span className='letter'>$&</span>");

    AOS.init({
      duration: 700,
      once: true, // whether animation should happen only once - while scrolling down

    });

    getConfig();
  }, []);

  useEffect(() => {

    getData();
  }, [blockchain.account]);



  return (

    <div className="App">

      <header id="navigation" className="navbar-fixed-top navbar">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <i className="fa fa-bars fa-2x"></i>
            </button>
            <a className="navbar-brand" href="#body">
              <h1 id="logo">
                <img src="img/logo.png" alt="Brandi" />
              </h1>
            </a>
          </div>

          <nav className="collapse navbar-collapse navbar-right" role="navigation">
            <ul id="nav" className="nav navbar-nav">
              <li className="current"><a href="#mint">Mint</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#element">Element</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>

        </div>
      </header>



      <Container id='mint' className='mainCls' fluid>
        <canvas id="world" style={{ position: 'absolute', width: '100%', left: 0, opacity: 0.5 }}></canvas>
        <Row className='rowCls-1'   >
          <Col xs={12} className='nft-info'  >
            <div >

              <h1 className="ml10">
                <span className="text-wrapper">
                  <span className="letters">Donba Dragon</span>
                </span>
              </h1>
            </div>

            <h3> 1 {"Matic"} </h3>

            {blockchain.account === "" ||
              blockchain.smartContract === null ? (
              <div>
                <h3>
                  Connect to the {CONFIG.NETWORK.NAME} network
                </h3>
                <Button
                variant="contained"
                  className='mint-btn'
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(connect());
                    getData();
                  }}
                >
                  Connect Wallet
                </Button>
                {blockchain.errorMsg !== "" ? (
                  <>
                    <h2>
                      {blockchain.errorMsg}
                    </h2>
                  </>
                ) : null}
              </div>
            ) : (
              <>
                <h2>
                  {feedback}
                </h2>
                <div className='mint-count'>

                <IconButton color="primary" aria-label="upload picture" component="span"
                    variant="contained"
                    size="large"
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      decrementMintAmount();
                    }}
                  >
                    <IndeterminateCheckBoxIcon style={{fontSize: '48px'}} />
                  </IconButton>
                  <h2>
                    {mintAmount}
                  </h2>

                  <IconButton color="primary" aria-label="upload picture" component="span"
                    variant="contained"
                    size="large"
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      incrementMintAmount();
                    }}
                  >
                    <AddBoxIcon style={{fontSize: '48px'}} />
                  </IconButton>
                </div>

                <div>
                  <Button
                    disabled={claimingNft ? 1 : 0}
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      claimNFTs();
                      getData();
                    }}
                    style={{fontSize: '1.5rem',  fontWeight: '700'}}
                    
                  >
                    {claimingNft ? "BUSY" : "MINTED"}
                  </Button>
                </div>
              </>
            )}

            <div className='mint-title'>
              <h2> {data.totalSupply} / {CONFIG.MAX_SUPPLY} Minted</h2>

            </div>

          </Col>
          {/* <Col md={6} xs={12} style={{ alignSelf: 'flex-end' }}>
            <div className='indexText' >
              <p>這是一個 nft 測試網站，如果您需要幫助或討論，請與我聯繫</p>
              This is a nft test website, please contact me if you need assistance or discussion
            </div>
          </Col> */}
        </Row>
      </Container>
      <Container id='about' className='mainCls-2' fluid style={{ position: 'relative' }}>
        <Row className='rowCls' style={{ position: 'relative' }}  >
          <Col md={6} xs={12} className='dragon-col'>
            <div>

            </div>
          </Col>
          <Col md={6} xs={12} className='indexText-2' >
            <div className='text'>
              <h2>Dongba Dragon 介紹</h2>
              <p>
                東巴龍，一種草食性動物，有多種奇特的外觀組成，腳短跑不快，大部分的東巴龍是很友善的，但有一些有帶有尖牙的東巴龍可能較有攻擊性。

              </p>
              <Button
                variant="contained"
                style={{
                  margin: "5px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                }}
               
              >
                {CONFIG.MARKETPLACE}
              </Button>
            </div>
            {/* <div className='indexText' >
            This is an nft test,please contact me if you need assistance or discussion
          </div> */}
          </Col>
        </Row>
      </Container>

      <Container id='element' className='mainCls-3' fluid style={{ position: 'relative' }}>
        <Row className='rowCls' style={{ position: 'relative' }}  >
          <Col md={6} xs={12} className='indexText-2' style={{ flexDirection: 'column', background: '#1a3049' }} >
            <div className='text'>
              <h2>Dongba Dragon組成</h2>
              <p>
                Dongba Dragon由七個部位組成，分別為 : 背景、身體、角、嘴、眼、背、尾，
                每個部位都是隨機組成，不會有重複，是獨一無二的造型。
              </p>
            </div>
            <div className='part'>
              <Col md={4} xs={6}  ><img src={tail} alt='tail' /></Col>
              <Col md={4} xs={6}  ><img src={hom} alt='hom' /></Col>
              <Col md={4} xs={6}  ><img src={back} alt='back' /></Col>
              <Col md={4} xs={6}  ><img src={body} alt='body' /></Col>
              <Col md={4} xs={6}  ><img src={mouth} alt='mouth' /></Col>
              <Col md={4} xs={6}  ><img src={eyes} alt='eyes' /></Col>
            </div>
          </Col>
          <Col md={6} xs={12} className='dragon-col-v2'>
            <div className='dragon' >
              <img src={ocean} data-aos="fade-in" alt='ocean' />
              <img src={shofar} data-aos="fade-down" data-aos-delay="400" alt='shofar' />
              <img src={demon} data-aos="fade-down-left" data-aos-delay="600" alt='demon' />
              <img src={pink} data-aos="fade-down" data-aos-delay="200" alt='pink' />

              <img src={tongue} data-aos="fade-left" data-aos-delay="800" alt='tongue' />

              <img src={angry} data-aos="flip-up" data-aos-delay="1000" alt='angry' />
              <img src={bat} data-aos="zoom-out-down" data-aos-delay="1200" alt='bat' />


            </div>

            <div className="area" >
              <ul className="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div >
          </Col>
        </Row>
      </Container>

      <Container id='contact' className='mainCls-4' fluid style={{ position: 'relative' }}>
        <Row className='rowCls' style={{ position: 'relative' }} >
          <Col className='indexText-3'>
            <div id='star-frame'>
              <div id='stars'></div>
              <div id='stars2'></div>
              <div id='stars3'></div>
            </div>

            <div className='text'>
              <h2>Contact me</h2>
              <p style={{ fontSize: '2.5rem' }}>
                marlowkent@gmail.com
              </p>



            </div>
          </Col>
        </Row>
      </Container>

    </div>
  );

}

export default App;
