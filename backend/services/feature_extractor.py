import pandas as pd
from backend.schemas.ai_schemas import PlacementInput

def extract_placement_features(data: PlacementInput) -> pd.DataFrame:
    """
    Converts user statistics from PlacementInput into a Pandas DataFrame
    with the exact columns expected by the ML model.
    """
    features = {
        'problems_solved': [data.problems_solved],
        'easy_solved': [data.easy_solved],
        'medium_solved': [data.medium_solved],
        'hard_solved': [data.hard_solved],
        'arrays_count': [data.arrays_count],
        'strings_count': [data.strings_count],
        'graphs_count': [data.graphs_count],
        'dp_count': [data.dp_count],
        'trees_count': [data.trees_count],
        'contest_rating': [data.contest_rating],
        'contest_count': [data.contest_count],
        'acceptance_rate': [data.acceptance_rate],
        'current_streak': [data.current_streak],
        'room_participations': [data.room_participations],
        'room_wins': [data.room_wins]
    }
    return pd.DataFrame(features)
