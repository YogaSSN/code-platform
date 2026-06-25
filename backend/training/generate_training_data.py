import pandas as pd
import numpy as np
import os

def generate_placement_data(num_samples=5000):
    np.random.seed(42)
    
    # Generate random features
    problems_solved = np.random.randint(10, 1500, num_samples)
    
    # Distribute problems into easy, medium, hard
    easy_ratio = np.random.uniform(0.4, 0.7, num_samples)
    medium_ratio = np.random.uniform(0.2, 0.5, num_samples)
    # normalize
    total = easy_ratio + medium_ratio
    easy_ratio = easy_ratio / total * np.random.uniform(0.7, 0.9, num_samples)
    medium_ratio = medium_ratio / total * np.random.uniform(0.7, 0.9, num_samples)
    
    easy_solved = (problems_solved * easy_ratio).astype(int)
    medium_solved = (problems_solved * medium_ratio).astype(int)
    hard_solved = problems_solved - easy_solved - medium_solved
    hard_solved = np.maximum(0, hard_solved) # ensure non-negative
    
    # Distribute into topics
    arrays_count = (problems_solved * np.random.uniform(0.1, 0.3, num_samples)).astype(int)
    strings_count = (problems_solved * np.random.uniform(0.1, 0.25, num_samples)).astype(int)
    graphs_count = (problems_solved * np.random.uniform(0.01, 0.15, num_samples)).astype(int)
    dp_count = (problems_solved * np.random.uniform(0.01, 0.15, num_samples)).astype(int)
    trees_count = (problems_solved * np.random.uniform(0.05, 0.2, num_samples)).astype(int)
    
    contest_count = np.random.randint(0, 100, num_samples)
    contest_rating = np.where(contest_count > 0, np.random.normal(1400, 300, num_samples), 0).astype(int)
    contest_rating = np.clip(contest_rating, 0, 3500)
    
    acceptance_rate = np.random.uniform(30, 85, num_samples)
    current_streak = np.random.randint(0, 365, num_samples)
    
    room_participations = np.random.randint(0, 50, num_samples)
    room_wins = (room_participations * np.random.uniform(0, 0.8, num_samples)).astype(int)
    
    # Calculate a realistic placement score based on weights
    # higher is better, max ~ 100
    
    score = (
        (problems_solved / 1500) * 20 +
        (hard_solved / 300) * 15 +
        (medium_solved / 600) * 10 +
        (contest_rating / 2500) * 25 +
        (acceptance_rate / 100) * 10 +
        (graphs_count / 150) * 5 +
        (dp_count / 150) * 5 +
        (room_wins / 50) * 10
    )
    
    # Add some noise
    score += np.random.normal(0, 5, num_samples)
    placement_score = np.clip(score, 0, 100).astype(int)
    
    df = pd.DataFrame({
        'problems_solved': problems_solved,
        'easy_solved': easy_solved,
        'medium_solved': medium_solved,
        'hard_solved': hard_solved,
        'arrays_count': arrays_count,
        'strings_count': strings_count,
        'graphs_count': graphs_count,
        'dp_count': dp_count,
        'trees_count': trees_count,
        'contest_rating': contest_rating,
        'contest_count': contest_count,
        'acceptance_rate': acceptance_rate,
        'current_streak': current_streak,
        'room_participations': room_participations,
        'room_wins': room_wins,
        'placement_score': placement_score
    })
    
    os.makedirs(os.path.join('backend', 'training'), exist_ok=True)
    df.to_csv(os.path.join('backend', 'training', 'placement_training_dataset.csv'), index=False)
    print("Generated placement_training_dataset.csv with 5000 records.")
    
    # Generate learning path dummy dataset
    goals = ['Amazon SDE', 'Google SDE', 'Microsoft', 'Zoho', 'TCS', 'Infosys', 'Campus Placement', 'Competitive Programming', 'Interview Preparation']
    lp_df = pd.DataFrame({
        'goal': np.random.choice(goals, num_samples),
        'arrays_score': np.random.randint(0, 100, num_samples),
        'strings_score': np.random.randint(0, 100, num_samples),
        'graphs_score': np.random.randint(0, 100, num_samples),
        'dp_score': np.random.randint(0, 100, num_samples),
        'trees_score': np.random.randint(0, 100, num_samples),
        'backtracking_score': np.random.randint(0, 100, num_samples),
        'contest_rating': contest_rating,
        'acceptance_rate': acceptance_rate,
        'problems_solved': problems_solved
    })
    lp_df.to_csv(os.path.join('backend', 'training', 'learning_path_dataset.csv'), index=False)
    print("Generated learning_path_dataset.csv with 5000 records.")

if __name__ == "__main__":
    generate_placement_data()
