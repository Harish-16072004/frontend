import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState('');

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  // Effect to scroll to top when location changes
  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // In production, this would send to your API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setFormStatus('error');
    }
  };

  const contactInfo = [
    {
      title: 'General Queries',
      items: [
        {
          label: 'Killivalavan S',
          value: '+91 6382853181',
          link: 'tel:+916382853181',
        },
        {
          label: 'Abirami N',
          value: '+91 6369234314',
          link: 'tel:+916369234314',
        },
      ],
    },
    {
      title: 'Event Queries',
      items: [
        {
          label: 'Sakthivel K',
          value: '+91 93420034079',
          link: 'tel:+919342034079',
        },
        {
          label: 'Prabhuvelsundhar S R',
          value: '+91 9600463229',
          link: 'tel:+919600463229',
        },
      ],
    },
    {
      title: 'Email',
      items: [
        {
          label: 'Official Email',
          value: 'shackles2k25@gmail.com',
          link: 'mailto:shackles2k25@gmail.com',
        },
      ],
    },
    {
      title: 'Registration Support',
      items: [
        {
          label: 'Harish J',
          value: '+91 7305432775',
          link: 'tel:+917305432775',
        },
      ],
    },
  ];

  return (
    <div className="contact">
      <section className="contact-hero">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">Get in Touch with Team SHACKLES</p>
      </section>

      <section className="contact-info-section">
        <div className="contact-container">
          <div className="contact-cards">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-card">
                <div className="contact-icon">{info.icon}</div>
                <h3 className="contact-card-title">{info.title}</h3>
                {info.items.map((item, idx) => (
                  <div key={idx} className="contact-item">
                    <p className="contact-label">{item.label}:</p>
                    <a 
                      href={item.link} 
                      className="contact-value"
                      target={item.link.startsWith('http') ? '_blank' : undefined}
                      rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {item.value}
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-map">
        <div className="map-container">
          <h2>Find Us</h2>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.1104180374587!2d78.79213707487264!3d10.090037990019967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0067a028f8a8f9%3A0x9c2484c6df0fb26!2sAlagappa%20Chettiar%20Government%20College%20of%20Engineering%20%26%20Technology.!5e0!3m2!1sen!2sin!4v1759495426123!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '20px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ACGCET Location"
            ></iframe>
          </div>
          <div className="map-info">
            <p className="map-address">
              <strong>Alagappa Chettiar Government College of Engineering & Technology</strong><br />
             
              Karaikudi, Tamil Nadu 630003<br />
              Sivaganga District, India
            </p>
          </div>
        </div>
      </section>
{/*
      <section className="contact-form-section">
        <div className="form-container">
          <h2>Send Us a Message</h2>
          <p className="form-desc">Have a question? Drop us a message and we'll get back to you soon!</p>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this about?"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={formStatus === 'sending'}
            >
              {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {formStatus === 'success' && (
              <p className="form-message success">✓ Message sent successfully! We'll get back to you soon.</p>
            )}
            {formStatus === 'error' && (
              <p className="form-message error">✗ Failed to send message. Please try again or contact us directly.</p>
            )}
          </form>
        </div>
      </section>

      <section className="contact-social">
        <div className="social-container">
          <h2>Connect With Us</h2>
          <div className="social-links">
            <a 
              href="https://www.instagram.com/mechasso_acgcet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
            >
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                <circle cx="18" cy="6" r="1" fill="currentColor"/>
              </svg>
              <span>@mechanical_acgcet</span>
            </a>
            <a 
              href="https://www.linkedin.com/company/mechanical-engineering-association-acgcet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link linkedin"
            >
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>Mechanical Engineering Association</span>
            </a>
          </div>
        </div>
      </section>
*/}
      <section className="contact-cta">
        <h2>Ready to Join SHACKLES 2025?</h2>
        <p>Register now and be part of an amazing experience</p>
        <Link to="/register" className="btn-register-base btn-register-primary btn-register-large">
          Register Now
        </Link>
      </section>
    </div>
  );
};


export default Contact;
