// scripts/seedC.mjs
// Run with: node scripts/seedC.mjs

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

const cLessons = [
    {
        id: "c-01",
        courseId: "c",
        order: 1,
        title: "Hello, C!",
        duration: "10 min",
        xpReward: 20,
        language: "c",
        theory: `# Introduction to C

C is one of the most widely used and influential programming languages of all time. It is known for its speed, low-level memory access, and as the basis for modern languages like C++, Java, and Python.

## The Basic Structure
Every C program must have a \`main()\` function.

\`\`\`c
#include <stdio.h> // Standard Input/Output library

int main() {
    printf("Hello, World!\\n");
    return 0; // Return 0 means success
}
\`\`\`

* **\`#include <stdio.h>\`**: Tells the compiler to include tools for printing and reading data.
* **\`printf()\`**: The standard function for printing text to the console.
* **\`\\n\`**: A special character that moves the cursor to a new line.`,
        starterCode: `#include <stdio.h>

int main() {
    // Print a welcome message
    printf("Welcome to C Programming!\\n");
    
    return 0;
}`,
        quiz: [
            {
                id: "q1",
                question: "What function must every C program contain to execute?",
                options: ["start()", "init()", "main()", "execute()"],
                correct: 2,
                explanation: "The execution of all C programs starts from the main() function.",
            }
        ],
    },
    {
        id: "c-02",
        courseId: "c",
        order: 2,
        title: "Variables & Format Specifiers",
        duration: "15 min",
        xpReward: 30,
        language: "c",
        theory: `# Variables and Format Specifiers

C is statically typed. You must define a variable's type before using it.

## Basic Types
\`\`\`c
int age = 20;        // Integers (whole numbers)
float price = 9.99;  // Decimal numbers
char grade = 'A';    // Single characters
\`\`\`

## Printing Variables (Format Specifiers)
Unlike Python, you cannot just write \`print(age)\`. In C, you use **format specifiers** inside the string as placeholders:
* \`%d\` or \`%i\` - Integer
* \`%f\` - Float
* \`%c\` - Character

\`\`\`c
int score = 100;
printf("Your score is %d points.\\n", score);

char letter = 'X';
printf("The letter is %c\\n", letter);
\`\`\``,
        starterCode: `#include <stdio.h>

int main() {
    int year = 2026;
    float temp = 98.6;
    char section = 'B';

    printf("Year: %d\\n", year);
    printf("Temperature: %f\\n", temp);
    printf("Section: %c\\n", section);

    return 0;
}`,
        quiz: [
            {
                id: "q1",
                question: "Which format specifier is used to print an integer?",
                options: ["%f", "%i or %d", "%c", "%s"],
                correct: 1,
                explanation: "%d (decimal) or %i (integer) are used as placeholders for int variables in printf.",
            }
        ],
    },
    {
        id: "c-03",
        courseId: "c",
        order: 3,
        title: "User Input (scanf)",
        duration: "15 min",
        xpReward: 30,
        language: "c",
        theory: `# Taking User Input

To read input from the terminal, C uses the \`scanf()\` function.

## How it works
Like \`printf()\`, it relies on format specifiers. However, it also requires the **address** of the variable using the \`&\` (ampersand) symbol.

\`\`\`c
int age;
printf("Enter your age: ");
scanf("%d", &age); // Notice the & symbol!
printf("You are %d years old.\\n", age);
\`\`\`

*The \`&\` tells \`scanf\` exactly where in the computer's memory to store the typed value.*`,
        starterCode: `#include <stdio.h>

int main() {
    int num;
    printf("Enter a number: ");
    // scanf("%d", &num);
    // printf("You entered: %d\\n", num);
    return 0;
}`,
        quiz: [
            {
                id: "q1",
                question: "Why do we use the '&' symbol in scanf for basic data types?",
                options: ["It stands for 'And'", "It gets the memory address where the value should be saved", "It formats the text", "It secures the memory"],
                correct: 1,
                explanation: "scanf needs to know exactly where in memory to put the input. & provides the memory address of the variable.",
            }
        ],
    },
    {
        id: "c-04",
        courseId: "c",
        order: 4,
        title: "Conditionals & Loops",
        duration: "20 min",
        xpReward: 40,
        language: "c",
        theory: `# Control Flow

## If / Else
\`\`\`c
int age = 18;
if (age >= 18) {
    printf("Adult\\n");
} else {
    printf("Minor\\n");
}
\`\`\`

## For Loops
Used when you know exactly how many times to loop.
\`\`\`c
for (int i = 0; i < 5; i++) {
    printf("%d ", i);
}
\`\`\`

## While Loops
Used when looping until a condition becomes false.
\`\`\`c
int count = 5;
while (count > 0) {
    printf("%d ", count);
    count--;
}
\`\`\``,
        starterCode: `#include <stdio.h>

int main() {
    // Write a loop that prints 1 to 10
    for(int i = 1; i <= 10; i++) {
        printf("%d\\n", i);
    }
    return 0;
}`,
        quiz: [
            {
                id: "q1",
                question: "What are the three components inside a for loop's parenthesis?",
                options: ["Start, Stop, Return", "Initialization, Condition, Increment/Update", "Condition, Increment, Output", "Array, Index, Value"],
                correct: 1,
                explanation: "for(int i=0; i<10; i++) translates to Initialization, Condition to keep running, and Update step.",
            }
        ],
    },
    {
        id: "c-05",
        courseId: "c",
        order: 5,
        title: "Arrays & Strings",
        duration: "20 min",
        xpReward: 40,
        language: "c",
        theory: `# Arrays & Strings

## Arrays
An array is a collection of items of the same type. In C, arrays have a fixed size.
\`\`\`c
int scores[5] = {90, 85, 88, 92, 79};
printf("First score: %d\\n", scores[0]);
\`\`\`

## Strings (Character Arrays)
C does not have a built-in \`string\` object. Strings are simply arrays of characters ending with a special **null terminator** (\`\\0\`).
\`\`\`c
char name[] = "Alice";
// In memory: ['A', 'l', 'i', 'c', 'e', '\\0']

printf("Name is %s\\n", name); // Use %s for strings
\`\`\``,
        starterCode: `#include <stdio.h>

int main() {
    int numbers[3] = {10, 20, 30};
    char greeting[] = "Hello World";
    
    printf("Number: %d\\n", numbers[1]);
    printf("String: %s\\n", greeting);

    return 0;
}`,
        quiz: [
            {
                id: "q1",
                question: "What special character marks the end of a string in C?",
                options: ["\\n", "\\t", "\\0", "\\end"],
                correct: 2,
                explanation: "\\0 is the null terminator. It tells the C compiler where the character array (string) actually ends in memory.",
            }
        ],
    },
    {
        id: "c-06",
        courseId: "c",
        order: 6,
        title: "Functions",
        duration: "20 min",
        xpReward: 45,
        language: "c",
        theory: `# Functions

Functions encapsulate reusable logic. In C, you must define the function's return type and the types of its parameters.

\`\`\`c
// A function that takes two ints and returns an int
int add(int a, int b) {
    return a + b;
}

// A function that returns nothing (void)
void sayHello() {
    printf("Hello!\\n");
}

int main() {
    int result = add(5, 3);
    printf("Result: %d\\n", result);
    sayHello();
    return 0;
}
\`\`\`

If you call a function before defining it, C requires you to write a **prototype** at the top of your file.`,
        starterCode: `#include <stdio.h>

// Try writing a multiply function here
int multiply(int x, int y) {
    return x * y;
}

int main() {
    int res = multiply(4, 5);
    printf("4 * 5 = %d\\n", res);
    return 0;
}`,
        quiz: [
            {
                id: "q1",
                question: "What keyword is used for the return type of a function that does not return any value?",
                options: ["null", "empty", "none", "void"],
                correct: 3,
                explanation: "void indicates that the function performs an action but does not return data to the caller.",
            }
        ],
    },
    {
        id: "c-07",
        courseId: "c",
        order: 7,
        title: "Pointers (The Core of C)",
        duration: "25 min",
        xpReward: 60,
        language: "c",
        theory: `# Pointers

Pointers are the most powerful (and infamous) feature of C. A pointer is simply a variable that stores the **memory address** of another variable.

## Creating Pointers
* **\`&\`** (Address-of operator): Gets the memory address of a variable.
* **\`*\`** (Dereference operator): Gets the value stored at a memory address.

\`\`\`c
int target = 42;
int *ptr = &target; // ptr now holds the address of target

printf("Value of target: %d\\n", target);
printf("Address of target: %p\\n", ptr); 
printf("Value at address: %d\\n", *ptr); // Dereferencing
\`\`\`

## Modifying via Pointers
You can change the original variable by editing the pointer!
\`\`\`c
*ptr = 100;
printf("%d", target); // Prints 100!
\`\`\``,
        starterCode: `#include <stdio.h>

int main() {
    int num = 50;
    int *p = &num;

    printf("Original: %d\\n", num);
    
    // Change num using the pointer p
    *p = 99;
    
    printf("Modified: %d\\n", num);

    return 0;
}`,
        quiz: [
            {
                id: "q1",
                question: "If 'ptr' is a pointer, what does '*ptr' do?",
                options: ["Multiplies the pointer", "Finds the memory address of ptr", "Retrieves the actual value stored at the memory address the pointer holds", "Deletes the pointer"],
                correct: 2,
                explanation: "The * operator (when used outside of declaration) 'dereferences' the pointer, allowing you to read or write the actual value sitting at that memory address.",
            }
        ],
    },
    {
        id: "c-08",
        courseId: "c",
        order: 8,
        title: "Dynamic Memory (malloc & free)",
        duration: "25 min",
        xpReward: 60,
        language: "c",
        theory: `# Dynamic Memory Allocation

Normally, arrays have a fixed size decided at compile time. What if you need to determine the size while the program is running? You use the Heap!

## malloc (Memory Allocate)
Included in \`<stdlib.h>\`. It asks the OS for a specific number of bytes and returns a pointer to that block.

\`\`\`c
#include <stdlib.h>

int size = 5;
// Allocate memory for 5 integers
int *arr = (int*) malloc(size * sizeof(int));

arr[0] = 10;
arr[1] = 20;
\`\`\`

## free
If you use \`malloc\`, you **MUST** use \`free()\` when you are done. If you don't, your program will have a **Memory Leak** and consume all the computer's RAM.
\`\`\`c
free(arr);
\`\`\``,
        starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Allocate array of 3 ints dynamically
    int *arr = (int*) malloc(3 * sizeof(int));
    
    arr[0] = 5;
    arr[1] = 10;
    arr[2] = 15;
    
    printf("Index 1 is: %d\\n", arr[1]);
    
    // Always free memory!
    free(arr);
    
    return 0;
}`,
        quiz: [
            {
                id: "q1",
                question: "What happens if you use malloc() but forget to use free()?",
                options: ["The compiler throws an error", "The program runs faster", "A memory leak occurs, tying up system RAM until the program closes", "The memory is automatically freed by a Garbage Collector"],
                correct: 2,
                explanation: "C has no Garbage Collector. If you allocate heap memory manually with malloc, you must manually release it with free, otherwise it leaks.",
            }
        ],
    },
    {
        id: "c-09",
        courseId: "c",
        order: 9,
        title: "Structs",
        duration: "20 min",
        xpReward: 50,
        language: "c",
        theory: `# Structs (Structures)

C doesn't have classes or Objects (like Python or C++). Instead, it has **structs** to group different types of variables together.

## Defining a Struct
\`\`\`c
struct Player {
    char name[50];
    int hp;
    int score;
};
\`\`\`

## Using a Struct
\`\`\`c
#include <string.h>

int main() {
    struct Player p1;
    
    // Assign values
    p1.hp = 100;
    p1.score = 500;
    strcpy(p1.name, "Hero"); // Must use strcpy for string arrays!
    
    printf("%s has %d HP.\\n", p1.name, p1.hp);
    return 0;
}
\`\`\``,
        starterCode: `#include <stdio.h>
#include <string.h>

struct Book {
    char title[50];
    int pages;
};

int main() {
    struct Book b1;
    strcpy(b1.title, "C Programming");
    b1.pages = 350;
    
    printf("Book: %s (%d pages)\\n", b1.title, b1.pages);

    return 0;
}`,
        quiz: [
            {
                id: "q1",
                question: "Why do we use strcpy() to assign a string to a struct's character array?",
                options: ["Arrays in C cannot be directly assigned with '=' after creation", "It makes the string uppercase", "It allocates memory", "It's faster"],
                correct: 0,
                explanation: "In C, you cannot use the assignment operator (=) on an array after it has been declared. You must copy the characters into the array using string copy (strcpy).",
            }
        ],
    },
    {
        id: "c-10",
        courseId: "c",
        order: 10,
        title: "File Handling",
        duration: "20 min",
        xpReward: 50,
        language: "c",
        theory: `# File I/O

C can create, read, and write to text files on your computer.

## Opening a File
Use \`fopen()\` and a file pointer (\`FILE *\`).
\`\`\`c
FILE *file = fopen("data.txt", "w"); // "w" is Write Mode, "r" is Read Mode, "a" is Append
\`\`\`

## Writing to a File
Use \`fprintf()\` (File Print Format).
\`\`\`c
fprintf(file, "Saving data to disk!\\n");
\`\`\`

## Closing a File
Always close the file to save the buffer to the hard drive!
\`\`\`c
fclose(file);
\`\`\``,
        starterCode: `#include <stdio.h>

int main() {
    // Open file in write mode
    FILE *fptr = fopen("test.txt", "w");
    
    if (fptr == NULL) {
        printf("Error opening file!");
        return 1;
    }
    
    // Write text
    fprintf(fptr, "Hello from C File I/O!\\n");
    
    // Close file
    fclose(fptr);
    printf("File written successfully.\\n");

    return 0;
}`,
        quiz: [
            {
                id: "q1",
                question: "What file mode should you use in fopen() if you want to add text to the end of a file without deleting the existing contents?",
                options: ["'w' (Write)", "'r' (Read)", "'a' (Append)", "'e' (End)"],
                correct: 2,
                explanation: "'a' stands for Append. It opens the file and points the cursor to the very end so new data is added without overwriting.",
            }
        ],
    }
];

async function seed() {
    console.log("🌱 Seeding C course...\n");

    // Create the course document
    await setDoc(doc(db, "courses", "c"), {
        id: "c",
        title: "C Programming",
        emoji: "⚙️",
        color: "gray",
        tagline: "Master the mother of all modern languages",
        description: "Learn memory management, pointers, and high-performance coding with the legendary C programming language.",
        level: "Beginner",
        totalLessons: 10,
        xpReward: 50,
        order: 5,
    });

    console.log("✅ Created C course document");

    // Add lessons
    console.log("📖 Adding C lessons...");
    for (const lesson of cLessons) {
        await setDoc(doc(db, "courses", "c", "lessons", lesson.id), lesson);
        console.log(`  ✅ Added Lesson ${lesson.order}: ${lesson.title}`);
    }

    console.log(`\n✨ Done! Added full C course with 10 lessons.`);
    process.exit(0);
}

seed().catch((e) => {
    console.error("❌", e);
    process.exit(1);
});