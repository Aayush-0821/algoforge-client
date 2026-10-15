import type { CodingQuestion, Company, McqQuestion, Question } from "./types";

export const companies: Company[] = [
  {
    slug: "amazon", name: "Amazon", role: "SDE Intern", durationMins: 100, difficulty: "Medium",
    gradient: "from-orange-500 to-amber-400",
    tagline: "Two DSA problems plus technical MCQs, modelled on recent campus OAs.",
    sections: [
      { name: "Technical MCQs", type: "mcq", count: 2, marks: 20 },
      { name: "Coding", type: "coding", count: 2, marks: 80 },
    ],
    topics: ["Arrays", "Strings", "HashMap", "Graphs", "Greedy", "Trees"],
  },
  {
    slug: "google", name: "Google", role: "SWE Intern", durationMins: 90, difficulty: "Hard",
    gradient: "from-blue-500 to-cyan-400",
    tagline: "Pure algorithmic round with tight constraints and edge-case heavy problems.",
    sections: [{ name: "Coding", type: "coding", count: 2, marks: 100 }],
    topics: ["Graphs", "DP", "Binary Search", "Sliding Window", "Math"],
  },
  {
    slug: "microsoft", name: "Microsoft", role: "New Grad", durationMins: 120, difficulty: "Medium",
    gradient: "from-sky-500 to-indigo-500",
    tagline: "Fundamentals MCQs followed by two medium-level coding questions.",
    sections: [
      { name: "CS Fundamentals", type: "mcq", count: 2, marks: 20 },
      { name: "Coding", type: "coding", count: 2, marks: 80 },
    ],
    topics: ["Arrays", "Linked Lists", "Trees", "OOP", "OS", "DBMS"],
  },
  {
    slug: "atlassian", name: "Atlassian", role: "SDE", durationMins: 90, difficulty: "Medium",
    gradient: "from-cyan-500 to-blue-500",
    tagline: "Practical problem solving with clean-code expectations.",
    sections: [{ name: "Coding", type: "coding", count: 2, marks: 100 }],
    topics: ["Strings", "HashMap", "Design", "Sorting"],
  },
  {
    slug: "adobe", name: "Adobe", role: "Intern", durationMins: 90, difficulty: "Medium",
    gradient: "from-red-500 to-orange-500",
    tagline: "Aptitude-style MCQs and a pair of DSA problems.",
    sections: [
      { name: "Technical MCQs", type: "mcq", count: 2, marks: 20 },
      { name: "Coding", type: "coding", count: 2, marks: 80 },
    ],
    topics: ["Arrays", "Recursion", "Bit Manipulation", "Trees"],
  },
  {
    slug: "salesforce", name: "Salesforce", role: "Intern", durationMins: 100, difficulty: "Easy",
    gradient: "from-blue-600 to-sky-500",
    tagline: "Beginner-friendly OA focused on arrays and strings.",
    sections: [{ name: "Coding", type: "coding", count: 2, marks: 100 }],
    topics: ["Arrays", "Strings", "Two Pointers", "Math"],
  },
];

export const getCompany = (slug: string) => companies.find((c) => c.slug === slug);

export const sectionSummary = (c: Company) =>
  c.sections.map((s) => `${s.count} ${s.type === "mcq" ? "MCQ" : "Coding"}`).join(" • ");

export const generalInstructions = [
  "The timer starts the moment you click Start Assessment and cannot be reset.",
  "Use the question numbers in the top bar to move between questions at any time.",
  "Mark questions for review and come back before the timer ends.",
  "Your code is auto-saved per language as you type.",
  "Run Code executes your solution against sample cases. Submit evaluates against all test cases.",
  "The assessment auto-submits when the timer reaches zero.",
];

export const modeRules: Record<"practice" | "interview", string[]> = {
  practice: ["Hints available", "Pause the timer anytime", "Unlimited Run Code", "Camera, mic and screen share optional", "No tab-switch penalty"],
  interview: ["Fullscreen is mandatory", "Camera, mic and entire-screen share required", "Tab switching is flagged", "3 violations auto-submit your test", "No hints, timer cannot pause"],
};

// ---------- Question bank (replace with backend later) ----------

const mcqBank: McqQuestion[] = [
  {
    id: "mcq-1", type: "mcq", title: "Data Structures", marks: 10, multiple: false,
    prompt: "What is the worst-case time complexity of searching for a key in a balanced binary search tree with n nodes?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: [1],
  },
  {
    id: "mcq-2", type: "mcq", title: "Java Fundamentals", marks: 10, multiple: false,
    prompt: "What does the following snippet print?",
    code: `String a = "algo";\nString b = new String("algo");\nSystem.out.println((a == b) + " " + a.equals(b));`,
    options: ["true true", "false true", "true false", "false false"], correct: [1],
  },
];

const codingBank: CodingQuestion[] = [
  {
    id: "code-1", type: "coding", title: "Maximum Sum of Distinct Subarray", difficulty: "Medium", marks: 40,
    description: [
      "Given an integer array nums and an integer k, find the maximum sum of any subarray of size k that contains only distinct elements.",
      "Return the maximum possible sum, or 0 if no valid subarray exists.",
    ],
    examples: [
      { input: "nums = [1,5,4,2,9,9,9], k = 3", output: "15", explanation: "Subarray [5,4,2] has distinct elements and sum 11; [4,2,9] has sum 15 and is the maximum." },
      { input: "nums = [4,4,4], k = 3", output: "0", explanation: "No valid subarray exists." },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "1 ≤ nums[i] ≤ 10^5", "1 ≤ k ≤ nums.length"],
    hints: ["Think about a fixed-size sliding window.", "Track element counts in a HashMap and the number of duplicates inside the window."],
    sampleInput: "1 5 4 2 9 9 9\n3",
    starter: {
      java: `import java.util.*;\n\nclass Solution {\n    public long maximumSubarraySum(int[] nums, int k) {\n        // write your code here\n        return 0;\n    }\n}\n`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    long long maximumSubarraySum(vector<int>& nums, int k) {\n        // write your code here\n        return 0;\n    }\n};\n`,
      python: `class Solution:\n    def maximumSubarraySum(self, nums: list[int], k: int) -> int:\n        # write your code here\n        return 0\n`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nfunction maximumSubarraySum(nums, k) {\n  // write your code here\n}\n`,
    },
  },
  {
    id: "code-2", type: "coding", title: "Number of Islands", difficulty: "Medium", marks: 40,
    description: [
      "Given an m x n grid of '1's (land) and '0's (water), return the number of islands.",
      "An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    ],
    examples: [
      { input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', output: "2", explanation: "Two separate groups of connected land." },
    ],
    constraints: ["1 ≤ m, n ≤ 300", "grid[i][j] is '0' or '1'"],
    hints: ["Run DFS or BFS from every unvisited land cell.", "Mark visited cells in place to avoid extra memory."],
    sampleInput: "3 3\n110\n010\n001",
    starter: {
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        // write your code here\n        return 0;\n    }\n}\n`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // write your code here\n        return 0;\n    }\n};\n`,
      python: `class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        # write your code here\n        return 0\n`,
      javascript: `/**\n * @param {character[][]} grid\n * @return {number}\n */\nfunction numIslands(grid) {\n  // write your code here\n}\n`,
    },
  },
];

export function getQuestions(slug: string): Question[] {
  const c = getCompany(slug);
  if (!c) return [];
  const n = (t: "mcq" | "coding") => c.sections.filter((s) => s.type === t).reduce((a, s) => a + s.count, 0);
  return [...mcqBank.slice(0, n("mcq")), ...codingBank.slice(0, n("coding"))];
}