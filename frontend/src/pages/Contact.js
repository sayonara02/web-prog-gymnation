import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    
    if (!formData.subject) newErrors.subject = 'Subject is required';
    else if (formData.subject.length < 3) newErrors.subject = 'Subject must be at least 3 characters';
    
    if (!formData.message) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setShowSuccess(false), 10000);
    }
  };

  const resources = [
    { icon: 'fas fa-heart', title: 'The Trevor Project', desc: '24/7 crisis intervention and suicide prevention services for LGBTQ+ youth.', link: 'https://www.thetrevorproject.org/' },
    { icon: 'fas fa-running', title: 'OutAthletics', desc: 'Global network of LGBTQ+ sports clubs and events promoting inclusive athletic participation.', link: 'https://www.outathletics.org/' },
    { icon: 'fas fa-bullhorn', title: 'GLAAD', desc: 'Leading LGBTQ+ advocacy organization working through entertainment, news, and digital media.', link: 'https://www.glaad.org/' },
    { icon: 'fas fa-hands-helping', title: 'LGBT Philippines', desc: 'Local organization providing support, advocacy, and community building.', link: 'https://www.lgbtphilippines.org/' }
  ];

  return (
    <main className="contact-container">
      <section className="hero-section">
        <h1>Get in Touch with PrideFit Gym</h1>
        <p className="subtitle">We're here to answer your questions, listen to your feedback, and welcome you to our inclusive community</p>
      </section>

      <div className="contact-grid">
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input type="text" id="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject:</label>
              <input type="text" id="subject" value={formData.subject} onChange={handleChange} placeholder="What is this regarding?" />
              {errors.subject && <span className="error">{errors.subject}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message:</label>
              <textarea id="message" rows="6" value={formData.message} onChange={handleChange} placeholder="Type your message here..."></textarea>
              {errors.message && <span className="error">{errors.message}</span>}
            </div>
            
            {showSuccess && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i> Message sent successfully! We'll get back to you within 24-48 hours.
              </div>
            )}
            
            <button type="submit"><i className="fas fa-paper-plane"></i> Send Message</button>
          </form>
        </div>
        
        <div className="contact-info-card">
          <h2>Contact Information</h2>
          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div className="contact-text">
                <h4>Our Location</h4>
                <p>123 Quezon Avenue, Quezon City<br />Metro Manila, Philippines 1100</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-phone"></i></div>
              <div className="contact-text">
                <h4>Phone Number</h4>
                <p>+63 2 1234 5678</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <div className="contact-text">
                <h4>Email Address</h4>
                <p>info@pridefitgym.ph</p>
                <p>support@pridefitgym.ph</p>
              </div>
            </div>
          </div>
          
          <h3>Operating Hours</h3>
          <table className="hours-table">
            <tbody>
              <tr><td>Monday - Friday</td><td>5:00 AM - 10:00 PM</td></tr>
              <tr><td>Saturday</td><td>6:00 AM - 8:00 PM</td></tr>
              <tr><td>Sunday</td><td>7:00 AM - 6:00 PM</td></tr>
              <tr><td>Holidays</td><td>8:00 AM - 4:00 PM</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <section className="map-section">
        <h2>Our Location</h2>
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps?q=Quezon+City+Philippines&output=embed"
            width="100%" 
            height="350" 
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="PrideFit Gym Location"
          ></iframe>
        </div>
      </section>
      
      <section className="resources-section">
        <h2>Helpful Resources & Community Partners</h2>
        <p>We partner with organizations that share our commitment to LGBTQ+ wellness and inclusivity.</p>
        <div className="resources-grid">
          {resources.map((resource, index) => (
            <div className="resource-card" key={index}>
              <div className="resource-icon"><i className={resource.icon}></i></div>
              <h3>{resource.title}</h3>
              <p>{resource.desc}</p>
              <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">Visit Website →</a>
            </div>
          ))}
        </div>
      </section>
      
      <section className="emergency-section">
        <h2>Emergency Support</h2>
        <p>If you or someone you know is in crisis and needs immediate assistance, please contact:</p>
        <div className="contact-item">
          <div className="contact-icon emergency-icon"><i className="fas fa-phone-alt"></i></div>
          <div className="contact-text">
            <h4>National Center for Mental Health (NCMH)</h4>
            <p>📞 Crisis Hotline: 1553 (Nationwide)</p>
            <p>📞 0917-899-8727 (USAP)</p>
          </div>
        </div>
        <p className="emergency-note">These services are available 24/7 and provide free, confidential support.</p>
      </section>
    </main>
  );
}

export default Contact;