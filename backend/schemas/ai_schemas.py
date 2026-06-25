from pydantic import BaseModel
from typing import List

class PlacementInput(BaseModel):
    problems_solved: int
    easy_solved: int
    medium_solved: int
    hard_solved: int
    arrays_count: int
    strings_count: int
    graphs_count: int
    dp_count: int
    trees_count: int
    contest_rating: int
    contest_count: int
    acceptance_rate: float
    current_streak: int
    room_wins: int
    room_participations: int

class PlacementOutput(BaseModel):
    overall_score: int
    amazon_score: int
    google_score: int
    microsoft_score: int
    zoho_score: int
    tcs_score: int
    infosys_score: int
    strong_topics: List[str]
    weak_topics: List[str]
    # Topic Scores
    arrays_score: int
    strings_score: int
    graphs_score: int
    dp_score: int
    trees_score: int

class LearningPathInput(BaseModel):
    goal: str
    arrays_score: int
    strings_score: int
    graphs_score: int
    dp_score: int
    trees_score: int
    backtracking_score: int
    contest_rating: int
    acceptance_rate: float
    problems_solved: int

class WeekRoadmap(BaseModel):
    week: int
    topics: List[str]
    problems: List[str]

class LearningPathOutput(BaseModel):
    roadmap: List[WeekRoadmap]
