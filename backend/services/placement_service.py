from backend.schemas.ai_schemas import PlacementInput, PlacementOutput
from backend.services.model_loader import get_placement_model
from backend.services.feature_extractor import extract_placement_features

def evaluate_placement_readiness(data: PlacementInput) -> PlacementOutput:
    model = get_placement_model()
    if not model:
        raise Exception("Placement model not loaded.")
        
    features_df = extract_placement_features(data)
    
    # Predict overall score
    predicted_score = model.predict(features_df)[0]
    overall_score = max(0, min(100, int(predicted_score)))
    
    # Heuristics for company scores based on overall score and specific traits
    # E.g. Google might care more about hard problems and DP/Graphs
    google_bonus = 0 if data.hard_solved < 50 else 5
    amazon_bonus = 0 if data.medium_solved < 100 else 5
    
    google_score = max(0, min(100, overall_score - 15 + google_bonus))
    microsoft_score = max(0, min(100, overall_score - 8))
    amazon_score = max(0, min(100, overall_score - 5 + amazon_bonus))
    zoho_score = max(0, min(100, overall_score + 8))
    tcs_score = max(0, min(100, overall_score + 15))
    infosys_score = max(0, min(100, overall_score + 12))
    
    # Topic scores calculation based on counts
    arrays_score = min(100, int(data.arrays_count / max(1, data.problems_solved) * 500))
    strings_score = min(100, int(data.strings_count / max(1, data.problems_solved) * 500))
    graphs_score = min(100, int(data.graphs_count / max(1, data.problems_solved) * 1000))
    dp_score = min(100, int(data.dp_count / max(1, data.problems_solved) * 1000))
    trees_score = min(100, int(data.trees_count / max(1, data.problems_solved) * 800))
    
    topic_scores = {
        "Arrays": arrays_score,
        "Strings": strings_score,
        "Graphs": graphs_score,
        "Dynamic Programming": dp_score,
        "Trees": trees_score
    }
    
    strong_topics = [topic for topic, score in topic_scores.items() if score >= 70]
    weak_topics = [topic for topic, score in topic_scores.items() if score < 40]
    
    return PlacementOutput(
        overall_score=overall_score,
        amazon_score=amazon_score,
        google_score=google_score,
        microsoft_score=microsoft_score,
        zoho_score=zoho_score,
        tcs_score=tcs_score,
        infosys_score=infosys_score,
        strong_topics=strong_topics,
        weak_topics=weak_topics,
        arrays_score=arrays_score,
        strings_score=strings_score,
        graphs_score=graphs_score,
        dp_score=dp_score,
        trees_score=trees_score
    )
