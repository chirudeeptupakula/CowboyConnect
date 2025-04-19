from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from app.routes import auth, student, faculty, admin, course_routes, event_routes


# ✅ Optional debug print to confirm DB setup runs
print("✅ Base metadata includes these tables:", models.Base.metadata.tables)

# ✅ Create tables at startup
models.Base.metadata.create_all(bind=engine)

# ✅ Initialize FastAPI app
app = FastAPI(
    title="Cowboy Connect",
    version="1.0.0",
    description="A volunteer tracking and feedback platform for students, faculty, and admins"
)

# ✅ CORS middleware (for Vite frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root route for testing
@app.get("/")
def read_root():
    return {"message": "Welcome to Cowboy Connect 👋"}

# ✅ Include all route files
app.include_router(auth.router)
app.include_router(student.router)
app.include_router(faculty.router)
app.include_router(admin.router)
app.include_router(course_routes.router)
app.include_router(event_routes.router)





