-- AUTO GENERATED SEED SCRIPT

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000001', 'Two Sum', 'two-sum', 'Easy', 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.', ARRAY['Array','Hash Table'], '{"JavaScript":"/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};","Python":"class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ","Java":"class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}","C++":"class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};"}'::jsonb, 51.2);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000001', 'nums = [2,7,11,15], target = 9', '[0,1]', 'Because nums[0] + nums[1] == 9, we return [0, 1].');
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000001', 'nums = [3,2,4], target = 6', '[1,2]', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000001', '2 <= nums.length <= 10^4');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000001', '-10^9 <= nums[i] <= 10^9');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000001', '-10^9 <= target <= 10^9');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000001', 'Only one valid answer exists.');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000001', 'nums = [2,7,11,15]
target = 9', '[0,1]', FALSE);
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000001', 'nums = [3,2,4]
target = 6', '[1,2]', FALSE);
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000001', 'nums = [3,3]
target = 6', '[0,1]', TRUE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000002', 'Valid Parentheses', 'valid-parentheses', 'Easy', 'Given a string `s` containing just the characters `''(''`, `'')''`, `''{''`, `''}''`, `''[''` and `'']''`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.', ARRAY['String','Stack'], '{"JavaScript":"/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};","Python":"class Solution:\n    def isValid(self, s: str) -> bool:\n        ","Java":"class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}","C++":"class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};"}'::jsonb, 40.4);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000002', 's = "()"', 'true', NULL);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000002', 's = "()[]{}"', 'true', NULL);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000002', 's = "(]"', 'false', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000002', '1 <= s.length <= 10^4');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000002', 's consists of parentheses only ''()[]{}''.');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000002', 's = "()"', 'true', FALSE);
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000002', 's = "()[]{}"', 'true', FALSE);
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000002', 's = "(]"', 'false', TRUE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000003', 'Binary Search', 'binary-search', 'Easy', 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.

You must write an algorithm with `O(log n)` runtime complexity.', ARRAY['Array','Binary Search'], '{"JavaScript":"/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    \n};","Python":"class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        ","Java":"class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}","C++":"class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};"}'::jsonb, 55.6);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000003', 'nums = [-1,0,3,5,9,12], target = 9', '4', '9 exists in nums and its index is 4');
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000003', 'nums = [-1,0,3,5,9,12], target = 2', '-1', '2 does not exist in nums so return -1');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000003', '1 <= nums.length <= 10^4');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000003', '-10^4 < nums[i], target < 10^4');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000003', 'All the integers in nums are unique.');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000003', 'nums is sorted in ascending order.');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000003', 'nums = [-1,0,3,5,9,12]
target = 9', '4', FALSE);
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000003', 'nums = [-1,0,3,5,9,12]
target = 2', '-1', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000004', 'Merge Intervals', 'merge-intervals', 'Medium', 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.', ARRAY['Array','Sorting'], '{"JavaScript":"/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nvar merge = function(intervals) {\n    \n};","Python":"class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        ","Java":"class Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}","C++":"class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};"}'::jsonb, 46.8);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000004', 'intervals = [[1,3],[2,6],[8,10],[15,18]]', '[[1,6],[8,10],[15,18]]', 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].');
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000004', 'intervals = [[1,4],[4,5]]', '[[1,5]]', 'Intervals [1,4] and [4,5] are considered overlapping.');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000004', '1 <= intervals.length <= 10^4');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000004', 'intervals[i].length == 2');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000004', '0 <= starti <= endi <= 10^4');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000004', 'intervals = [[1,3],[2,6],[8,10],[15,18]]', '[[1,6],[8,10],[15,18]]', FALSE);
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000004', 'intervals = [[1,4],[4,5]]', '[[1,5]]', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000005', 'Reverse Linked List', 'reverse-linked-list', 'Easy', 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.', ARRAY['Linked List','Recursion'], '{"JavaScript":"/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nvar reverseList = function(head) {\n    \n};","Python":"# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        ","Java":"/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}"}'::jsonb, 74.3);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000005', 'head = [1,2,3,4,5]', '[5,4,3,2,1]', NULL);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000005', 'head = [1,2]', '[2,1]', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000005', 'The number of nodes in the list is the range [0, 5000].');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000005', '-5000 <= Node.val <= 5000');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000005', 'head = [1,2,3,4,5]', '[5,4,3,2,1]', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000006', 'Maximum Subarray', 'maximum-subarray', 'Medium', 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.', ARRAY['Array','Divide and Conquer','Dynamic Programming'], '{"JavaScript":"/**\n * @param {number[]} nums\n * @return {number}\n */\nvar maxSubArray = function(nums) {\n    \n};"}'::jsonb, 50.4);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000006', 'nums = [-2,1,-3,4,-1,2,1,-5,4]', '6', 'The subarray [4,-1,2,1] has the largest sum 6.');
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000006', 'nums = [1]', '1', 'The subarray [1] has the largest sum 1.');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000006', '1 <= nums.length <= 10^5');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000006', '-10^4 <= nums[i] <= 10^4');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000006', 'nums = [-2,1,-3,4,-1,2,1,-5,4]', '6', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000007', 'Product of Array Except Self', 'product-of-array-except-self', 'Medium', 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.

