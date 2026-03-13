// scripts/seed.mjs
// Run ONCE with: node scripts/seed.mjs

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

const courses = [
  {
    id: "python",
    title: "Python Programming",
    emoji: "🐍",
    color: "green",
    level: "Beginner",
    totalLessons: 4,
    xpReward: 50,
    order: 1,
    tagline: "From your first print() to advanced algorithms",
  },
  {
    id: "linux",
    title: "Linux & Command Line",
    emoji: "🐧",
    color: "orange",
    level: "Beginner",
    totalLessons: 3,
    xpReward: 50,
    order: 2,
    tagline: "Master the terminal and file system",
  },
  {
    id: "c",
    title: "C Programming",
    emoji: "⚙️",
    color: "blue",
    level: "Intermediate",
    totalLessons: 3,
    xpReward: 75,
    order: 3,
    tagline: "Memory, pointers, and how computers really work",
  },
  {
    id: "cpp",
    title: "C++ Programming",
    emoji: "🔷",
    color: "purple",
    level: "Intermediate",
    totalLessons: 3,
    xpReward: 75,
    order: 4,
    tagline: "Object-oriented programming and the STL",
  },
];

const lessons = {
  python: [
    {
      id: "py-01",
      courseId: "python",
      order: 1,
      title: "Hello, Python!",
      duration: "10 min",
      xpReward: 20,
      language: "python",
      theory: `# Hello, Python!\n\nWelcome to Python — one of the most popular programming languages in the world.\n\n## Your First Program\n\nThe classic first program prints a message to the screen:\n\n\`\`\`python\nprint("Hello, World!")\n\`\`\`\n\nThe \`print()\` function outputs text to the console.\n\n## Variables\n\nVariables store data for later use:\n\n\`\`\`python\nname = "Alice"\nage  = 25\nprint("My name is", name, "and I am", age, "years old.")\n\`\`\`\n\nPython figures out the type automatically.\n\n## Comments\n\nUse \`#\` to write notes Python will ignore:\n\n\`\`\`python\n# This is a comment\nprint("This runs")  # end-of-line comment\n\`\`\``,
      starterCode: `# Welcome to Python!\nname = "World"\nage  = 0\n\nprint("Hello,", name)\nprint("You are", age, "years old.")\n\n# Modify this to print YOUR name and age!\n`,
      quiz: [
        {
          id: "q1",
          question: "Which function displays output in Python?",
          options: ["display()", "print()", "output()", "echo()"],
          correct: 1,
          explanation: "print() is the built-in function for output in Python.",
        },
        {
          id: "q2",
          question: "How do you write a comment in Python?",
          options: ["// comment", "/* comment */", "# comment", "-- comment"],
          correct: 2,
          explanation: "Python uses # for single-line comments.",
        },
        {
          id: "q3",
          question: "What will print(2 + 3) output?",
          options: ["2 + 3", '"5"', "5", "Error"],
          correct: 2,
          explanation: "Python evaluates 2+3=5 and prints the number 5.",
        },
      ],
    },
    {
      id: "py-02",
      courseId: "python",
      order: 2,
      title: "Variables & Data Types",
      duration: "12 min",
      xpReward: 20,
      language: "python",
      theory: `# Variables & Data Types\n\n## The Four Core Types\n\n| Type | Example | Description |\n|------|---------|-------------|\n| \`int\` | \`42\` | Whole numbers |\n| \`float\` | \`3.14\` | Decimal numbers |\n| \`str\` | \`"hello"\` | Text |\n| \`bool\` | \`True\` | True or False |\n\n## Checking a Type\n\n\`\`\`python\nx = 42\nprint(type(x))   # <class 'int'>\n\`\`\`\n\n## String Operations\n\n\`\`\`python\nname = "CodePath"\nprint(len(name))         # 8\nprint(name.upper())      # CODEPATH\nprint(f"Hi, {name}!")    # Hi, CodePath!\n\`\`\`\n\n## Arithmetic\n\n\`\`\`python\na, b = 10, 3\nprint(a + b)   # 13\nprint(a // b)  # 3  (integer division)\nprint(a % b)   # 1  (remainder)\nprint(a ** b)  # 1000 (power)\n\`\`\``,
      starterCode: `# Variables & Data Types\nscore   = 100\npi      = 3.14159\ncourse  = "CodePath"\npremium = False\n\nprint("Score:",   score)\nprint("Pi:",      pi)\nprint("Course:",  course)\nprint("Premium?", premium)\n\n# Try: print an f-string combining all four variables\n`,
      quiz: [
        {
          id: "q1",
          question: "What data type is 3.14?",
          options: ["int", "str", "float", "bool"],
          correct: 2,
          explanation: "3.14 is a decimal number — a float.",
        },
        {
          id: "q2",
          question: "What does // do in Python?",
          options: ["Division", "Integer division", "Power", "Modulo"],
          correct: 1,
          explanation: "// performs integer (floor) division. 10 // 3 = 3.",
        },
      ],
    },
    {
      id: "py-03",
      courseId: "python",
      order: 3,
      title: "If Statements & Logic",
      duration: "15 min",
      xpReward: 25,
      language: "python",
      theory: `# If Statements & Logic\n\n## The if / elif / else Structure\n\n\`\`\`python\nage = 18\nif age >= 18:\n    print("Adult")\nelif age >= 13:\n    print("Teenager")\nelse:\n    print("Child")\n\`\`\`\n\n⚠️ **Indentation matters!** Code inside a block must be indented 4 spaces.\n\n## Comparison Operators\n\n| Operator | Meaning |\n|----------|---------|\n| \`==\` | Equal |\n| \`!=\` | Not equal |\n| \`>\` | Greater than |\n| \`<\` | Less than |\n| \`>=\` | Greater or equal |\n| \`<=\` | Less or equal |\n\n## Logical Operators\n\nCombine conditions with \`and\`, \`or\`, \`not\`:\n\n\`\`\`python\nif score >= 50 and grade != "F":\n    print("Passed!")\n\`\`\``,
      starterCode: `# Grade Calculator\nscore = 75\n\nif score >= 90:\n    grade   = "A"\n    message = "Excellent!"\nelif score >= 80:\n    grade   = "B"\n    message = "Great job!"\nelif score >= 70:\n    grade   = "C"\n    message = "Good work."\nelif score >= 60:\n    grade   = "D"\n    message = "You passed."\nelse:\n    grade   = "F"\n    message = "Keep trying!"\n\nprint(f"Score: {score}")\nprint(f"Grade: {grade} — {message}")\n`,
      quiz: [
        {
          id: "q1",
          question: "How do you check equality in Python?",
          options: ["=", "===", "==", "equals()"],
          correct: 2,
          explanation: "== is the equality operator. = is for assignment.",
        },
        {
          id: "q2",
          question:
            "What happens if no if/elif condition matches and there's no else?",
          options: [
            "Error",
            "Block is skipped",
            "Python crashes",
            "First block runs",
          ],
          correct: 1,
          explanation: "Python simply skips the entire if/elif block.",
        },
      ],
    },
    {
      id: "py-04",
      courseId: "python",
      order: 4,
      title: "Loops",
      duration: "15 min",
      xpReward: 25,
      language: "python",
      theory: `# Loops\n\n## The for Loop\n\n\`\`\`python\nfor i in range(5):\n    print(i)   # 0 1 2 3 4\n\nfruits = ["apple","banana","cherry"]\nfor fruit in fruits:\n    print(fruit)\n\`\`\`\n\n## The while Loop\n\n\`\`\`python\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n\`\`\`\n\n## break and continue\n\n\`\`\`python\nfor i in range(10):\n    if i == 3: continue  # skip 3\n    if i == 7: break     # stop at 7\n    print(i)\n\`\`\``,
      starterCode: `# Loops Practice\n\nprint("Counting 1-10:")\nfor i in range(1, 11):\n    print(i, end=" ")\nprint()\n\ntotal = 0\nfor i in range(1, 51):\n    total += i\nprint(f"\\nSum 1-50: {total}")\n\nprint("\\nFizzBuzz 1-20:")\nfor i in range(1, 21):\n    if i % 15 == 0:   print("FizzBuzz")\n    elif i % 3 == 0:  print("Fizz")\n    elif i % 5 == 0:  print("Buzz")\n    else:             print(i)\n`,
      quiz: [
        {
          id: "q1",
          question: "What does range(3) produce?",
          options: ["1,2,3", "0,1,2,3", "0,1,2", "1,2"],
          correct: 2,
          explanation:
            "range(3) generates 0, 1, 2 — starts at 0, stops before 3.",
        },
        {
          id: "q2",
          question: "Which keyword immediately exits a loop?",
          options: ["exit", "stop", "continue", "break"],
          correct: 3,
          explanation: "break immediately terminates the loop.",
        },
      ],
    },
  ],
  linux: [
    {
      id: "lx-01",
      courseId: "linux",
      order: 1,
      title: "Navigating the File System",
      duration: "10 min",
      xpReward: 20,
      language: "linux",
      theory: `# Navigating the File System\n\nThe Linux file system is a tree starting from \`/\` (root).\n\n## Essential Commands\n\n| Command | What it does |\n|---------|-------------|\n| \`pwd\` | Show current directory |\n| \`ls\` | List files |\n| \`ls -la\` | List with details + hidden files |\n| \`cd folder\` | Enter a directory |\n| \`cd ..\` | Go up one level |\n| \`cd ~\` | Go to home |\n| \`mkdir name\` | Create directory |\n| \`touch file.txt\` | Create empty file |\n| \`rm file.txt\` | Delete a file |\n\nTry these in the Terminal tab!`,
      starterCode: `# This lesson uses the Terminal tab below.\n# Switch to Terminal and try the commands!\nprint("Switch to the Terminal tab to practice Linux commands.")`,
      quiz: [
        {
          id: "q1",
          question: "What does pwd do?",
          options: [
            "Print a file",
            "Show current directory",
            "List files",
            "Delete directory",
          ],
          correct: 1,
          explanation: "pwd = print working directory.",
        },
        {
          id: "q2",
          question: "How do you go up one directory?",
          options: ["cd up", "cd /", "cd ..", "cd ~"],
          correct: 2,
          explanation: "cd .. moves you to the parent directory.",
        },
      ],
    },
  ],
  c: [
    {
      id: "c-01",
      courseId: "c",
      order: 1,
      title: "Hello, C!",
      duration: "12 min",
      xpReward: 25,
      language: "c",
      theory: `# Hello, C!\n\nC powers operating systems and embedded systems worldwide.\n\n## Your First C Program\n\n\`\`\`c\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n\`\`\`\n\n- **\`#include <stdio.h>\`** — imports printf and other I/O functions\n- **\`int main()\`** — entry point of every C program\n- **\`printf()\`** — prints formatted text\n- **\`return 0;\`** — signals successful completion\n- **Semicolons** — every statement ends with \`;\`\n\n## Format Specifiers\n\n\`\`\`c\nint   score = 95;     printf("Score: %d\\n", score);\nfloat pi    = 3.14;   printf("Pi: %.2f\\n",  pi);\nchar  grade = 'A';    printf("Grade: %c\\n", grade);\n\`\`\``,
      starterCode: `#include <stdio.h>\n\nint main() {\n    int   age   = 20;\n    float gpa   = 3.85;\n    char  grade = 'A';\n\n    printf("Age:   %d\\n",   age);\n    printf("GPA:   %.2f\\n", gpa);\n    printf("Grade: %c\\n",   grade);\n\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "What does #include <stdio.h> do?",
          options: [
            "Starts the program",
            "Imports I/O functions like printf",
            "Declares variables",
            "Ends the program",
          ],
          correct: 1,
          explanation:
            "stdio.h provides printf, scanf, and other I/O functions.",
        },
        {
          id: "q2",
          question: "What format specifier prints an integer?",
          options: ["%s", "%f", "%c", "%d"],
          correct: 3,
          explanation: "%d is the format specifier for integers in printf.",
        },
      ],
    },
  ],
  cpp: [
    {
      id: "cpp-01",
      courseId: "cpp",
      order: 1,
      title: "Hello, C++!",
      duration: "12 min",
      xpReward: 25,
      language: "cpp",
      theory: `# Hello, C++!\n\nC++ extends C with object-oriented features for large applications.\n\n## Your First C++ Program\n\n\`\`\`cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n\`\`\`\n\n- **\`#include <iostream>\`** — C++ I/O library\n- **\`using namespace std;\`** — write \`cout\` instead of \`std::cout\`\n- **\`cout <<\`** — stream insertion operator for output\n- **\`endl\`** — end of line\n\n## Native bool and string\n\n\`\`\`cpp\nbool   active = true;\nstring name   = "Alice";  // needs #include <string>\ncout << name << " active: " << active << endl;\n\`\`\``,
      starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name    = "CodePath";\n    int    year    = 2026;\n    double version = 1.0;\n    bool   active  = true;\n\n    cout << "Platform: " << name    << endl;\n    cout << "Year:     " << year    << endl;\n    cout << "Version:  " << version << endl;\n    cout << "Active:   " << active  << endl;\n\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "What C++ object prints to the console?",
          options: ["printf", "print", "cout", "output"],
          correct: 2,
          explanation: "cout with << is the standard output stream in C++.",
        },
        {
          id: "q2",
          question: "What does 'using namespace std;' allow?",
          options: [
            "Creates a namespace",
            "Use std items without std:: prefix",
            "Imports all libraries",
            "Defines main",
          ],
          correct: 1,
          explanation: "It lets you write cout instead of std::cout.",
        },
      ],
    },
  ],
};

async function seed() {
  console.log("🌱 Seeding Firestore...\n");
  for (const course of courses) {
    await setDoc(doc(db, "courses", course.id), course);
    console.log(`✅ ${course.emoji} ${course.title}`);
  }
  for (const [courseId, courseLessons] of Object.entries(lessons)) {
    for (const lesson of courseLessons) {
      await setDoc(doc(db, "courses", courseId, "lessons", lesson.id), lesson);
      console.log(`   📖 ${lesson.title}`);
    }
  }
  console.log("\n✨ Done! Firestore is seeded.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
