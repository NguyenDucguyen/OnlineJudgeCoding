import { Problem } from '../types';

export const problems: Problem[] = [
  {
    id: ,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    testCases: [
      {
        input: '[2,7,11,15]\n9',
        expectedOutput: '[0,1]',
        hidden: false
      },
      {
        input: '[3,2,4]\n6',
        expectedOutput: '[1,2]',
        hidden: false
      },
      {
        input: '[3,3]\n6',
        expectedOutput: '[0,1]',
        hidden: true
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    tags: ['Array', 'Hash Table'],
    solved: false,
    attempts: 0
  },
  {
    id: ,
    title: 'Reverse String',
    difficulty: 'Easy',
    category: 'Strings',
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    testCases: [
      {
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
        hidden: false
      },
      {
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
        hidden: false
      }
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.'
    ],
    tags: ['Two Pointers', 'String'],
    solved: true,
    attempts: 2
  },
  {
    id: ,
    title: 'Binary Tree Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.

Follow up: Recursive solution is trivial, could you do it iteratively?`,
    examples: [
      {
        input: 'root = [1,null,2,3]',
        output: '[1,3,2]'
      },
      {
        input: 'root = []',
        output: '[]'
      }
    ],
    testCases: [
      {
        input: '[1,null,2,3]',
        expectedOutput: '[1,3,2]',
        hidden: false
      },
      {
        input: '[]',
        expectedOutput: '[]',
        hidden: false
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    tags: ['Stack', 'Tree', 'Depth-First Search'],
    solved: false,
    attempts: 5
  },
  {
    id: ,
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    category: 'Linked Lists',
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'The linked-lists are: [1->4->5, 1->3->4, 2->6]. Merging them into one sorted list: 1->1->2->3->4->4->5->6.'
      }
    ],
    testCases: [
      {
        input: '[[1,4,5],[1,3,4],[2,6]]',
        expectedOutput: '[1,1,2,3,4,4,5,6]',
        hidden: false
      },
      {
        input: '[]',
        expectedOutput: '[]',
        hidden: true
      }
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4'
    ],
    tags: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'],
    solved: false,
    attempts: 0
  }
];