The product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in `O(n)` time and without using the division operation.', ARRAY['Array','Prefix Sum'], '{"JavaScript":"/**\n * @param {number[]} nums\n * @return {number[]}\n */\nvar productExceptSelf = function(nums) {\n    \n};"}'::jsonb, 64.9);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000007', 'nums = [1,2,3,4]', '[24,12,8,6]', NULL);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000007', 'nums = [-1,1,0,-3,3]', '[0,0,9,0,0]', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000007', '2 <= nums.length <= 10^5');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000007', '-30 <= nums[i] <= 30');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000007', 'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000007', 'nums = [1,2,3,4]', '[24,12,8,6]', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000008', 'Coin Change', 'coin-change', 'Medium', 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.

You may assume that you have an infinite number of each kind of coin.', ARRAY['Array','Dynamic Programming','Breadth-First Search'], '{"JavaScript":"/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nvar coinChange = function(coins, amount) {\n    \n};"}'::jsonb, 43.1);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000008', 'coins = [1,2,5], amount = 11', '3', '11 = 5 + 5 + 1');
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000008', 'coins = [2], amount = 3', '-1', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000008', '1 <= coins.length <= 12');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000008', '1 <= coins[i] <= 2^31 - 1');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000008', '0 <= amount <= 10^4');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000008', 'coins = [1,2,5]
amount = 11', '3', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000009', 'House Robber', 'house-robber', 'Medium', 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.

Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.', ARRAY['Array','Dynamic Programming'], '{"JavaScript":"/**\n * @param {number[]} nums\n * @return {number}\n */\nvar rob = function(nums) {\n    \n};"}'::jsonb, 49.8);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000009', 'nums = [1,2,3,1]', '4', 'Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000009', '1 <= nums.length <= 100');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000009', '0 <= nums[i] <= 400');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000009', 'nums = [1,2,3,1]', '4', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-00000000000a', 'Number of Islands', 'number-of-islands', 'Medium', 'Given an `m x n` 2D binary grid `grid` which represents a map of `''1''`s (land) and `''0''`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.', ARRAY['Array','Depth-First Search','Breadth-First Search','Union Find','Matrix'], '{"JavaScript":"/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    \n};"}'::jsonb, 58);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-00000000000a', 'grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]', '1', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000a', 'm == grid.length');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000a', 'n == grid[i].length');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000a', '1 <= m, n <= 300');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000a', 'grid[i][j] is ''0'' or ''1''.');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-00000000000a', 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', '3', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-00000000000b', 'Group Anagrams', 'group-anagrams', 'Medium', 'Given an array of strings `strs`, group **the anagrams** together. You can return the answer in **any order**.', ARRAY['Array','Hash Table','String','Sorting'], '{"JavaScript":"/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nvar groupAnagrams = function(strs) {\n    \n};"}'::jsonb, 66.8);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-00000000000b', 'strs = ["eat","tea","tan","ate","nat","bat"]', '[["bat"],["nat","tan"],["ate","eat","tea"]]', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000b', '1 <= strs.length <= 10^4');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000b', '0 <= strs[i].length <= 100');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000b', 'strs[i] consists of lowercase English letters.');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-00000000000b', 'strs = ["eat","tea","tan","ate","nat","bat"]', '[["bat"],["nat","tan"],["ate","eat","tea"]]', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-00000000000c', 'Course Schedule', 'course-schedule', 'Medium', 'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you **must** take course `bi` first if you want to take course `ai`.

