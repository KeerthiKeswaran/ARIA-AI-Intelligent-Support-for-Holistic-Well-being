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
        model_name="llama-3.2-3b-preview"
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
                make health-conscious decisions based on their current environment.
                At last ask the user to continue to the next page to provide more details about their family and work culture.
                Don't ask whether they like to proceed.
                Mention the data values. Make it more professional, don't mention the latitude and longitude values. Make a short recommendation.
                """         
            )
    
    chain_advisor = prompt_advisor | llmAdvisor
    
    return chain_advisor
