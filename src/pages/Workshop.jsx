import React from 'react';
import { Link } from 'react-router-dom';
import './Workshop.css';

const Workshop = () => {
  const workshops = [
    {
      id: 1,
      name: 'Additive Manufacturing Workshop',
      time: '10:00 AM - 1:00 PM',
      date: 'October 23, 2025',
      description: 'Learn about 3D printing technologies, CAD design for additive manufacturing, and hands-on experience with 3D printers.',
      topics: [
        'Introduction to Additive Manufacturing',
        'Types of 3D Printing Technologies',
        'CAD Design for 3D Printing',
        'Material Selection and Properties',
        'Hands-on 3D Printer Operation',
        'Post-Processing Techniques',
      ],
      trainer: 'Industry Expert from Leading 3D Printing Company',
      coordinator: {
        name: 'Workshop Team',
        phone: '+91 9514585887',
      },
    },
    {
      id: 2,
      name: 'IoT (Internet of Things) Workshop',
      time: '2:00 PM - 5:00 PM',
      date: 'October 23, 2025',
      description: 'Explore the world of IoT with hands-on projects using sensors, microcontrollers, and cloud integration.',
      topics: [
        'Introduction to IoT Architecture',
        'Arduino and ESP32 Programming',
        'Sensor Integration and Data Collection',
        'Cloud Platforms (ThingSpeak, Blynk)',
        'Building Smart Home Automation',
        'Real-world IoT Applications',
      ],
      trainer: 'Certified IoT Professional',
      coordinator: {
        name: 'Workshop Team',
        phone: '+91 9384583077',
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

      <section className="workshop-pricing">
        <div className="pricing-container">
          <div className="pricing-option">
            <h3>Workshops Only</h3>
            <div className="price">
              <span className="currency">₹</span>
              <span className="amount">199</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Both workshops included</li>
              <li>✓ Hands-on training</li>
              <li>✓ Workshop certificates</li>
              <li>✓ Lunch included</li>
              <li>✓ Learning materials provided</li>
            </ul>
            <Link to="/register" className="btn-pricing">Register</Link>
          </div>

          <div className="pricing-option featured">
            <div className="featured-tag">Best Value</div>
            <h3>Combined Package</h3>
            <div className="price">
              <span className="currency">₹</span>
              <span className="amount">499</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Both workshops</li>
              <li>✓ All 11 events access</li>
              <li>✓ Event & workshop certificates</li>
              <li>✓ Lunch & refreshments</li>
              <li>✓ Exclusive goodies</li>
              <li>✓ Complete symposium experience</li>
            </ul>
            <Link to="/register" className="btn-pricing">Register</Link>
          </div>
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
          <Link to="/register" className="btn-cta-primary">
            Register Now
          </Link>
          <Link to="/contact" className="btn-cta-secondary">
            Have Questions?
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Workshop;
