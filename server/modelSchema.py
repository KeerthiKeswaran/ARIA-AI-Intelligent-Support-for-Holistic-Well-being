from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserQuestionnaire(BaseModel):
    userExercise: Optional[str]
    userFamily: Optional[str]

class User(BaseModel):
    userId: Optional[str] = Field(None, alias="_id") 
    userMailId: EmailStr
    userName: str
    userLocationLat: Optional[float]
    userLocationLong: Optional[float]
    userLocationName: Optional[str]
    userLocationWeather: Optional[str]
    userLocationAirQuality: Optional[str]
    userQuestionnaire: Optional[UserQuestionnaire]
    userRecommendation: Optional[str]

class Suggest(BaseModel):
    nearbyPlacesData : str
    airQualityData : str
    weatherData : str
    userMailId : str

class FormData(BaseModel):
    userExercise : str
    userWork : str
    userStress : str
    userFamily : str
    userDiet : str
    userHabit : str
    infants : str
    PregnantWomen : str
    userMailId : str

class loginIn(BaseModel):
    userMailId: str
    password : str
    
class SignIn(BaseModel):
    userMailId: str
    userName: str
    password : str
    
class Location(BaseModel):
    latitute : int
    longitude: int
    locationName: str
    userMailId : str
    
class Dashboard(BaseModel):
    userMailId : str