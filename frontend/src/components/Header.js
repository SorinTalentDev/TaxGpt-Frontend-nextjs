
import React from "react";
import "./../Asset/css/Header.css";
import { Button } from "antd";
import mark from './../Asset/img/logo.png';

function Header() {
  return (
    <div className='header'>
    <div className='logo'>
      <div className='header-mark'>
        <img src={mark} alt="mark" />
      </div>
      <p>BotBuzz</p>
    </div>
    <div className='menu'>
      <Button type="primary">Home</Button>
      <Button type="primary">Setting</Button>
      <Button type="primary">Login</Button>
    </div>
  </div>
  );
}

export default Header;
