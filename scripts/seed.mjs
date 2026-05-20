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
    {
      id: "c-02",
      courseId: "c",
      order: 2,
      title: "Variables & Format Specifiers",
      duration: "12 min",
      xpReward: 25,
      language: "c",
      theory: `# Variables & Format Specifiers\n\n## Core Types\n\n- **int** for whole numbers\n- **float** for decimal numbers\n- **char** for single characters\n\n## printf Format Specifiers\n\n| Type | Specifier | Example |\n|------|-----------|---------|\n| int | %d | \`printf("%d", count);\` |\n| float | %f | \`printf("%f", price);\` |\n| char | %c | \`printf("%c", grade);\` |\n| string | %s | \`printf("%s", name);\` |\n\n\`\`\`c\nint age = 25;\nfloat height = 5.9f;\nchar grade = 'B';\nchar name[] = "Ada";\n\nprintf("Age: %d\\n", age);\nprintf("Height: %f\\n", height);\nprintf("Grade: %c\\n", grade);\nprintf("Name: %s\\n", name);\n\`\`\``,
      starterCode: `#include <stdio.h>\n\nint main() {\n    int age = 25;\n    float height = 5.9f;\n    char grade = 'B';\n\n    printf("Age: %d\\n", age);\n    printf("Height: %f\\n", height);\n    printf("Grade: %c\\n", grade);\n\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "Which format specifier is used for float?",
          options: ["%d", "%f", "%c", "%s"],
          correct: 1,
          explanation: "%f prints floating point numbers in printf.",
        },
        {
          id: "q2",
          question: "How do you declare an integer in C?",
          options: ["int x=5", "integer x=5", "var x=5", "num x=5"],
          correct: 0,
          explanation: "Use the int keyword to declare integers in C.",
        },
      ],
    },
    {
      id: "c-03",
      courseId: "c",
      order: 3,
      title: "User Input (scanf)",
      duration: "12 min",
      xpReward: 25,
      language: "c",
      theory: `# User Input (scanf)\n\nUse \`scanf\` to read input from the user.\n\n## The Address Operator\n\n\`scanf\` needs the **address** of a variable, so you pass it with **&**.\n\n\`\`\`c\nint num;\nscanf("%d", &num);\n\`\`\`\n\n## Reading Different Types\n\n\`\`\`c\nint age;\nfloat gpa;\nchar name[20];\n\nscanf("%d", &age);\nscanf("%f", &gpa);\nscanf("%19s", name);\n\`\`\``,
      starterCode: `#include <stdio.h>\n\nint main() {\n    int num;\n\n    printf("Enter a number: ");\n    scanf("%d", &num);\n\n    printf("You entered: %d\\n", num);\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "What operator gives the address of a variable?",
          options: ["*", "&", "#", "@"],
          correct: 1,
          explanation: "& returns the memory address of a variable.",
        },
        {
          id: "q2",
          question: "Which function reads input in C?",
          options: ["input()", "cin", "scanf", "read()"],
          correct: 2,
          explanation: "scanf reads formatted input in C.",
        },
      ],
    },
    {
      id: "c-04",
      courseId: "c",
      order: 4,
      title: "Conditionals & Loops",
      duration: "12 min",
      xpReward: 25,
      language: "c",
      theory: `# Conditionals & Loops\n\n## if / else if / else\n\n\`\`\`c\nint score = 75;\n\nif (score >= 90) {\n    printf("A\\n");\n} else if (score >= 75) {\n    printf("B\\n");\n} else {\n    printf("C\\n");\n}\n\`\`\`\n\n## for Loop\n\n\`\`\`c\nfor (int i = 0; i < 5; i++) {\n    printf("%d\\n", i);\n}\n\`\`\`\n\n## while Loop\n\n\`\`\`c\nint i = 0;\nwhile (i < 5) {\n    printf("%d\\n", i);\n    i++;\n}\n\`\`\``,
      starterCode: `#include <stdio.h>\n\nint main() {\n    int score = 75;\n\n    if (score >= 90) {\n        printf("A\\n");\n    } else if (score >= 75) {\n        printf("B\\n");\n    } else {\n        printf("C\\n");\n    }\n\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "Which keyword handles alternate conditions?",
          options: ["elif", "else if", "elseif", "otherwise"],
          correct: 1,
          explanation: "C uses else if for alternate conditions.",
        },
        {
          id: "q2",
          question: "What is the correct for loop syntax in C?",
          options: [
            "for i in range(5)",
            "for(int i=0;i<5;i++)",
            "foreach(i,5)",
            "loop(5)",
          ],
          correct: 1,
          explanation: "C for loops use initializer, condition, increment.",
        },
      ],
    },
    {
      id: "c-05",
      courseId: "c",
      order: 5,
      title: "Arrays & Strings",
      duration: "12 min",
      xpReward: 25,
      language: "c",
      theory: `# Arrays & Strings\n\n## Arrays\n\n\`\`\`c\nint nums[5] = {1, 2, 3, 4, 5};\nprintf("First: %d\\n", nums[0]);\n\`\`\`\n\n## Strings\n\nStrings are char arrays ending with a null terminator.\n\n\`\`\`c\nchar name[] = "Syntaxia";\n\nprintf("%s\\n", name);\nprintf("Length: %zu\\n", strlen(name));\n\nchar copy[20];\nstrcpy(copy, name);\n\`\`\`\n\nRemember to include \`string.h\` for \`strlen\` and \`strcpy\`.`,
      starterCode: `#include <stdio.h>\n\nint main() {\n    int nums[] = {1, 2, 3, 4, 5};\n\n    for (int i = 0; i < 5; i++) {\n        printf("%d\\n", nums[i]);\n    }\n\n    char name[] = "Syntaxia";\n    printf("%s\\n", name);\n\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "How do you declare an integer array of size 3?",
          options: [
            "int arr[3]",
            "array<int> arr",
            "int[] arr",
            "arr = int[3]",
          ],
          correct: 0,
          explanation: "C arrays use brackets with a size, like int arr[3].",
        },
        {
          id: "q2",
          question: "Which library provides strlen and strcpy?",
          options: ["stdlib.h", "math.h", "string.h", "stdio.h"],
          correct: 2,
          explanation: "string.h declares strlen and strcpy.",
        },
      ],
    },
    {
      id: "c-06",
      courseId: "c",
      order: 6,
      title: "Functions",
      duration: "12 min",
      xpReward: 30,
      language: "c",
      theory: `# Functions\n\nFunctions let you reuse logic and keep code organized.\n\n## Declaration and Definition\n\n\`\`\`c\nint add(int a, int b);\n\nint add(int a, int b) {\n    return a + b;\n}\n\`\`\`\n\n## Return Types and Parameters\n\n- **Return type** describes the value returned\n- **Parameters** are input values\n- Use **void** for no return\n\n\`\`\`c\nvoid greet(void) {\n    printf("Hello!\\n");\n}\n\`\`\``,
      starterCode: `#include <stdio.h>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int result = add(3, 4);\n    printf("Result: %d\\n", result);\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "What return type means a function returns nothing?",
          options: ["null", "void", "none", "empty"],
          correct: 1,
          explanation: "void means a function does not return a value.",
        },
        {
          id: "q2",
          question: "Where must functions be declared before main in C?",
          options: [
            "After main",
            "Inside main",
            "Before main or as prototype",
            "Anywhere",
          ],
          correct: 2,
          explanation:
            "Functions need a prototype or full definition before main.",
        },
      ],
    },
    {
      id: "c-07",
      courseId: "c",
      order: 7,
      title: "Pointers",
      duration: "12 min",
      xpReward: 30,
      language: "c",
      theory: `# Pointers\n\nPointers store memory addresses.\n\n- **&** gets the address of a variable\n- **\*** declares a pointer or dereferences it\n\n\`\`\`c\nint x = 10;\nint *p = &x;\n\nprintf("Address: %p\\n", (void *)p);\nprintf("Value: %d\\n", *p);\n\`\`\`\n\nPointer arithmetic moves by the size of the pointed-to type.`,
      starterCode: `#include <stdio.h>\n\nint main() {\n    int x = 10;\n    int *p = &x;\n\n    printf("Address: %p\\n", (void *)p);\n    printf("Value: %d\\n", *p);\n\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "What does * do when used with a pointer variable?",
          options: [
            "Gets address",
            "Dereferences (gets value)",
            "Multiplies",
            "Declares array",
          ],
          correct: 1,
          explanation:
            "Using * with a pointer dereferences it to get the value.",
        },
        {
          id: "q2",
          question: "What does & give you?",
          options: ["Value", "Pointer size", "Memory address", "Null"],
          correct: 2,
          explanation: "& returns a variable's memory address.",
        },
      ],
    },
    {
      id: "c-08",
      courseId: "c",
      order: 8,
      title: "Dynamic Memory",
      duration: "12 min",
      xpReward: 35,
      language: "c",
      theory: `# Dynamic Memory\n\nUse heap allocation to create data at runtime.\n\n## malloc and calloc\n\n\`\`\`c\nint *p = (int *)malloc(sizeof(int));\nif (p == NULL) {\n    return 1;\n}\n*p = 42;\n\nfree(p);\n\`\`\`\n\n- **malloc** allocates uninitialized memory\n- **calloc** allocates and zeroes memory\n- Always **free** what you allocate`,
      starterCode: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *p = (int *)malloc(sizeof(int));\n    if (p == NULL) {\n        return 1;\n    }\n\n    *p = 42;\n    printf("%d\\n", *p);\n\n    free(p);\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "Which function allocates memory dynamically in C?",
          options: ["alloc", "new", "malloc", "memget"],
          correct: 2,
          explanation: "malloc allocates memory on the heap in C.",
        },
        {
          id: "q2",
          question: "What must you do after using malloc'd memory?",
          options: ["Reassign it", "free() it", "Null it", "Copy it"],
          correct: 1,
          explanation: "Always call free() to release allocated memory.",
        },
      ],
    },
    {
      id: "c-09",
      courseId: "c",
      order: 9,
      title: "Structs",
      duration: "12 min",
      xpReward: 35,
      language: "c",
      theory: `# Structs\n\nStructs group related data under one type.\n\n## Define a Struct\n\n\`\`\`c\nstruct Hero {\n    char name[20];\n    int hp;\n};\n\nstruct Hero h;\n\`\`\`\n\nAccess members with the dot operator.\n\n\`\`\`c\nstrcpy(h.name, "Nova");\nh.hp = 100;\nprintf("%s %d\\n", h.name, h.hp);\n\`\`\`\n\nYou can also use \`typedef struct\` to create a shorter type name.`,
      starterCode: `#include <stdio.h>\n#include <string.h>\n\nstruct Hero {\n    char name[20];\n    int hp;\n};\n\nint main() {\n    struct Hero h;\n    strcpy(h.name, "Nova");\n    h.hp = 100;\n\n    printf("%s %d\\n", h.name, h.hp);\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "How do you access a struct member?",
          options: [
            "struct->member",
            "struct.member",
            "struct[member]",
            "struct::member",
          ],
          correct: 1,
          explanation: "Use the dot operator, like hero.hp.",
        },
        {
          id: "q2",
          question: "What keyword defines a custom data type grouping in C?",
          options: ["class", "object", "struct", "type"],
          correct: 2,
          explanation: "struct defines a grouped data type in C.",
        },
      ],
    },
    {
      id: "c-10",
      courseId: "c",
      order: 10,
      title: "File Handling",
      duration: "12 min",
      xpReward: 35,
      language: "c",
      theory: `# File Handling\n\nC uses \`FILE *\` to read and write files.\n\n## Open, Write, and Close\n\n\`\`\`c\nFILE *f = fopen("out.txt", "w");\nif (f == NULL) {\n    return 1;\n}\n\nfprintf(f, "Hello file!\\n");\nfclose(f);\n\`\`\`\n\n## Read a File\n\n\`\`\`c\nchar buf[64];\nf = fopen("out.txt", "r");\nif (f) {\n    fgets(buf, sizeof(buf), f);\n    printf("%s", buf);\n    fclose(f);\n}\n\`\`\`\n\nCommon modes: \`"r"\` read, \`"w"\` write, \`"a"\` append.`,
      starterCode: `#include <stdio.h>\n\nint main() {\n    FILE *f = fopen("out.txt", "w");\n    if (f == NULL) {\n        return 1;\n    }\n\n    fprintf(f, "Hello file!\\n");\n    fclose(f);\n\n    f = fopen("out.txt", "r");\n    if (f == NULL) {\n        return 1;\n    }\n\n    char buf[64];\n    fgets(buf, sizeof(buf), f);\n    printf("%s", buf);\n    fclose(f);\n\n    return 0;\n}\n`,
      quiz: [
        {
          id: "q1",
          question: "Which mode opens a file for writing in C?",
          options: ['"r"', '"w"', '"x"', '"o"'],
          correct: 1,
          explanation: '"w" opens a file for writing (and truncates it).',
        },
        {
          id: "q2",
          question: "What function closes a file in C?",
          options: ["fend()", "close()", "fclose()", "fileclose()"],
          correct: 2,
          explanation: "fclose() closes a file opened with fopen().",
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
