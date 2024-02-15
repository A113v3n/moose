import React from "react";
import "../../App.css";
import logoBg from "../../imgs/images/logolg.png";
import Sep from "../../imgs/images/sep.png";
import Image4 from "../../imgs/images/4.png";
import Image5 from "../../imgs/images/5.png";
import Image6 from "../../imgs/images/6.png";
import Image7 from "../../imgs/images/30.png";
import Image8 from "../../imgs/images/60.png";
import Image9 from "../../imgs/images/90.png";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className='button-container'>
      <div className='image-container'>
        <img src={logoBg} alt='Logo' />
        <p className='description-text'>
          Reduce tension and increase relaxation with a Moose massage. Schedule
          your appointment today and start healing your body.
        </p>
        <button className='book-now-btn'>Book Now</button>
      </div>
      <img src={Sep} alt='Separator' className='separator-image' />
      <div>
        <h4 className='section-heading'>
          WHY <span style={{ color: "#f6983c" }}>MOOSE</span>
        </h4>
        <div className='images-row'>
          <img src={Image4} alt='Icon 4' className='small-image' />
          <img src={Image5} alt='Icon 5' className='small-image' />
          <img src={Image6} alt='Icon 6' className='small-image' />
        </div>
        <p className='section-text'>
          Moose massages are unique.
          <br />
          We are extremely passionate about what we do, and each massage is
          specifically designed for the body of the client.
          <br />
          <br />
          Our goal is to achieve physical and spiritual energy balance in order
          to both prevent and treat pain.
        </p>
      </div>
      <img src={Sep} alt='Separator' className='separator-image' />
      <div>
        <h4 className='section-heading'>
          OUR <span style={{ color: "#f6983c" }}>PRICES</span>
        </h4>
        <div className='images-row'>
          <img src={Image7} alt='Icon 7' className='price-image' />
          <img src={Image8} alt='Icon 8' className='price-image' />
          <img src={Image9} alt='Icon 9' className='price-image' />
        </div>
      </div>
      <img src={Sep} alt='Separator' className='separator-image' />
      <div></div>
    </div>
  );
};

export default Home;
