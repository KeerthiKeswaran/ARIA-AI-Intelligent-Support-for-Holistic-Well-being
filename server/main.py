from pydantic import BaseModel, EmailStr, Field
from fastapi.middleware.cors import CORSMiddleware
from initializePipeline import init_pipeline
from fastapi import FastAPI, HTTPException, Depends
from pymongo import MongoClient
from modelSchema import loginIn, SignIn, Suggest, FormData, Location, Dashboard
from bson import ObjectId
from typing import Any, Dict
from fastapi.responses import JSONResponse
import logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
client = MongoClient("mongodb+srv://Keerthi29:KeerthiMongo22@cluster0.vbcz9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
#client = MongoClient("mongodb+srv://Keerthi29:KeerthiMongo22@ariacluster.vbcz9.mongodb.net/?retryWrites=true&w=majority")
db = client['ariaDatabase']  
users_collection = db['ariaUser']
print("Initialized MongoDB!")

responseModel, questModel= init_pipeline()
print("Initialized LLMs!")


@app.post("/signup")
async def signup(user: SignIn):
    existing_user = users_collection.find_one({"userMailID": user.userMailId})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_data = user.dict()
    users_collection.insert_one(user_data)
    print("Completed Creation")
    return {"message": "User created successfully"}

@app.post("/login")
async def login(user: loginIn):
    print(user.userMailId)
    db_user = users_collection.find_one({"userMailId": user.userMailId})
    if not db_user: 
        raise HTTPException(status_code=400, detail="User not exist please Sign Up")
    if db_user['password'] != user.password: 
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"message": "Login successful"}

@app.post("/storeLocation")
async def signup(loc: Location):
    try:
        
        userMailId = loc.userMailId
        user_locData = loc.dict()
        del user_locData['userMailId']
        filter = {"userMailId": userMailId}
        update = {
            "$set": user_locData
        }

        #result = collection.update_one(filter, update)
        #users_collection.update_one(
         #   {"username": userMailId},  
         #   {"$set": user_locData},  
         #   upsert=True 
          #  )
        #users_collection.insert_one(user_locData)
        users_collection.update_one(filter, update)
        return {"message", "Stored Location"}
    except AttributeError as e:
        logging.error(f"AttributeError: {e}")
        raise HTTPException(status_code=422, detail="Invalid request body")
    
@app.post("/getFormAnalysis")
async def semantic_search(req : FormData):
    userExercise = req.userExercise
    userWorkEnv = req.userWork
    userStressLvl = req.userStress
    userFamily = req.userFamily
    userHabit = req.userHabit
    userDiet = req.userDiet
    infants = req.infants
    PregnantWomen = req.PregnantWomen
    
    userMailId = req.userMailId
    user_qnData = req.dict()
    del user_qnData['userMailId']
    filter = {"userMailId": userMailId}
    update = {
            "$set": user_qnData
        }
    users_collection.update_one(filter, update)
    
    response = questModel.invoke({
                    "userExercise": str(userExercise),
                    "userWorkEnv": str(userWorkEnv),
                    "userStressLvl" : str(userStressLvl),
                    "userFamily" : str(userFamily),
                    "userHabit" : str(userHabit),
                    "userDiet" : str(userDiet),
                    "Infants" : str(infants),
                    "PregnantWomen" : str(PregnantWomen)
                    })

    if not response or not response.content:
         raise ValueError("Invalid response from the model.")
        
    return {"results": str(response.content)}

@app.post("/suggestion")
async def semantic_search(req : Suggest):
    try:
        nearbyPlace = req.nearbyPlacesData
        airQuality = req.airQualityData
        weather = req.weatherData
        
        
        userMailId = req.userMailId
        user_envData = req.dict()
        del user_envData['userMailId']
        filter = {"userMailId": userMailId}
        update = {
            "$set": user_envData
        }
        users_collection.update_one(filter, update)
        
        response = responseModel.invoke({
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
    
def convert_objectid(data: Dict[str, Any]) -> Dict[str, Any]:
    """Convert ObjectId in MongoDB data to string format."""
    data['_id'] = str(data['_id'])
    return data

@app.post("/getDashboard")
async def semantic_search(userData: Dashboard):
    userMailId = userData.userMailId
    if not userMailId:
        raise HTTPException(status_code=400, detail="User Mail ID not provided.")

    user_data = users_collection.find_one({"userMailId": userMailId})
    if user_data:
        user_data = convert_objectid(user_data)
        return JSONResponse(content={"result": user_data})
    return JSONResponse(content={"result": "No user data found!"})