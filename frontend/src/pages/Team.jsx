import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Team.css';

// Import team member images
import ganeshImage from '../assets/images/GANESH_MOORTHI.webp';
import nithishImage from '../assets/images/NITHISH_KUMAR.webp';
import parameshwaranImage from '../assets/images/PARAMESWARAN.webp';
import abiraiImage from '../assets/images/ABIRAMI.webp';
import akilanImage from '../assets/images/AKILAN.webp';
import anithaImage from '../assets/images/ANITHA.webp';
import aravindImage from '../assets/images/ARAVIND.webp';
import aswinImage from '../assets/images/ASWIN.webp';
import barathImage from '../assets/images/BAVINA.webp';
import drRamanathanImage from '../assets/images/Dr_K_Ramanathan.webp';
import gnanaprakashImage from '../assets/images/GNANAPRAKASH.webp';
import harishImage from '../assets/images/HARISH.webp';
import hariPrasathImage from '../assets/images/HARI_PRASATH.webp';
import kaushikImage from '../assets/images/KAUSHIK_KUMAR.webp';
import killivalanImage from '../assets/images/KILLIVALAVAN.webp';
import maarishImage from '../assets/images/MARISH_AADITH.webp';
import manjuImage from '../assets/images/MANJU.webp';
import manojImage from '../assets/images/MOHAN.webp';
import megalaImage from '../assets/images/MEGALA_SAKTHI.webp';
import mukilandrenImage from '../assets/images/MUKILANDRAN.webp';
import nidharshanImage from '../assets/images/NIDHARSHAN.webp';
import nishwathImage from '../assets/images/NISHWATH_FATHIMA.webp';
import padmalosanaImage from '../assets/images/PADMALOSANA.webp';
import poornithaImage from '../assets/images/POORNITHA.webp';
import prabhuvelsundharImage from '../assets/images/PRABUVELSUNDAR.webp';
import prajithImage from '../assets/images/PRAJIT_AJAY.webp';
import premImage from '../assets/images/PREM.webp';
import profJawaharImage from '../assets/images/Prof_V_Jawahar.webp';
import sakthivelImage from '../assets/images/SAKTHIVEL.webp';
import sathishImage from '../assets/images/SATHISH.webp';
import sivaImage from '../assets/images/SIVA.webp';
import sowmithaImage from '../assets/images/SOWMITHA.webp';
import sureshImage from '../assets/images/SURESH.webp';
import suryaImage from '../assets/images/SURYA.webp';
import varunrajImage from '../assets/images/VARUN_RAJ.webp';
import vigneshImage from '../assets/images/VIGNESHWARAN.webp';



