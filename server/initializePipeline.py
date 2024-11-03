from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate

def init_pipeline():
    load_dotenv()
    groq_api_key = os.getenv('GROQ_API_KEY')
    
    llmAdvisor = ChatGroq(
        temperature=0.2,
        groq_api_key=groq_api_key,
        model_name="llama-3.1-70b-versatile"
    )
    
    llmQuest = ChatGroq(
        temperature=0.2,
        groq_api_key=groq_api_key,
        model_name="llama-3.1-8b-instant"
    )
    
    
    prompt_advisor = PromptTemplate.from_template(
            """
                ### INSTRUCTION:
                You are an environment-aware assistant for a mobile app. Based on the user's current location, 
                gather real-time data and provide a detailed response about the local environment.
                
                Welcome the user and Introduce yourself as 'ARIA' in a single sentence. Using the provided data on the user’s environment, generate a detailed response that 
                integrates information from {weather}, {airQuality}, and {nearbyPlaces}. Provide Tailor recommendations to the current conditions, offering advice like staying 
                hydrated in heat or wearing protective clothing in harsh weather. Combine all this 
                information into a coherent, concise message to help the user stay informed and 
                make health-conscious decisions based on their current environment. Explain it in a clear and easily 
                understandable way for a normal human. Avoid using bold font for suggestions.
                At last ask the user to continue to the next page to provide more details about their family and work culture.
                Don't ask whether they like to proceed.
                Mention the data values. Make it more professional, don't mention the latitude and longitude values. 
                Make a short recommendation. Provide the response as a paragraph.
                """         
            )
    
    prompt_quest = PromptTemplate.from_template(
            """
                ### INSTRUCTION:
                Given the user's profile details, including their exercise routine ({userExercise}), work environment ({userWorkEnv}), 
                stress level ({userStressLvl}), household composition ({userFamily}), whether the user have any infant baby in their home ({Infants}), whether 
                the user have any pregnant women in their home ({PregnantWomen}) habits such as smoking or alcohol 
                consumption ({userHabit}), and dietary preferences ({userDiet}), please provide a comprehensive and personalized health 
                suggestion. This suggestion should address areas such as stress management, physical activity, dietary improvements, family health
                and lifestyle modifications to support the user's overall well-being. Focus on providing specific, actionable advice that 
                aligns with the user's current habits and lifestyle, aiming to enhance their health and quality of life.
                Make it short and professional the token size must not exceed 150. Provide the response as a paragraph.
                """         
            )
    
    chain_advisor = prompt_advisor | llmAdvisor
    
    chain_quest = prompt_quest | llmQuest
    
    return chain_advisor,chain_quest
