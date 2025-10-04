import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Workshop.css';

const Workshop = () => {
  const location = useLocation();

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

  const workshops = [
    {
      id: 1,
      name: 'Additive Manufacturing Workshop',
      time: '10:00 AM - 1:00 PM',
      date: 'October 23, 2025',
      description: 'An additive manufacturing workshop introduces the process of building three-dimensional objects layer-by-layer directly from a digital model. It typically covers various AM technologies, materials (polymers, metals), design principles like Design for Additive Manufacturing (DfAM), and post-processing techniques. Participants learn how AM enables design complexity, rapid prototyping, and the production of customized or lightweight functional parts across multiple industries.',
      topics: [
        'Introduction to Additive Manufacturing',
        'Types of 3D Printing Technologies',
        'CAD Design for 3D Printing',
        'Material Selection and Properties',
        'Hands-on 3D Printer Operation',
        'Post-Processing Techniques',
      ],
      trainer: 'Dr.S.M.Siavgami',
      coordinator: {
        name: 'Workshop Team',
        phone: '+91 9342034079',
      },
    },
    {
      id: 2,
      name: 'Smart Manufacturing',
      time: '2:00 PM - 5:00 PM',
      date: 'October 23, 2025',
      description: 'A smart manufacturing workshop explores the integration of advanced technologies like AI, IoT, and data analytics into production systems. Participants will learn how to leverage these tools to optimize operations, enhance efficiency, improve quality control, and enable real-time decision-making, ultimately driving the shift towards a more connected and adaptive industrial landscape.',
      topics: [
        'Introduction to IoT Architecture',
        'Arduino and ESP32 Programming',
        'Sensor Integration and Data Collection',
        'Cloud Platforms (ThingSpeak, Blynk)',
        'Building Smart Home Automation',
        'Real-world IoT Applications',
      ],
      trainer: 'Expert Team',
      coordinator: {
        name: 'Workshop Team',
        phone: '+91 9342034079',
      },
    },
  ];

  return (
    <div className="workshop">
      <section className="workshop-hero">
        <div className="workshop-symbol">◈</div>
        <h1 className="workshop-title">Workshops</h1>
        <p className="workshop-subtitle">Skill-Building Sessions by Industry Experts</p>
        <p className="workshop-date">October 23, 2025 | ACGCET Karaikudi</p>
      </section>

      <section className="workshop-grid">
        <div className="workshop-container">
          {workshops.map((workshop) => (
            <div key={workshop.id} className="workshop-card">
              <div className="workshop-badge">
                <span className="badge-text">Workshop {workshop.id}</span>
              </div>
              
              <h2 className="workshop-name">{workshop.name}</h2>
              
              <div className="workshop-timing">
                <div className="timing-item">
                  <span className="timing-icon">📅</span>
                  <span>{workshop.date}</span>
                </div>
                <div className="timing-item">
                  <span className="timing-icon">🕒</span>
                  <span>{workshop.time}</span>
                </div>
              </div>

              <p className="workshop-description">{workshop.description}</p>

              <div className="workshop-topics">
                <h3>What You'll Learn:</h3>
                <ul>
                  {workshop.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>

              <div className="workshop-trainer">
                <h4>Trainer:</h4>
                <p>{workshop.trainer}</p>
              </div>

              <div className="workshop-coordinator">
                <span className="coordinator-icon">📞</span>
                <div>
                  <p className="coordinator-name">{workshop.coordinator.name}</p>
                  <p className="coordinator-phone">{workshop.coordinator.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="workshop-benefits">
        <h2>Why Attend Our Workshops?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🎓</div>
            <h3>Expert Guidance</h3>
            <p>Learn from industry professionals with years of experience</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔧</div>
            <h3>Hands-On Experience</h3>
            <p>Practical sessions with real equipment and tools</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📜</div>
            <h3>Certificates</h3>
            <p>Receive certificates for both workshops</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💼</div>
            <h3>Career Boost</h3>
            <p>Add valuable skills to your resume</p>
          </div>
        </div>
      </section>

      <section className="workshop-cta">
        <h2>Ready to Learn & Grow?</h2>
        <p>Limited seats available - Register now!</p>
        <div className="cta-actions">
          <Link to="/register" className="btn-register-base btn-register-primary btn-register-large">
            Register Now
          </Link>
          <Link to="/contact" className="btn-register-base btn-register-secondary btn-register-large">
            Have Questions?
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Workshop;
