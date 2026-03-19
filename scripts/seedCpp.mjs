// scripts/seedCpp.mjs
// Run with: node scripts/seedCpp.mjs
// Adds 24 new C++ lessons (2-25) + 20 daily challenges

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyBeCUpoOfSyEO_i7hBcoSd-pRq95TTpi9A",
  authDomain:        "academic-coding-environment.firebaseapp.com",
  projectId:         "academic-coding-environment",
  storageBucket:     "academic-coding-environment.firebasestorage.app",
  messagingSenderId: "575762500824",
  appId:             "1:575762500824:web:87c159931942ed565d1bad",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const lessons = [

  // ── BEGINNER (2–8) ────────────────────────────────────────────────────────

  {
    id:"cpp-02", courseId:"cpp", order:2, title:"Variables & Data Types", duration:"15 min", xpReward:25, language:"cpp",
    theory:`# Variables & Data Types

C++ is a **statically typed** language — you must declare the type of every variable before using it.

## Fundamental Types

\`\`\`cpp
int    age     = 25;        // whole numbers
double price   = 9.99;     // decimal numbers (preferred over float)
char   grade   = 'A';      // single character (use single quotes)
bool   active  = true;     // true or false
string name    = "Alice";  // text (requires #include <string>)
\`\`\`

## auto — Let the Compiler Decide

C++11 introduced \`auto\`, which automatically deduces the type:

\`\`\`cpp
auto x    = 42;       // int
auto pi   = 3.14;     // double
auto msg  = "Hello";  // const char*
\`\`\`

## Constants

\`\`\`cpp
const double PI    = 3.14159;
const int    DAYS  = 7;
// PI = 3.14;  // Error! Cannot modify a const
\`\`\`

## Type Sizes

\`\`\`cpp
cout << sizeof(int)    << endl;  // 4 bytes
cout << sizeof(double) << endl;  // 8 bytes
cout << sizeof(char)   << endl;  // 1 byte
cout << sizeof(bool)   << endl;  // 1 byte
\`\`\`

## Type Conversion

\`\`\`cpp
int    a = 5;
int    b = 2;
double result = (double)a / b;  // 2.5 (without cast: 2)
cout << result << endl;
\`\`\``,
    starterCode:`#include <iostream>
#include <string>
using namespace std;

int main() {
    // Fundamental types
    int    age     = 20;
    double gpa     = 3.85;
    char   grade   = 'A';
    bool   enrolled = true;
    string name    = "Alice";

    cout << "Name:     " << name     << endl;
    cout << "Age:      " << age      << endl;
    cout << "GPA:      " << gpa      << endl;
    cout << "Grade:    " << grade    << endl;
    cout << "Enrolled: " << enrolled << endl;

    // auto keyword
    auto score  = 95;
    auto rating = 4.8;
    cout << "Score:  " << score  << endl;
    cout << "Rating: " << rating << endl;

    // Constants
    const double PI = 3.14159;
    double radius   = 5.0;
    cout << "Area: " << PI * radius * radius << endl;

    // Type sizes
    cout << "int size:    " << sizeof(int)    << " bytes" << endl;
    cout << "double size: " << sizeof(double) << " bytes" << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"Which type is preferred for decimal numbers in C++?", options:["float","int","double","long"], correct:2, explanation:"double is preferred over float because it has higher precision (64-bit vs 32-bit)."},
      {id:"q2", question:"What does the 'auto' keyword do in C++?", options:["Creates an automatic pointer","Lets the compiler deduce the type","Makes a variable constant","Creates a global variable"], correct:1, explanation:"auto tells the compiler to automatically determine the variable's type from its initializer value."},
      {id:"q3", question:"What happens if you try to modify a const variable?", options:["It silently ignores the change","It resets to default","The compiler gives an error","It creates a new variable"], correct:2, explanation:"const variables cannot be modified after initialization — the compiler produces an error if you try."},
    ],
  },

  {
    id:"cpp-03", courseId:"cpp", order:3, title:"Operators & Expressions", duration:"12 min", xpReward:25, language:"cpp",
    theory:`# Operators & Expressions

## Arithmetic Operators

\`\`\`cpp
int a = 10, b = 3;
cout << a + b  << endl;  // 13  addition
cout << a - b  << endl;  // 7   subtraction
cout << a * b  << endl;  // 30  multiplication
cout << a / b  << endl;  // 3   integer division
cout << a % b  << endl;  // 1   modulo (remainder)
\`\`\`

## Comparison Operators

\`\`\`cpp
cout << (a == b) << endl;  // 0 (false)
cout << (a != b) << endl;  // 1 (true)
cout << (a >  b) << endl;  // 1 (true)
cout << (a <= b) << endl;  // 0 (false)
\`\`\`

## Logical Operators

\`\`\`cpp
bool x = true, y = false;
cout << (x && y) << endl;  // 0 (AND)
cout << (x || y) << endl;  // 1 (OR)
cout << (!x)     << endl;  // 0 (NOT)
\`\`\`

## Increment & Decrement

\`\`\`cpp
int n = 5;
cout << n++ << endl;  // 5 (post-increment: use then add)
cout << n   << endl;  // 6
cout << ++n << endl;  // 7 (pre-increment: add then use)
\`\`\`

## Compound Assignment

\`\`\`cpp
int x = 10;
x += 5;   // x = 15
x -= 3;   // x = 12
x *= 2;   // x = 24
x /= 4;   // x = 6
x %= 4;   // x = 2
\`\`\`

## Ternary Operator

\`\`\`cpp
int age = 18;
string status = (age >= 18) ? "Adult" : "Minor";
cout << status << endl;  // Adult
\`\`\``,
    starterCode:`#include <iostream>
#include <string>
using namespace std;

int main() {
    int a = 15, b = 4;

    // Arithmetic
    cout << "=== Arithmetic ===" << endl;
    cout << a << " + " << b << " = " << a + b << endl;
    cout << a << " - " << b << " = " << a - b << endl;
    cout << a << " * " << b << " = " << a * b << endl;
    cout << a << " / " << b << " = " << a / b << " (integer)" << endl;
    cout << a << " % " << b << " = " << a % b << endl;
    cout << (double)a / b << " (double division)" << endl;

    // Comparison
    cout << "\n=== Comparisons ===" << endl;
    cout << "a == b: " << (a == b) << endl;
    cout << "a != b: " << (a != b) << endl;
    cout << "a >  b: " << (a >  b) << endl;

    // Ternary
    cout << "\n=== Ternary ===" << endl;
    int score = 75;
    string result = (score >= 60) ? "Pass" : "Fail";
    cout << "Score " << score << ": " << result << endl;

    // Increment
    cout << "\n=== Increment ===" << endl;
    int n = 5;
    cout << "n++: " << n++ << endl;
    cout << "n now: " << n << endl;
    cout << "++n: " << ++n << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What does the % operator do in C++?", options:["Division","Power","Remainder after division","Percentage"], correct:2, explanation:"% is the modulo operator — it returns the remainder after integer division. 10 % 3 = 1."},
      {id:"q2", question:"What is the difference between n++ and ++n?", options:["No difference","n++ adds 2, ++n adds 1","n++ uses then increments; ++n increments then uses","++n is faster"], correct:2, explanation:"n++ (post-increment) returns the current value then increments. ++n (pre-increment) increments first then returns the new value."},
      {id:"q3", question:"What does (age >= 18) ? \"Adult\" : \"Minor\" do?", options:["Compares two strings","A ternary expression returning Adult if age>=18, Minor otherwise","Creates two variables","Throws an error if age<18"], correct:1, explanation:"The ternary operator ?: is a compact if-else. It returns the first value if the condition is true, otherwise the second."},
    ],
  },

  {
    id:"cpp-04", courseId:"cpp", order:4, title:"Control Flow: if/else & switch", duration:"15 min", xpReward:25, language:"cpp",
    theory:`# Control Flow: if/else & switch

## if / else if / else

\`\`\`cpp
int score = 85;

if (score >= 90) {
    cout << "Grade: A" << endl;
} else if (score >= 80) {
    cout << "Grade: B" << endl;
} else if (score >= 70) {
    cout << "Grade: C" << endl;
} else {
    cout << "Grade: F" << endl;
}
\`\`\`

## Nested if

\`\`\`cpp
int age = 20;
bool hasID = true;

if (age >= 18) {
    if (hasID) {
        cout << "Access granted" << endl;
    } else {
        cout << "Need ID" << endl;
    }
}
\`\`\`

## switch Statement

Use switch for equality checks against fixed values:

\`\`\`cpp
int day = 3;
switch (day) {
    case 1:  cout << "Monday";    break;
    case 2:  cout << "Tuesday";   break;
    case 3:  cout << "Wednesday"; break;
    case 4:  cout << "Thursday";  break;
    case 5:  cout << "Friday";    break;
    default: cout << "Weekend";   break;
}
\`\`\`

⚠️ Always include \`break\` — without it, execution falls through to the next case.

## Logical Operators in Conditions

\`\`\`cpp
int age = 25;
double income = 50000;

if (age >= 18 && income >= 30000) {
    cout << "Loan approved" << endl;
}

if (age < 13 || age > 65) {
    cout << "Special pricing applies" << endl;
}
\`\`\``,
    starterCode:`#include <iostream>
#include <string>
using namespace std;

int main() {
    // Grade calculator
    int score = 82;
    string grade;

    if      (score >= 90) grade = "A";
    else if (score >= 80) grade = "B";
    else if (score >= 70) grade = "C";
    else if (score >= 60) grade = "D";
    else                  grade = "F";

    cout << "Score: " << score << " -> Grade: " << grade << endl;

    // Switch for day of week
    int day = 4;
    cout << "Day " << day << " is: ";
    switch (day) {
        case 1:  cout << "Monday";    break;
        case 2:  cout << "Tuesday";   break;
        case 3:  cout << "Wednesday"; break;
        case 4:  cout << "Thursday";  break;
        case 5:  cout << "Friday";    break;
        case 6:  cout << "Saturday";  break;
        case 7:  cout << "Sunday";    break;
        default: cout << "Invalid";   break;
    }
    cout << endl;

    // Multiple conditions
    int age    = 22;
    bool hasID = true;
    if (age >= 18 && hasID) {
        cout << "Access granted" << endl;
    } else if (age >= 18 && !hasID) {
        cout << "Please show ID" << endl;
    } else {
        cout << "Too young" << endl;
    }

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What happens in a switch statement if you forget 'break'?", options:["The program crashes","Execution falls through to the next case","Only the matching case runs","The default runs"], correct:1, explanation:"Without break, execution continues ('falls through') into the next case, running its code even if that case doesn't match."},
      {id:"q2", question:"Which operator means AND in C++?", options:["&","||","&&","and"], correct:2, explanation:"&& is the logical AND operator. Both conditions must be true for the whole expression to be true."},
      {id:"q3", question:"What is the 'default' case in a switch statement?", options:["The first case","Required in every switch","Runs when no other case matches","The fastest case"], correct:2, explanation:"The default case runs when the switch value doesn't match any of the defined cases. It's optional but good practice."},
    ],
  },

  {
    id:"cpp-05", courseId:"cpp", order:5, title:"Loops", duration:"15 min", xpReward:25, language:"cpp",
    theory:`# Loops

## for Loop

Best when you know how many times to iterate:

\`\`\`cpp
for (int i = 0; i < 5; i++) {
    cout << i << " ";
}
// 0 1 2 3 4
\`\`\`

## while Loop

Best when you don't know how many iterations are needed:

\`\`\`cpp
int n = 1;
while (n <= 10) {
    cout << n << " ";
    n++;
}
\`\`\`

## do-while Loop

Runs at least once before checking the condition:

\`\`\`cpp
int x;
do {
    cout << "Enter positive number: ";
    cin >> x;
} while (x <= 0);
\`\`\`

## Range-based for (C++11)

The modern way to loop over collections:

\`\`\`cpp
int nums[] = {10, 20, 30, 40, 50};
for (int n : nums) {
    cout << n << " ";
}
\`\`\`

## break & continue

\`\`\`cpp
for (int i = 0; i < 10; i++) {
    if (i == 3) continue;  // skip 3
    if (i == 7) break;     // stop at 7
    cout << i << " ";
}
// 0 1 2 4 5 6
\`\`\`

## Nested Loops

\`\`\`cpp
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        cout << i * j << "\t";
    }
    cout << endl;
}
\`\`\``,
    starterCode:`#include <iostream>
using namespace std;

int main() {
    // for loop — multiplication table of 5
    cout << "Multiplication table of 5:" << endl;
    for (int i = 1; i <= 10; i++) {
        cout << "5 x " << i << " = " << 5 * i << endl;
    }

    // while loop — sum 1 to 100
    int sum = 0, i = 1;
    while (i <= 100) {
        sum += i;
        i++;
    }
    cout << "\nSum 1-100: " << sum << endl;

    // Range-based for
    int primes[] = {2, 3, 5, 7, 11, 13, 17};
    cout << "\nFirst 7 primes: ";
    for (int p : primes) {
        cout << p << " ";
    }
    cout << endl;

    // FizzBuzz
    cout << "\nFizzBuzz 1-20:" << endl;
    for (int n = 1; n <= 20; n++) {
        if      (n % 15 == 0) cout << "FizzBuzz" << endl;
        else if (n % 3  == 0) cout << "Fizz"     << endl;
        else if (n % 5  == 0) cout << "Buzz"     << endl;
        else                  cout << n           << endl;
    }

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What are the three parts of a for loop header?", options:["condition, body, end","init, condition, update","start, stop, step","declare, check, run"], correct:1, explanation:"A for loop header has three parts: initialization (int i=0), condition (i<5), and update (i++), separated by semicolons."},
      {id:"q2", question:"What does a do-while loop guarantee?", options:["Infinite execution","The body runs at least once","Better performance","The condition is checked first"], correct:1, explanation:"A do-while loop checks the condition after the body runs, guaranteeing the body executes at least once."},
      {id:"q3", question:"What does 'continue' do inside a loop?", options:["Exits the loop","Restarts the program","Skips the rest of the current iteration","Pauses execution"], correct:2, explanation:"continue skips the remaining code in the current iteration and moves to the next iteration of the loop."},
    ],
  },

  {
    id:"cpp-06", courseId:"cpp", order:6, title:"Functions", duration:"18 min", xpReward:30, language:"cpp",
    theory:`# Functions

Functions let you group reusable code under a name.

## Declaration & Definition

\`\`\`cpp
// Declaration (prototype) — tells compiler the function exists
int add(int a, int b);

int main() {
    cout << add(3, 5) << endl;  // 8
    return 0;
}

// Definition — the actual implementation
int add(int a, int b) {
    return a + b;
}
\`\`\`

## void Functions

Functions that don't return a value:

\`\`\`cpp
void greet(string name) {
    cout << "Hello, " << name << "!" << endl;
}
\`\`\`

## Default Parameters

\`\`\`cpp
void greet(string name, string msg = "Hello") {
    cout << msg << ", " << name << "!" << endl;
}
greet("Alice");          // Hello, Alice!
greet("Bob", "Hi");      // Hi, Bob!
\`\`\`

## Function Overloading

Multiple functions with the same name but different parameters:

\`\`\`cpp
int    square(int x)    { return x * x; }
double square(double x) { return x * x; }

cout << square(5)   << endl;   // 25   (int version)
cout << square(2.5) << endl;   // 6.25 (double version)
\`\`\`

## Pass by Value vs Pass by Reference

\`\`\`cpp
void doubleVal(int x)   { x *= 2; }     // copy — original unchanged
void doubleRef(int& x)  { x *= 2; }     // reference — original changed

int n = 10;
doubleVal(n);  cout << n << endl;  // 10
doubleRef(n);  cout << n << endl;  // 20
\`\`\``,
    starterCode:`#include <iostream>
#include <string>
#include <cmath>
using namespace std;

// Function prototypes
double circleArea(double radius);
int    factorial(int n);
void   printStars(int count, char symbol = '*');
int    max3(int a, int b, int c);

int main() {
    // Circle area
    cout << "Area of circle r=5: " << circleArea(5.0) << endl;

    // Factorial
    for (int i = 0; i <= 7; i++) {
        cout << i << "! = " << factorial(i) << endl;
    }

    // Default parameter
    printStars(8);
    printStars(5, '#');

    // Max of three
    cout << "Max(3,9,6) = " << max3(3, 9, 6) << endl;

    // Pass by reference
    int a = 10, b = 20;
    cout << "Before swap: a=" << a << " b=" << b << endl;
    swap(a, b);  // std::swap
    cout << "After swap:  a=" << a << " b=" << b << endl;

    return 0;
}

double circleArea(double r)   { return 3.14159 * r * r; }
int    factorial(int n)        { return (n <= 1) ? 1 : n * factorial(n-1); }
void   printStars(int n, char c) { for(int i=0;i<n;i++) cout<<c; cout<<endl; }
int    max3(int a, int b, int c) { return max(a, max(b, c)); }`,
    quiz:[
      {id:"q1", question:"What is function overloading?", options:["Calling a function too many times","Multiple functions with the same name but different parameters","A function that calls itself","A function with no return type"], correct:1, explanation:"Function overloading allows multiple functions with the same name as long as their parameter lists differ in type or number."},
      {id:"q2", question:"What does passing by reference (&) do?", options:["Creates a copy","Passes a pointer","Allows the function to modify the original variable","Makes the variable const"], correct:2, explanation:"Pass by reference passes the actual variable, not a copy, so any modifications inside the function affect the original."},
      {id:"q3", question:"What is a function prototype?", options:["The function's full implementation","A declaration that tells the compiler the function's name, return type, and parameters","A template function","A virtual function"], correct:1, explanation:"A function prototype (declaration) tells the compiler about a function before its full definition, allowing it to be called before being defined."},
    ],
  },

  {
    id:"cpp-07", courseId:"cpp", order:7, title:"Arrays & Strings", duration:"18 min", xpReward:30, language:"cpp",
    theory:`# Arrays & Strings

## C-Style Arrays

\`\`\`cpp
int scores[5] = {85, 92, 78, 96, 88};
cout << scores[0] << endl;    // 85
cout << scores[4] << endl;    // 88

// Size of array
int size = sizeof(scores) / sizeof(scores[0]);  // 5
\`\`\`

## Multidimensional Arrays

\`\`\`cpp
int matrix[2][3] = {{1,2,3},{4,5,6}};
cout << matrix[1][2] << endl;  // 6
\`\`\`

## std::string

Much safer and easier than C-style char arrays:

\`\`\`cpp
#include <string>

string name = "Alice";
cout << name.length()      << endl;  // 5
cout << name.substr(0, 3)  << endl;  // Ali
cout << name.find("ice")   << endl;  // 2
cout << name + " Smith"    << endl;  // Alice Smith
name[0] = 'B';
cout << name               << endl;  // Blice
\`\`\`

## String Methods

\`\`\`cpp
string s = "  Hello World  ";
// No built-in trim, but:
cout << s.size()               << endl;  // 15
cout << s.empty()              << endl;  // 0 (false)
cout << s.at(2)                << endl;  // H (bounds-checked)
cout << s.replace(2,5,"Hi")    << endl;  // replace chars
\`\`\`

## Reading Strings with Spaces

\`\`\`cpp
string line;
getline(cin, line);  // reads entire line including spaces
\`\`\``,
    starterCode:`#include <iostream>
#include <string>
using namespace std;

int main() {
    // Array operations
    int scores[] = {85, 92, 78, 96, 88, 73, 91};
    int size = sizeof(scores) / sizeof(scores[0]);

    int sum = 0, maxScore = scores[0], minScore = scores[0];
    for (int i = 0; i < size; i++) {
        sum += scores[i];
        if (scores[i] > maxScore) maxScore = scores[i];
        if (scores[i] < minScore) minScore = scores[i];
    }
    cout << "Scores: ";
    for (int s : scores) cout << s << " ";
    cout << endl;
    cout << "Average: " << (double)sum/size << endl;
    cout << "Max: " << maxScore << "  Min: " << minScore << endl;

    // String operations
    string fullName = "Ada Lovelace";
    cout << "\nName:   " << fullName << endl;
    cout << "Length: " << fullName.length() << endl;
    cout << "First:  " << fullName.substr(0, 3) << endl;
    cout << "Upper:  ";
    for (char c : fullName) cout << (char)toupper(c);
    cout << endl;

    // String search
    string sentence = "C++ is a powerful language";
    if (sentence.find("powerful") != string::npos) {
        cout << "\n'powerful' found at index: " << sentence.find("powerful") << endl;
    }

    return 0;
}`,
    quiz:[
      {id:"q1", question:"How do you find the number of elements in a C-style array?", options:["array.size()","array.length()","sizeof(array)/sizeof(array[0])","count(array)"], correct:2, explanation:"sizeof(array) gives total bytes; sizeof(array[0]) gives bytes per element. Dividing gives the element count."},
      {id:"q2", question:"What does string::npos represent?", options:["The last position","Zero","A 'not found' indicator returned by find()","The string's length"], correct:2, explanation:"string::npos is the maximum value of size_t and is returned by find() when the substring is not found."},
      {id:"q3", question:"Which function reads a full line including spaces in C++?", options:["cin >>","cin.get()","getline(cin, str)","cin.read()"], correct:2, explanation:"getline(cin, str) reads an entire line including spaces until a newline character, unlike cin >> which stops at whitespace."},
    ],
  },

  {
    id:"cpp-08", courseId:"cpp", order:8, title:"Pointers & References", duration:"20 min", xpReward:35, language:"cpp",
    theory:`# Pointers & References

Pointers and references are fundamental to C++ and are what give it power over memory.

## What is a Pointer?

A pointer stores the **memory address** of another variable:

\`\`\`cpp
int  x   = 42;
int* ptr = &x;    // ptr holds the address of x

cout << x    << endl;  // 42       (value of x)
cout << &x   << endl;  // 0x...    (address of x)
cout << ptr  << endl;  // 0x...    (same address)
cout << *ptr << endl;  // 42       (dereference: value at address)
\`\`\`

## Modifying Through a Pointer

\`\`\`cpp
*ptr = 100;   // change x through its pointer
cout << x << endl;  // 100
\`\`\`

## nullptr

Always initialize pointers — use \`nullptr\` for "no address":

\`\`\`cpp
int* p = nullptr;
if (p != nullptr) {
    cout << *p << endl;  // safe — only deref if not null
}
\`\`\`

## References

A reference is an **alias** — another name for the same variable:

\`\`\`cpp
int  a   = 10;
int& ref = a;   // ref IS a — not a copy

ref = 20;
cout << a << endl;  // 20 — a changed through ref
\`\`\`

## Pointer vs Reference

| | Pointer | Reference |
|--|---------|-----------|
| Can be null | Yes | No |
| Can be reassigned | Yes | No |
| Syntax to use | \`*ptr\` | \`ref\` |
| Best used for | Dynamic memory | Function parameters |

## Pointers and Arrays

\`\`\`cpp
int arr[] = {10, 20, 30};
int* p    = arr;          // points to first element
cout << *p     << endl;   // 10
cout << *(p+1) << endl;   // 20
cout << *(p+2) << endl;   // 30
\`\`\``,
    starterCode:`#include <iostream>
using namespace std;

void increment(int* p)  { (*p)++; }         // pointer param
void doubleIt(int& ref) { ref *= 2; }        // reference param

int main() {
    int x = 42;
    int* ptr = &x;

    cout << "=== Pointer Basics ===" << endl;
    cout << "Value of x:     " << x    << endl;
    cout << "Address of x:   " << ptr  << endl;
    cout << "Value via ptr:  " << *ptr << endl;

    *ptr = 100;
    cout << "x after *ptr=100: " << x << endl;

    cout << "\n=== Reference Basics ===" << endl;
    int a = 10;
    int& ref = a;
    cout << "a = " << a << ", ref = " << ref << endl;
    ref = 99;
    cout << "After ref=99, a = " << a << endl;

    cout << "\n=== Pointer vs Reference as params ===" << endl;
    int n = 5;
    increment(&n);
    cout << "After increment: " << n << endl;
    doubleIt(n);
    cout << "After doubleIt:  " << n << endl;

    cout << "\n=== Pointer Arithmetic ===" << endl;
    int arr[] = {10, 20, 30, 40, 50};
    int* p = arr;
    for (int i = 0; i < 5; i++) {
        cout << "arr[" << i << "] = " << *(p+i) << endl;
    }

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What does the * operator do when used with a pointer?", options:["Declares a pointer","Multiplies values","Dereferences the pointer (gets the value at the address)","Gets the address of a variable"], correct:2, explanation:"When used with an existing pointer (not in declaration), * dereferences it — meaning it accesses the value stored at that memory address."},
      {id:"q2", question:"What is the & operator used for in 'int* ptr = &x'?", options:["Logical AND","Bitwise AND","Gets the memory address of x","Creates a reference"], correct:2, explanation:"In this context, & is the address-of operator. It returns the memory address of the variable x."},
      {id:"q3", question:"What is nullptr in C++?", options:["Zero","An empty string","A pointer to memory address 0 meaning 'points to nothing'","An error code"], correct:2, explanation:"nullptr is the C++11 null pointer constant. It represents a pointer that doesn't point to any valid memory location."},
    ],
  },

  // ── INTERMEDIATE (9–17) ───────────────────────────────────────────────────

  {
    id:"cpp-09", courseId:"cpp", order:9, title:"OOP I — Classes & Objects", duration:"20 min", xpReward:40, language:"cpp",
    theory:`# OOP I — Classes & Objects

A **class** bundles data (attributes) and functions (methods) together.

## Defining a Class

\`\`\`cpp
class Dog {
private:           // only accessible within the class
    string name;
    int    age;

public:            // accessible from anywhere
    // Constructor
    Dog(string n, int a) {
        name = n;
        age  = a;
    }

    // Methods
    void bark() {
        cout << name << " says: Woof!" << endl;
    }

    string getName() { return name; }
    int    getAge()  { return age;  }
};

int main() {
    Dog d1("Rex", 3);
    d1.bark();
    cout << d1.getName() << " is " << d1.getAge() << endl;
}
\`\`\`

## Constructor & Destructor

\`\`\`cpp
class Resource {
public:
    Resource()  { cout << "Created!"   << endl; }   // constructor
    ~Resource() { cout << "Destroyed!" << endl; }   // destructor
};
\`\`\`

## this Pointer

\`\`\`cpp
class Counter {
    int count;
public:
    Counter(int count) {
        this->count = count;  // this-> distinguishes member from param
    }
    void show() { cout << count << endl; }
};
\`\`\`

## Getters & Setters

\`\`\`cpp
class BankAccount {
    double balance;
public:
    double getBalance()      { return balance; }
    void   setBalance(double b) {
        if (b >= 0) balance = b;
    }
};
\`\`\``,
    starterCode:`#include <iostream>
#include <string>
using namespace std;

class Rectangle {
private:
    double width;
    double height;
    string color;

public:
    // Constructor
    Rectangle(double w, double h, string c = "black") {
        width  = w;
        height = h;
        color  = c;
    }

    // Destructor
    ~Rectangle() {
        cout << "Rectangle destroyed" << endl;
    }

    // Getters
    double getWidth()  { return width;  }
    double getHeight() { return height; }
    string getColor()  { return color;  }

    // Methods
    double area()      { return width * height; }
    double perimeter() { return 2 * (width + height); }

    void describe() {
        cout << color << " rectangle: "
             << width << "x" << height
             << " | area=" << area()
             << " | perimeter=" << perimeter()
             << endl;
    }
};

int main() {
    Rectangle r1(5.0, 3.0, "blue");
    Rectangle r2(8.0, 2.5);

    r1.describe();
    r2.describe();

    cout << "r1 area:   " << r1.area()      << endl;
    cout << "r2 perim:  " << r2.perimeter() << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What is the difference between public and private in a class?", options:["public is faster","private members can only be accessed within the class; public from anywhere","There is no difference in C++","public is for functions, private for data"], correct:1, explanation:"private restricts access to within the class itself. public allows access from anywhere. This is encapsulation — hiding internal details."},
      {id:"q2", question:"What is a destructor?", options:["A function that creates objects","A function called automatically when an object is destroyed","A private constructor","A function that deletes pointers"], correct:1, explanation:"A destructor (~ClassName) is called automatically when an object goes out of scope or is deleted. Used for cleanup like freeing memory."},
      {id:"q3", question:"What does 'this' pointer refer to inside a class method?", options:["The parent class","The next object created","A pointer to the current object instance","The class definition itself"], correct:2, explanation:"'this' is a pointer to the current object. It's useful when a parameter has the same name as a member variable."},
    ],
  },

  {
    id:"cpp-10", courseId:"cpp", order:10, title:"OOP II — Inheritance & Polymorphism", duration:"22 min", xpReward:40, language:"cpp",
    theory:`# OOP II — Inheritance & Polymorphism

## Inheritance

A derived class **inherits** members from a base class:

\`\`\`cpp
class Animal {
protected:
    string name;
public:
    Animal(string n) : name(n) {}
    void eat()  { cout << name << " is eating" << endl; }
    string getName() { return name; }
};

class Dog : public Animal {
public:
    Dog(string n) : Animal(n) {}   // call base constructor
    void bark() { cout << name << " barks!" << endl; }
};

Dog d("Rex");
d.eat();    // inherited
d.bark();   // own method
\`\`\`

## Virtual Functions & Polymorphism

\`\`\`cpp
class Shape {
public:
    virtual double area() { return 0; }   // virtual!
    virtual void describe() {
        cout << "Area: " << area() << endl;
    }
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() override { return 3.14159 * r * r; }
};

class Square : public Shape {
    double s;
public:
    Square(double s) : s(s) {}
    double area() override { return s * s; }
};

// Polymorphism via base pointer
Shape* shapes[] = { new Circle(5), new Square(4) };
for (Shape* s : shapes) {
    s->describe();   // calls correct area() for each type
}
\`\`\``,
    starterCode:`#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Vehicle {
protected:
    string brand;
    int    speed;
public:
    Vehicle(string b, int s) : brand(b), speed(s) {}
    virtual string type()  { return "Vehicle"; }
    virtual void   info()  {
        cout << type() << ": " << brand
             << " | max speed: " << speed << " km/h" << endl;
    }
    virtual ~Vehicle() {}
};

class Car : public Vehicle {
    int doors;
public:
    Car(string b, int s, int d) : Vehicle(b, s), doors(d) {}
    string type() override { return "Car"; }
    void   info() override {
        Vehicle::info();
        cout << "  Doors: " << doors << endl;
    }
};

class Motorcycle : public Vehicle {
    bool hasSidecar;
public:
    Motorcycle(string b, int s, bool sc=false)
        : Vehicle(b, s), hasSidecar(sc) {}
    string type() override { return "Motorcycle"; }
    void   info() override {
        Vehicle::info();
        cout << "  Sidecar: " << (hasSidecar?"Yes":"No") << endl;
    }
};

int main() {
    vector<Vehicle*> fleet = {
        new Car("Toyota", 180, 4),
        new Motorcycle("Honda", 200),
        new Car("BMW", 250, 2),
        new Motorcycle("Harley", 160, true),
    };

    cout << "=== Fleet Info ===" << endl;
    for (Vehicle* v : fleet) {
        v->info();
    }

    // Cleanup
    for (Vehicle* v : fleet) delete v;
    return 0;
}`,
    quiz:[
      {id:"q1", question:"What does the 'override' keyword do in C++11?", options:["Creates a new function","Explicitly marks that a function overrides a virtual function","Makes a function faster","Prevents a function from being overridden further"], correct:1, explanation:"override explicitly tells the compiler this function is meant to override a virtual function. If the base function signature doesn't match, the compiler gives an error."},
      {id:"q2", question:"Why do we use virtual functions?", options:["To make functions faster","To enable polymorphism — calling the correct derived class function through a base class pointer","To hide functions from derived classes","To make functions static"], correct:1, explanation:"virtual allows the correct overridden function to be called at runtime based on the actual object type, not the pointer type. This is runtime polymorphism."},
      {id:"q3", question:"What is the access specifier 'protected'?", options:["Same as private","Same as public","Accessible within the class and its derived classes, but not from outside","Only accessible in virtual functions"], correct:2, explanation:"protected members are accessible within the class itself and any derived classes, but not from outside the class hierarchy."},
    ],
  },

  {
    id:"cpp-11", courseId:"cpp", order:11, title:"OOP III — Operator Overloading", duration:"18 min", xpReward:40, language:"cpp",
    theory:`# Operator Overloading

Operator overloading lets you define how operators like \`+\`, \`==\`, and \`<<\` work with your custom classes.

## Overloading +

\`\`\`cpp
class Vector2D {
public:
    double x, y;
    Vector2D(double x, double y) : x(x), y(y) {}

    // Overload +
    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }
};

Vector2D v1(1, 2), v2(3, 4);
Vector2D v3 = v1 + v2;   // uses operator+
\`\`\`

## Overloading == and !=

\`\`\`cpp
bool operator==(const Vector2D& other) const {
    return x == other.x && y == other.y;
}
bool operator!=(const Vector2D& other) const {
    return !(*this == other);
}
\`\`\`

## Overloading << for output

\`\`\`cpp
// Friend function — outside the class but has private access
friend ostream& operator<<(ostream& os, const Vector2D& v) {
    os << "(" << v.x << ", " << v.y << ")";
    return os;
}

Vector2D v(3, 4);
cout << v << endl;   // (3, 4)
\`\`\`

## Rules

- You cannot create new operators
- You cannot change operator precedence
- At least one operand must be a user-defined type
- Some operators cannot be overloaded (\`::\`, \`.\`, \`?:\`)`,
    starterCode:`#include <iostream>
#include <cmath>
using namespace std;

class Vector2D {
public:
    double x, y;

    Vector2D(double x=0, double y=0) : x(x), y(y) {}

    // Arithmetic
    Vector2D operator+(const Vector2D& o) const { return {x+o.x, y+o.y}; }
    Vector2D operator-(const Vector2D& o) const { return {x-o.x, y-o.y}; }
    Vector2D operator*(double scalar)     const { return {x*scalar, y*scalar}; }

    // Comparison
    bool operator==(const Vector2D& o) const { return x==o.x && y==o.y; }
    bool operator!=(const Vector2D& o) const { return !(*this==o); }

    // Compound assignment
    Vector2D& operator+=(const Vector2D& o) { x+=o.x; y+=o.y; return *this; }

    // Utility
    double magnitude() const { return sqrt(x*x + y*y); }

    // Stream output
    friend ostream& operator<<(ostream& os, const Vector2D& v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os;
    }
};

int main() {
    Vector2D v1(3, 4), v2(1, 2);

    cout << "v1 = "       << v1 << endl;
    cout << "v2 = "       << v2 << endl;
    cout << "v1+v2 = "    << v1+v2 << endl;
    cout << "v1-v2 = "    << v1-v2 << endl;
    cout << "v1*2 = "     << v1*2  << endl;
    cout << "|v1| = "     << v1.magnitude() << endl;
    cout << "v1==v2: "    << (v1==v2) << endl;

    Vector2D v3(3, 4);
    cout << "v1==v3: "    << (v1==v3) << endl;

    v1 += v2;
    cout << "v1 after +=v2: " << v1 << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What is operator overloading?", options:["Using too many operators","Defining how operators work with custom classes","Replacing built-in operators","Deleting default operators"], correct:1, explanation:"Operator overloading lets you define custom behavior for operators like +, ==, << when used with your own class types."},
      {id:"q2", question:"What is a 'friend' function?", options:["A derived class function","A function that can access private members of a class even though it's not a member","A static function","A virtual function"], correct:1, explanation:"A friend function is declared inside a class with the 'friend' keyword. It has access to the class's private and protected members but is not a member of the class itself."},
      {id:"q3", question:"Which of these operators CANNOT be overloaded?", options:["==","<<","::","+="], correct:2, explanation:"The scope resolution operator :: cannot be overloaded. Others that can't include . (member access), .* (pointer-to-member), and ?: (ternary)."},
    ],
  },

  {
    id:"cpp-12", courseId:"cpp", order:12, title:"Memory Management", duration:"22 min", xpReward:45, language:"cpp",
    theory:`# Memory Management

Understanding memory is what makes C++ powerful — and dangerous.

## Stack vs Heap

\`\`\`
Stack: automatic, fast, limited size, freed automatically
Heap:  manual, slower, large size, must be freed manually
\`\`\`

\`\`\`cpp
// Stack — automatic
int x = 5;                    // freed when goes out of scope

// Heap — manual with new/delete
int* p = new int(5);          // allocate
cout << *p << endl;           // use
delete p;                     // MUST free!
p = nullptr;                  // good practice
\`\`\`

## Arrays on the Heap

\`\`\`cpp
int* arr = new int[10];       // allocate array
for (int i=0; i<10; i++) arr[i] = i;
delete[] arr;                  // MUST use delete[] for arrays
\`\`\`

## Memory Leaks

\`\`\`cpp
// LEAK — memory never freed
void leak() {
    int* p = new int(42);
    // forgot delete p;
}

// NO LEAK
void noLeak() {
    int* p = new int(42);
    // ... use p ...
    delete p;
    p = nullptr;
}
\`\`\`

## RAII (Resource Acquisition Is Initialization)

Tie resource lifetime to object lifetime:

\`\`\`cpp
class ManagedArray {
    int* data;
    int  size;
public:
    ManagedArray(int n) : size(n), data(new int[n]) {}
    ~ManagedArray() { delete[] data; }  // auto cleanup!
    int& operator[](int i) { return data[i]; }
};
\`\`\``,
    starterCode:`#include <iostream>
using namespace std;

class DynamicArray {
    int* data;
    int  capacity;
    int  count;

public:
    DynamicArray(int cap = 10)
        : capacity(cap), count(0), data(new int[cap]) {
        cout << "Array created (capacity=" << cap << ")" << endl;
    }

    ~DynamicArray() {
        delete[] data;
        cout << "Array destroyed" << endl;
    }

    void push(int val) {
        if (count < capacity) {
            data[count++] = val;
        } else {
            cout << "Array full!" << endl;
        }
    }

    int  get(int i)  const { return data[i]; }
    int  size()      const { return count; }

    void print() const {
        cout << "[";
        for (int i = 0; i < count; i++) {
            cout << data[i];
            if (i < count-1) cout << ", ";
        }
        cout << "]" << endl;
    }
};

int main() {
    {   // inner scope — array destroyed when block ends
        DynamicArray arr(5);
        arr.push(10);
        arr.push(20);
        arr.push(30);
        arr.push(40);
        arr.push(50);
        arr.push(60);  // should print "Array full!"
        arr.print();
        cout << "Size: " << arr.size() << endl;
    }   // destructor called here automatically

    cout << "\nBack in main — array was cleaned up!" << endl;

    // Raw pointer demo
    int* p = new int(42);
    cout << "\nHeap value: " << *p << endl;
    delete p;
    p = nullptr;
    cout << "Memory freed" << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What is a memory leak?", options:["Using too much stack memory","Allocated heap memory that is never freed","A segmentation fault","Using delete twice"], correct:1, explanation:"A memory leak occurs when heap memory is allocated with new but never freed with delete. The program uses more and more memory over time."},
      {id:"q2", question:"What is the difference between 'delete' and 'delete[]'?", options:["No difference","delete is for objects; delete[] is for arrays allocated with new[]","delete[] is slower","delete[] frees more memory"], correct:1, explanation:"delete is for single objects (new). delete[] is for arrays (new[]). Using the wrong one causes undefined behavior."},
      {id:"q3", question:"What does RAII stand for and what does it mean?", options:["Resource Allocation Is Important","Random Access Iterator Interface","Resource Acquisition Is Initialization — tie resource lifetime to object lifetime","Rapid Application Interface Integration"], correct:2, explanation:"RAII means resources (memory, files, locks) are acquired in constructors and released in destructors, ensuring cleanup happens automatically when objects go out of scope."},
    ],
  },

  {
    id:"cpp-13", courseId:"cpp", order:13, title:"STL: Vectors", duration:"18 min", xpReward:40, language:"cpp",
    theory:`# STL: Vectors

\`std::vector\` is the most commonly used container in C++ — a dynamic array that resizes automatically.

## Basic Usage

\`\`\`cpp
#include <vector>

vector<int> nums = {1, 2, 3, 4, 5};
nums.push_back(6);          // add to end
nums.pop_back();            // remove from end
cout << nums.size() << endl; // 5
cout << nums[0]    << endl;  // 1
cout << nums.front() << endl; // 1
cout << nums.back()  << endl; // 5
\`\`\`

## Iterating

\`\`\`cpp
// Range-based for (preferred)
for (int n : nums) cout << n << " ";

// Iterator
for (auto it = nums.begin(); it != nums.end(); it++) {
    cout << *it << " ";
}

// Index
for (size_t i = 0; i < nums.size(); i++) {
    cout << nums[i] << " ";
}
\`\`\`

## Useful Methods

\`\`\`cpp
nums.insert(nums.begin() + 2, 99);  // insert 99 at index 2
nums.erase(nums.begin() + 2);       // remove element at index 2
nums.clear();                        // remove all elements
nums.empty();                        // true if empty
nums.resize(10, 0);                  // resize to 10, fill with 0
\`\`\`

## 2D Vector

\`\`\`cpp
vector<vector<int>> matrix(3, vector<int>(3, 0));
matrix[1][2] = 5;
\`\`\``,
    starterCode:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    // Basic vector operations
    vector<int> scores;
    scores.push_back(85);
    scores.push_back(92);
    scores.push_back(78);
    scores.push_back(96);
    scores.push_back(88);

    cout << "Scores: ";
    for (int s : scores) cout << s << " ";
    cout << endl;
    cout << "Size: "  << scores.size()  << endl;
    cout << "Front: " << scores.front() << endl;
    cout << "Back: "  << scores.back()  << endl;

    // Sort
    sort(scores.begin(), scores.end());
    cout << "Sorted: ";
    for (int s : scores) cout << s << " ";
    cout << endl;

    // Find
    auto it = find(scores.begin(), scores.end(), 92);
    if (it != scores.end())
        cout << "Found 92 at index: " << it - scores.begin() << endl;

    // 2D vector — multiplication table
    cout << "\nMultiplication table (3x3):" << endl;
    vector<vector<int>> table(3, vector<int>(3));
    for (int i=0; i<3; i++)
        for (int j=0; j<3; j++)
            table[i][j] = (i+1)*(j+1);

    for (auto& row : table) {
        for (int val : row) cout << val << "\t";
        cout << endl;
    }

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What does vector::push_back() do?", options:["Removes last element","Adds element to the front","Adds element to the end","Inserts at a position"], correct:2, explanation:"push_back() appends an element to the end of the vector, automatically resizing if necessary."},
      {id:"q2", question:"How do you remove the last element from a vector?", options:["erase(end())","remove_back()","pop_back()","delete back()"], correct:2, explanation:"pop_back() removes and destroys the last element of the vector, reducing its size by one."},
      {id:"q3", question:"What type does vector::size() return?", options:["int","long","size_t (unsigned)","ptrdiff_t"], correct:2, explanation:"size() returns size_t which is an unsigned integer type. Comparing it with signed int can cause warnings — use size_t or cast when needed."},
    ],
  },

  {
    id:"cpp-14", courseId:"cpp", order:14, title:"STL: Maps & Sets", duration:"18 min", xpReward:40, language:"cpp",
    theory:`# STL: Maps & Sets

## std::map — Key-Value Storage

\`\`\`cpp
#include <map>

map<string, int> ages;
ages["Alice"] = 25;
ages["Bob"]   = 30;
ages.insert({"Charlie", 22});

cout << ages["Alice"] << endl;       // 25
cout << ages.count("Bob") << endl;   // 1 (exists)
cout << ages.count("Dave") << endl;  // 0 (doesn't exist)
\`\`\`

## Iterating a Map

\`\`\`cpp
for (auto& [key, val] : ages) {      // structured bindings C++17
    cout << key << ": " << val << endl;
}
\`\`\`

## std::unordered_map — Faster, No Order

\`\`\`cpp
#include <unordered_map>
unordered_map<string, int> freq;
// O(1) average lookup vs O(log n) for map
\`\`\`

## std::set — Unique Sorted Values

\`\`\`cpp
#include <set>

set<int> s = {5, 3, 1, 4, 2, 3};
// Stored as: {1, 2, 3, 4, 5} — sorted, no duplicates

s.insert(6);
s.erase(3);
cout << s.count(4) << endl;  // 1 (found)
cout << s.size()   << endl;  // 5
\`\`\`

## When to Use Which

| Container | Ordered | Unique Keys | Lookup |
|-----------|---------|-------------|--------|
| map | Yes | Yes | O(log n) |
| unordered_map | No | Yes | O(1) avg |
| set | Yes | Yes | O(log n) |
| unordered_set | No | Yes | O(1) avg |`,
    starterCode:`#include <iostream>
#include <map>
#include <set>
#include <unordered_map>
#include <string>
#include <vector>
using namespace std;

int main() {
    // Word frequency counter
    string text = "the cat sat on the mat the cat";
    unordered_map<string, int> freq;

    // Split and count
    string word;
    for (char c : text + " ") {
        if (c == ' ') {
            if (!word.empty()) { freq[word]++; word = ""; }
        } else word += c;
    }

    cout << "Word frequencies:" << endl;
    for (auto& [w, cnt] : freq)
        cout << "  " << w << ": " << cnt << endl;

    // Sorted map — student grades
    map<string, char> grades = {
        {"Alice","A"}, {"Charlie","B"}, {"Bob","A"},
        {"Diana","C"}, {"Eve","B"}
    };
    cout << "\nStudent grades (sorted):" << endl;
    for (auto& [name, grade] : grades)
        cout << "  " << name << ": " << grade << endl;

    // Set — unique elements
    vector<int> nums = {5,3,1,4,2,3,5,2,1};
    set<int> unique(nums.begin(), nums.end());
    cout << "\nOriginal: ";
    for (int n : nums) cout << n << " ";
    cout << "\nUnique:   ";
    for (int n : unique) cout << n << " ";
    cout << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What is the main difference between map and unordered_map?", options:["map can store more items","map keeps keys sorted; unordered_map is faster with O(1) average lookup","unordered_map requires unique values","map uses less memory"], correct:1, explanation:"map stores keys in sorted order using a red-black tree (O(log n) operations). unordered_map uses a hash table (O(1) average) but has no ordering."},
      {id:"q2", question:"What does set guarantee about its elements?", options:["They are stored in insertion order","They are unique and sorted","They allow duplicates","They are stored in a hash table"], correct:1, explanation:"std::set stores unique elements in sorted order. Duplicate insertions are silently ignored."},
      {id:"q3", question:"How do you safely check if a key exists in a map?", options:["map[key] != null","map.exists(key)","map.count(key) > 0","map.find(key) != nullptr"], correct:2, explanation:"count() returns 1 if the key exists, 0 if not. Using map[key] creates the key with a default value if it doesn't exist — which is usually not what you want."},
    ],
  },

  {
    id:"cpp-15", courseId:"cpp", order:15, title:"STL: Algorithms", duration:"18 min", xpReward:40, language:"cpp",
    theory:`# STL: Algorithms

The \`<algorithm>\` header provides powerful, reusable algorithms that work with any container.

## Sorting

\`\`\`cpp
#include <algorithm>
vector<int> v = {5,2,8,1,9,3};

sort(v.begin(), v.end());              // ascending
sort(v.begin(), v.end(), greater<int>()); // descending

// Custom comparator
sort(v.begin(), v.end(), [](int a, int b){ return a > b; });
\`\`\`

## Searching

\`\`\`cpp
auto it = find(v.begin(), v.end(), 8);
if (it != v.end()) cout << "Found: " << *it << endl;

// Binary search (sorted array only)
bool found = binary_search(v.begin(), v.end(), 5);
\`\`\`

## Counting & Checking

\`\`\`cpp
int cnt = count(v.begin(), v.end(), 3);          // count 3s
bool any = any_of(v.begin(), v.end(), [](int x){ return x > 7; });
bool all = all_of(v.begin(), v.end(), [](int x){ return x > 0; });
\`\`\`

## Transforming

\`\`\`cpp
vector<int> result(v.size());
transform(v.begin(), v.end(), result.begin(),
          [](int x){ return x * 2; });
\`\`\`

## Accumulate

\`\`\`cpp
#include <numeric>
int sum = accumulate(v.begin(), v.end(), 0);
int product = accumulate(v.begin(), v.end(), 1,
                         [](int a, int b){ return a*b; });
\`\`\``,
    starterCode:`#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <string>
using namespace std;

int main() {
    vector<int> nums = {15, 3, 9, 7, 21, 1, 18, 6, 12, 4};

    // Sort
    vector<int> sorted = nums;
    sort(sorted.begin(), sorted.end());
    cout << "Sorted: ";
    for (int n : sorted) cout << n << " ";
    cout << endl;

    // Min, max, sum
    cout << "Min: "  << *min_element(nums.begin(), nums.end()) << endl;
    cout << "Max: "  << *max_element(nums.begin(), nums.end()) << endl;
    cout << "Sum: "  << accumulate(nums.begin(), nums.end(), 0) << endl;

    // Count and check
    cout << "Count > 10: "
         << count_if(nums.begin(), nums.end(), [](int x){ return x > 10; }) << endl;
    cout << "Any > 20:   "
         << any_of(nums.begin(), nums.end(),  [](int x){ return x > 20; }) << endl;
    cout << "All > 0:    "
         << all_of(nums.begin(), nums.end(),  [](int x){ return x > 0;  }) << endl;

    // Transform — square all
    vector<int> squares(nums.size());
    transform(nums.begin(), nums.end(), squares.begin(),
              [](int x){ return x * x; });
    cout << "Squares: ";
    for (int s : squares) cout << s << " ";
    cout << endl;

    // Reverse
    vector<int> rev = sorted;
    reverse(rev.begin(), rev.end());
    cout << "Reversed: ";
    for (int n : rev) cout << n << " ";
    cout << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What does std::transform() do?", options:["Converts types","Applies a function to each element and stores the result","Sorts elements","Removes elements"], correct:1, explanation:"transform() applies a function to each element in a range and stores the results in a destination range."},
      {id:"q2", question:"What does accumulate() do by default?", options:["Multiplies all elements","Finds the maximum","Sums all elements starting from an initial value","Concatenates strings"], correct:2, explanation:"accumulate() (from <numeric>) sums all elements in a range, starting from the initial value you provide as the third argument."},
      {id:"q3", question:"What must be true for binary_search() to work correctly?", options:["The range must have at least 2 elements","The range must be sorted","The range must contain unique elements","The range must be a vector"], correct:1, explanation:"binary_search() requires the range to be sorted in ascending order (or by the comparator you provide). On unsorted data it gives undefined results."},
    ],
  },

  {
    id:"cpp-16", courseId:"cpp", order:16, title:"Templates", duration:"20 min", xpReward:45, language:"cpp",
    theory:`# Templates

Templates let you write **generic code** that works with any data type.

## Function Templates

\`\`\`cpp
template <typename T>
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}

cout << maxOf(3, 7)       << endl;  // 7   (int)
cout << maxOf(3.14, 2.71) << endl;  // 3.14 (double)
cout << maxOf('a', 'z')   << endl;  // z   (char)
\`\`\`

## Multiple Template Parameters

\`\`\`cpp
template <typename T, typename U>
void printPair(T first, U second) {
    cout << first << " : " << second << endl;
}

printPair("Age", 25);
printPair(3.14, "pi");
\`\`\`

## Class Templates

\`\`\`cpp
template <typename T>
class Stack {
    vector<T> data;
public:
    void push(T val)   { data.push_back(val); }
    T    pop()         { T v = data.back(); data.pop_back(); return v; }
    T    top()         { return data.back(); }
    bool empty()       { return data.empty(); }
    int  size()        { return data.size(); }
};

Stack<int>    intStack;
Stack<string> strStack;

intStack.push(1); intStack.push(2);
strStack.push("hello"); strStack.push("world");
\`\`\`

## Template Specialization

\`\`\`cpp
template <typename T>
T absolute(T x) { return (x < 0) ? -x : x; }

// Specialization for string — different behaviour
template <>
string absolute(string s) { return s; }
\`\`\``,
    starterCode:`#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Function template
template <typename T>
T clamp(T value, T minVal, T maxVal) {
    if (value < minVal) return minVal;
    if (value > maxVal) return maxVal;
    return value;
}

// Class template
template <typename T>
class Pair {
public:
    T first, second;
    Pair(T a, T b) : first(a), second(b) {}

    T    min()  const { return (first < second) ? first : second; }
    T    max()  const { return (first > second) ? first : second; }
    void swap()       { T tmp = first; first = second; second = tmp; }

    friend ostream& operator<<(ostream& os, const Pair<T>& p) {
        return os << "(" << p.first << ", " << p.second << ")";
    }
};

// Generic print function
template <typename T>
void printVector(const vector<T>& v, string label="") {
    if (!label.empty()) cout << label << ": ";
    for (const T& item : v) cout << item << " ";
    cout << endl;
}

int main() {
    // Function template
    cout << "clamp(15, 0, 10) = " << clamp(15, 0, 10)     << endl;
    cout << "clamp(5, 0, 10)  = " << clamp(5, 0, 10)      << endl;
    cout << "clamp(3.7, 0.0, 3.0) = " << clamp(3.7,0.0,3.0) << endl;

    // Class template with different types
    Pair<int>    p1(3, 7);
    Pair<double> p2(1.5, 2.8);
    Pair<string> p3("apple", "banana");

    cout << "\np1 = " << p1 << " min=" << p1.min() << " max=" << p1.max() << endl;
    cout << "p2 = " << p2 << " min=" << p2.min() << " max=" << p2.max() << endl;
    cout << "p3 = " << p3 << " min=" << p3.min() << endl;

    p1.swap();
    cout << "p1 after swap: " << p1 << endl;

    // Generic print
    vector<int>    ints    = {1,2,3,4,5};
    vector<string> strings = {"cpp","is","great"};
    printVector(ints,    "Ints");
    printVector(strings, "Strings");

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What is the purpose of templates in C++?", options:["To make code run faster","To write generic code that works with any data type","To create abstract classes","To enable multiple inheritance"], correct:1, explanation:"Templates allow you to write a single function or class that works with any data type, avoiding code duplication."},
      {id:"q2", question:"What keyword introduces a template parameter?", options:["generic","template","type","class only"], correct:1, explanation:"The template keyword followed by <typename T> (or <class T>) declares a template. typename and class are interchangeable in this context."},
      {id:"q3", question:"When does the compiler generate code for a template?", options:["When the template is defined","When the program starts","When the template is instantiated with a specific type","Never — templates are runtime"], correct:2, explanation:"Templates are compiled at instantiation — when you write Stack<int>, the compiler generates a version of the template code specifically for int."},
    ],
  },

  {
    id:"cpp-17", courseId:"cpp", order:17, title:"Exception Handling", duration:"18 min", xpReward:40, language:"cpp",
    theory:`# Exception Handling

Exceptions let you handle errors gracefully without crashing.

## try / catch / throw

\`\`\`cpp
try {
    int age = -5;
    if (age < 0)
        throw invalid_argument("Age cannot be negative");
    cout << "Age: " << age << endl;
}
catch (const invalid_argument& e) {
    cout << "Error: " << e.what() << endl;
}
\`\`\`

## Standard Exceptions

\`\`\`cpp
#include <stdexcept>

throw runtime_error("Something went wrong");
throw out_of_range("Index out of bounds");
throw invalid_argument("Bad argument");
throw overflow_error("Numeric overflow");
\`\`\`

## Catching Multiple Exceptions

\`\`\`cpp
try {
    // risky code
} catch (const out_of_range& e) {
    cout << "Range error: " << e.what() << endl;
} catch (const runtime_error& e) {
    cout << "Runtime error: " << e.what() << endl;
} catch (...) {
    cout << "Unknown error!" << endl;  // catch-all
}
\`\`\`

## Custom Exception Classes

\`\`\`cpp
class InsufficientFunds : public runtime_error {
    double amount;
public:
    InsufficientFunds(double a)
        : runtime_error("Insufficient funds"), amount(a) {}
    double getAmount() const { return amount; }
};

try {
    throw InsufficientFunds(500.0);
} catch (const InsufficientFunds& e) {
    cout << e.what() << " — needed: " << e.getAmount() << endl;
}
\`\`\``,
    starterCode:`#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>
using namespace std;

// Custom exception
class ValidationError : public runtime_error {
    string field;
public:
    ValidationError(string f, string msg)
        : runtime_error(msg), field(f) {}
    string getField() const { return field; }
};

class BankAccount {
    string owner;
    double balance;
public:
    BankAccount(string o, double b) {
        if (b < 0) throw ValidationError("balance", "Initial balance cannot be negative");
        owner = o; balance = b;
    }

    void deposit(double amount) {
        if (amount <= 0) throw invalid_argument("Deposit must be positive");
        balance += amount;
    }

    void withdraw(double amount) {
        if (amount <= 0) throw invalid_argument("Withdrawal must be positive");
        if (amount > balance)
            throw runtime_error("Insufficient funds: need " +
                to_string(amount) + " have " + to_string(balance));
        balance -= amount;
    }

    double getBalance() const { return balance; }
    string getOwner()   const { return owner;   }
};

int main() {
    auto test = [](string label, auto func) {
        cout << label << ": ";
        try { func(); cout << "OK" << endl; }
        catch (const ValidationError& e) { cout << "ValidationError[" << e.getField() << "]: " << e.what() << endl; }
        catch (const exception& e)       { cout << "Exception: " << e.what() << endl; }
    };

    test("Create valid account",   []{ BankAccount a("Alice", 1000); cout << a.getBalance(); });
    test("Create negative balance",[]{ BankAccount a("Bob", -100); });
    test("Valid deposit",          []{ BankAccount a("Alice",500); a.deposit(200); cout << a.getBalance(); });
    test("Invalid deposit",        []{ BankAccount a("Alice",500); a.deposit(-50); });
    test("Valid withdrawal",       []{ BankAccount a("Alice",500); a.withdraw(200); cout << a.getBalance(); });
    test("Overdraft",              []{ BankAccount a("Alice",100); a.withdraw(500); });

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What does e.what() return for a standard exception?", options:["The exception type","A description string of the error","The line number","The error code"], correct:1, explanation:"what() is a virtual method inherited from std::exception that returns a C-string describing the exception."},
      {id:"q2", question:"What does catch(...) do?", options:["Catches only int exceptions","Catches only std::exception types","Catches any exception type","Is a syntax error"], correct:2, explanation:"catch(...) is the catch-all handler — it catches any exception regardless of type. Place it last after more specific handlers."},
      {id:"q3", question:"Which header is needed for standard exceptions like runtime_error?", options:["<exception>","<error>","<stdexcept>","<iostream>"], correct:2, explanation:"<stdexcept> provides standard exception classes like runtime_error, invalid_argument, out_of_range, and overflow_error."},
    ],
  },

  // ── ADVANCED (18–25) ─────────────────────────────────────────────────────

  {
    id:"cpp-18", courseId:"cpp", order:18, title:"Smart Pointers", duration:"20 min", xpReward:50, language:"cpp",
    theory:`# Smart Pointers

Smart pointers are wrappers that automatically manage memory — no manual \`delete\` needed.

## unique_ptr — Single Ownership

\`\`\`cpp
#include <memory>

unique_ptr<int> p = make_unique<int>(42);
cout << *p << endl;   // 42

// Cannot copy — only one owner
// unique_ptr<int> p2 = p;  // ERROR!

// Can move
unique_ptr<int> p2 = move(p);  // p is now null
\`\`\`

## shared_ptr — Shared Ownership

\`\`\`cpp
shared_ptr<int> sp1 = make_shared<int>(99);
shared_ptr<int> sp2 = sp1;   // both point to same object

cout << sp1.use_count() << endl;  // 2 (two owners)
sp1.reset();                       // sp1 releases ownership
cout << sp2.use_count() << endl;  // 1 — only sp2 left
// Object destroyed when last shared_ptr goes out of scope
\`\`\`

## weak_ptr — Non-owning Observer

\`\`\`cpp
shared_ptr<int> sp = make_shared<int>(10);
weak_ptr<int>   wp = sp;   // doesn't increase count

cout << sp.use_count() << endl;  // 1 (weak_ptr doesn't count)

if (auto locked = wp.lock()) {   // safely get shared_ptr
    cout << *locked << endl;
}
\`\`\`

## Smart Pointers with Classes

\`\`\`cpp
class Dog {
public:
    string name;
    Dog(string n) : name(n) { cout << name << " created" << endl; }
    ~Dog()                   { cout << name << " destroyed" << endl; }
};

auto dog = make_unique<Dog>("Rex");
dog->name = "Max";
// Automatically destroyed when dog goes out of scope
\`\`\``,
    starterCode:`#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

class Resource {
    string name;
public:
    Resource(string n) : name(n) {
        cout << "  [+] " << name << " acquired" << endl;
    }
    ~Resource() {
        cout << "  [-] " << name << " released" << endl;
    }
    string getName() const { return name; }
    void use() { cout << "  Using " << name << endl; }
};

void demonstrateUnique() {
    cout << "=== unique_ptr ===" << endl;
    auto r1 = make_unique<Resource>("File");
    r1->use();

    // Transfer ownership
    auto r2 = move(r1);
    cout << "r1 is " << (r1 ? "valid" : "null") << endl;
    r2->use();
    cout << "(r2 goes out of scope)" << endl;
}

void demonstrateShared() {
    cout << "\n=== shared_ptr ===" << endl;
    auto sp1 = make_shared<Resource>("Database");
    cout << "Count: " << sp1.use_count() << endl;
    {
        auto sp2 = sp1;
        auto sp3 = sp1;
        cout << "Count with 3 owners: " << sp1.use_count() << endl;
    }
    cout << "Count after block: " << sp1.use_count() << endl;
}

int main() {
    demonstrateUnique();
    demonstrateShared();
    cout << "\nAll resources cleaned up!" << endl;
    return 0;
}`,
    quiz:[
      {id:"q1", question:"What is the advantage of using smart pointers over raw pointers?", options:["They are faster","They automatically free memory when no longer needed","They use less memory","They work with more types"], correct:1, explanation:"Smart pointers automatically call delete when they go out of scope or ownership is released, preventing memory leaks."},
      {id:"q2", question:"What happens when you try to copy a unique_ptr?", options:["It creates a deep copy","It shares ownership","It causes a compile error","It moves ownership"], correct:2, explanation:"unique_ptr cannot be copied because only one owner is allowed. You must use std::move() to transfer ownership."},
      {id:"q3", question:"What does shared_ptr::use_count() return?", options:["The memory size","The number of shared_ptrs sharing ownership","The pointer address","The reference count minus weak_ptrs"], correct:1, explanation:"use_count() returns the number of shared_ptr objects currently sharing ownership of the managed object."},
    ],
  },

  {
    id:"cpp-19", courseId:"cpp", order:19, title:"Move Semantics", duration:"20 min", xpReward:50, language:"cpp",
    theory:`# Move Semantics

Move semantics (C++11) allow you to **transfer** resources instead of copying them — making code significantly faster.

## lvalue vs rvalue

\`\`\`cpp
int x = 5;   // x is lvalue (has address, can be on left of =)
int y = x+1; // x+1 is rvalue (temporary, no persistent address)
\`\`\`

## The Problem Without Move

\`\`\`cpp
vector<int> createBigVector() {
    vector<int> v(1000000, 0);  // 1M elements
    return v;    // Without move: COPIES 1M elements!
}
\`\`\`

## std::move

\`\`\`cpp
string s1 = "Hello World";
string s2 = move(s1);   // s1's data is MOVED to s2

cout << s2 << endl;     // "Hello World"
cout << s1 << endl;     // "" (s1 is now empty but valid)
\`\`\`

## Move Constructor & Move Assignment

\`\`\`cpp
class Buffer {
    int*   data;
    size_t size;
public:
    // Move constructor
    Buffer(Buffer&& other) noexcept
        : data(other.data), size(other.size) {
        other.data = nullptr;   // leave source in valid state
        other.size = 0;
    }

    // Move assignment
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
};
\`\`\``,
    starterCode:`#include <iostream>
#include <string>
#include <vector>
#include <chrono>
using namespace std;

class HeavyData {
    vector<int> data;
    string      label;
public:
    HeavyData(string l, int size) : label(l), data(size, 0) {
        iota(data.begin(), data.end(), 0);
        cout << "Constructed: " << label << " (" << size << " ints)" << endl;
    }

    // Copy constructor
    HeavyData(const HeavyData& other)
        : label(other.label + "_copy"), data(other.data) {
        cout << "Copied: " << label << endl;
    }

    // Move constructor
    HeavyData(HeavyData&& other) noexcept
        : label(move(other.label)), data(move(other.data)) {
        other.label = "(moved)";
        cout << "Moved: " << label << endl;
    }

    size_t size()        const { return data.size(); }
    string getLabel()    const { return label; }
};

int main() {
    cout << "=== Copy vs Move ===" << endl;

    HeavyData original("Original", 5);
    cout << "\n-- Copying --" << endl;
    HeavyData copied = original;

    cout << "\n-- Moving --" << endl;
    HeavyData moved = std::move(original);

    cout << "\nOriginal label: '" << original.getLabel() << "'" << endl;
    cout << "Copied label:   '" << copied.getLabel()   << "'" << endl;
    cout << "Moved label:    '" << moved.getLabel()    << "'" << endl;

    // std::move with string
    cout << "\n=== std::move with string ===" << endl;
    string s1 = "Hello, World!";
    string s2 = move(s1);
    cout << "s2: '" << s2 << "'" << endl;
    cout << "s1 after move: '" << s1 << "'" << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What does std::move() actually do to the source object?", options:["Deletes it","Copies it","Casts it to an rvalue reference enabling move semantics","Zeroes out its memory"], correct:2, explanation:"std::move() is just a cast — it casts the argument to an rvalue reference, which enables move semantics. The actual moving happens in the move constructor/assignment."},
      {id:"q2", question:"What state should an object be in after it has been moved from?", options:["Deleted","Unchanged","In a valid but unspecified state","Set to all zeros"], correct:2, explanation:"After a move, the source object must be in a valid but unspecified state — you can still destroy it or reassign it, but you shouldn't assume its value."},
      {id:"q3", question:"What is the main benefit of move semantics?", options:["Better syntax","Avoiding expensive deep copies by transferring ownership of resources","Automatic memory management","Thread safety"], correct:1, explanation:"Move semantics allow transferring resources (like heap memory) from one object to another without copying, making operations on large objects significantly faster."},
    ],
  },

  {
    id:"cpp-20", courseId:"cpp", order:20, title:"Lambda Expressions", duration:"18 min", xpReward:45, language:"cpp",
    theory:`# Lambda Expressions

Lambdas are **anonymous functions** defined inline — introduced in C++11.

## Basic Syntax

\`\`\`cpp
[capture](parameters) -> return_type { body }
\`\`\`

\`\`\`cpp
auto square = [](int x) { return x * x; };
cout << square(5) << endl;  // 25
\`\`\`

## Capture Clause

\`\`\`cpp
int base = 10;

auto addBase  = [base](int x)  { return x + base; };   // capture by value
auto addBaseR = [&base](int x) { base += x; };          // capture by reference
auto captAll  = [=](int x)     { return x + base; };    // capture all by value
auto captAllR = [&](int x)     { base += x; };          // capture all by ref
\`\`\`

## Lambdas with STL

\`\`\`cpp
vector<int> v = {5, 2, 8, 1, 9, 3};

// Sort descending
sort(v.begin(), v.end(), [](int a, int b){ return a > b; });

// Filter (copy_if)
vector<int> evens;
copy_if(v.begin(), v.end(), back_inserter(evens),
        [](int x){ return x % 2 == 0; });

// Transform
transform(v.begin(), v.end(), v.begin(),
          [](int x){ return x * 2; });
\`\`\`

## Storing Lambdas

\`\`\`cpp
#include <functional>
function<int(int)> doubler = [](int x) { return x * 2; };
\`\`\``,
    starterCode:`#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
#include <numeric>
using namespace std;

int main() {
    vector<int> nums = {15, 3, 9, 22, 7, 18, 1, 11, 6, 14};

    // Sort with lambda
    auto sorted = nums;
    sort(sorted.begin(), sorted.end(), [](int a, int b){ return a < b; });
    cout << "Sorted: ";
    for (int n : sorted) cout << n << " ";
    cout << endl;

    // Capture by value
    int threshold = 10;
    auto bigNums = [threshold](const vector<int>& v) {
        vector<int> result;
        copy_if(v.begin(), v.end(), back_inserter(result),
                [threshold](int x){ return x > threshold; });
        return result;
    }(nums);
    cout << "Numbers > " << threshold << ": ";
    for (int n : bigNums) cout << n << " ";
    cout << endl;

    // Capture by reference — modify external state
    int sumAbove = 0;
    for_each(nums.begin(), nums.end(), [&sumAbove, threshold](int x){
        if (x > threshold) sumAbove += x;
    });
    cout << "Sum of numbers > " << threshold << ": " << sumAbove << endl;

    // Store lambda in function<>
    function<string(int)> classify = [](int x) -> string {
        if (x < 5)  return "small";
        if (x < 15) return "medium";
        return "large";
    };
    cout << "\nClassifications:" << endl;
    for (int n : {1, 8, 20}) {
        cout << "  " << n << " -> " << classify(n) << endl;
    }

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What does [=] in a lambda capture clause mean?", options:["Capture nothing","Capture all local variables by reference","Capture all local variables by value","Equality comparison"], correct:2, explanation:"[=] captures all local variables by value — a copy is made at the point the lambda is created."},
      {id:"q2", question:"What does [&] in a lambda capture clause mean?", options:["Capture nothing","Capture all local variables by reference","Bitwise AND","Capture only the first variable"], correct:1, explanation:"[&] captures all local variables by reference — the lambda can read and modify the original variables."},
      {id:"q3", question:"What header do you need to store a lambda in a named variable with any signature?", options:["<lambda>","<functional>","<algorithm>","<memory>"], correct:1, explanation:"std::function from <functional> can store any callable (lambda, function pointer, functor) with a specified signature like function<int(int,int)>."},
    ],
  },

  {
    id:"cpp-21", courseId:"cpp", order:21, title:"File I/O", duration:"18 min", xpReward:40, language:"cpp",
    theory:`# File I/O

C++ provides file streams for reading and writing files.

## Writing to a File

\`\`\`cpp
#include <fstream>

ofstream outFile("output.txt");
if (outFile.is_open()) {
    outFile << "Hello, File!" << endl;
    outFile << 42 << endl;
    outFile.close();
}
\`\`\`

## Reading from a File

\`\`\`cpp
ifstream inFile("output.txt");
string line;
while (getline(inFile, line)) {
    cout << line << endl;
}
inFile.close();
\`\`\`

## Appending

\`\`\`cpp
ofstream appFile("log.txt", ios::app);  // append mode
appFile << "New log entry" << endl;
\`\`\`

## Binary Files

\`\`\`cpp
struct Student {
    char   name[50];
    int    age;
    double gpa;
};

Student s = {"Alice", 20, 3.85};

// Write binary
ofstream bin("students.bin", ios::binary);
bin.write(reinterpret_cast<char*>(&s), sizeof(s));

// Read binary
Student s2;
ifstream binIn("students.bin", ios::binary);
binIn.read(reinterpret_cast<char*>(&s2), sizeof(s2));
cout << s2.name << " " << s2.age << " " << s2.gpa << endl;
\`\`\`

## File Position

\`\`\`cpp
inFile.seekg(0, ios::beg);   // go to beginning
inFile.seekg(0, ios::end);   // go to end
inFile.tellg();              // current position
\`\`\``,
    starterCode:`#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <sstream>
using namespace std;

struct Student {
    string name;
    int    age;
    double gpa;
    string toString() const {
        return name + "," + to_string(age) + "," + to_string(gpa);
    }
};

// Simulate writing and reading CSV
void demonstrateFileIO() {
    // Use stringstream to simulate file content (browser-safe)
    stringstream file;

    // Write header and data
    file << "name,age,gpa\n";
    vector<Student> students = {
        {"Alice", 20, 3.85}, {"Bob", 22, 3.42},
        {"Charlie", 21, 3.91}, {"Diana", 23, 3.67}
    };
    for (const auto& s : students)
        file << s.toString() << "\n";

    cout << "=== Written CSV ===" << endl;
    cout << file.str();

    // Read it back
    cout << "\n=== Parsed Students ===" << endl;
    file.seekg(0);
    string line;
    getline(file, line); // skip header

    vector<Student> loaded;
    while (getline(file, line)) {
        stringstream ss(line);
        string name, ageStr, gpaStr;
        getline(ss, name,   ',');
        getline(ss, ageStr, ',');
        getline(ss, gpaStr, ',');
        loaded.push_back({name, stoi(ageStr), stod(gpaStr)});
    }

    for (const auto& s : loaded) {
        cout << "Name: " << s.name
             << " | Age: " << s.age
             << " | GPA: " << s.gpa << endl;
    }

    // Stats
    double avgGpa = 0;
    for (const auto& s : loaded) avgGpa += s.gpa;
    cout << "\nAverage GPA: " << avgGpa/loaded.size() << endl;
}

int main() {
    demonstrateFileIO();
    return 0;
}`,
    quiz:[
      {id:"q1", question:"Which class is used to write to a file in C++?", options:["ifstream","fstream","ofstream","wstream"], correct:2, explanation:"ofstream (output file stream) is used for writing. ifstream for reading. fstream for both read and write."},
      {id:"q2", question:"What does ios::app do when opening a file?", options:["Appends to end of file instead of overwriting","Opens in binary mode","Creates a new file","Locks the file"], correct:0, explanation:"ios::app (append mode) positions the write pointer at the end of the file so new data is added without overwriting existing content."},
      {id:"q3", question:"What does getline(file, line) do?", options:["Reads a single character","Reads the whole file","Reads one line including spaces until newline","Reads a word"], correct:2, explanation:"getline() reads an entire line (including spaces) from the stream until it encounters a newline character or EOF."},
    ],
  },

  {
    id:"cpp-22", courseId:"cpp", order:22, title:"Multithreading", duration:"20 min", xpReward:50, language:"cpp",
    theory:`# Multithreading

C++11 introduced \`<thread>\` for running code concurrently.

## Creating Threads

\`\`\`cpp
#include <thread>

void task(string name) {
    cout << "Thread " << name << " running" << endl;
}

int main() {
    thread t1(task, "A");
    thread t2(task, "B");

    t1.join();   // wait for t1 to finish
    t2.join();   // wait for t2 to finish
    return 0;
}
\`\`\`

## Thread with Lambda

\`\`\`cpp
thread t([](){
    for (int i = 0; i < 5; i++)
        cout << i << " ";
});
t.join();
\`\`\`

## Mutex — Preventing Race Conditions

\`\`\`cpp
#include <mutex>

mutex mtx;
int   counter = 0;

void increment() {
    for (int i = 0; i < 1000; i++) {
        lock_guard<mutex> lock(mtx);   // auto-unlock
        counter++;
    }
}

thread t1(increment), t2(increment);
t1.join(); t2.join();
cout << counter << endl;   // always 2000
\`\`\`

## Thread Safety

Without a mutex, concurrent access to shared data causes **race conditions** — unpredictable results because threads interleave.

\`\`\`cpp
// UNSAFE — race condition
counter++;   // read-modify-write is NOT atomic!

// SAFE — protected by mutex
lock_guard<mutex> lock(mtx);
counter++;
\`\`\``,
    starterCode:`#include <iostream>
#include <thread>
#include <mutex>
#include <vector>
#include <chrono>
using namespace std;

mutex printMtx;

void safeprint(const string& msg) {
    lock_guard<mutex> lock(printMtx);
    cout << msg << endl;
}

// Worker function
void worker(int id, int workMs) {
    safeprint("Thread " + to_string(id) + " started");
    this_thread::sleep_for(chrono::milliseconds(workMs));
    safeprint("Thread " + to_string(id) + " done (" + to_string(workMs) + "ms)");
}

// Shared counter demo
mutex counterMtx;
int   sharedCounter = 0;

void incrementCounter(int times) {
    for (int i = 0; i < times; i++) {
        lock_guard<mutex> lock(counterMtx);
        sharedCounter++;
    }
}

int main() {
    // Run threads concurrently
    cout << "=== Concurrent Workers ===" << endl;
    auto start = chrono::high_resolution_clock::now();

    vector<thread> threads;
    int workloads[] = {100, 50, 150, 80};

    for (int i = 0; i < 4; i++)
        threads.emplace_back(worker, i+1, workloads[i]);

    for (auto& t : threads) t.join();

    auto end = chrono::high_resolution_clock::now();
    auto ms  = chrono::duration_cast<chrono::milliseconds>(end-start).count();
    cout << "All done in " << ms << "ms (longest was 150ms)" << endl;

    // Thread-safe counter
    cout << "\n=== Thread-Safe Counter ===" << endl;
    vector<thread> counters;
    for (int i = 0; i < 4; i++)
        counters.emplace_back(incrementCounter, 1000);
    for (auto& t : counters) t.join();

    cout << "Final counter: " << sharedCounter
         << " (expected 4000)" << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What does thread::join() do?", options:["Creates a new thread","Pauses the current thread","Waits for the thread to complete before continuing","Kills the thread"], correct:2, explanation:"join() blocks the calling thread until the joined thread finishes execution. A thread must be either joined or detached before it's destroyed."},
      {id:"q2", question:"What is a race condition?", options:["Two threads competing for CPU time","Unpredictable behavior when multiple threads access shared data without synchronization","A deadlock","A thread running too fast"], correct:1, explanation:"A race condition occurs when the result depends on the relative timing of threads accessing shared data. Without synchronization, threads can read/write in any order."},
      {id:"q3", question:"What does lock_guard<mutex> do?", options:["Creates a new mutex","Locks a mutex and automatically unlocks it when it goes out of scope","Permanently locks a mutex","Tries to lock without blocking"], correct:1, explanation:"lock_guard is a RAII wrapper that locks the mutex on construction and automatically unlocks it when destroyed (when it goes out of scope), preventing forgotten unlocks."},
    ],
  },

  {
    id:"cpp-23", courseId:"cpp", order:23, title:"Data Structures: Linked List", duration:"22 min", xpReward:50, language:"cpp",
    theory:`# Data Structures: Linked List

A linked list is a sequence of **nodes**, each containing data and a pointer to the next node.

## Node Class

\`\`\`cpp
class Node {
public:
    int   data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};
\`\`\`

## LinkedList Class

\`\`\`cpp
class LinkedList {
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    void pushFront(int data) {
        Node* node = new Node(data);
        node->next = head;
        head = node;
    }

    void pushBack(int data) {
        Node* node = new Node(data);
        if (!head) { head = node; return; }
        Node* cur = head;
        while (cur->next) cur = cur->next;
        cur->next = node;
    }

    void print() {
        Node* cur = head;
        while (cur) {
            cout << cur->data << " -> ";
            cur = cur->next;
        }
        cout << "NULL" << endl;
    }

    ~LinkedList() {  // prevent memory leak
        while (head) {
            Node* tmp = head;
            head = head->next;
            delete tmp;
        }
    }
};
\`\`\``,
    starterCode:`#include <iostream>
using namespace std;

class Node {
public:
    int   data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LinkedList {
    Node* head;
    int   count;
public:
    LinkedList() : head(nullptr), count(0) {}

    void pushBack(int data) {
        Node* node = new Node(data);
        if (!head) { head = node; }
        else {
            Node* cur = head;
            while (cur->next) cur = cur->next;
            cur->next = node;
        }
        count++;
    }

    void pushFront(int data) {
        Node* node = new Node(data);
        node->next = head;
        head = node;
        count++;
    }

    bool remove(int data) {
        if (!head) return false;
        if (head->data == data) {
            Node* tmp = head;
            head = head->next;
            delete tmp; count--;
            return true;
        }
        Node* cur = head;
        while (cur->next) {
            if (cur->next->data == data) {
                Node* tmp = cur->next;
                cur->next = tmp->next;
                delete tmp; count--;
                return true;
            }
            cur = cur->next;
        }
        return false;
    }

    void reverse() {
        Node *prev=nullptr, *cur=head, *next=nullptr;
        while (cur) {
            next = cur->next;
            cur->next = prev;
            prev = cur;
            cur  = next;
        }
        head = prev;
    }

    void print() {
        Node* cur = head;
        while (cur) { cout << cur->data; if(cur->next)cout<<"->"; cur=cur->next; }
        cout << " (size=" << count << ")" << endl;
    }

    ~LinkedList() {
        while (head) { Node* t=head; head=head->next; delete t; }
    }
};

int main() {
    LinkedList list;
    for (int v : {10,20,30,40,50}) list.pushBack(v);
    cout << "Initial:  "; list.print();

    list.pushFront(5);
    cout << "PushFront(5): "; list.print();

    list.remove(30);
    cout << "Remove(30): "; list.print();

    list.reverse();
    cout << "Reversed: "; list.print();

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What is the time complexity of inserting at the front of a linked list?", options:["O(n)","O(log n)","O(1)","O(n²)"], correct:2, explanation:"Inserting at the front is O(1) — just create a new node, point it to the current head, and update head. No traversal needed."},
      {id:"q2", question:"Why must we implement a destructor for a linked list?", options:["To sort the list","To prevent memory leaks by deleting all nodes","To reset the head pointer","C++ requires it for all classes"], correct:1, explanation:"Without a destructor, all dynamically allocated nodes (created with new) would leak when the list object is destroyed. The destructor traverses and deletes each node."},
      {id:"q3", question:"What is the time complexity of searching for an element in an unsorted linked list?", options:["O(1)","O(log n)","O(n)","O(n log n)"], correct:2, explanation:"To find an element you must traverse from the head, potentially visiting all n nodes — O(n) linear time."},
    ],
  },

  {
    id:"cpp-24", courseId:"cpp", order:24, title:"Data Structures: Stack & Queue", duration:"20 min", xpReward:50, language:"cpp",
    theory:`# Data Structures: Stack & Queue

## Stack — LIFO (Last In, First Out)

\`\`\`cpp
template <typename T>
class Stack {
    vector<T> data;
public:
    void push(T val)    { data.push_back(val);  }
    void pop()          { data.pop_back();        }
    T    top()    const { return data.back();     }
    bool empty()  const { return data.empty();    }
    int  size()   const { return data.size();     }
};

Stack<int> s;
s.push(1); s.push(2); s.push(3);
cout << s.top() << endl;  // 3
s.pop();
cout << s.top() << endl;  // 2
\`\`\`

## Queue — FIFO (First In, First Out)

\`\`\`cpp
#include <deque>

template <typename T>
class Queue {
    deque<T> data;
public:
    void enqueue(T val) { data.push_back(val);   }
    void dequeue()      { data.pop_front();       }
    T    front()  const { return data.front();    }
    bool empty()  const { return data.empty();    }
    int  size()   const { return data.size();     }
};
\`\`\`

## STL Stack and Queue

C++ STL provides ready-made containers:

\`\`\`cpp
#include <stack>
#include <queue>

stack<int>  stl_stack;
queue<int>  stl_queue;

stl_stack.push(1); stl_stack.top(); stl_stack.pop();
stl_queue.push(1); stl_queue.front(); stl_queue.pop();
\`\`\`

## Real-World Uses

- Stack: undo/redo, expression evaluation, backtracking, call stack
- Queue: task scheduling, BFS, print queue, request handling`,
    starterCode:`#include <iostream>
#include <stack>
#include <queue>
#include <string>
using namespace std;

// Use stack to check balanced brackets
bool isBalanced(const string& expr) {
    stack<char> s;
    for (char c : expr) {
        if (c=='(' || c=='[' || c=='{') s.push(c);
        else if (c==')' || c==']' || c=='}') {
            if (s.empty()) return false;
            char top = s.top(); s.pop();
            if ((c==')' && top!='(') ||
                (c==']' && top!='[') ||
                (c=='}' && top!='{')) return false;
        }
    }
    return s.empty();
}

// Simulate a print queue
void simulatePrintQueue() {
    queue<string> printQueue;
    cout << "\n=== Print Queue ===" << endl;

    // Submit jobs
    for (string job : {"Report.pdf","Photo.jpg","Invoice.pdf","Memo.txt"}) {
        printQueue.push(job);
        cout << "Queued: " << job << endl;
    }

    // Process jobs
    cout << "\nPrinting:" << endl;
    while (!printQueue.empty()) {
        cout << "  Printing: " << printQueue.front() << endl;
        printQueue.pop();
    }
}

int main() {
    // Balanced brackets
    cout << "=== Balanced Brackets ===" << endl;
    vector<string> tests = {"(())", "([{}])", "(()", "([)]", "{[]()}"};
    for (const string& t : tests)
        cout << "'" << t << "': " << (isBalanced(t) ? "balanced" : "unbalanced") << endl;

    simulatePrintQueue();

    // STL stack demo
    cout << "\n=== Stack (Reverse a string) ===" << endl;
    string word = "C++Rocks";
    stack<char> charStack;
    for (char c : word) charStack.push(c);
    string reversed;
    while (!charStack.empty()) {
        reversed += charStack.top();
        charStack.pop();
    }
    cout << "Original: " << word     << endl;
    cout << "Reversed: " << reversed << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What principle does a Stack follow?", options:["FIFO","FILO","LIFO","Round Robin"], correct:2, explanation:"Stack follows LIFO — Last In, First Out. The most recently pushed element is the first one popped."},
      {id:"q2", question:"Why is std::deque preferred over std::vector for implementing a Queue?", options:["deque uses less memory","deque has O(1) push_back AND pop_front; vector's pop_front is O(n)","deque is always faster","deque supports sorting"], correct:1, explanation:"vector::erase at the front (pop_front) is O(n) because all elements shift. deque is designed for efficient insertions/deletions at both ends — O(1)."},
      {id:"q3", question:"What is a practical use case for a Stack?", options:["Task scheduling","BFS graph traversal","Undo/redo functionality","Round-robin processing"], correct:2, explanation:"Undo/redo uses a stack — each action is pushed, undoing pops the last action. This is naturally LIFO behavior."},
    ],
  },

  {
    id:"cpp-25", courseId:"cpp", order:25, title:"Modern C++ Best Practices", duration:"20 min", xpReward:50, language:"cpp",
    theory:`# Modern C++ Best Practices

Modern C++ (C++11/14/17/20) is safer, faster, and more expressive.

## auto — Type Deduction

\`\`\`cpp
auto x     = 42;                    // int
auto pi    = 3.14;                  // double
auto it    = v.begin();             // iterator
auto& ref  = someObject;            // reference
const auto& cref = someObject;      // const reference
\`\`\`

## Range-based for

\`\`\`cpp
for (const auto& item : container) { /* read */ }
for (auto& item : container)        { /* modify */ }
\`\`\`

## Structured Bindings (C++17)

\`\`\`cpp
map<string,int> m = {{"a",1},{"b",2}};
for (const auto& [key, val] : m) {
    cout << key << "=" << val << endl;
}

auto [min, max] = minmax({3,1,4,1,5});
\`\`\`

## constexpr — Compile-time Constants

\`\`\`cpp
constexpr double PI      = 3.14159265358979;
constexpr int    MAX_SIZE = 100;

constexpr int factorial(int n) {
    return (n <= 1) ? 1 : n * factorial(n-1);
}
constexpr int fact5 = factorial(5);  // computed at compile time!
\`\`\`

## nullptr over NULL

\`\`\`cpp
// Old style — avoid
int* p = NULL;

// Modern — prefer
int* p = nullptr;
\`\`\`

## Prefer Algorithms over Raw Loops

\`\`\`cpp
// Old
int sum = 0;
for (int i = 0; i < v.size(); i++) sum += v[i];

// Modern
int sum = accumulate(v.begin(), v.end(), 0);

// Even more modern (C++20 ranges)
// auto sum = ranges::fold_left(v, 0, plus{});
\`\`\``,
    starterCode:`#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
#include <numeric>
#include <memory>
#include <optional>
using namespace std;

// constexpr function
constexpr long long power(long long base, int exp) {
    return (exp == 0) ? 1 : base * power(base, exp-1);
}

// Optional return (C++17) — better than returning -1 for "not found"
optional<int> findFirst(const vector<int>& v, int target) {
    for (int i = 0; i < (int)v.size(); i++)
        if (v[i] == target) return i;
    return nullopt;
}

int main() {
    // auto type deduction
    auto nums    = vector<int>{5,2,8,1,9,3,7,4,6};
    auto strings = vector<string>{"cpp","modern","best","practices"};

    // Range-for with const auto&
    cout << "=== Sorted Strings ===" << endl;
    sort(strings.begin(), strings.end());
    for (const auto& s : strings) cout << s << " ";
    cout << endl;

    // Structured bindings
    cout << "\n=== Structured Bindings ===" << endl;
    map<string,int> scores = {{"Alice",95},{"Bob",82},{"Charlie",91}};
    for (const auto& [name, score] : scores)
        cout << name << ": " << score << endl;

    // constexpr
    cout << "\n=== constexpr ===" << endl;
    constexpr long long val = power(2, 10);
    cout << "2^10 = " << val << " (compile-time)" << endl;

    // optional
    cout << "\n=== Optional ===" << endl;
    auto idx1 = findFirst(nums, 9);
    auto idx2 = findFirst(nums, 99);
    cout << "Find 9:  " << (idx1 ? "found at " + to_string(*idx1) : "not found") << endl;
    cout << "Find 99: " << (idx2 ? "found at " + to_string(*idx2) : "not found") << endl;

    // Smart pointer + algorithm
    cout << "\n=== Modern Resource Management ===" << endl;
    auto data = make_unique<vector<int>>(nums);
    sort(data->begin(), data->end());
    int sum = accumulate(data->begin(), data->end(), 0);
    cout << "Sum: " << sum << " | Max: " << data->back() << endl;

    return 0;
}`,
    quiz:[
      {id:"q1", question:"What is constexpr used for?", options:["Runtime constants only","Values and functions computed at compile time","Making variables thread-safe","Preventing copy construction"], correct:1, explanation:"constexpr declares that a value or function can be evaluated at compile time, enabling zero-cost abstractions and compile-time computation."},
      {id:"q2", question:"What does std::optional<T> represent?", options:["A pointer to T","A value that may or may not be present","A nullable reference","A thread-safe value"], correct:1, explanation:"std::optional<T> represents an optional value — it either contains a T or is empty (nullopt). It's safer than using -1 or nullptr as sentinel values."},
      {id:"q3", question:"What is the benefit of structured bindings in C++17?", options:["Faster code","Ability to unpack pairs/tuples/structs directly into named variables","Better memory usage","Automatic type conversion"], correct:1, explanation:"Structured bindings allow auto [a, b] = pair; syntax to unpack compound objects into individual named variables, making code cleaner especially with map iteration."},
    ],
  },
];

