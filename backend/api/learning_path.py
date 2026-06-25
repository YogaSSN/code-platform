from fastapi import APIRouter, HTTPException
from backend.schemas.ai_schemas import LearningPathInput, LearningPathOutput
from backend.services.learning_path_service import generate_learning_path

router = APIRouter(prefix="/ai", tags=["Learning Path"])

@router.post("/learning-path", response_model=LearningPathOutput)
async def get_learning_path(data: LearningPathInput):
    try:
        return generate_learning_path(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
