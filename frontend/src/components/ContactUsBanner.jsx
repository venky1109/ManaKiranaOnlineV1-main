import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import './contactUsBanner.css';

const ContactUsBanner = () => {
  return (
    <div className="contact-item mx-2" >
      <div className="contact-line">
        <FaPhone className="phone-icon" />
        <span>9502930797</span>
      </div>
      <div className="contact-line">
        <FaWhatsapp className="whatsapp-icon" />
        <div className="whatsapp-text">
          <a href="https://wa.me/9502930797" target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUsBanner;
