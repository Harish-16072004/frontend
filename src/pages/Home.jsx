import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css';
import acgcetLogo from '../assets/images/ACGCET.webp';
import departmentLogo from '../assets/images/DEPARTMENT.webp';
import shacklesLogo from '../assets/images/ASSOLOGO.webp';

function Home() {
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [showSparkles, setShowSparkles] = useState(false);
  const [countdownEnded, setCountdownEnded] = useState(false);

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

  useEffect(() => {
    const eventDate = new Date('2025-10-23T00:00:00');
    
    const checkCountdown = () => {
      const now = new Date();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else if (!countdownEnded) {
        setCountdownEnded(true);
        setShowSparkles(true);
        // Stop sparkles after 5 seconds
        setTimeout(() => setShowSparkles(false), 5000);
      }
    };

    // Check immediately on mount
    checkCountdown();
    
    // Then check every second
    const timer = setInterval(checkCountdown, 1000);

    return () => clearInterval(timer);
  }, [countdownEnded]);

  // Create sparkle elements
  const createSparkles = () => {
    const sparkles = [];
    for (let i = 0; i < 50; i++) {
      sparkles.push(
        <div
          key={i}
          className="sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        />
      );
    }
    return sparkles;
  };

  return (
    <div className="home">
      {showSparkles && (
        <div className="sparkles-container">
          {createSparkles()}
        </div>
      )}
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="college-name">Alagappa Chettiar Government College of Engineering and Technology</p>
          <h1 className="hero-title">
            <span className="title-main">SHACKLES</span>
            <span className="title-year">25-26</span>
          </h1>
          <p className="hero-subtitle">Break Free From The Ordinary</p>
          
          <div className="hero-date-card">
            <div className="date-shape-left">■</div>
            <div className="date-content">
              <span className="date-value">October 23-24, 2025</span>
            </div>
            <div className="date-shape-right">■</div>
          </div>

          {/* Countdown Timer - Integrated */}
          <div className="hero-countdown">
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.days}</span>
              <span className="countdown-label">DAYS</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.hours}</span>
              <span className="countdown-label">HOURS</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.minutes}</span>
              <span className="countdown-label">MINUTES</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.seconds}</span>
              <span className="countdown-label">SECONDS</span>
            </div>
          </div>

          <p className="hero-tagline">Let's Begin the Game</p>

          <div className="hero-actions">
            <Link to="/maintenance" className="btn-register-base btn-register-maintenance btn-register-large">
              Registration Coming Soon 🔧
            </Link>
            <Link to="/events" className="btn-register-base btn-register-secondary btn-register-large">
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Countdown Timer - Old Section Hidden */}
      <section className="countdown" style={{display: 'none'}}>
        <h2 className="countdown-title">The Game Begins In</h2>
        <div className="countdown-timer">
          <div className="countdown-box">
            <span className="countdown-number">{timeLeft.days}</span>
            <span className="countdown-label">Days</span>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-box">
            <span className="countdown-number">{timeLeft.hours}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-box">
            <span className="countdown-number">{timeLeft.minutes}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-box">
            <span className="countdown-number">{timeLeft.seconds}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2 className="section-title">Welcome, Player</h2>
        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon">◈</div>
            <h3>The Challenge</h3>
            <p>
              SHACKLES 25-26 is not just a symposium—it's a survival game where only 
              the sharpest minds break free. Face technical gauntlets, strategic puzzles, 
              and innovation challenges. Will you emerge as a survivor or be eliminated?
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">△</div>
            <h3>The Rules</h3>
            <p>
              2 days of intense competition. 
              Choose your game wisely—Technical, Non-Technical, or Special Events. 
              Each round eliminates the weak. Only the strongest claim victory.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">○</div>
            <h3>The Prize</h3>
            <p>
              Beyond glory and certificates, winners unlock cash prizes. 
              But remember—in this game, your 
              skills, strategy, and survival instinct are your only weapons.
            </p>
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="categories">
        <h2 className="section-title">Choose Your Game</h2>
        <p className="section-subtitle">Each shape represents a different path. Choose wisely.</p>
        <div className="categories-grid">
          <Link to="/events/technical" className="category-card technical">
            <span className="category-symbol">■</span>
            <h3>Technical Events</h3>
            <p>6 Engineering Challenges</p>
            <span className="category-badge">Square</span>
          </Link>

          <Link to="/events/non-technical" className="category-card non-technical">
            <span className="category-symbol">○</span>
            <h3>Non-Technical Events</h3>
            <p>4 Strategy Games</p>
            <span className="category-badge">Circle</span>
          </Link>

          <Link to="/events/special" className="category-card special">
            <span className="category-symbol">△</span>
            <h3>Special Events</h3>
            <p>2 Elite Competitions</p>
            <span className="category-badge">Triangle</span>
          </Link>

          <Link to="/workshops" className="category-card workshop">
            <span className="category-symbol">◈</span>
            <h3>Workshops</h3>
            <p>2 Skill-Building Sessions</p>
            <span className="category-badge">Bonus</span>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="cta-content">
          <div className="cta-symbol">◈</div>
          <h2>Ready to Break the Shackles?</h2>
          <p className="cta-text">
            The arena awaits. Will you play it safe, or risk everything for glory? 
            Registration is now open, but spots are limited. Only the first 456 players 
            can enter the game.
          </p>
          <div className="cta-stats">
            <div className="stat-box">
              <span className="stat-number">2</span>
              <span className="stat-label">Workshops</span>
            </div>
        
            <div className="stat-box">
              <span className="stat-number">12</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">2</span>
              <span className="stat-label">Days</span>
            </div>
          </div>
          <div className="cta-actions">
            <Link to="/maintenance" className="btn-register-base btn-register-maintenance btn-register-large">
              Registration Coming Soon 🔧
            </Link>
            <Link to="/contact" className="btn-register-base btn-register-secondary btn-register-large">
              Learn More
            </Link>
          </div>
          <p className="cta-warning">
            ⚠️ Warning: Participation requires courage, skill, and determination. Are you ready?
          </p>
        </div>
      </section>

      {/* Organizers Section */}
      <section className="organizers">
        <h2 className="section-title">ABOUT US</h2>
        
        
        <div className="organizer-grid">
          {/* Institution */}
          <div className="organizer-card">
            <div className="organizer-icon">
              <img src={acgcetLogo} alt="ACGCET" className="organizer-img" />
            </div>
            <h3>Alagappa Chettiar Government College of Engineering and Technology</h3>
            <p>
              Our institution ACGCET stands tall as a beacon of knowledge with a proud legacy of over 70 years. As an autonomous 
              government institution, we combine the richness of tradition with the dynamism of innovation to deliver world-class 
              education at an affordable cost. Our serene campus, experienced faculty, and industry-focused curriculum create the 
              perfect environment for intellectual growth and holistic development. Beyond academics, our institute offers student
              associations, clubs, sports, and cultural platforms that nurture leadership, creativity, and teamwork. At ACGCET, we
              are committed to empowering students to transform into skilled professionals and responsible individuals, ready to
              thrive in an ever-evolving global landscape.
            </p>
          </div>

          {/* Department */}
          <div className="organizer-card">
            <div className="organizer-icon">
              <img src={departmentLogo} alt="Department of Mechanical Engineering" className="organizer-img" />
            </div>
            <h3>Department of Mechanical Engineering</h3>
            <p>
              Established in 1952, our NBA-accredited Department of Mechanical Engineering is a hub of innovation and excellence. We offer a comprehensive range of programs including B.E. (Full-time & Part-time), M.E. in Manufacturing and CAD, and a robust Ph.D. program. Recognized as a research center by Anna University since 2002, we have proudly produced over 50 Ph.D.s in cutting-edge fields like Additive Manufacturing, Robotics, and Composite Materials. Our students gain hands-on experience in state-of-the-art facilities, including a Centre of Excellence in Additive Manufacturing, and enhance their employability through industrial internships and active participation in prestigious national competitions like SAE BAJA and GO-KART.
            </p>
          </div>

          {/* SHACKLES */}
          <div className="organizer-card">
            <div className="organizer-icon">
              <img src={shacklesLogo} alt="SHACKLES Association Logo" className="organizer-img" />
            </div>
            <h3>SHACKLES 25-26: The Ultimate Test</h3>
            <p>
              Organized by the Mechanical Engineering Association, SHACKLES is not just a symposium—
              it's a battlefield where theory meets practice. We've designed this game to push boundaries, 
              test limits, and separate the skilled from the average. Only those who dare to break free 
              from conventional thinking will claim victory. Are you ready to face the challenge?
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
