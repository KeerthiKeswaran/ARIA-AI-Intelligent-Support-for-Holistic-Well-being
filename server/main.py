from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from initializePipeline import init_pipeline
from fastapi import FastAPI, HTTPException
import logging
from typing import List
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


responseModel = init_pipeline()
print("Initialized LLM !!")

class Suggest(BaseModel):
    nearbyPlacesData : str
    airQualityData : str
    weatherData : str
    
@app.post("/suggestion")
async def semantic_search(req : Suggest):
    try:
        nearbyPlace = req.nearbyPlacesData
        airQuality = req.airQualityData
        weather = req.weatherData
        
        response = response = responseModel.invoke({
                    "nearbyPlaces": str(nearbyPlace),
                    "airQuality": str(airQuality),
                    "weather" : str(weather)
                    })

        if not response or not response.content:
            raise ValueError("Invalid response from the model.")
        
        return {"results": str(response.content)}
    
    except AttributeError as e:
        logging.error(f"AttributeError: {e}")
        raise HTTPException(status_code=422, detail="Invalid request body")
    except ValueError as ve:
        logging.error(f"ValueError: {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logging.error(f"Error during model invocation: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")


