// scripts/seedChallenges.mjs
// Run with: node scripts/seedChallenges.mjs
// Seeds 7 days of daily challenges into Firestore

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeCUpoOfSyEO_i7hBcoSd-pRq95TTpi9A",
  authDomain: "academic-coding-environment.firebaseapp.com",
  projectId: "academic-coding-environment",
  storageBucket: "academic-coding-environment.firebasestorage.app",
  messagingSenderId: "575762500824",
  appId: "1:575762500824:web:87c159931942ed565d1bad",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function dateString(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

const challenges = [
  {
    title: "Sum of a List",
    description:
      "Write a Python function that takes a list of numbers and returns their sum WITHOUT using the built-in sum() function.",
    language: "python",
    difficulty: "Easy",
    xpReward: 75,
    starterCode: `def my_sum(numbers):
    # Write your solution here
    pass

# Test your function
print(my_sum([1, 2, 3, 4, 5]))   # Expected: 15
print(my_sum([10, 20, 30]))       # Expected: 60
print(my_sum([]))                  # Expected: 0
`,
    expectedOutput: "15\n60\n0",
    hint: "Use a for loop and a running total variable.",
  },
  {
    title: "FizzBuzz",
    description:
      "Print numbers 1 to 30. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', for multiples of both print 'FizzBuzz'.",
    language: "python",
    difficulty: "Easy",
    xpReward: 75,
    starterCode: `# FizzBuzz challenge
for i in range(1, 31):
    # Write your solution here
    pass
`,
    expectedOutput:
      "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz",
    hint: "Check for divisibility by 15 first (multiples of both 3 and 5).",
  },
  {
    title: "Reverse a String",
    description:
      "Write a Python function that reverses a string without using slicing [::-1] or the reversed() function.",
    language: "python",
    difficulty: "Easy",
    xpReward: 75,
    starterCode: `def reverse_string(s):
    # Write your solution here
    pass

print(reverse_string("hello"))    # Expected: olleh
print(reverse_string("CodePath")) # Expected: htaPedoC
print(reverse_string(""))         # Expected: (empty)
`,
    expectedOutput: "olleh\nhtaPedoC\n",
    hint: "Build a new string by iterating backwards using a while loop or index.",
  },
  {
    title: "Count Vowels",
    description:
      "Write a Python function that counts the number of vowels (a, e, i, o, u) in a string. It should be case-insensitive.",
    language: "python",
    difficulty: "Easy",
    xpReward: 75,
    starterCode: `def count_vowels(s):
    # Write your solution here
    pass

print(count_vowels("Hello World"))  # Expected: 3
print(count_vowels("PYTHON"))       # Expected: 1
print(count_vowels("rhythm"))       # Expected: 0
`,
    expectedOutput: "3\n1\n0",
    hint: "Convert to lowercase first, then check each character against 'aeiou'.",
  },
  {
    title: "Find the Maximum",
    description:
      "Write a Python function that finds the maximum value in a list WITHOUT using the built-in max() function.",
    language: "python",
    difficulty: "Easy",
    xpReward: 75,
    starterCode: `def find_max(numbers):
    # Write your solution here
    pass

print(find_max([3, 1, 4, 1, 5, 9, 2, 6]))  # Expected: 9
print(find_max([-5, -1, -3]))               # Expected: -1
print(find_max([42]))                        # Expected: 42
`,
    expectedOutput: "9\n-1\n42",
    hint: "Start by assuming the first element is the max, then compare with each subsequent element.",
  },
  {
    title: "Is Palindrome",
    description:
      "Write a Python function that checks if a string is a palindrome (reads the same forwards and backwards). Ignore spaces and case.",
    language: "python",
    difficulty: "Medium",
    xpReward: 100,
    starterCode: `def is_palindrome(s):
    # Write your solution here
    pass

print(is_palindrome("racecar"))        # Expected: True
print(is_palindrome("hello"))          # Expected: False
print(is_palindrome("A man a plan a canal Panama"))  # Expected: True
`,
    expectedOutput: "True\nFalse\nTrue",
    hint: "Remove spaces and convert to lowercase first, then compare with its reverse.",
  },
  {
    title: "Fibonacci Sequence",
    description:
      "Write a Python function that returns the first n numbers of the Fibonacci sequence as a list.",
    language: "python",
    difficulty: "Medium",
    xpReward: 100,
    starterCode: `def fibonacci(n):
    # Write your solution here
    pass

print(fibonacci(1))   # Expected: [0]
print(fibonacci(5))   # Expected: [0, 1, 1, 2, 3]
print(fibonacci(8))   # Expected: [0, 1, 1, 2, 3, 5, 8, 13]
`,
    expectedOutput: "[0]\n[0, 1, 1, 2, 3]\n[0, 1, 1, 2, 3, 5, 8, 13]",
    hint: "Start with [0, 1] and each next number is the sum of the previous two.",
  },
];

async function seed() {
  console.log("🌱 Seeding daily challenges...\n");
  for (let i = 0; i < challenges.length; i++) {
    const date = dateString(i - 3); // seed from 3 days ago to 3 days ahead
    const id = date;
    await setDoc(doc(db, "challenges", id), { ...challenges[i], date, id });
    console.log(`✅ ${date}: ${challenges[i].title}`);
  }
  console.log("\n✨ Challenges seeded!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
