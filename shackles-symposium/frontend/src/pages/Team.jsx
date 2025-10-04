import React from 'react';
import { Link } from 'react-router-dom';
import './Team.css';
import memberAvatar from '../assets/images/member-avatar.png';

const Team = () => {
  const staffInCharge = [
    {
      name: 'Dr.K.Ramanathan',
      designation: 'Head of Department',
      department: 'Mechanical Engineering',
    },
    {
      name: 'Prof.V.Jawahar',
      designation: 'Coordinator',
      department: 'Mechanical Engineering',
    },
  ];

  const officeBearers = [
    { name: 'KILLIVALAVAN S', designation: 'General Secretary',linkedin: '#' },
    { name: 'ABIRAMI N', designation: 'General Secretary', linkedin: '#' },
    { name: 'HARISH J', designation: 'Accounts Secretary', linkedin: '#' },
    { name: 'SIVA G', designation: 'Accounts Secretary', linkedin: '#' },
    { name: 'MOHAN V', designation: 'Technical Director', linkedin: '#' },
    { name: 'BAVINA M', designation: 'Technical Director', linkedin: '#' },
    { name: 'VIGNESHWARAN K', designation: 'Technical Director', linkedin: '#' },
    { name: 'PRABHUVELSUNDHAR S R', designation: 'Event Director', linkedin: '#' },
    { name: 'SAKTHIVEL', designation: 'Event Director', linkedin: '#' },
    { name: 'SURYA R', designation: 'Design and Media Director', linkedin: '#' },
    { name: 'NISHWATH FATHIMA M', designation: 'Design and Media Director', linkedin: '#' },
    { name: 'MEGALA SAKTHI G', designation: 'Documentation Lead', linkedin: '#' },
  ];

  const executives = [
    { name: 'ASWIN P', role: 'Student Executive', linkedin: '#' },
    { name: 'MUKILANDRAN C D', role: 'Student Executive', linkedin: '#' },
    { name: 'MANJU S', role: 'Financial Executive', linkedin: '#' },
    { name: 'PREM K', role: 'Financial Executive', linkedin: '#' },
    { name: 'PARAMESWARAN S', role: 'Event Executive', linkedin: '#' },
    { name: 'MAARISH AADITH M', role: 'Event Executive', linkedin: '#' },
    { name: 'VARUNRAJ V', role: 'Design Executive', linkedin: '#' },
    { name: 'NITHISH KUMAR S', role: 'Design Executive', linkedin: '#' },
    { name: 'SOWMITHA S', role: 'Media Executive', linkedin: '#' },
    { name: 'HARIPRASATH S', role: 'Media Executive', linkedin: '#' },
    
  ];

  const coordinators = [
    { name: 'AKILAN K', role: 'COORDINATOR', linkedin: '#' },
    { name: 'ANITHA M', role: 'COORDINATOR', linkedin: '#' },
    { name: 'ARAVIND A', role: 'COORDINATOR', linkedin: '#' },
    { name: 'GANESH MOORTHI K', role: 'COORDINATOR', linkedin: '#' },
    { name: 'GNANAPRAKASH D T', role: 'COORDINATOR', linkedin: '#' },
    { name: 'KAUSHIK KUMAR S R', role: 'COORDINATOR', linkedin: '#' },
    { name: 'NIDHARSHAN S S', role: 'COORDINATOR', linkedin: '#' },
    { name: 'PADMALOSANA S', role: 'COORDINATOR', linkedin: '#' },
    { name: 'POORNITHA V', role: 'COORDINATOR', linkedin: '#' },
    { name: 'PRAJIT AJAY S', role: 'COORDINATOR', linkedin: '#' },
    { name: 'SATHISH S', role: 'COORDINATOR', linkedin: '#' },
    { name: 'SURESH C', role: 'COORDINATOR', linkedin: '#' },
  ];

  return (
    <div className="team">
      <section className="team-hero">
        <h1 className="team-title">Our Team</h1>
        <p className="team-subtitle">Meet the Mechanical Engineering Association</p>
        <p className="team-desc">
          The dedicated team behind SHACKLES 2025
        </p>
      </section>

      {/* Staff-In-Charge */}
      <section className="team-section staff-section">
        <div className="section-container">
          <h2 className="section-title">Staff-In-Charge</h2>
          <div className="staff-grid">
            {staffInCharge.map((staff, index) => (
              <div key={index} className="staff-card">
                <div className="staff-avatar">
                  <img src={memberAvatar} alt={staff.name} className="staff-avatar-img" />
                </div>
                <h3 className="staff-name">{staff.name}</h3>
                <p className="staff-designation">{staff.designation}</p>
                <p className="staff-department">{staff.department}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Bearers */}
      <section className="team-section office-bearers-section">
        <div className="section-container">
          <h2 className="section-title">Office Bearers</h2>
          <div className="office-bearers-grid">
            {officeBearers.map((member, index) => (
              <div key={index} className="member-card office-bearer-card">
                <div className="member-avatar">
                  <img src={memberAvatar} alt={member.name} className="member-avatar-img" />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-designation">{member.designation}</p>
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="member-linkedin"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  Connect
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executives */}
      <section className="team-section executives-section">
        <div className="section-container">
          <h2 className="section-title">Executives</h2>
          <div className="executives-grid">
            {executives.map((member, index) => (
              <div key={index} className="member-card executive-card">
                <div className="member-avatar">
                  <img src={memberAvatar} alt={member.name} className="member-avatar-img" />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="member-linkedin"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  Connect
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coordinators */}
      <section className="team-section coordinators-section">
        <div className="section-container">
          <h2 className="section-title">Coordinators</h2>
          <div className="coordinators-grid">
            {coordinators.map((member, index) => (
              <div key={index} className="member-card coordinator-card">
                <div className="member-avatar">
                  <img src={memberAvatar} alt={member.name} className="member-avatar-img" />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="member-linkedin"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  Connect
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About MEA */}
      <section className="about-mea">
        <div className="about-container">
          <h2>About Mechanical Engineering Association</h2>
          <p className="about-desc">
            The Mechanical Engineering Association (MEA) at ACGCET, Karaikudi, is a vibrant 
            student-driven organization committed to fostering technical excellence, innovation, 
            and leadership among mechanical engineering students. Through symposiums, workshops, 
            technical talks, and industry interactions, MEA bridges the gap between academic 
            learning and real-world engineering challenges.
          </p>
          <p className="about-desc">
            Our association organizes various events throughout the year, with SHACKLES being 
            our flagship national-level technical symposium. We believe in nurturing talent, 
            encouraging creativity, and building a community of future engineers who will shape 
            the world of tomorrow.
          </p>
          <div className="mea-values">
            <div className="value-card">
              <span className="value-icon">🎯</span>
              <h3>Innovation</h3>
              <p>Encouraging creative thinking and problem-solving</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🤝</span>
              <h3>Collaboration</h3>
              <p>Building strong networks and teamwork</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🏆</span>
              <h3>Excellence</h3>
              <p>Striving for the highest standards</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🌟</span>
              <h3>Leadership</h3>
              <p>Developing future engineering leaders</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="team-cta">
        <h2>Join Us at SHACKLES 2025</h2>
        <p>Be part of an unforgettable experience</p>
        <Link to="/register" className="btn-register-team">
          Register Now
        </Link>
      </section>
    </div>
  );
};

export default Team;