const Team = () => {
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

  // Function to get team member image
  const getMemberImage = (name) => {
    const imageMap = {
      'Dr.K.Ramanathan': drRamanathanImage,
      'Prof.V.Jawahar': profJawaharImage,
      'KILLIVALAVAN S': killivalanImage,
      'ABIRAMI N': abiraiImage,
      'HARISH J': harishImage,
      'SIVA G': sivaImage,
      'MOHAN V': manojImage, 
      'BAVINA M': barathImage,
      'VIGNESHWARAN K': vigneshImage,
      'PRABUVELSUNDAR SR': prabhuvelsundharImage,
      'SAKTHIVEL': sakthivelImage,
      'SURYA R': suryaImage,
      'NISHWATH FATHIMA M': nishwathImage,
      'MEGALA SAKTHI G': megalaImage,
      'ASWIN P': aswinImage,
      'MUKILANDRAN C D': mukilandrenImage,
      'MANJU S': manjuImage,
      'PREM K': premImage,
      'PARAMESWARAN S': parameshwaranImage, 
      'MAARISH AADITH M': maarishImage,
      'VARUNRAJ V': varunrajImage,
      'NITHISH KUMAR S': nithishImage, 
      'SOWMITHA S': sowmithaImage,
      'HARIPRASATH S': hariPrasathImage,
      'AKILAN K': akilanImage,
      'ANITHA M': anithaImage,
      'ARAVIND A': aravindImage,
      'GANESH MOORTHI K': ganeshImage, 
      'GNANAPRAKASH D T': gnanaprakashImage,
      'KAUSHIK KUMAR S R': kaushikImage,
      'NIDHARSHAN S S': nidharshanImage,
      'PADMALOSANA S': padmalosanaImage,
      'POORNITHA V': poornithaImage,
      'PRAJIT AJAY S': prajithImage,
      'SATHISH S': sathishImage,
      'SURESH C': sureshImage,
      // Additional mappings for backward compatibility
      'ABIRAMI': abiraiImage,
      'HARISH': harishImage,
      'SURYA': suryaImage,
      'NISHWATH FATHIMA': nishwathImage,
      'MANJU': manjuImage,
      'MAARISH AADITH': maarishImage,
      'VARUNRAJ': varunrajImage,
      'POORNITHA': poornithaImage,
      'SURESH': sureshImage,
    };
    
    return imageMap[name] || null;
  };

  const staffInCharge = [
    {
      name: 'Dr.K.Ramanathan',
      designation: 'Head of Department',
      department: 'Mechanical Engineering',
      image: getMemberImage('Dr.K.Ramanathan'),
    },
    {
      name: 'Prof.V.Jawahar',
      designation: 'Coordinator',
      department: 'Mechanical Engineering',
      image: getMemberImage('Prof.V.Jawahar'),
    },
  ];

  const officeBearers = [
    { name: 'KILLIVALAVAN S', designation: 'General Secretary', linkedin: '#', image: getMemberImage('KILLIVALAVAN S') },
    { name: 'ABIRAMI N', designation: 'General Secretary', linkedin: '#', image: getMemberImage('ABIRAMI N') },
    { name: 'HARISH J', designation: 'Accounts Secretary', linkedin: '#', image: getMemberImage('HARISH J') },
    { name: 'SIVA G', designation: 'Accounts Secretary', linkedin: '#', image: getMemberImage('SIVA G') },
    { name: 'MOHAN V', designation: 'Technical Director', linkedin: '#', image: getMemberImage('MOHAN V') },
    { name: 'BAVINA M', designation: 'Technical Director', linkedin: '#', image: getMemberImage('BAVINA M') },
    { name: 'VIGNESHWARAN K', designation: 'Technical Director', linkedin: '#', image: getMemberImage('VIGNESHWARAN K') },
    { name: 'PRABUVELSUNDAR SR', designation: 'Event Director', linkedin: '#', image: getMemberImage('PRABUVELSUNDAR SR') },
    { name: 'SAKTHIVEL K', designation: 'Event Director', linkedin: '#', image: getMemberImage('SAKTHIVEL') },
    { name: 'SURYA R', designation: 'Design and Media Director', linkedin: '#', image: getMemberImage('SURYA R') },
    { name: 'NISHWATH FATHIMA M', designation: 'Design and Media Director', linkedin: '#', image: getMemberImage('NISHWATH FATHIMA M') },
    { name: 'MEGALA SAKTHI G', designation: 'Documentation Lead', linkedin: '#', image: getMemberImage('MEGALA SAKTHI G') },
  ];

  const executives = [
    { name: 'ASWIN P', role: 'Student Executive', linkedin: '#', image: getMemberImage('ASWIN P') },
    { name: 'MUKILANDRAN C D', role: 'Student Executive', linkedin: '#', image: getMemberImage('MUKILANDRAN C D') },
    { name: 'MANJU S', role: 'Financial Executive', linkedin: '#', image: getMemberImage('MANJU S') },
    { name: 'PREM K', role: 'Financial Executive', linkedin: '#', image: getMemberImage('PREM K') },
    { name: 'PARAMESWARAN S', role: 'Event Executive', linkedin: '#', image: getMemberImage('PARAMESWARAN S') },
    { name: 'MAARISH AADITH M', role: 'Event Executive', linkedin: '#', image: getMemberImage('MAARISH AADITH M') },
    { name: 'VARUNRAJ V', role: 'Design Executive', linkedin: '#', image: getMemberImage('VARUNRAJ V') },
    { name: 'NITHISH KUMAR A', role: 'Design Executive', linkedin: '#', image: getMemberImage('NITHISH KUMAR S') },
    { name: 'SOWMITHA S', role: 'Media Executive', linkedin: '#', image: getMemberImage('SOWMITHA S') },
    { name: 'HARIPRASATH S', role: 'Media Executive', linkedin: '#', image: getMemberImage('HARIPRASATH S') },
  ];

  const coordinators = [
    { name: 'AKILAN K', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('AKILAN K') },
    { name: 'ANITHA M', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('ANITHA M') },
    { name: 'ARAVIND A', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('ARAVIND A') },
    { name: 'GANESH MOORTHI K', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('GANESH MOORTHI K') },
    { name: 'GNANAPRAKASH D T', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('GNANAPRAKASH D T') },
    { name: 'KAUSHIK KUMAR S R', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('KAUSHIK KUMAR S R') },
    { name: 'NIDHARSHAN S S', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('NIDHARSHAN S S') },
    { name: 'PADMALOSANA S', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('PADMALOSANA S') },
    { name: 'POORNITHA V', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('POORNITHA V') },
    { name: 'PRAJIT AJAY S', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('PRAJIT AJAY S') },
    { name: 'SATHISH S', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('SATHISH S') },
    { name: 'SURESH C', role: 'COORDINATOR', linkedin: '#', image: getMemberImage('SURESH C') },
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
                  <img src={staff.image} alt={staff.name} className="staff-avatar-img" />
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
                  <img src={member.image} alt={member.name} className="member-avatar-img" />
                </div>
                <h3 className={`member-name ${member.name.length > 15 ? 'long-name' : ''}`}>{member.name}</h3>
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
                  <img src={member.image} alt={member.name} className="member-avatar-img" />
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
                  <img src={member.image} alt={member.name} className="member-avatar-img" />
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
          
        </div>
      </section>

      {/* CTA */}
      <section className="team-cta">
        <h2>Join Us at SHACKLES 2025</h2>
        <p>Be part of an unforgettable experience</p>
        <Link to="/maintenance" className="btn-register-base btn-register-maintenance btn-register-large">
          Registration Coming Soon 🔧
        </Link>
      </section>
    </div>
  );
};

export default Team;
