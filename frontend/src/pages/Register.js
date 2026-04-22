import React, { useState } from 'react';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: '',
    dob: '',
    fitnessLevel: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [id]: val }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleRadioChange = (e) => {
    setFormData(prev => ({ ...prev, fitnessLevel: e.target.value }));
    if (errors.fitnessLevel) {
      setErrors(prev => ({ ...prev, fitnessLevel: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullname) newErrors.fullname = 'Full name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords don\'t match';
    
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) newErrors.dob = 'You must be at least 18 years old to register';
    }
    
    if (!formData.fitnessLevel) newErrors.fitnessLevel = 'Select fitness level';
    if (!formData.terms) newErrors.terms = 'Agree to terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      alert('✅ Registration Successful! Welcome to PrideFit Gym!');
      setFormData({
        fullname: '',
        username: '',
        password: '',
        confirmPassword: '',
        dob: '',
        fitnessLevel: '',
        terms: false
      });
    }
  };

  return (
    <section className="register-content">
      <h2>Join PrideFit</h2>
      <p>Sign up to receive inclusive workout tips, event invites, and updates.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" id="fullname" value={formData.fullname} onChange={handleChange} />
          {errors.fullname && <span className="error">{errors.fullname}</span>}
        </div>

        <div className="form-group">
          <label>Username:</label>
          <input type="text" id="username" value={formData.username} onChange={handleChange} />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <div className="password-container">
            <input type={showPassword ? 'text' : 'password'} id="password" value={formData.password} onChange={handleChange} />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
            </button>
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <div className="password-container">
            <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
            </button>
          </div>
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="date" id="dob" value={formData.dob} onChange={handleChange} />
          {errors.dob && <span className="error">{errors.dob}</span>}
        </div>

        <div className="form-group">
          <label>Fitness Level:</label>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" name="level" value="beginner" checked={formData.fitnessLevel === 'beginner'} onChange={handleRadioChange} />
              Beginner
            </label>
            <label className="radio-option">
              <input type="radio" name="level" value="intermediate" checked={formData.fitnessLevel === 'intermediate'} onChange={handleRadioChange} />
              Intermediate
            </label>
            <label className="radio-option">
              <input type="radio" name="level" value="expert" checked={formData.fitnessLevel === 'expert'} onChange={handleRadioChange} />
              Expert
            </label>
          </div>
          {errors.fitnessLevel && <span className="error">{errors.fitnessLevel}</span>}
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" id="terms" checked={formData.terms} onChange={handleChange} />
            I agree to the terms
          </label>
          {errors.terms && <span className="error">{errors.terms}</span>}
        </div>

        <button type="submit">Register</button>
      </form>
    </section>
  );
}

export default Register;