Return `true` if you can finish all courses. Otherwise, return `false`.', ARRAY['Depth-First Search','Breadth-First Search','Graph','Topological Sort'], '{"JavaScript":"/**\n * @param {number} numCourses\n * @param {number[][]} prerequisites\n * @return {boolean}\n */\nvar canFinish = function(numCourses, prerequisites) {\n    \n};"}'::jsonb, 46.2);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-00000000000c', 'numCourses = 2, prerequisites = [[1,0]]', 'true', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000c', '1 <= numCourses <= 2000');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000c', '0 <= prerequisites.length <= 5000');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000c', 'prerequisites[i].length == 2');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000c', '0 <= ai, bi < numCourses');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000c', 'All the pairs prerequisites[i] are unique.');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-00000000000c', 'numCourses = 2
prerequisites = [[1,0]]', 'true', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-00000000000d', 'Word Search', 'word-search', 'Medium', 'Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.', ARRAY['Array','Backtracking','Matrix'], '{"JavaScript":"/**\n * @param {character[][]} board\n * @param {string} word\n * @return {boolean}\n */\nvar exist = function(board, word) {\n    \n};"}'::jsonb, 40.8);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-00000000000d', 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', 'true', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000d', 'm == board.length');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000d', 'n = board[i].length');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000d', '1 <= m, n <= 6');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000d', '1 <= word.length <= 15');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-00000000000d', 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]
word = "ABCCED"', 'true', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-00000000000e', 'Rotate Image', 'rotate-image', 'Medium', 'You are given an `n x n` 2D `matrix` representing an image, rotate the image by **90** degrees (clockwise).

You have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.', ARRAY['Array','Math','Matrix'], '{"JavaScript":"/**\n * @param {number[][]} matrix\n * @return {void} Do not return anything, modify matrix in-place instead.\n */\nvar rotate = function(matrix) {\n    \n};"}'::jsonb, 72.8);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-00000000000e', 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', '[[7,4,1],[8,5,2],[9,6,3]]', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000e', 'n == matrix.length == matrix[i].length');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000e', '1 <= n <= 20');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-00000000000e', 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', '[[7,4,1],[8,5,2],[9,6,3]]', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-00000000000f', 'Climbing Stairs', 'climbing-stairs', 'Easy', 'You are climbing a staircase. It takes `n` steps to reach the top.

Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?', ARRAY['Math','Dynamic Programming','Memoization'], '{"JavaScript":"/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    \n};"}'::jsonb, 52.4);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-00000000000f', 'n = 2', '2', '1. 1 step + 1 step
2. 2 steps');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-00000000000f', '1 <= n <= 45');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-00000000000f', 'n = 2', '2', FALSE);
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-00000000000f', 'n = 3', '3', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000010', 'Kth Largest Element in an Array', 'kth-largest-element', 'Medium', 'Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array.

Note that it is the `kth` largest element in the sorted order, not the `kth` distinct element.