// ── DAILY CHALLENGES ──────────────────────────────────────────────────────────

function dateStr(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

const challenges = [
  { title:"Reverse a String in C++", description:"Write a function that takes a std::string and returns it reversed without using any STL reverse algorithms.", language:"cpp", difficulty:"Easy", xpReward:75, starterCode:`#include <iostream>\n#include <string>\nusing namespace std;\n\nstring reverseStr(string s) {\n    // Write your solution\n    return "";\n}\n\nint main() {\n    cout << reverseStr("Hello")    << endl; // olleH\n    cout << reverseStr("C++")      << endl; // ++C\n    cout << reverseStr("racecar")  << endl; // racecar\n    return 0;\n}`, hint:"Use two pointers — one at the start and one at the end — swapping characters as they move toward the center." },
  { title:"Count Vowels in C++", description:"Write a function that counts the number of vowels (a,e,i,o,u — case insensitive) in a given string.", language:"cpp", difficulty:"Easy", xpReward:75, starterCode:`#include <iostream>\n#include <string>\nusing namespace std;\n\nint countVowels(string s) {\n    // Write your solution\n    return 0;\n}\n\nint main() {\n    cout << countVowels("Hello World") << endl; // 3\n    cout << countVowels("AEIOU")       << endl; // 5\n    cout << countVowels("rhythm")      << endl; // 0\n    return 0;\n}`, hint:"Convert each character to lowercase and check if it's in the string \"aeiou\"." },
  { title:"Sum of Digits", description:"Write a C++ function that takes an integer and returns the sum of its digits.", language:"cpp", difficulty:"Easy", xpReward:75, starterCode:`#include <iostream>\nusing namespace std;\n\nint digitSum(int n) {\n    n = abs(n);\n    // Write your solution\n    return 0;\n}\n\nint main() {\n    cout << digitSum(12345) << endl; // 15\n    cout << digitSum(999)   << endl; // 27\n    cout << digitSum(0)     << endl; // 0\n    return 0;\n}`, hint:"Repeatedly take n % 10 to get the last digit, add it to sum, then do n /= 10 to remove it." },
  { title:"Check Palindrome", description:"Write a C++ function that checks if a string is a palindrome (reads the same forwards and backwards), ignoring spaces and case.", language:"cpp", difficulty:"Easy", xpReward:75, starterCode:`#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // Write your solution\n    return false;\n}\n\nint main() {\n    cout << isPalindrome("racecar")              << endl; // 1\n    cout << isPalindrome("hello")                << endl; // 0\n    cout << isPalindrome("A man a plan a canal Panama") << endl; // 1\n    return 0;\n}`, hint:"Remove spaces, convert to lowercase, then compare the string with its reverse." },
  { title:"FizzBuzz in C++", description:"Print numbers 1 to 50. For multiples of 3 print Fizz, multiples of 5 print Buzz, both print FizzBuzz. Return result as a vector of strings.", language:"cpp", difficulty:"Easy", xpReward:75, starterCode:`#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> fizzBuzz(int n) {\n    // Write your solution\n    return {};\n}\n\nint main() {\n    auto result = fizzBuzz(20);\n    for (const auto& s : result)\n        cout << s << endl;\n    return 0;\n}`, hint:"Check divisibility by 15 first (FizzBuzz), then 3 (Fizz), then 5 (Buzz), else convert number to string." },
  { title:"Find Max in Array", description:"Write a C++ function that finds the maximum value in a vector of integers without using std::max_element.", language:"cpp", difficulty:"Easy", xpReward:75, starterCode:`#include <iostream>\n#include <vector>\nusing namespace std;\n\nint findMax(const vector<int>& nums) {\n    // Write your solution\n    return 0;\n}\n\nint main() {\n    cout << findMax({3,1,9,2,7})    << endl; // 9\n    cout << findMax({-5,-1,-3})     << endl; // -1\n    cout << findMax({42})           << endl; // 42\n    return 0;\n}`, hint:"Start with the first element as max, then loop through comparing each element." },
  { title:"Count Words in a String", description:"Write a C++ function that counts the number of words in a string. Words are separated by one or more spaces.", language:"cpp", difficulty:"Easy", xpReward:75, starterCode:`#include <iostream>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nint countWords(const string& s) {\n    // Write your solution\n    return 0;\n}\n\nint main() {\n    cout << countWords("Hello World")          << endl; // 2\n    cout << countWords("  spaces   between  ") << endl; // 2\n    cout << countWords("one")                  << endl; // 1\n    cout << countWords("")                     << endl; // 0\n    return 0;\n}`, hint:"Use a stringstream and extract words with >>. Each successful extraction is one word." },
  { title:"Bubble Sort Implementation", description:"Implement the bubble sort algorithm in C++ to sort a vector of integers in ascending order.", language:"cpp", difficulty:"Easy", xpReward:75, starterCode:`#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid bubbleSort(vector<int>& arr) {\n    // Write your solution\n}\n\nint main() {\n    vector<int> v = {64,34,25,12,22,11,90};\n    bubbleSort(v);\n    for (int n : v) cout << n << " ";\n    cout << endl; // 11 12 22 25 34 64 90\n    return 0;\n}`, hint:"Use two nested loops. The inner loop compares adjacent elements and swaps them if out of order. After each pass, the largest unsorted element is in its place." },
  { title:"Implement a Generic Stack", description:"Implement a template Stack class with push(), pop(), top(), isEmpty(), and size() methods.", language:"cpp", difficulty:"Medium", xpReward:100, starterCode:`#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\ntemplate <typename T>\nclass Stack {\n    // Write your implementation\npublic:\n    void push(T val) {}\n    void pop()       {}\n    T    top()       { return T{}; }\n    bool isEmpty()   { return true; }\n    int  size()      { return 0; }\n};\n\nint main() {\n    Stack<int> s;\n    s.push(1); s.push(2); s.push(3);\n    cout << s.top()  << endl; // 3\n    cout << s.size() << endl; // 3\n    s.pop();\n    cout << s.top()  << endl; // 2\n\n    Stack<string> ss;\n    ss.push("hello"); ss.push("world");\n    cout << ss.top() << endl; // world\n    return 0;\n}`, hint:"Use a private std::vector<T> as the underlying storage. push uses push_back, pop uses pop_back, top returns back()." },
  { title:"Matrix Multiplication", description:"Write a C++ function that multiplies two n×n matrices represented as 2D vectors.", language:"cpp", difficulty:"Medium", xpReward:100, starterCode:`#include <iostream>\n#include <vector>\nusing namespace std;\n\nusing Matrix = vector<vector<int>>;\n\nMatrix multiply(const Matrix& A, const Matrix& B) {\n    // Write your solution\n    return {};\n}\n\nvoid printMatrix(const Matrix& m) {\n    for (const auto& row : m) {\n        for (int v : row) cout << v << "\\t";\n        cout << endl;\n    }\n}\n\nint main() {\n    Matrix A = {{1,2},{3,4}};\n    Matrix B = {{5,6},{7,8}};\n    printMatrix(multiply(A, B));\n    // Expected: 19 22 / 43 50\n    return 0;\n}`, hint:"For result[i][j], sum the products of row i from A and column j from B: result[i][j] += A[i][k] * B[k][j] for each k." },
  { title:"Binary Search Tree Insert & Search", description:"Implement a BST class with insert() and search() methods. insert adds a value; search returns true if the value exists.", language:"cpp", difficulty:"Medium", xpReward:100, starterCode:`#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int   val;\n    Node* left  = nullptr;\n    Node* right = nullptr;\n    Node(int v) : val(v) {}\n};\n\nclass BST {\n    Node* root = nullptr;\n    // Add helper methods as needed\npublic:\n    void insert(int val) {}\n    bool search(int val) { return false; }\n};\n\nint main() {\n    BST tree;\n    for (int v : {5,3,7,1,4,6,8}) tree.insert(v);\n    cout << tree.search(4)  << endl; // 1\n    cout << tree.search(9)  << endl; // 0\n    cout << tree.search(1)  << endl; // 1\n    cout << tree.search(10) << endl; // 0\n    return 0;\n}`, hint:"For insert: if val < node->val go left, else go right. Create a new node when you reach nullptr. Search follows the same logic returning true on a match." },
  { title:"Sort by Custom Comparator", description:"Given a vector of strings, sort them by length (shortest first). If two strings have the same length, sort alphabetically.", language:"cpp", difficulty:"Medium", xpReward:100, starterCode:`#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nvector<string> sortByLength(vector<string> words) {\n    // Write your solution using std::sort with a custom comparator\n    return words;\n}\n\nint main() {\n    auto r = sortByLength({"banana","apple","kiwi","fig","cherry","date","pear"});\n    for (const auto& w : r) cout << w << endl;\n    // fig, date, kiwi, pear, apple, banana, cherry\n    return 0;\n}`, hint:"Pass a lambda to std::sort. Return true if a should come before b. Compare lengths first, and if equal, compare alphabetically with <." },
  { title:"Unique Elements Using Set", description:"Write a C++ function that takes a vector of integers and returns a new vector containing only the unique elements, preserving their first appearance order.", language:"cpp", difficulty:"Medium", xpReward:100, starterCode:`#include <iostream>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nvector<int> uniqueElements(const vector<int>& nums) {\n    // Write your solution\n    return {};\n}\n\nint main() {\n    auto r = uniqueElements({1,2,3,2,1,4,3,5});\n    for (int n : r) cout << n << " ";\n    cout << endl; // 1 2 3 4 5\n    return 0;\n}`, hint:"Use an unordered_set to track seen elements. For each element, only add it to the result vector if it's not in the set yet." },
  { title:"Word Frequency Map", description:"Write a C++ function that takes a sentence and returns a map<string,int> with each word as a key and its frequency as the value (case-insensitive).", language:"cpp", difficulty:"Medium", xpReward:100, starterCode:`#include <iostream>\n#include <map>\n#include <string>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nmap<string,int> wordFrequency(const string& sentence) {\n    // Write your solution\n    return {};\n}\n\nint main() {\n    auto freq = wordFrequency("the cat sat on the mat the cat");\n    for (const auto& [w,c] : freq)\n        cout << w << ": " << c << endl;\n    return 0;\n}`, hint:"Use a stringstream to split words. Convert each word to lowercase with transform+tolower. Then use map[word]++ to count." },
  { title:"Implement shared_ptr Reference Counting", description:"Implement a simple SharedPtr<T> class that mimics std::shared_ptr — with a reference count, automatic deletion when count reaches zero, copy/move semantics.", language:"cpp", difficulty:"Hard", xpReward:150, starterCode:`#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nclass SharedPtr {\n    T*   ptr   = nullptr;\n    int* count = nullptr;\n\npublic:\n    explicit SharedPtr(T* p = nullptr) {\n        // Initialize ptr and count\n    }\n\n    SharedPtr(const SharedPtr& other) {\n        // Copy — increment count\n    }\n\n    ~SharedPtr() {\n        // Decrement count, delete if zero\n    }\n\n    T& operator*()  const { return *ptr;  }\n    T* operator->() const { return ptr;   }\n    int useCount()  const { return count ? *count : 0; }\n};\n\nint main() {\n    SharedPtr<int> sp1(new int(42));\n    cout << *sp1 << " count=" << sp1.useCount() << endl; // 42 count=1\n    {\n        SharedPtr<int> sp2 = sp1;\n        cout << "count=" << sp1.useCount() << endl;     // count=2\n    }\n    cout << "count=" << sp1.useCount() << endl;         // count=1\n    return 0;\n}`, hint:"Allocate count as a new int(1) in the constructor. Copy increments *count. Destructor decrements *count and deletes ptr if *count reaches 0." },
  { title:"Expression Evaluator", description:"Write a C++ function that evaluates a simple mathematical expression string with +, -, *, / and integers, respecting operator precedence.", language:"cpp", difficulty:"Hard", xpReward:150, starterCode:`#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nint evaluate(const string& expr) {\n    // Handle +, -, *, / with integer operands\n    // Respect * and / precedence over + and -\n    return 0;\n}\n\nint main() {\n    cout << evaluate("3 + 5")        << endl; // 8\n    cout << evaluate("10 - 3")       << endl; // 7\n    cout << evaluate("2 * 6")        << endl; // 12\n    cout << evaluate("10 + 5 * 2")   << endl; // 20\n    cout << evaluate("20 - 4 * 3")   << endl; // 8\n    return 0;\n}`, hint:"Use two stacks: one for numbers and one for operators. When you see an operator with lower/equal precedence to the top of the stack, pop and compute first." },
  { title:"LRU Cache", description:"Implement an LRU (Least Recently Used) cache with get(key) and put(key, value). The cache has a fixed capacity. When full, evict the least recently used item.", language:"cpp", difficulty:"Hard", xpReward:150, starterCode:`#include <iostream>\n#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\n    int capacity;\n    // Hint: use list for O(1) move-to-front\n    //       unordered_map<int, list<pair<int,int>>::iterator> for O(1) lookup\npublic:\n    LRUCache(int cap) : capacity(cap) {}\n    int  get(int key)              { return -1; }\n    void put(int key, int value)   {}\n};\n\nint main() {\n    LRUCache cache(2);\n    cache.put(1, 1);\n    cache.put(2, 2);\n    cout << cache.get(1)    << endl; // 1\n    cache.put(3, 3);                 // evicts 2\n    cout << cache.get(2)    << endl; // -1 (evicted)\n    cout << cache.get(3)    << endl; // 3\n    return 0;\n}`, hint:"Use a doubly linked list (std::list) where the front is most recent. Store iterators in an unordered_map for O(1) access. On get/put, move accessed item to front." },
  { title:"Thread-Safe Counter", description:"Implement a ThreadSafeCounter class that can be safely incremented by multiple threads simultaneously. Verify the final count is always correct.", language:"cpp", difficulty:"Hard", xpReward:150, starterCode:`#include <iostream>\n#include <thread>\n#include <mutex>\n#include <vector>\nusing namespace std;\n\nclass ThreadSafeCounter {\n    // Write your implementation\npublic:\n    void increment()  {}\n    void decrement()  {}\n    int  getValue()   { return 0; }\n};\n\nint main() {\n    ThreadSafeCounter counter;\n    vector<thread> threads;\n\n    for (int i = 0; i < 10; i++)\n        threads.emplace_back([&](){ for(int j=0;j<1000;j++) counter.increment(); });\n\n    for (auto& t : threads) t.join();\n    cout << "Final: " << counter.getValue() << endl; // always 10000\n    return 0;\n}`, hint:"Use a private std::mutex and lock_guard<mutex> in each method. Without the mutex, concurrent increments will produce values less than 10000 due to race conditions." },
  { title:"Variadic Template Sum", description:"Write a variadic template function sum() that accepts any number of arguments of any numeric type and returns their sum.", language:"cpp", difficulty:"Hard", xpReward:150, starterCode:`#include <iostream>\nusing namespace std;\n\n// Write your variadic template here\n// Hint: use parameter pack (typename... Args)\n\nint main() {\n    cout << sum(1, 2, 3)           << endl; // 6\n    cout << sum(1.5, 2.5, 3.0)     << endl; // 7.0\n    cout << sum(1, 2.5, 3, 4.5)    << endl; // 11.0\n    cout << sum(10)                << endl; // 10\n    return 0;\n}`, hint:"Define a base case: sum(T x) returns x. Define the recursive case: sum(T first, Args... rest) returns first + sum(rest...). The compiler expands the pack." },
  { title:"Iterator Pattern", description:"Implement a custom Range class that generates integers from start to end (exclusive) and supports range-based for loops by implementing begin() and end().", language:"cpp", difficulty:"Hard", xpReward:150, starterCode:`#include <iostream>\nusing namespace std;\n\nclass Range {\n    // Implement iterator support for range-based for\npublic:\n    Range(int start, int end) {}\n};\n\nint main() {\n    for (int i : Range(1, 6))\n        cout << i << " ";  // 1 2 3 4 5\n    cout << endl;\n\n    for (int i : Range(0, 10))\n        if (i % 2 == 0) cout << i << " ";  // 0 2 4 6 8\n    cout << endl;\n    return 0;\n}`, hint:"Create a nested Iterator struct with int current. Implement operator!=, operator++, operator*. Range::begin() returns Iterator(start), Range::end() returns Iterator(end)." },
];

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding C++ content...\n");

  // Update course
  await setDoc(doc(db, "courses", "cpp"), {
    id:"cpp", title:"C++ Programming", emoji:"🔷", color:"purple",
    tagline:"From beginner to modern C++ — complete foundations",
    description:"A complete C++ course for beginners covering all fundamentals through advanced topics including OOP, templates, STL, memory management, and modern C++17 features.",
    level:"Beginner → Advanced", totalLessons:25, xpReward:75, order:4,
  });
  console.log("✅ Updated C++ course (25 lessons)\n");

  // Lessons
  console.log("📖 Adding lessons...");
  for (const lesson of lessons) {
    await setDoc(doc(db, "courses", "cpp", "lessons", lesson.id), lesson);
    console.log(`  ✅ Lesson ${lesson.order}: ${lesson.title}`);
  }

  // Challenges
  console.log("\n⚔️  Adding C++ daily challenges...");
  for (let i = 0; i < challenges.length; i++) {
    const date = dateStr(i + 30); // start 30 days from now
    await setDoc(doc(db, "challenges", date), { ...challenges[i], date, id: date });
    console.log(`  ✅ ${date}: ${challenges[i].title}`);
  }

  console.log(`\n✨ Done!`);
  console.log(`   - 24 new C++ lessons (lessons 2–25)`);
  console.log(`   - 20 daily challenges (Easy → Hard)`);
  process.exit(0);
}

seed().catch(e => { console.error("❌", e); process.exit(1); });
