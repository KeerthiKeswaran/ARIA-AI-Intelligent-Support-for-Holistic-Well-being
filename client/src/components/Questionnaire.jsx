import React, { useState } from 'react';
import { Loader2, CheckCircle, Brain, ArrowRight } from 'lucide-react';
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';

function Questionnaire() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const loc = useLocation();
  const userMailId = loc.state.userMailId;

  const [environmentData, setEnvironmentData] = useState({ aiResponse: '' });
  const [formData, setFormData] = useState({
    workEnvironment: '',
    stressLevel: '',
    household: '',
    Infants: '',
    PregnantWomen: '',
    smokingAlcohol: '',
    exerciseRoutine: '',
    diet: ''
  });

  const questions = [
    {
      id: 'workEnvironment',
      question: "What's your daily work environment like?",
      options: [
        { value: 'Office/Sedentary', label: 'Office/Sedentary Job' },
        { value: 'Physical Labor', label: 'Physical Labor' },
        { value: 'Chemical/Industrial', label: 'Chemical/Industrial Environment' },
        { value: 'High-Stress', label: 'High-Stress Environment' },
        { value: 'Other', label: 'Other' }
      ]
    },
    {
      id: 'stressLevel',
      question: 'How would you rate your daily stress level?',
      options: [
        { value: 'Low', label: 'Low - Generally Relaxed' },
        { value: 'Moderate', label: 'Moderate - Some Stress' },
        { value: 'High', label: 'High - Frequently Stressed' },
        { value: 'Very High', label: 'Very High - Constantly Stressed' }
      ]
    },
    {
      id: 'household',
      question: 'Who do you share your living space with?',
      options: [
        { value: 'Alone', label: 'Living Alone' },
        { value: 'Family', label: 'With Family' },
        { value: 'Roommates', label: 'With Roommates' },
        { value: 'Partner', label: 'With Partner' }
      ]
    },
    {
      id: 'Pregnant Women',
      question: 'Are there any pregnant women in your household?',
      options: [
        { value: 'Yes', label: 'Yes, there is a pregnant woman' },
        { value: 'No', label: 'No, there are no pregnant women' }
      ]
    },
    {
      id: 'Infants',
      question: 'Do you have any infants on your home?',
      options: [
        { value: 'Yes', label: 'Having Infants' },
        { value: 'No', label: 'Not having any Infants' }
      ]
    },
    {
      id: 'smokingAlcohol',
      question: 'Do you smoke or consume alcohol?',
      options: [
        { value: 'Neither', label: 'Neither' },
        { value: 'Smoking Only', label: 'Smoking Only' },
        { value: 'Alcohol Only', label: 'Alcohol Only' },
        { value: 'Both', label: 'Both' }
      ]
    },
    {
      id: 'exerciseRoutine',
      question: 'How often do you exercise?',
      options: [
        { value: 'Daily', label: 'Daily' },
        { value: 'Few Times Week', label: '3-4 Times a Week' },
        { value: 'Occasionally', label: 'Occasionally' },
        { value: 'Rarely', label: 'Rarely or Never' }
      ]
    },
    {
      id: 'diet',
      question: 'What best describes your diet?',
      options: [
        { value: 'Balanced', label: 'Balanced Mixed Diet' },
        { value: 'Vegetarian', label: 'Vegetarian' },
        { value: 'Vegan', label: 'Vegan' },
        { value: 'Keto', label: 'Keto/Low-Carb' }
      ]
    }
  ];

  const preprocessText = (text) => {
    let formattedText = String(text)
    let responseArray = formattedText.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let pattern = /\*/g;
    let replacement = "</br><b>•</b> ";
    let newResponse2 = newResponse.replace(pattern, replacement);
    pattern = /(\r?\n\s*){2,}/g;
    replacement = "</br> ";
    newResponse2 = newResponse2.replace(pattern, replacement);
    pattern = /- <b>/g;
    replacement = "</br> - <b> ";
    newResponse2 = newResponse2.replace(pattern, replacement);
    newResponse2 = newResponse2.replace("</br>", " ");
    return newResponse2;
  };

  const fetchAIResponse = async (data) => {
    try {
      {/*const response = await new Promise(resolve =>
        setTimeout(() => resolve("Based on your responses, we recommend focusing on stress management techniques and maintaining a balanced diet."), 5000)
      );*/}
      const response = await axios.post("http://127.0.0.1:8000/getFormAnalysis", {
        userExercise: formData.exerciseRoutine,
        userWork: formData.workEnvironment,
        userStress: formData.stressLevel,
        userFamily: formData.household,
        userDiet: formData.diet,
        userHabit: formData.smokingAlcohol,
        infants : formData.Infants,
        PregnantWomen : formData.PregnantWomen,
        userMailId : userMailId
      }, {
        headers: { "Content-Type": "application/json" }
      });
      const modelSuggestion = response.data.results;
      const text = preprocessText(modelSuggestion)
      setEnvironmentData({ aiResponse: text });
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  const handleOptionSelect = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitForm();
    }
  };

  const submitForm = async () => {
    setIsLoading(true);
    try {
      await fetchAIResponse(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard' , {state : {userMailId}});
};

  if (analysisComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Questionnaire Complete!</h2>

            <div className="bg-amber-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-amber-800 mb-2">AI Analysis</h3>
              <div className="text-gray-700">{environmentData.aiResponse}</div>
            </div>

            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg 
                       font-semibold flex items-center justify-center gap-2 mx-auto hover:from-blue-600 
                       hover:to-indigo-700 transition-all duration-300"
              onClick={handleContinue}
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Analyzing Your Environment</h2>
          <Loader2 className="animate-spin mx-auto h-12 w-12 text-blue-500" />
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-black">User Questionnaire</h2>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">{currentQuestion.question}</h2>
        <div className="space-y-4">
          {currentQuestion.options.map(option => (
            <button
              key={option.value}
              className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition-all duration-300"
              onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;
