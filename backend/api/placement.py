from fastapi import APIRouter, HTTPException
from backend.schemas.ai_schemas import PlacementInput, PlacementOutput
from backend.services.placement_service import evaluate_placement_readiness
from backend.services.model_loader import get_placement_metrics

router = APIRouter(prefix="/ai", tags=["Placement Readiness"])

@router.post("/placement-readiness", response_model=PlacementOutput)
async def get_placement_readiness(data: PlacementInput):
    try:
        return evaluate_placement_readiness(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feature-importance")
async def get_feature_importance():
    metrics = get_placement_metrics()
    if not metrics or "Feature_Importance" not in metrics:
        raise HTTPException(status_code=404, detail="Feature importance data not found.")
    
    # Sort and return top features
    importance = metrics["Feature_Importance"]
    sorted_importance = {k: v * 100 for k, v in sorted(importance.items(), key=lambda item: item[1], reverse=True)[:5]}
    return sorted_importance
