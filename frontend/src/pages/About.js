import React from 'react';
import './About.css';

function About() {
  const timelineItems = [
    { year: '2018', title: 'Discovering Fitness as Confidence', desc: 'Found strength training during a difficult coming-out period. Realized physical strength translated to emotional resilience.', icon: 'fas fa-dumbbell' },
    { year: '2019-2020', title: 'Experiencing Gym Exclusion', desc: 'Faced uncomfortable stares, misgendering, and lack of representation at traditional gyms. Felt constantly "othered" in spaces meant for wellness.', icon: 'fas fa-ban' },
    { year: '2021', title: 'Researching Inclusive Models', desc: 'Studied LGBTQ+ friendly gyms worldwide, interviewed community members about their needs, and trained in trauma-informed coaching.', icon: 'fas fa-search' },
    { year: '2022-Present', title: 'Creating PrideFit', desc: 'Designed PrideFit as a welcoming alternative with input from the community. Every detail, from signage to programming, was created with intention.', icon: 'fas fa-heart' }
  ];

  const values = [
    { icon: 'fas fa-shield-alt', title: 'Safety First', desc: 'Zero-tolerance policy for discrimination. All staff complete LGBTQ+ sensitivity training annually.' },
    { icon: 'fas fa-users', title: 'Community Focus', desc: 'Weekly social events, support groups, and partner workouts to build genuine connections.' },
    { icon: 'fas fa-universal-access', title: 'Accessibility', desc: 'Sliding scale memberships, adaptive equipment, and classes for all ability levels.' },
    { icon: 'fas fa-graduation-cap', title: 'Education', desc: 'Workshops on nutrition, mental health, and body positivity alongside physical training.' }
  ];

  return (
    <main className="about-container">
      <section className="hero-section">
        <h1>Our Story: Building an Inclusive Fitness Community</h1>
        <p className="subtitle">Creating safe spaces where every body belongs</p>
      </section>

      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>At PrideFit Gym, we believe fitness should be accessible, welcoming, and empowering for everyone regardless of gender identity, sexual orientation, ability, or background. We're not just a gym—we're a movement toward radical inclusivity in wellness.</p>
        </div>
      </section>

      <section className="content-section">
        <h2>What I Love About Inclusive Fitness</h2>
        <p>Many LGBTQ+ individuals avoid gyms due to fear of judgment or harassment. PrideFit Gym represents a space where everyone can train confidently and safely. We've created an environment where members can focus on their health without worrying about discrimination, microaggressions, or feeling out of place.</p>
        <p>Inclusive fitness goes beyond just having rainbow flags—it's about trained staff who understand diverse needs, gender-neutral facilities, programming that celebrates all body types, and a community that actively supports each other's journeys.</p>
      </section>

      <section className="content-section">
        <h2>My Journey</h2>
        <div className="timeline">
          {timelineItems.map((item, index) => (
            <div className="timeline-item" key={index}>
              <h3>
                <i className={item.icon} style={{ marginRight: '10px' }}></i>
                {item.title}
              </h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <div className="value-card" key={index}>
              <div className="value-icon">
                <i className={value.icon}></i>
              </div>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section">
        <h2>Our Community in Action</h2>
        <div className="image-gallery">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Personal training session" className="gallery-img" />
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Community group workout" className="gallery-img" />
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="LGBTQ+ yoga class" className="gallery-img" />
        </div>
        <div className="content-section">
          <h3>Beyond the Workout Floor</h3>
          <p>We host monthly events including:</p>
          <ul>
            <li>🏳️‍🌈 Queer & Trans Fitness Clinics</li>
            <li>🧠 Mental Health & Movement Workshops</li>
            <li>🎉 Pride Month Celebrations</li>
            <li>🤝 Community Partnership Events</li>
            <li>🎓 Free Classes for LGBTQ+ Youth</li>
          </ul>
        </div>
      </section>

      <section className="content-section">
        <h2>Why Representation Matters</h2>
        <p>Seeing trainers and members who share your identity changes everything. It transforms exercise from a source of anxiety to a source of joy. Our staff reflects the diversity of our community, with 70% identifying as LGBTQ+ and 40% as people of color.</p>
        <blockquote>
          "Your body is worthy of strength and respect exactly as it is."
          <cite>— PrideFit Gym Mantra</cite>
        </blockquote>
        <p>This isn't just a quote on our wall—it's the foundation of every interaction at PrideFit. We celebrate non-scale victories, honor all fitness journeys, and reject diet culture that harms marginalized communities.</p>
      </section>

      <section className="content-section">
        <h2>Join Our Movement</h2>
        <p>PrideFit is more than a business—it's a testament to what happens when we center marginalized voices in wellness. We're growing, with plans to open three new locations by 2027 and developing online resources for those without local inclusive gyms.</p>
         <div className="cta-buttons">
           <button className="cta-button" onClick={() => window.location.href = '/register'}>Become a Member</button>
           <button className="cta-button secondary" onClick={() => window.location.href = '/contact'}>Volunteer With Us</button>
         </div>
      </section>
    </main>
  );
}

export default About;