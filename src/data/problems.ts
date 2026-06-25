import { Problem } from '../types';

export const problems: Problem[] = [
  {
    id: "1",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    examples: [
      {
        id: "ex1",
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        id: "ex2",
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};",
      "Python": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ",
      "Java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};"
    },
    testCases: [
      { input: "nums = [2,7,11,15]\ntarget = 9", expectedOutput: "[0,1]", isHidden: false },
      { input: "nums = [3,2,4]\ntarget = 6", expectedOutput: "[1,2]", isHidden: false },
      { input: "nums = [3,3]\ntarget = 6", expectedOutput: "[0,1]", isHidden: true }
    ],
    tags: ["Array", "Hash Table"],
    acceptanceRate: 51.2
  },
  {
    id: "2",
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    examples: [
      { id: "ex1", input: "s = \"()\"", output: "true" },
      { id: "ex2", input: "s = \"()[]{}\"", output: "true" },
      { id: "ex3", input: "s = \"(]\"", output: "false" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};",
      "Python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        ",
      "Java": "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};"
    },
    testCases: [
      { input: "s = \"()\"", expectedOutput: "true", isHidden: false },
      { input: "s = \"()[]{}\"", expectedOutput: "true", isHidden: false },
      { input: "s = \"(]\"", expectedOutput: "false", isHidden: true }
    ],
    tags: ["String", "Stack"],
    acceptanceRate: 40.4
  },
  {
    id: "3",
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    examples: [
      { id: "ex1", input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4" },
      { id: "ex2", input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    \n};",
      "Python": "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        ",
      "Java": "class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};"
    },
    testCases: [
      { input: "nums = [-1,0,3,5,9,12]\ntarget = 9", expectedOutput: "4", isHidden: false },
      { input: "nums = [-1,0,3,5,9,12]\ntarget = 2", expectedOutput: "-1", isHidden: false }
    ],
    tags: ["Array", "Binary Search"],
    acceptanceRate: 55.6
  },
  {
    id: "4",
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    description: "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4"
    ],
    examples: [
      { id: "ex1", input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]." },
      { id: "ex2", input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Intervals [1,4] and [4,5] are considered overlapping." }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nvar merge = function(intervals) {\n    \n};",
      "Python": "class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        ",
      "Java": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};"
    },
    testCases: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]", isHidden: false },
      { input: "intervals = [[1,4],[4,5]]", expectedOutput: "[[1,5]]", isHidden: false }
    ],
    tags: ["Array", "Sorting"],
    acceptanceRate: 46.8
  },
  {
    id: "5",
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    examples: [
      { id: "ex1", input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { id: "ex2", input: "head = [1,2]", output: "[2,1]" }
    ],
    starterCode: {
      "JavaScript": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nvar reverseList = function(head) {\n    \n};",
      "Python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        ",
      "Java": "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}"
    },
    testCases: [
      { input: "head = [1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]", isHidden: false }
    ],
    tags: ["Linked List", "Recursion"],
    acceptanceRate: 74.3
  },
  {
    id: "6",
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    examples: [
      { id: "ex1", input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { id: "ex2", input: "nums = [1]", output: "1", explanation: "The subarray [1] has the largest sum 1." }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar maxSubArray = function(nums) {\n    \n};"
    },
    testCases: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", isHidden: false }
    ],
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
    acceptanceRate: 50.4
  },
  {
    id: "7",
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.",
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer."
    ],
    examples: [
      { id: "ex1", input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { id: "ex2", input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nvar productExceptSelf = function(nums) {\n    \n};"
    },
    testCases: [
      { input: "nums = [1,2,3,4]", expectedOutput: "[24,12,8,6]", isHidden: false }
    ],
    tags: ["Array", "Prefix Sum"],
    acceptanceRate: 64.9
  },
  {
    id: "8",
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    examples: [
      { id: "ex1", input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
      { id: "ex2", input: "coins = [2], amount = 3", output: "-1" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nvar coinChange = function(coins, amount) {\n    \n};"
    },
    testCases: [
      { input: "coins = [1,2,5]\namount = 11", expectedOutput: "3", isHidden: false }
    ],
    tags: ["Array", "Dynamic Programming", "Breadth-First Search"],
    acceptanceRate: 43.1
  },
  {
    id: "9",
    slug: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    examples: [
      { id: "ex1", input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3).\nTotal amount you can rob = 1 + 3 = 4." }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar rob = function(nums) {\n    \n};"
    },
    testCases: [
      { input: "nums = [1,2,3,1]", expectedOutput: "4", isHidden: false }
    ],
    tags: ["Array", "Dynamic Programming"],
    acceptanceRate: 49.8
  },
  {
    id: "10",
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    examples: [
      { id: "ex1", input: "grid = [\n  [\"1\",\"1\",\"1\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"0\",\"0\"]\n]", output: "1" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    \n};"
    },
    testCases: [
      { input: "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", expectedOutput: "3", isHidden: false }
    ],
    tags: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
    acceptanceRate: 58.0
  },
  {
    id: "11",
    slug: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    description: "Given an array of strings `strs`, group **the anagrams** together. You can return the answer in **any order**.",
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ],
    examples: [
      { id: "ex1", input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nvar groupAnagrams = function(strs) {\n    \n};"
    },
    testCases: [
      { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", expectedOutput: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", isHidden: false }
    ],
    tags: ["Array", "Hash Table", "String", "Sorting"],
    acceptanceRate: 66.8
  },
  {
    id: "12",
    slug: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    description: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you **must** take course `bi` first if you want to take course `ai`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.",
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "0 <= ai, bi < numCourses",
      "All the pairs prerequisites[i] are unique."
    ],
    examples: [
      { id: "ex1", input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number} numCourses\n * @param {number[][]} prerequisites\n * @return {boolean}\n */\nvar canFinish = function(numCourses, prerequisites) {\n    \n};"
    },
    testCases: [
      { input: "numCourses = 2\nprerequisites = [[1,0]]", expectedOutput: "true", isHidden: false }
    ],
    tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    acceptanceRate: 46.2
  },
  {
    id: "13",
    slug: "word-search",
    title: "Word Search",
    difficulty: "Medium",
    description: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    constraints: [
      "m == board.length",
      "n = board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15"
    ],
    examples: [
      { id: "ex1", input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", output: "true" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {character[][]} board\n * @param {string} word\n * @return {boolean}\n */\nvar exist = function(board, word) {\n    \n};"
    },
    testCases: [
      { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nword = \"ABCCED\"", expectedOutput: "true", isHidden: false }
    ],
    tags: ["Array", "Backtracking", "Matrix"],
    acceptanceRate: 40.8
  },
  {
    id: "14",
    slug: "rotate-image",
    title: "Rotate Image",
    difficulty: "Medium",
    description: "You are given an `n x n` 2D `matrix` representing an image, rotate the image by **90** degrees (clockwise).\n\nYou have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.",
    constraints: [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 20"
    ],
    examples: [
      { id: "ex1", input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[][]} matrix\n * @return {void} Do not return anything, modify matrix in-place instead.\n */\nvar rotate = function(matrix) {\n    \n};"
    },
    testCases: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "[[7,4,1],[8,5,2],[9,6,3]]", isHidden: false }
    ],
    tags: ["Array", "Math", "Matrix"],
    acceptanceRate: 72.8
  },
  {
    id: "15",
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    constraints: [
      "1 <= n <= 45"
    ],
    examples: [
      { id: "ex1", input: "n = 2", output: "2", explanation: "1. 1 step + 1 step\n2. 2 steps" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    \n};"
    },
    testCases: [
      { input: "n = 2", expectedOutput: "2", isHidden: false },
      { input: "n = 3", expectedOutput: "3", isHidden: false }
    ],
    tags: ["Math", "Dynamic Programming", "Memoization"],
    acceptanceRate: 52.4
  },
  {
    id: "16",
    slug: "kth-largest-element",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    description: "Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array.\n\nNote that it is the `kth` largest element in the sorted order, not the `kth` distinct element.\n\nCan you solve it without sorting?",
    constraints: [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    examples: [
      { id: "ex1", input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nvar findKthLargest = function(nums, k) {\n    \n};"
    },
    testCases: [
      { input: "nums = [3,2,1,5,6,4]\nk = 2", expectedOutput: "5", isHidden: false }
    ],
    tags: ["Array", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Quickselect"],
    acceptanceRate: 66.5
  },
  {
    id: "17",
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in **any order**.",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "k is in the range [1, the number of unique elements in the array].",
      "It is guaranteed that the answer is unique."
    ],
    examples: [
      { id: "ex1", input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nvar topKFrequent = function(nums, k) {\n    \n};"
    },
    testCases: [
      { input: "nums = [1,1,1,2,2,3]\nk = 2", expectedOutput: "[1,2]", isHidden: false }
    ],
    tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Bucket Sort", "Counting", "Quickselect"],
    acceptanceRate: 62.7
  },
  {
    id: "18",
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    examples: [
      { id: "ex1", input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[]} prices\n * @return {number}\n */\nvar maxProfit = function(prices) {\n    \n};"
    },
    testCases: [
      { input: "prices = [7,1,5,3,6,4]", expectedOutput: "5", isHidden: false }
    ],
    tags: ["Array", "Dynamic Programming"],
    acceptanceRate: 53.6
  },
  {
    id: "19",
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    description: "There is an integer array `nums` sorted in ascending order (with **distinct** values).\n\nPrior to being passed to your function, `nums` is **possibly rotated** at an unknown pivot index `k` (`1 <= k < nums.length`) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (**0-indexed**).\n\nGiven the array `nums` **after** the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.",
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "-10^4 <= target <= 10^4"
    ],
    examples: [
      { id: "ex1", input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    \n};"
    },
    testCases: [
      { input: "nums = [4,5,6,7,0,1,2]\ntarget = 0", expectedOutput: "4", isHidden: false }
    ],
    tags: ["Array", "Binary Search"],
    acceptanceRate: 39.5
  },
  {
    id: "20",
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Given a string `s`, find the length of the **longest substring** without repeating characters.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    examples: [
      { id: "ex1", input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." }
    ],
    starterCode: {
      "JavaScript": "/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};"
    },
    testCases: [
      { input: "s = \"abcabcbb\"", expectedOutput: "3", isHidden: false },
      { input: "s = \"bbbbb\"", expectedOutput: "1", isHidden: false }
    ],
    tags: ["Hash Table", "String", "Sliding Window"],
    acceptanceRate: 34.0
  }
];
