import React from "react";
import "./../Asset/css/Footer.css";
import footerlogo from "./../Asset/img/footer-logo.png";

function Footer () {
    return(
        <div className="footer">
        <div className="footer-menu">
          <div className="footer-logo">
            <div className='footer-mark'>
              <img src={footerlogo} alt="footerlogo" />
              <p className="footer-logo-txt">BotBuzz</p>
            </div>
            <p className="footer-address">123, S Nowhere., West Hollywood</p>
          </div>
          <div className="footer-resources">
            <h3>Resources</h3>
            <p>Help</p>
            <p>Blog</p>
            <p>Pricing</p>
            <p>Contact</p>
          </div>
          <div className="footer-pricing">
            <h3>Pricing</h3>
            <p>Basic Pricing Plan</p>
            <p>Plus Pricing Plan</p>
            <p>Teams Pricing Plan</p>
          </div>
          <div className="footer-explore">
            <h3>Explore</h3>
            <p>AI Personalities</p>
            <p>Bot Buzz AI</p>
          </div>
          <div className="footer-company">
            <h3>Company</h3>
            <p>About us</p>
            <p>Privacy Policy</p>
            <p>Terms and Conditions</p>
          </div>
          <div className="footer-others">
            <h3>Others</h3>
            <p>FAQs</p>
            <p>Supports</p>
          </div>
        </div>
        <div className="footer-line"></div>
        <div className="copyright">Copyright © 2024 . All rights reserved</div>
      </div>
    );
}

export default Footer;