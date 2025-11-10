from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Smart Recommender API")

# ✅ Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy users
USERS = {"admin": "admin", "test": "1234"}

# Dummy movie dataset
MOVIES = [
    {"movie_id": "m1", "title": "Inception", "poster": "https://m.media-amazon.com/images/I/51nbVEuw1HL._AC_.jpg", "overview": "Dreams within dreams and a daring mission.", "genre": "Sci-Fi"},
    {"movie_id": "m2", "title": "Interstellar", "poster": "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SL1178_.jpg", "overview": "A journey beyond galaxies to save mankind.", "genre": "Sci-Fi"},
    {"movie_id": "m3", "title": "The Dark Knight", "poster": "https://m.media-amazon.com/images/I/51k0qa6qURL._AC_.jpg", "overview": "Batman faces his greatest nemesis, the Joker.", "genre": "Action"},
    {"movie_id": "m4", "title": "Avatar", "poster": "https://m.media-amazon.com/images/I/61OUGpUfAyL._AC_SL1024_.jpg", "overview": "A marine torn between two worlds on Pandora.", "genre": "Adventure"},
    {"movie_id": "m5", "title": "The Matrix", "poster": "https://m.media-amazon.com/images/I/51vpnbwFHrL._AC_.jpg", "overview": "Reality or illusion? A hacker finds out.", "genre": "Sci-Fi"},
    {"movie_id": "m6", "title": "Titanic", "poster": "https://m.media-amazon.com/images/I/71yAzN+YfDL._AC_SL1000_.jpg", "overview": "A love story aboard the doomed ship Titanic.", "genre": "Romance"},
    {"movie_id": "m7", "title": "Avengers: Endgame", "poster": "https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SL1500_.jpg", "overview": "Heroes unite to reverse Thanos' snap.", "genre": "Action"},
    {"movie_id": "m8", "title": "Joker", "poster": "https://m.media-amazon.com/images/I/71pVfYl0qgL._AC_SL1024_.jpg", "overview": "A failed comedian descends into madness.", "genre": "Drama"},
    {"movie_id": "m9", "title": "Forrest Gump", "poster": "https://m.media-amazon.com/images/I/61+zNf-GZxL._AC_SL1200_.jpg", "overview": "Life is like a box of chocolates.", "genre": "Drama"},
    {"movie_id": "m10", "title": "Black Panther", "poster": "https://m.media-amazon.com/images/I/81jktm9e5pL._AC_SL1500_.jpg", "overview": "The king of Wakanda rises to defend his people.", "genre": "Action"},
]

# Login/Register models
class LoginRequest(BaseModel):
    username: str
    password: str


@app.get("/")
def root():
    return {"message": "🎬 Smart Recommender API running successfully!"}


@app.post("/api/auth/login")
def login_user(data: LoginRequest):
    if data.username in USERS and USERS[data.username] == data.password:
        return {"token": "fake-jwt-token", "username": data.username}
    raise HTTPException(status_code=401, detail="Invalid username or password")


@app.post("/api/register")
def register_user(data: LoginRequest):
    if data.username in USERS:
        raise HTTPException(status_code=400, detail="User already exists")
    USERS[data.username] = data.password
    print(f"🆕 Registered user: {data.username}")
    return {"message": "🎉 User registered successfully!"}


@app.get("/api/recommend/cf/{user_id}")
def recommend_cf(user_id: str):
    """Collaborative Filtering — random mix"""
    recommendations = random.sample(MOVIES, 5)
    return {"recommendations": recommendations}


@app.get("/api/recommend/cbf/{item_id}")
def recommend_cbf(item_id: str):
    """Content-Based Filtering — same genre as selected"""
    movie = next((m for m in MOVIES if m["movie_id"] == item_id), None)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    same_genre = [m for m in MOVIES if m["genre"] == movie["genre"] and m["movie_id"] != item_id]
    if len(same_genre) < 5:
        same_genre += random.sample(MOVIES, 5 - len(same_genre))
    return {"recommendations": random.sample(same_genre, 5)}


if __name__ == "__main__":
    import uvicorn
    print("\n🧠 Loading Models...\n✅ Ready to serve requests!\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
