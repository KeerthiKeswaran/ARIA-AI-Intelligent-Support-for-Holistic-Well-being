import React, { useState } from 'react';
import './Questionnaire.css';

const Questionnaire = () => {
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({
    workEnvironment: '',
    stressLevel: '',
    household: '',
    smokingAlcohol: '',
    exerciseRoutine: '',
    diet: ''
  });

  const handleAnswerChange = (question, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: answer,
    }));
    // Update progress based on answers completed
    setProgress(Math.min(100, progress + 20));
  };

  return (
    <div className="questionnaire">
      <h1>Personalize Your Health Journey!</h1>
      <p>A quick questionnaire to tailor your health assistant experience based on your unique lifestyle and work environment.</p>
      

      {/* Question 1 */}
      <div className="question">
        <label>Let’s start with a bit about your work. Which of these describes your daily work environment?</label>
        <select onChange={(e) => handleAnswerChange('workEnvironment', e.target.value)}>
          <option value="">Select your work environment</option>
          <option value="Office/Sedentary">Office/Sedentary Job</option>
          <option value="Physical Labor">Physical Labor</option>
          <option value="Chemical/Industrial">Chemical/Industrial Environment</option>
          <option value="High-Stress">High-Stress Job</option>
          <option value="Other">Other</option>
        </select>
        <span className="tooltip" title="Chemical environments include exposure to industrial pollutants, fumes, or hazardous materials.">Note: Chemical environments include exposure to industrial pollutants, fumes, or hazardous materials.</span>
      </div>

      {/* Question 2 */}
      <div className="question">
        <label>On a scale from relaxed to high-pressure, where would you place your job stress level?</label>
        <select onChange={(e) => handleAnswerChange('stressLevel', e.target.value)}>
          <option value="">Select stress level</option>
          <option value="Minimal">Minimal</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
          <option value="Very High">Very High</option>
        </select>
      </div>

      {/* Question 3 */}
      <div className="question">
        <label>Who do you share your home with? This helps us understand your support system.</label>
        <select onChange={(e) => handleAnswerChange('household', e.target.value)}>
          <option value="">Select household members</option>
          <option value="Live Alone">Live Alone</option>
          <option value="With Family">With Family (Parents/Siblings)</option>
          <option value="With Partner">With Partner/Children</option>
          <option value="With Roommates">With Roommates</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Question 4 */}
      <div className="question">
        <label>Let’s talk lifestyle—do you smoke or drink?</label>
        <select onChange={(e) => handleAnswerChange('smokingAlcohol', e.target.value)}>
          <option value="">Select smoking/alcohol habits</option>
          <option value="Regular">I smoke/drink regularly</option>
          <option value="Occasionally">Occasionally</option>
          <option value="Not at all">Not at all</option>
        </select>
      </div>

      {/* Question 5 */}
      <div className="question">
        <label>What’s your exercise routine like? This helps us set personalized fitness goals!</label>
        <select onChange={(e) => handleAnswerChange('exerciseRoutine', e.target.value)}>
          <option value="">Select exercise frequency</option>
          <option value="Daily">Daily</option>
          <option value="3-4 times a week">3-4 times a week</option>
          <option value="Occasionally">Occasionally</option>
          <option value="Rarely">Rarely/Never</option>
        </select>
      </div>

      {/* Question 6 */}
      <div className="question">
        <label>And finally, let’s talk about food! How would you describe your dietary habits?</label>
        <select onChange={(e) => handleAnswerChange('diet', e.target.value)}>
          <option value="">Select dietary preference</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Non-vegetarian">Non-vegetarian</option>
          <option value="Gluten-Free">Gluten-Free</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {progress === 100 && (
        <div className="summary">
          <h2>Thank you for completing the questionnaire!</h2>
          <p>Your responses will help us provide personalized health recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
