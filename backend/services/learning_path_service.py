from backend.schemas.ai_schemas import LearningPathInput, LearningPathOutput, WeekRoadmap

def generate_learning_path(data: LearningPathInput) -> LearningPathOutput:
    roadmap = []
    current_week = 1
    
    # Rule engine based on scores
    if data.arrays_score < 50 or data.strings_score < 50:
        roadmap.append(WeekRoadmap(
            week=current_week,
            topics=["Arrays", "Strings"],
            problems=["Two Sum", "Valid Palindrome", "Longest Substring Without Repeating Characters"]
        ))
        current_week += 1
        
    if data.arrays_score >= 50 and data.strings_score >= 50:
        roadmap.append(WeekRoadmap(
            week=current_week,
            topics=["Sliding Window", "Two Pointers"],
            problems=["Container With Most Water", "3Sum", "Minimum Window Substring"]
        ))
        current_week += 1
        
    if data.trees_score < 40:
        roadmap.append(WeekRoadmap(
            week=current_week,
            topics=["Trees", "Binary Search Trees"],
            problems=["Maximum Depth of Binary Tree", "Invert Binary Tree", "Lowest Common Ancestor"]
        ))
        current_week += 1
        
    if data.graphs_score < 40:
        roadmap.append(WeekRoadmap(
            week=current_week,
            topics=["Graphs Basics", "BFS/DFS"],
            problems=["Number of Islands", "Clone Graph", "Course Schedule"]
        ))
        current_week += 1
    elif data.graphs_score < 70:
        roadmap.append(WeekRoadmap(
            week=current_week,
            topics=["Advanced Graphs"],
            problems=["Network Delay Time", "Alien Dictionary", "Word Ladder"]
        ))
        current_week += 1
        
    if data.dp_score < 35:
        roadmap.append(WeekRoadmap(
            week=current_week,
            topics=["Dynamic Programming 1D"],
            problems=["Climbing Stairs", "House Robber", "Coin Change"]
        ))
        current_week += 1
        
    if data.dp_score >= 35 and data.dp_score < 70:
        roadmap.append(WeekRoadmap(
            week=current_week,
            topics=["Dynamic Programming 2D"],
            problems=["Unique Paths", "Longest Common Subsequence", "Edit Distance"]
        ))
        current_week += 1

    # Adjust for goals
    if data.goal in ["Amazon SDE", "Google SDE", "Microsoft"]:
        roadmap.append(WeekRoadmap(
            week=current_week,
            topics=["System Design Basics", "Hard Problem Solving"],
            problems=["Merge k Sorted Lists", "Trapping Rain Water", "Median of Two Sorted Arrays"]
        ))
        current_week += 1

    # If the user is really good, give them advanced stuff
    if len(roadmap) < 4:
        roadmap.append(WeekRoadmap(
            week=current_week,
            topics=["Backtracking", "Tries"],
            problems=["N-Queens", "Word Search II", "Implement Trie"]
        ))
        current_week += 1

    return LearningPathOutput(roadmap=roadmap)
