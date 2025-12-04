-- Seed problems and test cases directly into the database so content is DB-driven
-- REPLACE is idempotent when rerunning on the same dataset.

REPLACE INTO problem (id, title, description, difficulty, time_limit, memory_limit) VALUES
  (1, 'Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'EASY', 2000, 65536),
  (2, 'Reverse String', 'Write a function that reverses a string. The input string is given as an array of characters s.', 'EASY', 2000, 65536),
  (3, 'Fibonacci Number', 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones.', 'MEDIUM', 2000, 65536),
  (4, 'Valid Parentheses', 'Given a string s containing just the characters ()[]{} determine if the input string is valid.', 'MEDIUM', 2000, 65536),
  (5, 'Merge Sorted Array', 'You are given two integer arrays nums1 and nums2 sorted in non-decreasing order, merge nums2 into nums1 as one sorted array.', 'EASY', 2000, 65536),
  (6, 'Palindrome Number', 'Given an integer x, return true if x is a palindrome, and false otherwise.', 'EASY', 2000, 65536),
  (7, 'Longest Common Prefix', 'Write a function to find the longest common prefix string amongst an array of strings.', 'MEDIUM', 2000, 65536),
  (8, 'Climbing Stairs', 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?', 'EASY', 2000, 65536),
  (9, 'Maximum Subarray', 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.', 'MEDIUM', 2000, 65536),
  (10, 'Power of Two', 'Given an integer n, return true if it is a power of two. Otherwise, return false.', 'EASY', 2000, 65536);

REPLACE INTO test_case (id, input, expected_output, is_hidden, problem_id) VALUES
  (1, 'nums = [2,7,11,15], target = 9', '[0,1]', false, 1),
  (2, 'nums = [3,2,4], target = 6', '[1,2]', false, 1),
  (3, 'nums = [3,3], target = 6', '[0,1]', true, 1),
  (4, 'nums = [1,5,1,2,3], target = 4', '[0,2]', true, 1),

  (5, 's = [''h'',''e'',''l'',''l'',''o'']', '[''o'',''l'',''l'',''e'',''h'']', false, 2),
  (6, 's = [''H'',''a'',''n'',''n'',''a'',''h'']', '[''h'',''a'',''n'',''n'',''a'',''H'']', true, 2),

  (7, 'n = 2', '1', false, 3),
  (8, 'n = 3', '2', false, 3),
  (9, 'n = 10', '55', true, 3),
  (10, 'n = 30', '832040', true, 3),

  (11, 's = "()"', 'true', false, 4),
  (12, 's = "()[]{}"', 'true', false, 4),
  (13, 's = "(]"', 'false', true, 4),
  (14, 's = "([)]"', 'false', true, 4),

  (15, 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', '[1,2,2,3,5,6]', false, 5),
  (16, 'nums1 = [1], m = 1, nums2 = [], n = 0', '[1]', false, 5),
  (17, 'nums1 = [0], m = 0, nums2 = [1], n = 1', '[1]', true, 5),

  (18, 'x = 121', 'true', false, 6),
  (19, 'x = -121', 'false', false, 6),
  (20, 'x = 10', 'false', true, 6),
  (21, 'x = 123454321', 'true', true, 6),

  (22, 'strs = ["flower","flow","flight"]', '"fl"', false, 7),
  (23, 'strs = ["dog","racecar","car"]', '""', false, 7),
  (24, 'strs = ["interspecies","interstellar","interstate"]', '"inters"', true, 7),

  (25, 'n = 2', '2', false, 8),
  (26, 'n = 3', '3', false, 8),
  (27, 'n = 5', '8', true, 8),
  (28, 'n = 10', '89', true, 8),

  (29, 'nums = [-2,1,-3,4,-1,2,1,-5,4]', '6', false, 9),
  (30, 'nums = [1]', '1', false, 9),
  (31, 'nums = [5,4,-1,7,8]', '23', true, 9),
  (32, 'nums = [-3,-2,-5,-1]', '-1', true, 9),

  (33, 'n = 1', 'true', false, 10),
  (34, 'n = 16', 'true', false, 10),
  (35, 'n = 3', 'false', true, 10),
  (36, 'n = 1073741824', 'true', true, 10);