Can you solve it without sorting?', ARRAY['Array','Divide and Conquer','Sorting','Heap (Priority Queue)','Quickselect'], '{"JavaScript":"/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nvar findKthLargest = function(nums, k) {\n    \n};"}'::jsonb, 66.5);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000010', 'nums = [3,2,1,5,6,4], k = 2', '5', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000010', '1 <= k <= nums.length <= 10^5');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000010', '-10^4 <= nums[i] <= 10^4');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000010', 'nums = [3,2,1,5,6,4]
k = 2', '5', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000011', 'Top K Frequent Elements', 'top-k-frequent-elements', 'Medium', 'Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in **any order**.', ARRAY['Array','Hash Table','Divide and Conquer','Sorting','Heap (Priority Queue)','Bucket Sort','Counting','Quickselect'], '{"JavaScript":"/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nvar topKFrequent = function(nums, k) {\n    \n};"}'::jsonb, 62.7);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000011', 'nums = [1,1,1,2,2,3], k = 2', '[1,2]', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000011', '1 <= nums.length <= 10^5');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000011', '-10^4 <= nums[i] <= 10^4');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000011', 'k is in the range [1, the number of unique elements in the array].');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000011', 'It is guaranteed that the answer is unique.');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000011', 'nums = [1,1,1,2,2,3]
k = 2', '[1,2]', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000012', 'Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Easy', 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.', ARRAY['Array','Dynamic Programming'], '{"JavaScript":"/**\n * @param {number[]} prices\n * @return {number}\n */\nvar maxProfit = function(prices) {\n    \n};"}'::jsonb, 53.6);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000012', 'prices = [7,1,5,3,6,4]', '5', 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000012', '1 <= prices.length <= 10^5');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000012', '0 <= prices[i] <= 10^4');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000012', 'prices = [7,1,5,3,6,4]', '5', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000013', 'Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'Medium', 'There is an integer array `nums` sorted in ascending order (with **distinct** values).

Prior to being passed to your function, `nums` is **possibly rotated** at an unknown pivot index `k` (`1 <= k < nums.length`) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (**0-indexed**).

Given the array `nums` **after** the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.', ARRAY['Array','Binary Search'], '{"JavaScript":"/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    \n};"}'::jsonb, 39.5);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000013', 'nums = [4,5,6,7,0,1,2], target = 0', '4', NULL);
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000013', '1 <= nums.length <= 5000');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000013', '-10^4 <= nums[i] <= 10^4');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000013', 'All values of nums are unique.');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000013', '-10^4 <= target <= 10^4');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000013', 'nums = [4,5,6,7,0,1,2]
target = 0', '4', FALSE);

INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)
VALUES ('00000000-0000-0000-0000-000000000014', 'Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium', 'Given a string `s`, find the length of the **longest substring** without repeating characters.', ARRAY['Hash Table','String','Sliding Window'], '{"JavaScript":"/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};"}'::jsonb, 34);
INSERT INTO problem_examples (problem_id, input, output, explanation)
VALUES ('00000000-0000-0000-0000-000000000014', 's = "abcabcbb"', '3', 'The answer is "abc", with the length of 3.');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000014', '0 <= s.length <= 5 * 10^4');
INSERT INTO problem_constraints (problem_id, constraint_text)
VALUES ('00000000-0000-0000-0000-000000000014', 's consists of English letters, digits, symbols and spaces.');
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000014', 's = "abcabcbb"', '3', FALSE);
INSERT INTO test_cases (problem_id, input, expected_output, hidden)
VALUES ('00000000-0000-0000-0000-000000000014', 's = "bbbbb"', '1', FALSE);

-- Daily Challenges Mock
INSERT INTO daily_challenges (problem_id, date) VALUES ('00000000-0000-0000-0000-000000000001', CURRENT_DATE);
-- Contests Mock
INSERT INTO contests (id, title, start_time, end_time, status) VALUES ('11111111-1111-1111-1111-111111111111', 'Weekly Contest 400', NOW() + interval '2 days', NOW() + interval '2 days 2 hours', 'Upcoming');
-- Generic Achievements could be managed in app logic, but let's just make sure there are some standard records if needed later.