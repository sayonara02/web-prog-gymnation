import React from 'react';
import './Home.css';

function Home() {
  const features = [
    { icon: 'fas fa-shield-alt', title: 'Safe & Affirming Environment', desc: 'Zero-tolerance policy for discrimination. Our staff is trained in LGBTQ+ sensitivity and trauma-informed practices.' },
    { icon: 'fas fa-user-graduate', title: 'LGBTQ+ Certified Trainers', desc: 'Our trainers complete specialized certification in LGBTQ+ fitness needs and inclusive coaching methods.' },
    { icon: 'fas fa-restroom', title: 'Gender-Inclusive Facilities', desc: 'Private changing areas, gender-neutral restrooms, and facilities designed for everyone\'s comfort.' },
    { icon: 'fas fa-users', title: 'Community-Driven Events', desc: 'Regular social events, support groups, and fitness challenges that build genuine connections.' }
  ];

  const services = [
    { title: 'Personal Training', desc: 'One-on-one sessions with trainers who understand your unique needs and goals.' },
    { title: 'Group Classes', desc: 'From yoga to HIIT, our classes are designed to be inclusive and welcoming for all.' },
    { title: 'Nutrition Coaching', desc: 'Holistic nutrition plans that respect your identity and support your wellness journey.' }
  ];

  const testimonials = [
    { text: '"PrideFit changed my relationship with fitness. For the first time, I feel completely comfortable being myself at the gym."', author: 'Alex Jordan', memberSince: '2023', initials: 'AJ' },
    { text: '"The trainers here actually understand my needs as a trans person. I\'ve never felt more supported in my fitness journey."', author: 'Morgan Swift', memberSince: '2022', initials: 'MS' },
    { text: '"As an ally, I wanted to support an inclusive gym. What I found was an amazing community that welcomes everyone."', author: 'Taylor Park', memberSince: '2024', initials: 'TP' }
  ];

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Fitness Without Fear. Strength With Pride.</h1>
          <p>PrideFit Gym is a safe, inclusive fitness space designed for the LGBTQ+ community and allies. Join a community where you can be your authentic self while achieving your fitness goals.</p>
          <div className="hero-buttons">
            <a href="#" className="cta-button">Start Your Journey</a>
            <a href="#" className="cta-button secondary">Learn More</a>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="why-section">
          <h2 className="section-title">Why Choose PrideFit?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="services-section">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <div className="service-image">
                  <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt={service.title} />
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <a href="#" className="cta-button" style={{ padding: '10px 20px', fontSize: '0.9rem', marginTop: '15px', display: 'inline-block' }}>Learn More</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-card">
            <div className="stats-number">500+</div>
            <div className="stats-label">Happy Members</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">15+</div>
            <div className="stats-label">Certified Trainers</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">50+</div>
            <div className="stats-label">Weekly Classes</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">100%</div>
            <div className="stats-label">Inclusive Environment</div>
          </div>
        </section>

        <section className="testimonials-section">
          <h2 className="section-title">What Our Members Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-text">{testimonial.text}</div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.initials}</div>
                  <div className="author-info">
                    <h4>{testimonial.author}</h4>
                    <p>Member since {testimonial.memberSince}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Join Our Community?</h2>
          <p>Take the first step toward a fitness journey where you can be 100% yourself. Sign up today and get your first week free!</p>
          <div className="hero-buttons">
            <a href="#" className="cta-button">Join Now</a>
            <a href="#" className="cta-button secondary">Schedule a Tour</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;