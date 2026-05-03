// scripts/seedPythonExpansion.mjs
// Run with: node scripts/seedPythonExpansion.mjs
// Adds 26 new Python lessons + 30 daily challenges to Firestore

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

// ── LESSONS ───────────────────────────────────────────────────────────────────

const newLessons = [

  // ── BEGINNER (5–10) ──────────────────────────────────────────────────────

  {
    id:"py-05", courseId:"python", order:5, title:"Functions", duration:"15 min", xpReward:25, language:"python",
    theory:`# Functions

Functions let you group reusable code under a name and call it whenever needed.

## Defining a Function

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")   # Hello, Alice!
greet("Bob")     # Hello, Bob!
\`\`\`

## Return Values

Functions can send a value back to the caller using \`return\`:

\`\`\`python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)   # 8
\`\`\`

## Default Parameters

You can give parameters a default value:

\`\`\`python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")             # Hello, Alice!
greet("Bob", "Hi there")   # Hi there, Bob!
\`\`\`

## Scope

Variables inside a function are local — they don't exist outside:

\`\`\`python
def my_func():
    x = 10   # local variable
    print(x)

my_func()
# print(x)   # This would cause an error!
\`\`\`

## Multiple Return Values

Python functions can return multiple values as a tuple:

\`\`\`python
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 9, 2, 7])
print(low, high)   # 1 9
\`\`\``,
    starterCode:`# Functions Practice

def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# Test basic function
print(greet("Alice"))
print(greet("Bob", "Hi"))

# Write a function that calculates the area of a rectangle
def rectangle_area(width, height):
    # Write your code here
    pass

print(rectangle_area(5, 3))   # Expected: 15
print(rectangle_area(10, 4))  # Expected: 40

# Write a function that returns both the square and cube of a number
def powers(n):
    # Write your code here
    pass

square, cube = powers(3)
print(square, cube)   # Expected: 9 27
`,
    quiz:[
      { id:"q1", question:"What keyword is used to define a function in Python?", options:["function","define","def","func"], correct:2, explanation:"def is the keyword used to define a function in Python." },
      { id:"q2", question:"What does the return statement do?", options:["Prints a value","Ends the program","Sends a value back to the caller","Repeats the function"], correct:2, explanation:"return sends a value back to wherever the function was called from." },
      { id:"q3", question:"What happens to a local variable after the function finishes?", options:["It becomes global","It is saved for next call","It is deleted","It returns 0"], correct:2, explanation:"Local variables only exist while the function is running and are destroyed afterwards." },
    ],
  },

  {
    id:"py-06", courseId:"python", order:6, title:"Lists & Tuples", duration:"15 min", xpReward:25, language:"python",
    theory:`# Lists & Tuples

Lists and tuples store multiple values in a single variable.

## Lists

Lists are **mutable** (changeable) and defined with square brackets:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])    # apple  (index starts at 0)
print(fruits[-1])   # cherry (negative index from end)
\`\`\`

## Common List Methods

\`\`\`python
nums = [3, 1, 4, 1, 5]
nums.append(9)      # add to end
nums.remove(1)      # remove first occurrence
nums.sort()         # sort in place
print(len(nums))    # length
print(sum(nums))    # sum of all numbers
\`\`\`

## Slicing

\`\`\`python
letters = ["a","b","c","d","e"]
print(letters[1:3])   # ['b', 'c']
print(letters[:2])    # ['a', 'b']
print(letters[2:])    # ['c', 'd', 'e']
print(letters[::2])   # ['a', 'c', 'e'] (every 2nd)
\`\`\`

## Tuples

Tuples are **immutable** (cannot be changed) and use parentheses:

\`\`\`python
point = (3, 7)
x, y = point   # unpacking
print(x, y)    # 3 7

# point[0] = 5   # This would cause an error!
\`\`\`

Use tuples for data that shouldn't change, like coordinates or RGB colors.`,
    starterCode:`# Lists & Tuples

# List operations
scores = [85, 92, 78, 96, 88]
print("Scores:", scores)
print("Highest:", max(scores))
print("Lowest:", min(scores))
print("Average:", sum(scores) / len(scores))

# Slicing
print("Top 3:", sorted(scores, reverse=True)[:3])

# Add and remove
scores.append(100)
print("After adding 100:", scores)

# Tuple unpacking
student = ("Alice", 20, "Computer Science")
name, age, major = student
print(f"{name} is {age} years old studying {major}")

# Try: create a list of your 5 favourite numbers and print them in reverse
`,
    quiz:[
      { id:"q1", question:"What is the index of the first element in a Python list?", options:["1","-1","0","None"], correct:2, explanation:"Python lists are zero-indexed, so the first element is at index 0." },
      { id:"q2", question:"What is the key difference between a list and a tuple?", options:["Lists use () and tuples use []","Tuples can store more items","Lists are mutable; tuples are immutable","Tuples are faster to create"], correct:2, explanation:"Lists are mutable (can be changed); tuples are immutable (cannot be changed after creation)." },
      { id:"q3", question:"What does letters[1:3] return for letters = ['a','b','c','d']?", options:["['a','b']","['b','c','d']","['b','c']","['a','b','c']"], correct:2, explanation:"Slicing [1:3] returns elements at index 1 and 2 (not including 3), so ['b','c']." },
    ],
  },

  {
    id:"py-07", courseId:"python", order:7, title:"Dictionaries & Sets", duration:"15 min", xpReward:25, language:"python",
    theory:`# Dictionaries & Sets

## Dictionaries

Dictionaries store **key-value pairs**, like a real dictionary where words are keys and definitions are values:

\`\`\`python
student = {
    "name":  "Alice",
    "age":   20,
    "grade": "A"
}

print(student["name"])    # Alice
student["age"] = 21       # update value
student["email"] = "a@b.com"  # add new key
\`\`\`

## Useful Dictionary Methods

\`\`\`python
d = {"a": 1, "b": 2, "c": 3}
print(d.keys())    # dict_keys(['a', 'b', 'c'])
print(d.values())  # dict_values([1, 2, 3])
print(d.items())   # dict_items([('a',1), ('b',2), ('c',3)])

# Safe access with .get() — returns None instead of error
print(d.get("z", 0))  # 0 (default if key not found)
\`\`\`

## Looping Over a Dictionary

\`\`\`python
for key, value in d.items():
    print(f"{key}: {value}")
\`\`\`

## Sets

Sets store **unique values** with no duplicates:

\`\`\`python
colors = {"red", "blue", "green", "red"}
print(colors)   # {'red', 'blue', 'green'} — duplicate removed!

a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)   # union:        {1,2,3,4,5,6}
print(a & b)   # intersection: {3,4}
print(a - b)   # difference:   {1,2}
\`\`\``,
    starterCode:`# Dictionaries & Sets

# Create and use a dictionary
person = {
    "name":    "Alice",
    "age":     20,
    "country": "Bangladesh",
    "skills":  ["Python", "C++"]
}

print("Name:", person["name"])
print("Age:", person.get("age"))
print("Skills:", person["skills"])

# Loop over items
print("\\nAll info:")
for key, value in person.items():
    print(f"  {key}: {value}")

# Word frequency counter using a dictionary
sentence = "the cat sat on the mat the cat"
word_count = {}
for word in sentence.split():
    word_count[word] = word_count.get(word, 0) + 1
print("\\nWord counts:", word_count)

# Sets — remove duplicates
numbers = [1, 2, 2, 3, 3, 3, 4]
unique = set(numbers)
print("\\nUnique numbers:", unique)
`,
    quiz:[
      { id:"q1", question:"How do you safely access a dictionary key that might not exist?", options:["dict[key]","dict.find(key)","dict.get(key)","dict.fetch(key)"], correct:2, explanation:".get() returns None (or a default value) instead of raising a KeyError if the key doesn't exist." },
      { id:"q2", question:"What does a Python set guarantee about its elements?", options:["They are sorted","They are unique","They are immutable","They are indexed"], correct:1, explanation:"Sets automatically remove duplicates — every element appears exactly once." },
      { id:"q3", question:"What does d.items() return?", options:["Just the keys","Just the values","Key-value pairs","The length"], correct:2, explanation:"d.items() returns all key-value pairs as tuples, useful for looping over a dictionary." },
    ],
  },

  {
    id:"py-08", courseId:"python", order:8, title:"String Methods", duration:"12 min", xpReward:25, language:"python",
    theory:`# String Methods

Strings in Python come with many built-in methods for manipulation.

## Case Methods

\`\`\`python
s = "Hello, World!"
print(s.upper())     # HELLO, WORLD!
print(s.lower())     # hello, world!
print(s.title())     # Hello, World!
print(s.swapcase())  # hELLO, wORLD!
\`\`\`

## Search & Check

\`\`\`python
s = "Python is awesome"
print(s.find("is"))       # 7  (index of first occurrence)
print(s.count("o"))       # 2
print(s.startswith("Py")) # True
print(s.endswith("me"))   # True
print("awesome" in s)     # True
\`\`\`

## Modify & Clean

\`\`\`python
s = "  hello world  "
print(s.strip())           # "hello world" (removes whitespace)
print(s.replace("l","L"))  # "  heLLo worLd  "

words = "apple,banana,cherry"
print(words.split(","))    # ['apple', 'banana', 'cherry']

parts = ["Python", "is", "great"]
print(" ".join(parts))     # "Python is great"
\`\`\`

## f-Strings (Formatted Strings)

\`\`\`python
name  = "Alice"
score = 95.5
print(f"Hello {name}! Your score is {score:.1f}")
# Hello Alice! Your score is 95.5
\`\`\``,
    starterCode:`# String Methods Practice

text = "  Python Programming is Fun!  "

# Clean and transform
print(text.strip())
print(text.strip().lower())
print(text.strip().upper())
print(text.strip().replace("Fun", "Awesome"))

# Split and join
sentence = "the quick brown fox"
words = sentence.split()
print(words)
print("-".join(words))
print(" ".join(w.capitalize() for w in words))

# f-strings
name  = "ACE"
users = 1000
rate  = 98.5
print(f"\\nWelcome to {name}!")
print(f"We have {users:,} users with a {rate:.1f}% satisfaction rate.")

# Count vowels using string methods
def count_vowels(s):
    return sum(1 for c in s.lower() if c in "aeiou")

print(f"\\nVowels in 'Python': {count_vowels('Python')}")
`,
    quiz:[
      { id:"q1", question:"What does 'hello'.upper() return?", options:["hello","Hello","HELLO","HELLO!"], correct:2, explanation:".upper() converts all characters to uppercase." },
      { id:"q2", question:"What does 'a,b,c'.split(',') return?", options:["'abc'","['a','b','c']","('a','b','c')","{'a','b','c'}"], correct:1, explanation:".split() splits a string into a list by the given separator." },
      { id:"q3", question:"Which method removes whitespace from both ends of a string?", options:[".clean()",".trim()",".strip()",".remove()"], correct:2, explanation:".strip() removes leading and trailing whitespace characters." },
    ],
  },

  {
    id:"py-09", courseId:"python", order:9, title:"File Handling", duration:"15 min", xpReward:30, language:"python",
    theory:`# File Handling

Python makes it easy to read from and write to files.

## Opening Files

Use the \`open()\` function with a mode:

| Mode | Meaning |
|------|---------|
| \`"r"\` | Read (default) |
| \`"w"\` | Write (creates or overwrites) |
| \`"a"\` | Append (adds to end) |
| \`"x"\` | Create (fails if file exists) |

## The with Statement (Recommended)

Always use \`with\` — it automatically closes the file:

\`\`\`python
# Writing to a file
with open("notes.txt", "w") as f:
    f.write("Hello, file!\\n")
    f.write("Second line.\\n")

# Reading the whole file
with open("notes.txt", "r") as f:
    content = f.read()
    print(content)

# Reading line by line
with open("notes.txt", "r") as f:
    for line in f:
        print(line.strip())
\`\`\`

## Reading Methods

\`\`\`python
with open("notes.txt") as f:
    content = f.read()        # entire file as string
    lines   = f.readlines()   # list of lines
    line    = f.readline()    # one line at a time
\`\`\`

## Appending

\`\`\`python
with open("notes.txt", "a") as f:
    f.write("This is appended.\\n")
\`\`\``,
    starterCode:`# File Handling
# Note: In this browser environment we simulate file operations

# Simulate writing a file
lines_to_write = [
    "Name: Alice\\n",
    "Course: Python\\n",
    "Score: 95\\n",
]

# In a real environment you would do:
# with open("student.txt", "w") as f:
#     f.writelines(lines_to_write)

# Simulate reading
import io
simulated_file = io.StringIO("".join(lines_to_write))

print("Reading file contents:")
for line in simulated_file:
    print(line.strip())

# Parse the data
simulated_file.seek(0)
data = {}
for line in simulated_file:
    key, value = line.strip().split(": ")
    data[key] = value

print("\\nParsed data:", data)
print("Student name:", data["Name"])
`,
    quiz:[
      { id:"q1", question:"What mode opens a file for writing (creating or overwriting)?", options:['"r"','"a"','"w"','"x"'], correct:2, explanation:'"w" opens for writing. It creates the file if it doesn\'t exist, or overwrites it if it does.' },
      { id:"q2", question:"Why is the 'with' statement recommended for file handling?", options:["It's faster","It auto-closes the file","It prevents all errors","It reads faster"], correct:1, explanation:"The with statement ensures the file is automatically closed when the block ends, even if an error occurs." },
      { id:"q3", question:"What does f.readlines() return?", options:["A string","A single line","A list of all lines","The file size"], correct:2, explanation:"readlines() reads all lines and returns them as a list of strings." },
    ],
  },

  {
    id:"py-10", courseId:"python", order:10, title:"Error Handling", duration:"15 min", xpReward:30, language:"python",
    theory:`# Error Handling

Errors (exceptions) crash your program. Error handling lets you respond gracefully.

## try / except

\`\`\`python
try:
    number = int(input("Enter a number: "))
    print(10 / number)
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
\`\`\`

## Common Exceptions

| Exception | When it occurs |
|-----------|---------------|
| \`ValueError\` | Wrong value type (e.g. int("abc")) |
| \`TypeError\` | Wrong type for operation |
| \`ZeroDivisionError\` | Division by zero |
| \`IndexError\` | List index out of range |
| \`KeyError\` | Dictionary key not found |
| \`FileNotFoundError\` | File doesn't exist |

## else and finally

\`\`\`python
try:
    result = 10 / 2
except ZeroDivisionError:
    print("Error!")
else:
    print("Success:", result)   # runs if NO exception
finally:
    print("Always runs")        # runs regardless
\`\`\`

## Raising Exceptions

\`\`\`python
def divide(a, b):
    if b == 0:
        raise ValueError("Denominator cannot be zero")
    return a / b

try:
    print(divide(10, 0))
except ValueError as e:
    print(f"Error: {e}")
\`\`\``,
    starterCode:`# Error Handling

# Basic try/except
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        return "Error: Cannot divide by zero"

print(safe_divide(10, 2))
print(safe_divide(10, 0))

# Multiple exceptions
def parse_and_double(value):
    try:
        number = int(value)
        return number * 2
    except ValueError:
        return f"Error: '{value}' is not a valid integer"
    except TypeError:
        return "Error: Invalid type provided"

print(parse_and_double("5"))
print(parse_and_double("abc"))
print(parse_and_double(None))

# finally block
def read_data(data, index):
    try:
        return data[index]
    except IndexError:
        return "Error: Index out of range"
    finally:
        print(f"(Attempted to access index {index})")

nums = [10, 20, 30]
print(read_data(nums, 1))
print(read_data(nums, 9))
`,
    quiz:[
      { id:"q1", question:"Which block always runs regardless of whether an exception occurred?", options:["try","except","else","finally"], correct:3, explanation:"The finally block always executes, whether an exception occurred or not — useful for cleanup." },
      { id:"q2", question:"What exception is raised when you try int('hello')?", options:["TypeError","ValueError","SyntaxError","NameError"], correct:1, explanation:"ValueError is raised when a function receives the right type but an inappropriate value, like converting 'hello' to int." },
      { id:"q3", question:"What does the else block do in a try/except statement?", options:["Runs when exception occurs","Always runs","Runs only if no exception occurred","Catches all exceptions"], correct:2, explanation:"The else block runs only when no exception was raised in the try block." },
    ],
  },

  // ── INTERMEDIATE (11–20) ────────────────────────────────────────────────

  {
    id:"py-11", courseId:"python", order:11, title:"List Comprehensions", duration:"15 min", xpReward:35, language:"python",
    theory:`# List Comprehensions

List comprehensions are a concise way to create lists — often replacing a loop in one line.

## Basic Syntax

\`\`\`python
# Traditional loop
squares = []
for i in range(10):
    squares.append(i ** 2)

# List comprehension — same result, one line
squares = [i ** 2 for i in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
\`\`\`

## With a Condition (Filtering)

\`\`\`python
# Only even numbers
evens = [i for i in range(20) if i % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Words longer than 4 characters
words   = ["hi", "python", "code", "is", "great"]
long    = [w for w in words if len(w) > 4]
print(long)   # ['python', 'great']
\`\`\`

## Transforming Elements

\`\`\`python
names  = ["alice", "bob", "charlie"]
upper  = [name.upper() for name in names]
print(upper)  # ['ALICE', 'BOB', 'CHARLIE']
\`\`\`

## Nested List Comprehensions

\`\`\`python
# Flatten a 2D list
matrix  = [[1,2,3],[4,5,6],[7,8,9]]
flat    = [num for row in matrix for num in row]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\`

## Dictionary & Set Comprehensions

\`\`\`python
squares_dict = {i: i**2 for i in range(5)}
# {0:0, 1:1, 2:4, 3:9, 4:16}

unique_lens = {len(w) for w in ["hi","hello","hey","world"]}
# {2, 5}
\`\`\``,
    starterCode:`# List Comprehensions

# 1. Basic: squares of 1-10
squares = [i**2 for i in range(1, 11)]
print("Squares:", squares)

# 2. Filter: only odd numbers from 1-20
odds = [i for i in range(1, 21) if i % 2 != 0]
print("Odds:", odds)

# 3. Transform: celsius to fahrenheit
celsius    = [0, 20, 37, 100]
fahrenheit = [c * 9/5 + 32 for c in celsius]
print("Fahrenheit:", fahrenheit)

# 4. Filter and transform: uppercase words longer than 3 chars
words  = ["hi", "python", "is", "cool", "fun", "awesome"]
result = [w.upper() for w in words if len(w) > 3]
print("Long words:", result)

# 5. Dictionary comprehension: word lengths
word_lengths = {w: len(w) for w in words}
print("Word lengths:", word_lengths)

# Try: create a list of all numbers 1-50 divisible by both 3 and 5
`,
    quiz:[
      { id:"q1", question:"What does [x**2 for x in range(3)] produce?", options:["[1,4,9]","[0,1,4]","[0,1,2]","[1,2,3]"], correct:1, explanation:"range(3) produces 0,1,2 and squaring gives [0, 1, 4]." },
      { id:"q2", question:"How do you add a filter condition to a list comprehension?", options:["Add 'where' at the end","Add 'if' at the end","Wrap in filter()","Use a second for loop"], correct:1, explanation:"Add 'if condition' at the end: [x for x in items if condition]." },
      { id:"q3", question:"What is the dict comprehension syntax?", options:["{k,v for ...}","[k:v for ...]","{k:v for ...}","dict(k:v for ...)"], correct:2, explanation:"Dictionary comprehensions use {key: value for item in iterable} syntax." },
    ],
  },

  {
    id:"py-12", courseId:"python", order:12, title:"Advanced Functions", duration:"18 min", xpReward:35, language:"python",
    theory:`# Advanced Functions

## *args — Variable Positional Arguments

\`\`\`python
def add_all(*args):
    return sum(args)

print(add_all(1, 2, 3))        # 6
print(add_all(1, 2, 3, 4, 5))  # 15
\`\`\`

## **kwargs — Variable Keyword Arguments

\`\`\`python
def profile(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

profile(name="Alice", age=20, city="Dhaka")
\`\`\`

## Lambda Functions

Anonymous one-line functions:

\`\`\`python
square  = lambda x: x ** 2
add     = lambda a, b: a + b

print(square(5))   # 25
print(add(3, 4))   # 7

# Common use: sorting with a key
people = [("Alice", 30), ("Bob", 25), ("Charlie", 35)]
people.sort(key=lambda p: p[1])
print(people)  # sorted by age
\`\`\`

## map() and filter()

\`\`\`python
nums    = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, nums))
evens   = list(filter(lambda x: x % 2 == 0, nums))
print(doubled)  # [2, 4, 6, 8, 10]
print(evens)    # [2, 4]
\`\`\``,
    starterCode:`# Advanced Functions

# *args
def multiply_all(*args):
    result = 1
    for n in args:
        result *= n
    return result

print(multiply_all(2, 3, 4))    # 24
print(multiply_all(1, 2, 3, 4, 5))  # 120

# **kwargs
def create_tag(**attrs):
    parts = [f'{k}="{v}"' for k, v in attrs.items()]
    return f"<tag {' '.join(parts)}>"

print(create_tag(id="main", class_="container", style="color:red"))

# Lambda + sorted
students = [
    {"name": "Alice", "score": 85},
    {"name": "Bob",   "score": 92},
    {"name": "Eve",   "score": 78},
]
ranked = sorted(students, key=lambda s: s["score"], reverse=True)
for i, s in enumerate(ranked, 1):
    print(f"{i}. {s['name']}: {s['score']}")

# map and filter
numbers = list(range(1, 11))
squares = list(map(lambda x: x**2, numbers))
big     = list(filter(lambda x: x > 50, squares))
print("Squares:", squares)
print("Squares > 50:", big)
`,
    quiz:[
      { id:"q1", question:"What does *args allow a function to accept?", options:["Only keyword arguments","Any number of positional arguments","Only two arguments","Named arguments"], correct:1, explanation:"*args collects any number of positional arguments into a tuple." },
      { id:"q2", question:"What is a lambda function?", options:["A function that returns None","A multi-line function","An anonymous one-line function","A built-in function"], correct:2, explanation:"Lambda creates an anonymous function in a single expression: lambda params: expression." },
      { id:"q3", question:"What does filter() do?", options:["Transforms each element","Removes duplicates","Returns elements where function returns True","Sorts the list"], correct:2, explanation:"filter() returns only the elements for which the function returns True." },
    ],
  },

  {
    id:"py-13", courseId:"python", order:13, title:"Object Oriented Programming I", duration:"20 min", xpReward:40, language:"python",
    theory:`# Object Oriented Programming I

OOP organizes code into **objects** that combine data and behavior.

## Classes and Objects

\`\`\`python
class Dog:
    # __init__ is the constructor — runs when object is created
    def __init__(self, name, breed):
        self.name  = name   # instance attribute
        self.breed = breed

    def bark(self):
        print(f"{self.name} says: Woof!")

    def describe(self):
        return f"{self.name} is a {self.breed}"

# Create objects (instances)
dog1 = Dog("Rex", "Labrador")
dog2 = Dog("Buddy", "Poodle")

dog1.bark()               # Rex says: Woof!
print(dog2.describe())    # Buddy is a Poodle
\`\`\`

## The self Parameter

\`self\` refers to the current object. Every method must have it as the first parameter:

\`\`\`python
class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count += 1

    def reset(self):
        self.count = 0

c = Counter()
c.increment()
c.increment()
print(c.count)  # 2
c.reset()
print(c.count)  # 0
\`\`\`

## Class vs Instance Attributes

\`\`\`python
class Circle:
    pi = 3.14159   # class attribute (shared by all)

    def __init__(self, radius):
        self.radius = radius   # instance attribute (unique per object)

    def area(self):
        return Circle.pi * self.radius ** 2

c1 = Circle(5)
c2 = Circle(10)
print(c1.area())   # 78.53975
print(c2.area())   # 314.159
\`\`\``,
    starterCode:`# OOP I — Classes and Objects

class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner   = owner
        self.balance = balance

    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            print(f"Deposited {amount}. Balance: {self.balance}")
        else:
            print("Amount must be positive")

    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
        elif amount <= 0:
            print("Amount must be positive")
        else:
            self.balance -= amount
            print(f"Withdrew {amount}. Balance: {self.balance}")

    def __str__(self):
        return f"Account({self.owner}, balance={self.balance})"

# Test the class
acc = BankAccount("Alice", 1000)
print(acc)
acc.deposit(500)
acc.withdraw(200)
acc.withdraw(2000)
print(acc)

# Create your own account
acc2 = BankAccount("Bob")
acc2.deposit(100)
print(acc2)
`,
    quiz:[
      { id:"q1", question:"What is __init__ used for in a Python class?", options:["To delete an object","To initialize object attributes when created","To print the object","To copy the object"], correct:1, explanation:"__init__ is the constructor method — it runs automatically when a new object is created and sets up initial attributes." },
      { id:"q2", question:"What does 'self' refer to inside a class method?", options:["The class itself","The parent class","The current instance (object)","The previous object"], correct:2, explanation:"'self' is a reference to the current object — it allows methods to access and modify the object's own attributes." },
      { id:"q3", question:"What is the difference between a class attribute and an instance attribute?", options:["No difference","Class attributes are shared; instance attributes are unique per object","Instance attributes are faster","Class attributes can't be changed"], correct:1, explanation:"Class attributes are shared across all instances; instance attributes belong to a specific object." },
    ],
  },

  {
    id:"py-14", courseId:"python", order:14, title:"OOP II — Inheritance", duration:"20 min", xpReward:40, language:"python",
    theory:`# OOP II — Inheritance

Inheritance lets a class **reuse and extend** another class.

## Basic Inheritance

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

    def describe(self):
        return f"I am {self.name}"

class Dog(Animal):
    def speak(self):         # override parent method
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

dog = Dog("Rex")
cat = Cat("Whiskers")
print(dog.speak())      # Woof!
print(cat.describe())   # I am Whiskers (inherited)
\`\`\`

## super() — Calling the Parent

\`\`\`python
class Vehicle:
    def __init__(self, make, model):
        self.make  = make
        self.model = model

class Car(Vehicle):
    def __init__(self, make, model, doors):
        super().__init__(make, model)   # call parent __init__
        self.doors = doors

    def info(self):
        return f"{self.make} {self.model} ({self.doors} doors)"

car = Car("Toyota", "Corolla", 4)
print(car.info())
\`\`\`

## isinstance() and issubclass()

\`\`\`python
print(isinstance(dog, Dog))     # True
print(isinstance(dog, Animal))  # True — Dog IS an Animal
print(issubclass(Dog, Animal))  # True
\`\`\``,
    starterCode:`# OOP II — Inheritance

class Shape:
    def __init__(self, color="black"):
        self.color = color

    def area(self):
        return 0

    def describe(self):
        return f"A {self.color} shape with area {self.area():.2f}"

class Rectangle(Shape):
    def __init__(self, width, height, color="black"):
        super().__init__(color)
        self.width  = width
        self.height = height

    def area(self):
        return self.width * self.height

class Circle(Shape):
    PI = 3.14159

    def __init__(self, radius, color="black"):
        super().__init__(color)
        self.radius = radius

    def area(self):
        return Circle.PI * self.radius ** 2

class Triangle(Shape):
    def __init__(self, base, height, color="black"):
        super().__init__(color)
        self.base   = base
        self.height = height

    def area(self):
        return 0.5 * self.base * self.height

# Test all shapes
shapes = [
    Rectangle(5, 3, "blue"),
    Circle(4, "red"),
    Triangle(6, 8, "green"),
]

for shape in shapes:
    print(shape.describe())
    print(f"  Is a Shape? {isinstance(shape, Shape)}")
`,
    quiz:[
      { id:"q1", question:"What does super().__init__() do?", options:["Creates a new object","Calls the parent class constructor","Deletes the parent","Copies the parent class"], correct:1, explanation:"super().__init__() calls the parent class's __init__ method, allowing you to reuse parent initialization logic." },
      { id:"q2", question:"If Dog inherits from Animal, what does isinstance(Dog('Rex'), Animal) return?", options:["False","Error","None","True"], correct:3, explanation:"isinstance returns True because Dog IS an Animal — inheritance creates an 'is-a' relationship." },
      { id:"q3", question:"What is method overriding?", options:["Deleting a method","Calling a method twice","Redefining a parent method in a child class","Adding new parameters"], correct:2, explanation:"Method overriding is when a child class provides its own implementation of a method already defined in the parent." },
    ],
  },

  {
    id:"py-15", courseId:"python", order:15, title:"Modules & the Standard Library", duration:"15 min", xpReward:35, language:"python",
    theory:`# Modules & the Standard Library

A **module** is a Python file containing functions, classes, and variables you can reuse.

## Importing Modules

\`\`\`python
import math
print(math.pi)         # 3.141592653589793
print(math.sqrt(16))   # 4.0
print(math.ceil(4.2))  # 5

import random
print(random.randint(1, 10))        # random int 1–10
print(random.choice(["a","b","c"])) # random element

import datetime
today = datetime.date.today()
print(today)   # 2026-03-15
\`\`\`

## from ... import

\`\`\`python
from math import pi, sqrt
print(pi)        # 3.14159...
print(sqrt(25))  # 5.0
\`\`\`

## Useful Standard Library Modules

| Module | Use |
|--------|-----|
| \`math\` | Mathematical functions |
| \`random\` | Random numbers |
| \`datetime\` | Dates and times |
| \`os\` | Operating system operations |
| \`sys\` | System-specific parameters |
| \`json\` | JSON encoding/decoding |
| \`re\` | Regular expressions |
| \`collections\` | Specialized data structures |
| \`itertools\` | Iterator tools |

## collections.Counter

\`\`\`python
from collections import Counter

words   = ["apple","banana","apple","cherry","banana","apple"]
counts  = Counter(words)
print(counts)               # Counter({'apple': 3, 'banana': 2, 'cherry': 1})
print(counts.most_common(2)) # [('apple', 3), ('banana', 2)]
\`\`\``,
    starterCode:`# Modules & Standard Library

import math
import random
from collections import Counter, defaultdict
from datetime import datetime

# math module
print("=== Math ===")
print(f"Pi:          {math.pi:.4f}")
print(f"sqrt(144):   {math.sqrt(144)}")
print(f"factorial(6):{math.factorial(6)}")
print(f"log2(64):    {math.log2(64)}")

# random module
print("\\n=== Random ===")
print(f"Random int (1-100): {random.randint(1, 100)}")
items = ["Python", "C", "C++", "Linux"]
print(f"Random choice: {random.choice(items)}")
sample = random.sample(range(100), 5)
print(f"Random sample: {sorted(sample)}")

# collections.Counter
print("\\n=== Counter ===")
grades = ["A","B","A","C","B","A","D","B","A","C"]
grade_count = Counter(grades)
print("Grade counts:", dict(grade_count))
print("Most common:", grade_count.most_common(2))

# datetime
print("\\n=== Datetime ===")
now = datetime.now()
print(f"Now: {now.strftime('%Y-%m-%d %H:%M')}")
`,
    quiz:[
      { id:"q1", question:"What does 'from math import sqrt' allow you to do?", options:["Use sqrt() directly without math. prefix","Import all of math","Create a new function called sqrt","Nothing different"], correct:0, explanation:"'from module import name' lets you use the name directly without the module prefix." },
      { id:"q2", question:"Which module would you use to generate a random number?", options:["math","os","random","sys"], correct:2, explanation:"The random module provides functions for generating random numbers, choices, and shuffling." },
      { id:"q3", question:"What does Counter(['a','b','a','c','a']) return?", options:["3","['a','a','a','b','c']","Counter({'a':3,'b':1,'c':1})","{'a','b','c'}"], correct:2, explanation:"Counter counts occurrences of each element and returns a Counter object with element:count pairs." },
    ],
  },

  {
    id:"py-16", courseId:"python", order:16, title:"Iterators & Generators", duration:"18 min", xpReward:40, language:"python",
    theory:`# Iterators & Generators

## Iterators

An **iterator** is any object you can loop over. Behind every \`for\` loop is an iterator:

\`\`\`python
nums = [1, 2, 3]
it   = iter(nums)
print(next(it))  # 1
print(next(it))  # 2
print(next(it))  # 3
# next(it)  # StopIteration error
\`\`\`

## Generators

Generators create values **on demand** using \`yield\` — they don't store everything in memory:

\`\`\`python
def count_up(limit):
    n = 0
    while n < limit:
        yield n    # pause here and return n
        n += 1

for num in count_up(5):
    print(num)   # 0 1 2 3 4
\`\`\`

## Why Use Generators?

\`\`\`python
# Regular list — stores ALL million numbers in memory
million_list = [i for i in range(1_000_000)]

# Generator — creates one at a time, uses almost no memory
million_gen = (i for i in range(1_000_000))
\`\`\`

## Practical Generator Example

\`\`\`python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
for _ in range(8):
    print(next(fib), end=" ")
# 0 1 1 2 3 5 8 13
\`\`\``,
    starterCode:`# Iterators & Generators

# Generator function
def squares(n):
    for i in range(1, n + 1):
        yield i ** 2

print("Squares:")
for sq in squares(8):
    print(sq, end=" ")
print()

# Generator expression (like list comp but lazy)
even_gen = (i for i in range(20) if i % 2 == 0)
print("\\nEvens (generator):")
print(list(even_gen))

# Infinite generator with limit
def countdown(start):
    while start >= 0:
        yield start
        start -= 1

print("\\nCountdown:")
for n in countdown(5):
    print(n, end=" ")
print()

# Fibonacci generator
def fibonacci(limit):
    a, b = 0, 1
    while a <= limit:
        yield a
        a, b = b, a + b

print("\\nFibonacci up to 100:")
print(list(fibonacci(100)))
`,
    quiz:[
      { id:"q1", question:"What keyword is used to create a generator function?", options:["return","generate","yield","produce"], correct:2, explanation:"yield pauses the function and returns a value, resuming from that point on the next call." },
      { id:"q2", question:"What is the main advantage of generators over lists?", options:["Faster indexing","Less memory usage","More features","Easier syntax"], correct:1, explanation:"Generators produce values one at a time instead of storing everything in memory, making them ideal for large or infinite sequences." },
      { id:"q3", question:"What happens when next() is called on an exhausted iterator?", options:["Returns None","Returns 0","Raises StopIteration","Starts over"], correct:2, explanation:"When an iterator has no more values, calling next() raises a StopIteration exception." },
    ],
  },

  {
    id:"py-17", courseId:"python", order:17, title:"Decorators", duration:"20 min", xpReward:45, language:"python",
    theory:`# Decorators

A decorator is a function that **wraps another function** to add behavior without modifying it.

## Functions Are Objects

\`\`\`python
def greet():
    return "Hello!"

# Functions can be stored in variables
say_hi = greet
print(say_hi())   # Hello!

# Functions can be passed as arguments
def run_twice(func):
    func()
    func()

run_twice(greet)
\`\`\`

## Creating a Decorator

\`\`\`python
def my_decorator(func):
    def wrapper():
        print("Before the function")
        func()
        print("After the function")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# Before the function
# Hello!
# After the function
\`\`\`

## Decorators with Arguments

\`\`\`python
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start  = time.time()
        result = func(*args, **kwargs)
        end    = time.time()
        print(f"{func.__name__} took {end-start:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    return sum(range(n))

print(slow_sum(1_000_000))
\`\`\``,
    starterCode:`# Decorators
import time
import functools

# Simple logging decorator
def log_calls(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}({args}, {kwargs})")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

@log_calls
def multiply(a, b):
    return a * b

add(3, 5)
multiply(4, 6)

# Timer decorator
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start  = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__} completed in {elapsed:.6f}s")
        return result
    return wrapper

@timer
def sum_squares(n):
    return sum(i**2 for i in range(n))

result = sum_squares(100000)
print(f"Sum of squares: {result}")
`,
    quiz:[
      { id:"q1", question:"What does the @ symbol do when used above a function definition?", options:["Comments the line","Applies a decorator","Makes the function private","Imports a module"], correct:1, explanation:"@decorator_name is syntactic sugar for: function = decorator_name(function)." },
      { id:"q2", question:"Why do we use @functools.wraps(func) inside a decorator?", options:["To make it faster","To preserve the original function's name and docstring","To add error handling","To allow multiple decorators"], correct:1, explanation:"functools.wraps copies metadata (name, docstring) from the original function to the wrapper, so debugging is easier." },
      { id:"q3", question:"What is the main purpose of a decorator?", options:["To delete functions","To add behavior to a function without modifying it","To copy a function","To rename a function"], correct:1, explanation:"Decorators add functionality (logging, timing, caching) to a function by wrapping it, keeping the original code unchanged." },
    ],
  },

  {
    id:"py-18", courseId:"python", order:18, title:"Regular Expressions", duration:"18 min", xpReward:40, language:"python",
    theory:`# Regular Expressions

Regular expressions (regex) let you search and manipulate text using patterns.

## Importing re

\`\`\`python
import re
\`\`\`

## Basic Patterns

| Pattern | Matches |
|---------|---------|
| \`.\` | Any character |
| \`\\d\` | Digit (0-9) |
| \`\\w\` | Word character (a-z, A-Z, 0-9, _) |
| \`\\s\` | Whitespace |
| \`+\` | One or more |
| \`*\` | Zero or more |
| \`?\` | Zero or one |
| \`^\` | Start of string |
| \`$\` | End of string |

## Core Functions

\`\`\`python
text = "My phone is 0171-234-5678 and email is hello@ace.com"

# search — find first match
match = re.search(r"\\d{4}-\\d{3}-\\d{4}", text)
if match:
    print(match.group())   # 0171-234-5678

# findall — find all matches
digits = re.findall(r"\\d+", text)
print(digits)   # ['0171', '234', '5678']

# sub — replace
clean = re.sub(r"\\d", "*", text)
print(clean)

# match — only matches at start
print(re.match(r"My", text))   # Match object
\`\`\`

## Groups

\`\`\`python
email_pattern = r"(\\w+)@(\\w+)\\.(\w+)"
m = re.search(email_pattern, text)
print(m.group(0))  # hello@ace.com  (full match)
print(m.group(1))  # hello          (username)
print(m.group(2))  # ace            (domain)
\`\`\``,
    starterCode:`# Regular Expressions
import re

text = """
Contact us:
  Email: support@ace.edu
  Phone: 01711-234567
  Alt:   01811-987654
  Web:   https://ace.edu
  Date:  2026-03-15
"""

# 1. Find all email addresses
emails = re.findall(r'[\\w.]+@[\\w.]+\\.[a-z]{2,}', text)
print("Emails found:", emails)

# 2. Find all phone numbers
phones = re.findall(r'\\d{5}-\\d{6}', text)
print("Phones found:", phones)

# 3. Find URLs
urls = re.findall(r'https?://[\\w./]+', text)
print("URLs found:", urls)

# 4. Find dates (YYYY-MM-DD)
dates = re.findall(r'\\d{4}-\\d{2}-\\d{2}', text)
print("Dates found:", dates)

# 5. Validate an email
def is_valid_email(email):
    pattern = r'^[\\w.]+@[\\w]+\\.[a-z]{2,}$'
    return bool(re.match(pattern, email))

test_emails = ["user@ace.com", "bad-email", "ok@test.org", "@missing.com"]
for e in test_emails:
    print(f"{e}: {'valid' if is_valid_email(e) else 'invalid'}")
`,
    quiz:[
      { id:"q1", question:"What does \\d match in a regex pattern?", options:["Any letter","Any whitespace","Any digit 0-9","Any word character"], correct:2, explanation:"\\d is a shorthand for [0-9] and matches any single digit." },
      { id:"q2", question:"What does re.findall() return?", options:["First match only","True or False","A list of all matches","A match object"], correct:2, explanation:"re.findall() returns a list of all non-overlapping matches in the string." },
      { id:"q3", question:"What does the ^ symbol mean at the start of a pattern?", options:["Not/negate","Any character","Start of string","One or more"], correct:2, explanation:"^ anchors the pattern to the start of the string — the pattern must match from the beginning." },
    ],
  },

  {
    id:"py-19", courseId:"python", order:19, title:"Working with JSON", duration:"15 min", xpReward:35, language:"python",
    theory:`# Working with JSON

JSON (JavaScript Object Notation) is the most common format for exchanging data between systems and APIs.

## Python ↔ JSON

| Python | JSON |
|--------|------|
| dict | object {} |
| list | array [] |
| str | string "" |
| int/float | number |
| True/False | true/false |
| None | null |

## json.dumps() — Python → JSON string

\`\`\`python
import json

data = {
    "name":   "Alice",
    "age":    20,
    "skills": ["Python", "C++"],
    "active": True
}

json_str = json.dumps(data, indent=2)
print(json_str)
\`\`\`

## json.loads() — JSON string → Python

\`\`\`python
json_str = '{"name": "Bob", "score": 95}'
data     = json.loads(json_str)
print(data["name"])    # Bob
print(data["score"])   # 95
\`\`\`

## Reading/Writing JSON Files

\`\`\`python
# Write
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

# Read
with open("data.json", "r") as f:
    loaded = json.load(f)
\`\`\``,
    starterCode:`# Working with JSON
import json

# 1. Python dict to JSON string
student = {
    "name":    "Alice",
    "age":     20,
    "courses": ["Python", "C++", "Linux"],
    "grades":  {"Python": 95, "C++": 88, "Linux": 92},
    "active":  True,
    "gpa":     3.85
}

json_str = json.dumps(student, indent=2)
print("JSON output:")
print(json_str)

# 2. Parse JSON string back to Python
raw = '[{"id":1,"lang":"Python"},{"id":2,"lang":"C++"},{"id":3,"lang":"Linux"}]'
courses = json.loads(raw)
print("\\nParsed courses:")
for c in courses:
    print(f"  ID {c['id']}: {c['lang']}")

# 3. Simulate API response processing
api_response = json.dumps({
    "status": "success",
    "data": {
        "users": 1250,
        "lessons_completed": 8430,
        "top_language": "Python"
    }
})

result = json.loads(api_response)
if result["status"] == "success":
    d = result["data"]
    print(f"\\nPlatform Stats:")
    print(f"  Users: {d['users']:,}")
    print(f"  Lessons completed: {d['lessons_completed']:,}")
    print(f"  Top language: {d['top_language']}")
`,
    quiz:[
      { id:"q1", question:"What does json.dumps() do?", options:["Reads a JSON file","Converts Python object to JSON string","Validates JSON","Parses JSON string"], correct:1, explanation:"json.dumps() serializes (converts) a Python object into a JSON-formatted string." },
      { id:"q2", question:"What Python type does a JSON object {} become after json.loads()?", options:["list","tuple","dict","set"], correct:2, explanation:"JSON objects {} are converted to Python dictionaries by json.loads()." },
      { id:"q3", question:"What does the indent=2 parameter in json.dumps() do?", options:["Adds 2 spaces of margin","Pretty-prints with 2-space indentation","Limits output to 2 lines","Compresses the output"], correct:1, explanation:"indent=2 formats the JSON with 2-space indentation making it human-readable." },
    ],
  },

  {
    id:"py-20", courseId:"python", order:20, title:"Sorting & Searching Algorithms", duration:"20 min", xpReward:45, language:"python",
    theory:`# Sorting & Searching Algorithms

Understanding algorithms is fundamental to becoming a strong developer.

## Bubble Sort

Repeatedly compares adjacent elements and swaps them if out of order:

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))
\`\`\`

## Selection Sort

Finds the minimum and places it at the front:

\`\`\`python
def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
\`\`\`

## Linear Search — O(n)

\`\`\`python
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1
\`\`\`

## Binary Search — O(log n)

Only works on **sorted** arrays. Cuts the search space in half each time:

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\``,
    starterCode:`# Sorting & Searching Algorithms

def bubble_sort(arr):
    arr = arr[:]  # don't modify original
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    steps = 0
    while left <= right:
        steps += 1
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid, steps
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1, steps

# Test sorting
data = [64, 25, 12, 22, 11, 90, 45, 37]
print("Original:", data)
sorted_data = bubble_sort(data)
print("Sorted:  ", sorted_data)

# Test binary search vs linear search
import random
arr = sorted(random.sample(range(1, 1001), 100))
target = random.choice(arr)

# Linear search
def linear_search(arr, target):
    for i, v in enumerate(arr):
        if v == target: return i, i+1
    return -1, len(arr)

idx_l, steps_l = linear_search(arr, target)
idx_b, steps_b = binary_search(arr, target)

print(f"\\nSearching for {target} in 100 items:")
print(f"  Linear: found at index {idx_l} in {steps_l} steps")
print(f"  Binary: found at index {idx_b} in {steps_b} steps")
`,
    quiz:[
      { id:"q1", question:"What is the time complexity of binary search?", options:["O(n)","O(n²)","O(log n)","O(1)"], correct:2, explanation:"Binary search halves the search space each step, giving O(log n) time complexity." },
      { id:"q2", question:"What is required for binary search to work correctly?", options:["The array must have even length","The array must be sorted","The array must contain unique values","The target must be in the array"], correct:1, explanation:"Binary search only works on sorted arrays — it relies on the ordering to decide which half to search." },
      { id:"q3", question:"What is bubble sort's worst-case time complexity?", options:["O(n)","O(log n)","O(n log n)","O(n²)"], correct:3, explanation:"Bubble sort has O(n²) worst-case complexity because it uses two nested loops each iterating up to n times." },
    ],
  },

  // ── ADVANCED (21–30) ──────────────────────────────────────────────────────

  {
    id:"py-21", courseId:"python", order:21, title:"Recursion", duration:"20 min", xpReward:50, language:"python",
    theory:`# Recursion

A function that **calls itself** is recursive. Every recursive solution needs a **base case** to stop.

## Classic Example: Factorial

\`\`\`python
def factorial(n):
    if n == 0:          # base case
        return 1
    return n * factorial(n - 1)   # recursive case

print(factorial(5))  # 120
# 5 * 4 * 3 * 2 * 1 = 120
\`\`\`

## Fibonacci

\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

print([fib(i) for i in range(8)])
# [0, 1, 1, 2, 3, 5, 8, 13]
\`\`\`

## How the Call Stack Works

Each recursive call adds a frame to the call stack:

\`\`\`
factorial(3)
  → 3 * factorial(2)
       → 2 * factorial(1)
            → 1 * factorial(0)
                 → 1  (base case)
\`\`\`

## Memoization — Avoiding Repeated Work

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

print(fib(50))  # Fast! Without cache this would take forever
\`\`\``,
    starterCode:`# Recursion
from functools import lru_cache

# 1. Factorial
def factorial(n):
    if n == 0: return 1
    return n * factorial(n - 1)

for i in range(8):
    print(f"{i}! = {factorial(i)}")

# 2. Sum of digits
def digit_sum(n):
    if n < 10: return n
    return n % 10 + digit_sum(n // 10)

print(f"\\nDigit sum of 12345: {digit_sum(12345)}")

# 3. Power function
def power(base, exp):
    if exp == 0: return 1
    return base * power(base, exp - 1)

print(f"2^10 = {power(2, 10)}")

# 4. Flattening nested lists
def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

nested = [1, [2, 3], [4, [5, 6]], 7, [8, [9, [10]]]]
print(f"\\nFlattened: {flatten(nested)}")

# 5. Fast Fibonacci with memoization
@lru_cache(maxsize=None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

print(f"\\nFib(30) = {fib(30)}")
`,
    quiz:[
      { id:"q1", question:"What is the base case in recursion?", options:["The first function call","The condition that stops recursion","The recursive call","The return value"], correct:1, explanation:"The base case is the condition where the function stops calling itself and returns a direct result." },
      { id:"q2", question:"What happens if a recursive function has no base case?", options:["It returns None","It runs forever and causes a stack overflow","It returns 0","It works normally"], correct:1, explanation:"Without a base case, the function calls itself indefinitely until Python hits its recursion limit and raises RecursionError." },
      { id:"q3", question:"What does @lru_cache do for a recursive function?", options:["Makes it recursive","Stores results so they aren't recalculated","Limits recursion depth","Makes it faster by removing recursion"], correct:1, explanation:"lru_cache memoizes (caches) results so the function doesn't recalculate the same inputs, dramatically speeding up recursive functions." },
    ],
  },

  {
    id:"py-22", courseId:"python", order:22, title:"Data Structures: Stacks & Queues", duration:"18 min", xpReward:50, language:"python",
    theory:`# Stacks & Queues

## Stack — Last In, First Out (LIFO)

Like a stack of plates — you add and remove from the top:

\`\`\`python
# Using a list as a stack
stack = []
stack.append(1)   # push
stack.append(2)
stack.append(3)
print(stack.pop())  # 3 (last in, first out)
print(stack.pop())  # 2
\`\`\`

## Implementing a Stack Class

\`\`\`python
class Stack:
    def __init__(self):
        self._data = []

    def push(self, item):
        self._data.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._data.pop()

    def peek(self):
        return self._data[-1]

    def is_empty(self):
        return len(self._data) == 0

    def size(self):
        return len(self._data)
\`\`\`

## Queue — First In, First Out (FIFO)

Like a queue at a shop — first person in is first served:

\`\`\`python
from collections import deque

queue = deque()
queue.append("Alice")    # enqueue
queue.append("Bob")
queue.append("Charlie")
print(queue.popleft())   # "Alice" (first in, first out)
\`\`\``,
    starterCode:`# Stacks & Queues
from collections import deque

class Stack:
    def __init__(self):
        self._data = []
    def push(self, item):  self._data.append(item)
    def pop(self):         return self._data.pop()
    def peek(self):        return self._data[-1] if self._data else None
    def is_empty(self):    return len(self._data) == 0
    def __len__(self):     return len(self._data)
    def __str__(self):     return str(self._data)

class Queue:
    def __init__(self):
        self._data = deque()
    def enqueue(self, item): self._data.append(item)
    def dequeue(self):       return self._data.popleft()
    def front(self):         return self._data[0] if self._data else None
    def is_empty(self):      return len(self._data) == 0
    def __len__(self):       return len(self._data)
    def __str__(self):       return str(list(self._data))

# Stack: check balanced brackets
def is_balanced(s):
    stack = Stack()
    pairs = {')':'(', ']':'[', '}':'{'}
    for ch in s:
        if ch in "([{":
            stack.push(ch)
        elif ch in ")]}":
            if stack.is_empty() or stack.pop() != pairs[ch]:
                return False
    return stack.is_empty()

tests = ["(())", "([{}])", "(()", "([)]", ""]
for t in tests:
    print(f"'{t}': {is_balanced(t)}")

# Queue: simulate a help desk
print("\\n=== Help Desk Queue ===")
desk = Queue()
for name in ["Alice","Bob","Charlie","Diana"]:
    desk.enqueue(name)
    print(f"  {name} joined queue")

print("\\nServing customers:")
while not desk.is_empty():
    print(f"  Serving: {desk.dequeue()}")
`,
    quiz:[
      { id:"q1", question:"What principle does a Stack follow?", options:["FIFO","FILO","LIFO","LILO"], correct:2, explanation:"Stack follows LIFO — Last In, First Out. The most recently added item is removed first." },
      { id:"q2", question:"Which Python data structure is best for implementing a Queue efficiently?", options:["list","set","deque","dict"], correct:2, explanation:"collections.deque is optimized for O(1) appends and poplefts, making it ideal for queues. Lists are O(n) for popleft." },
      { id:"q3", question:"What is a practical use case for a Stack?", options:["Print queue","Undo/redo functionality","Breadth-first search","Task scheduling"], correct:1, explanation:"Undo/redo uses a stack — each action is pushed on, and undoing pops the last action." },
    ],
  },

  {
    id:"py-23", courseId:"python", order:23, title:"Data Structures: Linked Lists", duration:"20 min", xpReward:50, language:"python",
    theory:`# Linked Lists

A linked list is a chain of **nodes**, where each node holds a value and a reference to the next node.

## The Node

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None  # pointer to next node
\`\`\`

## Linked List Class

\`\`\`python
class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

    def display(self):
        elements = []
        current  = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        print(" -> ".join(elements))
\`\`\`

## Advantages Over Lists

- O(1) insertion/deletion at the beginning
- Dynamic size (no pre-allocation)
- Efficient for frequent insertions/deletions in the middle

## Disadvantages

- O(n) access by index (no random access)
- Extra memory for pointers`,
    starterCode:`# Linked Lists

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        node = Node(data)
        if not self.head:
            self.head = node; return
        cur = self.head
        while cur.next: cur = cur.next
        cur.next = node

    def prepend(self, data):
        node = Node(data)
        node.next = self.head
        self.head = node

    def delete(self, data):
        if not self.head: return
        if self.head.data == data:
            self.head = self.head.next; return
        cur = self.head
        while cur.next:
            if cur.next.data == data:
                cur.next = cur.next.next; return
            cur = cur.next

    def search(self, data):
        cur, idx = self.head, 0
        while cur:
            if cur.data == data: return idx
            cur = cur.next; idx += 1
        return -1

    def to_list(self):
        result, cur = [], self.head
        while cur: result.append(cur.data); cur = cur.next
        return result

    def length(self):
        count, cur = 0, self.head
        while cur: count += 1; cur = cur.next
        return count

# Test
ll = LinkedList()
for v in [10, 20, 30, 40, 50]:
    ll.append(v)

print("List:", ll.to_list())
ll.prepend(5)
print("After prepend 5:", ll.to_list())
ll.delete(30)
print("After delete 30:", ll.to_list())
print("Search 40:", ll.search(40))
print("Length:", ll.length())
`,
    quiz:[
      { id:"q1", question:"What does each node in a linked list contain?", options:["Just data","Data and an index","Data and a pointer to the next node","Data and a pointer to all nodes"], correct:2, explanation:"Each node contains data and a next pointer referencing the following node (or None for the last node)." },
      { id:"q2", question:"What is the time complexity of accessing an element by index in a linked list?", options:["O(1)","O(log n)","O(n)","O(n²)"], correct:2, explanation:"Unlike arrays, linked lists have no direct index access — you must traverse from the head, making it O(n)." },
      { id:"q3", question:"What is the main advantage of a linked list over a Python list for frequent insertions at the beginning?", options:["More memory efficient","O(1) prepend vs O(n) for list","Better cache performance","Supports more data types"], correct:1, explanation:"Prepending to a linked list is O(1) — just update the head pointer. Inserting at the start of a Python list is O(n) as all elements shift." },
    ],
  },

  {
    id:"py-24", courseId:"python", order:24, title:"Binary Trees", duration:"20 min", xpReward:50, language:"python",
    theory:`# Binary Trees

A **tree** is a hierarchical data structure. In a binary tree, each node has at most two children.

## Tree Vocabulary

- **Root**: top node
- **Leaf**: node with no children
- **Height**: number of levels
- **Parent/Child**: relationship between nodes

## Binary Search Tree (BST)

Left child < parent < right child:

\`\`\`python
class TreeNode:
    def __init__(self, val):
        self.val   = val
        self.left  = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
        else:
            self._insert(self.root, val)

    def _insert(self, node, val):
        if val < node.val:
            if node.left:  self._insert(node.left, val)
            else:          node.left = TreeNode(val)
        else:
            if node.right: self._insert(node.right, val)
            else:          node.right = TreeNode(val)
\`\`\`

## Tree Traversals

\`\`\`python
def inorder(node):    # Left, Root, Right → sorted output for BST
    if node:
        inorder(node.left)
        print(node.val, end=" ")
        inorder(node.right)

def preorder(node):   # Root, Left, Right
    if node:
        print(node.val, end=" ")
        preorder(node.left)
        preorder(node.right)
\`\`\``,
    starterCode:`# Binary Trees

class TreeNode:
    def __init__(self, val):
        self.val   = val
        self.left  = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        if not self.root: self.root = TreeNode(val); return
        self._insert(self.root, val)

    def _insert(self, node, val):
        if val < node.val:
            if node.left:  self._insert(node.left, val)
            else:          node.left = TreeNode(val)
        else:
            if node.right: self._insert(node.right, val)
            else:          node.right = TreeNode(val)

    def search(self, val):
        return self._search(self.root, val)

    def _search(self, node, val):
        if not node:       return False
        if node.val == val: return True
        if val < node.val: return self._search(node.left, val)
        return self._search(node.right, val)

    def inorder(self):
        result = []
        self._inorder(self.root, result)
        return result

    def _inorder(self, node, result):
        if node:
            self._inorder(node.left, result)
            result.append(node.val)
            self._inorder(node.right, result)

    def height(self):
        return self._height(self.root)

    def _height(self, node):
        if not node: return 0
        return 1 + max(self._height(node.left), self._height(node.right))

# Test
tree = BST()
for val in [50, 30, 70, 20, 40, 60, 80]:
    tree.insert(val)

print("Inorder (sorted):", tree.inorder())
print("Height:", tree.height())
print("Search 40:", tree.search(40))
print("Search 55:", tree.search(55))
`,
    quiz:[
      { id:"q1", question:"In a Binary Search Tree, where are smaller values stored?", options:["Right subtree","Root","Left subtree","Random position"], correct:2, explanation:"In a BST, all values smaller than a node are in its left subtree, and all larger values are in the right." },
      { id:"q2", question:"What does inorder traversal of a BST produce?", options:["Reverse sorted order","Random order","Sorted ascending order","Level by level"], correct:2, explanation:"Inorder traversal (Left, Root, Right) of a BST visits nodes in sorted ascending order." },
      { id:"q3", question:"What is the time complexity of searching a balanced BST?", options:["O(n)","O(1)","O(n²)","O(log n)"], correct:3, explanation:"A balanced BST halves the search space at each step, giving O(log n) search time." },
    ],
  },

  {
    id:"py-25", courseId:"python", order:25, title:"Big O Notation & Complexity", duration:"18 min", xpReward:50, language:"python",
    theory:`# Big O Notation & Complexity

Big O describes how an algorithm's performance **scales** with input size.

## Common Complexities (best to worst)

| Big O | Name | Example |
|-------|------|---------|
| O(1) | Constant | Dictionary lookup |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Scanning a list |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2ⁿ) | Exponential | Naive Fibonacci |

## Examples in Python

\`\`\`python
# O(1) — constant, doesn't depend on size
def get_first(lst): return lst[0]

# O(n) — linear, scales with size
def find_max(lst):
    m = lst[0]
    for x in lst:
        if x > m: m = x
    return m

# O(n²) — quadratic, nested loops
def has_duplicate(lst):
    for i in range(len(lst)):
        for j in range(i+1, len(lst)):
            if lst[i] == lst[j]: return True
    return False

# O(n) — smarter duplicate check
def has_duplicate_fast(lst):
    return len(lst) != len(set(lst))
\`\`\`

## Space Complexity

\`\`\`python
# O(1) space — uses fixed extra memory
def sum_list(lst):
    total = 0
    for x in lst: total += x
    return total

# O(n) space — creates new list
def double_list(lst):
    return [x * 2 for x in lst]
\`\`\``,
    starterCode:`# Big O — Practical Comparison
import time
import random

def time_it(func, *args):
    start = time.time()
    result = func(*args)
    return time.time() - start, result

# O(n) vs O(n²) duplicate detection
def duplicate_slow(lst):   # O(n²)
    for i in range(len(lst)):
        for j in range(i+1, len(lst)):
            if lst[i] == lst[j]: return True
    return False

def duplicate_fast(lst):   # O(n)
    return len(lst) != len(set(lst))

# Compare on different sizes
print("Size  | O(n²) time  | O(n) time")
print("-"*40)
for size in [100, 1000, 5000]:
    data = list(range(size))  # no duplicates
    t1, _ = time_it(duplicate_slow, data)
    t2, _ = time_it(duplicate_fast, data)
    print(f"{size:<5} | {t1*1000:.3f}ms      | {t2*1000:.3f}ms")

# O(log n) binary search vs O(n) linear
def linear_search(arr, t):
    for i, v in enumerate(arr): 
        if v == t: return i
    return -1

def binary_search(arr, t):
    l, r = 0, len(arr)-1
    while l <= r:
        m = (l+r)//2
        if arr[m] == t: return m
        elif arr[m] < t: l = m+1
        else: r = m-1
    return -1

big = sorted(range(100000))
target = 99999
t1, _ = time_it(linear_search, big, target)
t2, _ = time_it(binary_search, big, target)
print(f"\\nLinear search:  {t1*1000:.3f}ms")
print(f"Binary search:  {t2*1000:.3f}ms")
`,
    quiz:[
      { id:"q1", question:"What does O(1) mean?", options:["Takes 1 second","Performance doesn't change with input size","Only works for 1 element","One operation per element"], correct:1, explanation:"O(1) is constant time — the algorithm takes the same time regardless of input size." },
      { id:"q2", question:"A function with two nested loops over n elements has what complexity?", options:["O(n)","O(2n)","O(n log n)","O(n²)"], correct:3, explanation:"Two nested loops each running n times gives O(n × n) = O(n²) quadratic complexity." },
      { id:"q3", question:"Which is more efficient for large inputs: O(n²) or O(n log n)?", options:["O(n²)","They are equal","O(n log n)","Depends on the machine"], correct:2, explanation:"O(n log n) grows much slower than O(n²). For n=1000: n log n ≈ 10,000 vs n² = 1,000,000 operations." },
    ],
  },

  {
    id:"py-26", courseId:"python", order:26, title:"Functional Programming", duration:"18 min", xpReward:45, language:"python",
    theory:`# Functional Programming

Functional programming treats computation as evaluating mathematical functions — avoiding changing state or mutable data.

## Core Concepts

### Pure Functions
Always return the same output for the same input, no side effects:

\`\`\`python
# Pure
def add(a, b): return a + b

# Impure (modifies external state)
total = 0
def add_to_total(n):
    global total
    total += n
\`\`\`

### map() — Transform

\`\`\`python
nums    = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, nums))
# [1, 4, 9, 16, 25]
\`\`\`

### filter() — Select

\`\`\`python
evens = list(filter(lambda x: x % 2 == 0, nums))
# [2, 4]
\`\`\`

### reduce() — Accumulate

\`\`\`python
from functools import reduce

product = reduce(lambda a, b: a * b, nums)
# 1*2*3*4*5 = 120
\`\`\`

### functools.partial — Partial Application

\`\`\`python
from functools import partial

def power(base, exp): return base ** exp
square = partial(power, exp=2)
cube   = partial(power, exp=3)

print(square(5))  # 25
print(cube(3))    # 27
\`\`\``,
    starterCode:`# Functional Programming
from functools import reduce, partial

numbers = list(range(1, 11))

# map: square all
squares = list(map(lambda x: x**2, numbers))
print("Squares:", squares)

# filter: keep only even squares
even_squares = list(filter(lambda x: x % 2 == 0, squares))
print("Even squares:", even_squares)

# reduce: product of all numbers
product = reduce(lambda a, b: a * b, numbers)
print("Product 1-10:", product)

# Chaining: sum of squares of odd numbers
result = reduce(
    lambda a, b: a + b,
    map(lambda x: x**2,
        filter(lambda x: x % 2 != 0, numbers))
)
print("Sum of squares of odds:", result)

# partial application
def power(base, exp): return base ** exp
square = partial(power, exp=2)
cube   = partial(power, exp=3)

print("\\nPartial functions:")
print([square(i) for i in range(1, 6)])
print([cube(i)   for i in range(1, 6)])

# Pipeline function
def pipeline(*funcs):
    def apply(value):
        for f in funcs:
            value = f(value)
        return value
    return apply

process = pipeline(
    lambda x: x * 2,
    lambda x: x + 10,
    lambda x: x ** 2,
)
print("\\nPipeline(5):", process(5))
`,
    quiz:[
      { id:"q1", question:"What defines a pure function?", options:["It uses no variables","It always returns the same output for the same input with no side effects","It only takes one argument","It uses lambda syntax"], correct:1, explanation:"A pure function always produces the same result for the same inputs and doesn't modify any external state." },
      { id:"q2", question:"What does reduce() do?", options:["Filters elements","Creates a new list","Accumulates a list into a single value","Maps elements"], correct:2, explanation:"reduce() applies a function cumulatively to items, reducing the sequence to a single value (e.g. summing or multiplying all elements)." },
      { id:"q3", question:"What does functools.partial do?", options:["Splits a function","Creates a new function with some arguments pre-filled","Partially imports a module","Runs a function partially"], correct:1, explanation:"partial creates a new callable with some arguments already fixed, useful for creating specialized versions of general functions." },
    ],
  },

  {
    id:"py-27", courseId:"python", order:27, title:"Context Managers", duration:"15 min", xpReward:40, language:"python",
    theory:`# Context Managers

Context managers handle **setup and teardown** automatically using the \`with\` statement.

## The with Statement

\`\`\`python
# Without context manager — you must remember to close
f = open("file.txt")
data = f.read()
f.close()

# With context manager — closes automatically
with open("file.txt") as f:
    data = f.read()
# File is automatically closed here, even if an error occurred
\`\`\`

## Building Your Own with __enter__ and __exit__

\`\`\`python
class Timer:
    import time

    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start
        print(f"Elapsed: {elapsed:.4f}s")
        return False  # don't suppress exceptions

with Timer():
    total = sum(range(1_000_000))
# Elapsed: 0.0421s
\`\`\`

## contextlib.contextmanager

\`\`\`python
from contextlib import contextmanager

@contextmanager
def managed_resource(name):
    print(f"Opening {name}")
    try:
        yield name.upper()
    finally:
        print(f"Closing {name}")

with managed_resource("database") as db:
    print(f"Using {db}")
\`\`\``,
    starterCode:`# Context Managers
import time
from contextlib import contextmanager

# Custom Timer context manager
class Timer:
    def __enter__(self):
        self.start = time.time()
        print("Timer started")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed = time.time() - self.start
        print(f"Timer stopped: {self.elapsed:.6f}s")
        return False  # don't suppress exceptions

# Test Timer
with Timer() as t:
    result = sum(i**2 for i in range(100000))
print(f"Result: {result}")

# contextmanager decorator
@contextmanager
def section(title):
    print(f"\\n{'='*40}")
    print(f"  {title}")
    print('='*40)
    start = time.time()
    try:
        yield
    finally:
        print(f"  Done in {time.time()-start:.4f}s")
        print('='*40)

with section("Processing data"):
    data = sorted(range(10000, 0, -1))
    total = sum(data)
    print(f"  Sum: {total:,}")

with section("String operations"):
    words = ["python","functional","context","manager"]
    result = " ".join(w.title() for w in sorted(words))
    print(f"  Result: {result}")
`,
    quiz:[
      { id:"q1", question:"What does the __enter__ method return in a context manager?", options:["Nothing","The value bound to 'as' variable","Always self","True or False"], correct:1, explanation:"Whatever __enter__ returns is bound to the variable after 'as' in the with statement." },
      { id:"q2", question:"When does __exit__ get called?", options:["Only on success","Only on error","Always, when the with block ends","Only when return is called"], correct:2, explanation:"__exit__ is always called when the with block ends, whether normally or due to an exception — this is how cleanup is guaranteed." },
      { id:"q3", question:"What is the main benefit of using context managers?", options:["Faster code","Guaranteed cleanup even if errors occur","Better syntax","Less memory usage"], correct:1, explanation:"Context managers guarantee that cleanup code (closing files, releasing locks) runs even if an exception occurs in the block." },
    ],
  },

  {
    id:"py-28", courseId:"python", order:28, title:"Threading & Concurrency", duration:"20 min", xpReward:50, language:"python",
    theory:`# Threading & Concurrency

## The Problem: Blocking Operations

\`\`\`python
import time

def download(url):
    time.sleep(2)   # simulates network delay
    print(f"Downloaded {url}")

# Sequential — takes 6 seconds for 3 URLs
download("url1")
download("url2")
download("url3")
\`\`\`

## Threading — Run Concurrently

\`\`\`python
import threading

threads = []
for url in ["url1","url2","url3"]:
    t = threading.Thread(target=download, args=(url,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()   # wait for all to finish
# Takes ~2 seconds instead of 6!
\`\`\`

## Thread Safety with Locks

\`\`\`python
lock    = threading.Lock()
counter = 0

def increment():
    global counter
    with lock:          # only one thread at a time
        counter += 1

threads = [threading.Thread(target=increment) for _ in range(1000)]
for t in threads: t.start()
for t in threads: t.join()
print(counter)  # Always 1000 (not guaranteed without lock)
\`\`\`

## GIL Note

Python's Global Interpreter Lock (GIL) means threads share one CPU core. Threading is best for **I/O-bound** tasks (network, files). Use \`multiprocessing\` for **CPU-bound** tasks.`,
    starterCode:`# Threading
import threading
import time
import random

results = {}
lock = threading.Lock()

def compute_stats(name, data):
    time.sleep(random.uniform(0.1, 0.3))  # simulate work
    stats = {
        "min":  min(data),
        "max":  max(data),
        "mean": sum(data) / len(data),
        "sum":  sum(data),
    }
    with lock:
        results[name] = stats

# Create datasets
datasets = {
    "Dataset A": [random.randint(1, 100) for _ in range(1000)],
    "Dataset B": [random.randint(1, 100) for _ in range(1000)],
    "Dataset C": [random.randint(1, 100) for _ in range(1000)],
}

# Sequential
start = time.time()
for name, data in datasets.items():
    compute_stats(name, data)
seq_time = time.time() - start
print(f"Sequential: {seq_time:.3f}s")

results.clear()

# Threaded
start = time.time()
threads = [
    threading.Thread(target=compute_stats, args=(name, data))
    for name, data in datasets.items()
]
for t in threads: t.start()
for t in threads: t.join()
thr_time = time.time() - start
print(f"Threaded:   {thr_time:.3f}s")
print(f"Speedup:    {seq_time/thr_time:.1f}x")

print("\\nResults:")
for name, stats in results.items():
    print(f"  {name}: mean={stats['mean']:.1f}, min={stats['min']}, max={stats['max']}")
`,
    quiz:[
      { id:"q1", question:"What is a threading.Lock() used for?", options:["To speed up threads","To prevent multiple threads accessing shared data simultaneously","To create new threads","To stop all threads"], correct:1, explanation:"A Lock ensures only one thread at a time can execute a critical section, preventing race conditions on shared data." },
      { id:"q2", question:"What does t.join() do?", options:["Starts the thread","Stops the thread","Waits for the thread to finish","Copies the thread"], correct:2, explanation:"join() blocks the calling thread until the thread it's called on completes execution." },
      { id:"q3", question:"Python threading is best suited for which type of tasks?", options:["CPU-bound tasks","GPU tasks","I/O-bound tasks","Memory-intensive tasks"], correct:2, explanation:"Due to the GIL, Python threads don't run in parallel for CPU work. They excel at I/O-bound tasks (network, file) where threads wait most of the time." },
    ],
  },

  {
    id:"py-29", courseId:"python", order:29, title:"Async Programming with asyncio", duration:"20 min", xpReward:50, language:"python",
    theory:`# Async Programming with asyncio

Asyncio is Python's built-in library for **asynchronous** programming using \`async\`/\`await\`.

## async / await

\`\`\`python
import asyncio

async def greet(name, delay):
    await asyncio.sleep(delay)   # non-blocking wait
    print(f"Hello, {name}!")

# Run a single coroutine
asyncio.run(greet("Alice", 1))
\`\`\`

## Running Multiple Coroutines

\`\`\`python
async def main():
    # Sequential — takes 3 seconds
    await greet("Alice", 1)
    await greet("Bob",   2)

async def main_fast():
    # Concurrent — takes 2 seconds (the longest)
    await asyncio.gather(
        greet("Alice", 1),
        greet("Bob",   2),
    )

asyncio.run(main_fast())
\`\`\`

## Async vs Threads

| | asyncio | threading |
|--|---------|-----------|
| Best for | I/O-bound, many tasks | I/O-bound, few tasks |
| Overhead | Very low | Higher |
| Complexity | Medium | Higher (locks needed) |
| GIL | Not affected | Affected |

## Real-world Use

Asyncio powers web frameworks like **FastAPI** and **aiohttp** that handle thousands of concurrent requests.`,
    starterCode:`# Asyncio
import asyncio
import time

async def fetch_data(source, delay):
    print(f"  Fetching from {source}...")
    await asyncio.sleep(delay)
    return {"source": source, "records": delay * 100}

async def process(data):
    await asyncio.sleep(0.1)
    return {**data, "processed": True}

async def pipeline(source, delay):
    data    = await fetch_data(source, delay)
    result  = await process(data)
    print(f"  Done: {source} → {result['records']} records")
    return result

async def main():
    sources = [
        ("Database A", 0.3),
        ("Database B", 0.5),
        ("API C",      0.2),
        ("Cache D",    0.1),
    ]

    print("Sequential:")
    start = time.time()
    for source, delay in sources:
        await pipeline(source, delay)
    print(f"Time: {time.time()-start:.2f}s")

    print("\\nConcurrent:")
    start = time.time()
    results = await asyncio.gather(
        *[pipeline(s, d) for s, d in sources]
    )
    print(f"Time: {time.time()-start:.2f}s")
    print(f"Total records: {sum(r['records'] for r in results)}")

asyncio.run(main())
`,
    quiz:[
      { id:"q1", question:"What does 'await' do in an async function?", options:["Stops the program","Pauses the coroutine and lets other coroutines run","Creates a new thread","Blocks all other code"], correct:1, explanation:"await pauses the current coroutine, returning control to the event loop so other coroutines can run during the wait." },
      { id:"q2", question:"What does asyncio.gather() do?", options:["Runs coroutines one by one","Runs multiple coroutines concurrently","Collects return values only","Creates new threads"], correct:1, explanation:"asyncio.gather() runs multiple coroutines concurrently and waits for all of them to complete." },
      { id:"q3", question:"What is a coroutine in Python?", options:["A regular function","A thread","A function defined with async def that can be paused","A generator"], correct:2, explanation:"A coroutine is an async def function that can pause at await points and resume later, enabling cooperative multitasking." },
    ],
  },

  {
    id:"py-30", courseId:"python", order:30, title:"Testing with pytest", duration:"18 min", xpReward:50, language:"python",
    theory:`# Testing with pytest

Testing ensures your code works correctly and continues to work as you make changes.

## Why Test?

- Catch bugs early
- Refactor with confidence
- Document expected behavior
- Prevent regressions

## Writing Tests

\`\`\`python
# test_math.py
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3)  == 5
    assert add(-1, 1) == 0
    assert add(0, 0)  == 0
\`\`\`

Run with: \`pytest test_math.py\`

## Testing Exceptions

\`\`\`python
import pytest

def divide(a, b):
    if b == 0: raise ValueError("Cannot divide by zero")
    return a / b

def test_divide():
    assert divide(10, 2) == 5
    with pytest.raises(ValueError):
        divide(10, 0)
\`\`\`

## Fixtures

\`\`\`python
@pytest.fixture
def sample_data():
    return [1, 2, 3, 4, 5]

def test_sum(sample_data):
    assert sum(sample_data) == 15

def test_max(sample_data):
    assert max(sample_data) == 5
\`\`\`

## Parametrize — Test Multiple Cases

\`\`\`python
@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected
\`\`\``,
    starterCode:`# Testing — Manual test runner (pytest runs outside browser)
# This simulates what pytest would do

def run_test(name, func):
    try:
        func()
        print(f"  ✅ PASS: {name}")
        return True
    except AssertionError as e:
        print(f"  ❌ FAIL: {name} — {e}")
        return False
    except Exception as e:
        print(f"  💥 ERROR: {name} — {e}")
        return False

# ── Functions to test ─────────────────────────────────────────────────
def is_palindrome(s):
    s = s.replace(" ","").lower()
    return s == s[::-1]

def fizzbuzz(n):
    if n % 15 == 0: return "FizzBuzz"
    if n % 3  == 0: return "Fizz"
    if n % 5  == 0: return "Buzz"
    return str(n)

def find_max(lst):
    if not lst: raise ValueError("Empty list")
    return max(lst)

# ── Tests ─────────────────────────────────────────────────────────────
print("Running tests...\\n")
passed = 0
total  = 0

tests = [
    ("palindrome: racecar",    lambda: assert_eq(is_palindrome("racecar"), True)),
    ("palindrome: hello",      lambda: assert_eq(is_palindrome("hello"), False)),
    ("palindrome: spaces",     lambda: assert_eq(is_palindrome("A man a plan a canal Panama"), True)),
    ("fizzbuzz: 15",           lambda: assert_eq(fizzbuzz(15), "FizzBuzz")),
    ("fizzbuzz: 9",            lambda: assert_eq(fizzbuzz(9),  "Fizz")),
    ("fizzbuzz: 10",           lambda: assert_eq(fizzbuzz(10), "Buzz")),
    ("fizzbuzz: 7",            lambda: assert_eq(fizzbuzz(7),  "7")),
    ("find_max: normal",       lambda: assert_eq(find_max([3,1,9,2]), 9)),
    ("find_max: single",       lambda: assert_eq(find_max([42]), 42)),
    ("find_max: empty raises", lambda: assert_raises(lambda: find_max([]), ValueError)),
]

def assert_eq(actual, expected):
    assert actual == expected, f"Expected {expected!r}, got {actual!r}"

def assert_raises(func, exc):
    try:
        func()
        assert False, f"Expected {exc.__name__} but no exception raised"
    except exc:
        pass

for name, test in tests:
    total += 1
    if run_test(name, test): passed += 1

print(f"\\nResults: {passed}/{total} tests passed")
`,
    quiz:[
      { id:"q1", question:"What does the assert keyword do in a Python test?", options:["Prints a value","Raises AssertionError if condition is False","Returns True","Stops the program"], correct:1, explanation:"assert checks if a condition is True. If False, it raises AssertionError with an optional message — pytest catches these to report failures." },
      { id:"q2", question:"What does @pytest.fixture do?", options:["Marks a test to skip","Creates reusable test setup code","Runs a test multiple times","Marks a function as async"], correct:1, explanation:"Fixtures provide reusable setup data or objects for tests. Any test function that lists a fixture name as a parameter automatically receives it." },
      { id:"q3", question:"What is regression testing?", options:["Testing new features","Ensuring old tests still pass after changes","Testing performance","Testing on different machines"], correct:1, explanation:"Regression testing verifies that existing functionality still works correctly after new code changes — preventing old bugs from returning." },
    ],
  },
];

// ── DAILY CHALLENGES ──────────────────────────────────────────────────────────

function dateStr(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

const newChallenges = [
  { title:"Count Word Frequency", description:"Write a function that takes a sentence and returns a dictionary with each word as a key and its count as the value. The function should be case-insensitive.", language:"python", difficulty:"Easy", xpReward:75, starterCode: `def word_frequency(sentence):\n    # Write your solution here\n    pass\n\nprint(word_frequency("the cat sat on the mat the cat"))\n# Expected: {'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}\nprint(word_frequency("Hello hello HELLO"))\n# Expected: {'hello': 3}`, expectedOutput: "{'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}\nprint(word_frequency(\"Hello hello HELLO\"))\n", hint:"Convert to lowercase first, then split into words, then use a dictionary to count." },
  { title:"Flatten a Nested List", description:"Write a function that takes a nested list (any depth) and returns a flat list containing all elements.", language:"python", difficulty:"Medium", xpReward:100, starterCode: `def flatten(lst):\n    # Write your solution here\n    pass\n\nprint(flatten([1, [2, 3], [4, [5, 6]]]))\n# Expected: [1, 2, 3, 4, 5, 6]\nprint(flatten([[1, [2]], [3, [4, [5]]]]))\n# Expected: [1, 2, 3, 4, 5]`, expectedOutput: "[1, 2, 3, 4, 5, 6]\nprint(flatten([[1, [2]], [3, [4, [5]]]]))\n", hint:"Use recursion — if an item is a list, flatten it; otherwise append it to results." },
  { title:"Check Prime Number", description:"Write a function that returns True if a number is prime, and False otherwise. Then use it to find all prime numbers between 1 and 50.", language:"python", difficulty:"Easy", xpReward:75, starterCode: `def is_prime(n):\n    # Write your solution here\n    pass\n\nprint(is_prime(7))   # True\nprint(is_prime(10))  # False\nprint(is_prime(1))   # False\n\n# Find all primes from 2 to 50\nprimes = [n for n in range(2, 51) if is_prime(n)]\nprint("Primes:", primes)`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"A number is prime if it's only divisible by 1 and itself. Check divisors up to sqrt(n)." },
  { title:"Remove Duplicates Preserving Order", description:"Write a function that removes duplicates from a list while preserving the original order of first appearances. Do NOT use set() directly on the list.", language:"python", difficulty:"Easy", xpReward:75, starterCode: `def remove_duplicates(lst):\n    # Write your solution here — don't use list(set(lst))\n    pass\n\nprint(remove_duplicates([1,2,3,2,1,4,3,5]))\n# Expected: [1, 2, 3, 4, 5]\nprint(remove_duplicates(["a","b","a","c","b"]))\n# Expected: ['a', 'b', 'c']`, expectedOutput: "[1, 2, 3, 4, 5]\nprint(remove_duplicates([\"a\",\"b\",\"a\",\"c\",\"b\"]))\n", hint:"Keep a 'seen' set to track what you've added, and only append items not already seen." },
  { title:"Anagram Checker", description:"Write a function that checks if two strings are anagrams of each other (contain the same letters in any order). Ignore spaces and case.", language:"python", difficulty:"Easy", xpReward:75, starterCode: `def is_anagram(s1, s2):\n    # Write your solution here\n    pass\n\nprint(is_anagram("listen", "silent"))   # True\nprint(is_anagram("hello", "world"))     # False\nprint(is_anagram("Astronomer", "Moon starer"))  # True`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Remove spaces, convert to lowercase, then compare sorted characters." },
  { title:"Matrix Transpose", description:"Write a function that takes a 2D list (matrix) and returns its transpose — rows become columns and columns become rows.", language:"python", difficulty:"Medium", xpReward:100, starterCode: `def transpose(matrix):\n    # Write your solution here\n    pass\n\nmatrix = [[1,2,3],[4,5,6],[7,8,9]]\nresult = transpose(matrix)\nfor row in result:\n    print(row)\n# Expected:\n# [1, 4, 7]\n# [2, 5, 8]\n# [3, 6, 9]`, expectedOutput: "\n# [1, 4, 7]\n# [2, 5, 8]\n# [3, 6, 9]", hint:"The element at [i][j] in the original becomes [j][i] in the transpose. Try list comprehensions with zip()." },
  { title:"Caesar Cipher", description:"Implement a Caesar cipher that shifts each letter by a given number. Non-letter characters should remain unchanged. Support both encoding and decoding.", language:"python", difficulty:"Medium", xpReward:100, starterCode: `def caesar_cipher(text, shift, decode=False):\n    # Write your solution here\n    pass\n\nprint(caesar_cipher("Hello, World!", 3))\n# Expected: Khoor, Zruog!\nprint(caesar_cipher("Khoor, Zruog!", 3, decode=True))\n# Expected: Hello, World!`, expectedOutput: "Khoor, Zruog!\nprint(caesar_cipher(\"Khoor, Zruog!\", 3, decode=True))\n", hint:"Use ord() and chr() to work with character codes. uppercase: 65-90, lowercase: 97-122. Use modulo 26 to wrap around." },
  { title:"Stack Using Two Queues", description:"Implement a Stack class using only two queue (deque) objects. The stack must support push(), pop(), peek(), and is_empty() operations.", language:"python", difficulty:"Hard", xpReward:150, starterCode: `from collections import deque\n\nclass Stack:\n    def __init__(self):\n        self.q1 = deque()\n        self.q2 = deque()\n    \n    def push(self, item):\n        pass\n    \n    def pop(self):\n        pass\n    \n    def peek(self):\n        pass\n    \n    def is_empty(self):\n        pass\n\ns = Stack()\ns.push(1); s.push(2); s.push(3)\nprint(s.peek())   # 3\nprint(s.pop())    # 3\nprint(s.pop())    # 2\nprint(s.is_empty())  # False\nprint(s.pop())    # 1\nprint(s.is_empty())  # True`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"When pushing, move all elements from q1 to q2, enqueue the new item to q1, then move everything back from q2 to q1." },
  { title:"Merge Two Sorted Lists", description:"Given two sorted lists, write a function that merges them into one sorted list without using the built-in sort() function.", language:"python", difficulty:"Medium", xpReward:100, starterCode: `def merge_sorted(lst1, lst2):\n    # Write your solution here\n    pass\n\nprint(merge_sorted([1,3,5,7], [2,4,6,8]))\n# Expected: [1, 2, 3, 4, 5, 6, 7, 8]\nprint(merge_sorted([1,2,3], [4,5,6]))\n# Expected: [1, 2, 3, 4, 5, 6]\nprint(merge_sorted([], [1,2,3]))\n# Expected: [1, 2, 3]`, expectedOutput: "[1, 2, 3, 4, 5, 6, 7, 8]\nprint(merge_sorted([1,2,3], [4,5,6]))\n", hint:"Use two pointers — compare the front of each list and take the smaller element each time." },
  { title:"Generate All Permutations", description:"Write a function that generates all permutations of a given list. For [1,2,3] there are 6 permutations.", language:"python", difficulty:"Hard", xpReward:150, starterCode: `def permutations(lst):\n    # Write your solution here\n    pass\n\nresult = permutations([1, 2, 3])\nfor p in sorted(result):\n    print(p)\n# 6 lines expected:\n# [1, 2, 3]\n# [1, 3, 2]\n# [2, 1, 3]\n# [2, 3, 1]\n# [3, 1, 2]\n# [3, 2, 1]\nprint(f"Total: {len(permutations([1,2,3,4]))} permutations of 4 items")`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Use recursion — for each element, generate all permutations of the remaining elements and prepend the current element." },
  { title:"Longest Common Subsequence", description:"Find the length of the longest common subsequence (LCS) between two strings. A subsequence preserves order but doesn't need to be contiguous.", language:"python", difficulty:"Hard", xpReward:150, starterCode: `def lcs_length(s1, s2):\n    # Write your solution here (use dynamic programming)\n    pass\n\nprint(lcs_length("ABCBDAB", "BDCAB"))  # Expected: 4 (BCAB or BDAB)\nprint(lcs_length("AGGTAB", "GXTXAYB")) # Expected: 4 (GTAB)\nprint(lcs_length("abc", "abc"))         # Expected: 3`, expectedOutput: "4 (BCAB or BDAB)\nprint(lcs_length(\"AGGTAB\", \"GXTXAYB\"))", hint:"Build a 2D DP table. dp[i][j] = LCS length of s1[:i] and s2[:j]. If characters match, dp[i][j] = dp[i-1][j-1] + 1." },
  { title:"Validate Sudoku Row", description:"Write a function that checks if a given row (list of 9 numbers 1-9) is valid for Sudoku — each number appears exactly once with no zeros.", language:"python", difficulty:"Easy", xpReward:75, starterCode: `def is_valid_sudoku_row(row):\n    # Write your solution here\n    pass\n\nprint(is_valid_sudoku_row([1,2,3,4,5,6,7,8,9]))  # True\nprint(is_valid_sudoku_row([1,2,3,4,5,6,7,8,8]))  # False (8 repeats)\nprint(is_valid_sudoku_row([1,2,3,4,5,6,7,8]))    # False (only 8 elements)\nprint(is_valid_sudoku_row([0,2,3,4,5,6,7,8,9]))  # False (contains 0)`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"A valid row has exactly 9 elements, no zeros, and all values are unique (set length equals 9)." },
  { title:"Roman Numeral Converter", description:"Write a function that converts an integer (1–3999) to its Roman numeral representation.", language:"python", difficulty:"Medium", xpReward:100, starterCode: `def to_roman(num):\n    # Write your solution here\n    pass\n\nprint(to_roman(3))     # III\nprint(to_roman(9))     # IX\nprint(to_roman(14))    # XIV\nprint(to_roman(40))    # XL\nprint(to_roman(58))    # LVIII\nprint(to_roman(1994))  # MCMXCIV\nprint(to_roman(3749))  # MMMDCCXLIX`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Create a list of value-symbol pairs in descending order. Repeatedly subtract the largest possible value and append its symbol." },
  { title:"Spiral Matrix", description:"Given an n×n matrix, return all elements in spiral order (clockwise from the top-left).", language:"python", difficulty:"Hard", xpReward:150, starterCode: `def spiral_order(matrix):\n    # Write your solution here\n    pass\n\nmatrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nprint(spiral_order(matrix))\n# Expected: [1, 2, 3, 6, 9, 8, 7, 4, 5]\n\nbig = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]\nprint(spiral_order(big))\n# Expected: [1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10]`, expectedOutput: "[1, 2, 3, 6, 9, 8, 7, 4, 5]\n\nbig = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]\nprint(spiral_order(big))\n", hint:"Use four pointers: top, bottom, left, right. Traverse the outer ring, then shrink the boundaries inward." },
  { title:"Implement a Simple Calculator", description:"Build a calculator that takes a string like '10 + 5 * 2' and evaluates it respecting operator precedence (*, / before +, -).", language:"python", difficulty:"Hard", xpReward:150, starterCode: `def calculate(expression):\n    # Evaluate a math expression string respecting precedence\n    # Only handles +, -, *, / with integers\n    pass\n\nprint(calculate("3 + 5"))        # 8\nprint(calculate("10 - 3"))       # 7\nprint(calculate("2 * 6"))        # 12\nprint(calculate("10 + 5 * 2"))   # 20 (not 30)\nprint(calculate("20 - 4 * 3"))   # 8\nprint(calculate("6 + 4 / 2"))    # 8.0`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Split by spaces to get tokens. Handle * and / first (pass 1), then + and - (pass 2), building result lists." },
  { title:"Memoized Coin Change", description:"Given a list of coin denominations and a target amount, find the minimum number of coins needed to make the amount. Return -1 if impossible.", language:"python", difficulty:"Hard", xpReward:150, starterCode: `def coin_change(coins, amount):\n    # Use dynamic programming\n    pass\n\nprint(coin_change([1,5,6,9], 11))  # 2 (5+6)\nprint(coin_change([2], 3))          # -1 (impossible)\nprint(coin_change([1,2,5], 11))    # 3 (5+5+1)\nprint(coin_change([1], 0))          # 0`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Build a DP array where dp[i] = min coins to make amount i. Initialize with infinity, dp[0]=0. For each amount, try each coin." },
  { title:"Group Anagrams", description:"Given a list of strings, group the anagrams together. Each group should be a list of strings that are anagrams of each other.", language:"python", difficulty:"Medium", xpReward:100, starterCode: `def group_anagrams(words):\n    # Write your solution here\n    pass\n\nresult = group_anagrams(["eat","tea","tan","ate","nat","bat"])\nfor group in sorted(result, key=lambda g: sorted(g)[0]):\n    print(sorted(group))\n# Expected groups (any order):\n# ['ate', 'eat', 'tea']\n# ['bat']\n# ['nat', 'tan']`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Use a dictionary where the key is the sorted version of each word — anagrams will have the same sorted key." },
  { title:"Balanced Binary Tree Check", description:"Given a binary tree represented as a nested list [value, left, right] (or None for empty), check if it is height-balanced (no subtree differs in height by more than 1).", language:"python", difficulty:"Hard", xpReward:150, starterCode: `def is_balanced(tree):\n    # tree format: [value, left, right] or None\n    pass\n\n# Balanced tree\nt1 = [1, [2, [4,None,None], None], [3, None, [5,None,None]]]\nprint(is_balanced(t1))  # True\n\n# Unbalanced tree  \nt2 = [1, [2, [3, [4,None,None], None], None], None]\nprint(is_balanced(t2))  # False\n\nprint(is_balanced(None))  # True (empty is balanced)`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Write a helper that returns the height of the tree (or -1 if unbalanced). At each node, check if both subtrees are balanced and their heights differ by at most 1." },
  { title:"Run Length Encoding", description:"Implement run-length encoding (RLE) compression and decompression. 'AAABBBCCCC' becomes '3A3B4C'.", language:"python", difficulty:"Easy", xpReward:75, starterCode: `def encode(s):\n    # Write your solution here\n    pass\n\ndef decode(s):\n    # Write your solution here\n    pass\n\nprint(encode("AAABBBCCCC"))   # 3A3B4C\nprint(encode("ABCDE"))        # 1A1B1C1D1E\nprint(encode("AABBAAA"))      # 2A2B3A\n\nprint(decode("3A3B4C"))        # AAABBBCCCC\nprint(decode("2A2B3A"))        # AABBAAA`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"For encoding: count consecutive characters. For decoding: read digits to get count, then the following letter." },
  { title:"Two Sum Problem", description:"Given a list of numbers and a target, return the indices of the two numbers that add up to the target. Assume exactly one solution exists. Do it in O(n) time.", language:"python", difficulty:"Easy", xpReward:75, starterCode: `def two_sum(nums, target):\n    # Write your O(n) solution here\n    pass\n\nprint(two_sum([2,7,11,15], 9))   # [0, 1]\nprint(two_sum([3,2,4], 6))       # [1, 2]\nprint(two_sum([3,3], 6))         # [0, 1]`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Use a dictionary to store each number and its index. For each number, check if target - number is already in the dictionary." },
  { title:"Number to Words", description:"Write a function that converts a number (0–999) to its English word representation.", language:"python", difficulty:"Medium", xpReward:100, starterCode: `def num_to_words(n):\n    # Write your solution here\n    pass\n\nprint(num_to_words(0))    # zero\nprint(num_to_words(15))   # fifteen\nprint(num_to_words(42))   # forty two\nprint(num_to_words(100))  # one hundred\nprint(num_to_words(251))  # two hundred fifty one\nprint(num_to_words(999))  # nine hundred ninety nine`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Define lists for ones (zero-nineteen) and tens (twenty, thirty...). Handle hundreds separately, then tens, then ones." },
  { title:"Sliding Window Maximum", description:"Given an array and window size k, find the maximum value in each sliding window of size k as it moves from left to right.", language:"python", difficulty:"Hard", xpReward:150, starterCode: `def sliding_window_max(nums, k):\n    # Write your solution here\n    pass\n\nprint(sliding_window_max([1,3,-1,-3,5,3,6,7], 3))\n# Expected: [3, 3, 5, 5, 6, 7]\nprint(sliding_window_max([1,2,3,4,5], 2))\n# Expected: [2, 3, 4, 5]`, expectedOutput: "[3, 3, 5, 5, 6, 7]\nprint(sliding_window_max([1,2,3,4,5], 2))\n", hint:"Use a deque to store indices. Maintain the deque in decreasing order of values. Remove indices outside the window from the front." },
  { title:"Password Strength Checker", description:"Write a function that rates password strength. A strong password has 8+ characters, uppercase, lowercase, digit, and special character.", language:"python", difficulty:"Easy", xpReward:75, starterCode: `def check_password(password):\n    # Return: 'Weak', 'Moderate', or 'Strong'\n    pass\n\nprint(check_password("abc"))           # Weak\nprint(check_password("password123"))   # Moderate  \nprint(check_password("P@ssw0rd!"))     # Strong\nprint(check_password("Short1!"))       # Moderate (too short)`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Check each requirement separately: len >= 8, has_upper, has_lower, has_digit, has_special. Count how many are satisfied." },
  { title:"Merge Intervals", description:"Given a list of intervals [start, end], merge all overlapping intervals and return the result.", language:"python", difficulty:"Medium", xpReward:100, starterCode: `def merge_intervals(intervals):\n    # Write your solution here\n    pass\n\nprint(merge_intervals([[1,3],[2,6],[8,10],[15,18]]))\n# Expected: [[1,6],[8,10],[15,18]]\nprint(merge_intervals([[1,4],[4,5]]))\n# Expected: [[1,5]]\nprint(merge_intervals([[1,4],[0,4]]))\n# Expected: [[0,4]]`, expectedOutput: "[[1,6],[8,10],[15,18]]\nprint(merge_intervals([[1,4],[4,5]]))\n", hint:"Sort intervals by start time. Then iterate and merge if current interval overlaps with the last merged one." },
  { title:"Longest Palindromic Substring", description:"Find the longest palindromic substring in a given string.", language:"python", difficulty:"Hard", xpReward:150, starterCode: `def longest_palindrome(s):\n    # Write your solution here\n    pass\n\nprint(longest_palindrome("babad"))   # "bab" or "aba"\nprint(longest_palindrome("cbbd"))    # "bb"\nprint(longest_palindrome("racecar")) # "racecar"\nprint(longest_palindrome("a"))       # "a"`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Expand around each character (and each pair) as a potential center. Keep track of the longest palindrome found." },
  { title:"Implement Queue Using Stacks", description:"Implement a Queue using only two Stack (list) objects. Support enqueue(), dequeue(), front(), and is_empty().", language:"python", difficulty:"Medium", xpReward:100, starterCode: `class Queue:\n    def __init__(self):\n        self.stack1 = []  # for enqueue\n        self.stack2 = []  # for dequeue\n    \n    def enqueue(self, item):\n        pass\n    \n    def dequeue(self):\n        pass\n    \n    def front(self):\n        pass\n    \n    def is_empty(self):\n        pass\n\nq = Queue()\nq.enqueue(1); q.enqueue(2); q.enqueue(3)\nprint(q.front())    # 1\nprint(q.dequeue())  # 1\nprint(q.dequeue())  # 2\nq.enqueue(4)\nprint(q.dequeue())  # 3\nprint(q.dequeue())  # 4\nprint(q.is_empty()) # True`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Always push to stack1. When dequeuing, if stack2 is empty, move all from stack1 to stack2 (reversing order). Then pop from stack2." },
  { title:"Find Missing Number", description:"Given a list containing n distinct numbers in the range 0 to n, find the one number missing from the list.", language:"python", difficulty:"Easy", xpReward:75, starterCode: `def find_missing(nums):\n    # Write your solution here\n    pass\n\nprint(find_missing([3,0,1]))       # 2\nprint(find_missing([0,1]))          # 2\nprint(find_missing([9,6,4,2,3,5,7,0,1]))  # 8`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"The sum of 0 to n is n*(n+1)/2. Subtract the actual sum from the expected sum to find the missing number." },
  { title:"Zigzag Conversion", description:"Write a string in a zigzag pattern on a given number of rows, then read it row by row. 'PAYPALISHIRING' on 3 rows gives 'PAHNAPLSIIGYIR'.", language:"python", difficulty:"Medium", xpReward:100, starterCode: `def zigzag(s, num_rows):\n    # Write your solution here\n    pass\n\nprint(zigzag("PAYPALISHIRING", 3))\n# P   A   H   N\n# A P L S I I G\n# Y   I   R\n# Expected: "PAHNAPLSIIGYIR"\n\nprint(zigzag("PAYPALISHIRING", 4))\n# Expected: "PINALSIGYAHRPI"\n\nprint(zigzag("A", 1))\n# Expected: "A"`, expectedOutput: "\"PAHNAPLSIIGYIR\"\n\nprint(zigzag(\"PAYPALISHIRING\", 4))\n", hint:"Create a list of strings, one per row. Iterate through the string, adding each character to the current row. Change direction when hitting top or bottom row." },
  { title:"Maximum Subarray Sum", description:"Find the contiguous subarray with the largest sum (Kadane's algorithm). The array may contain negative numbers.", language:"python", difficulty:"Medium", xpReward:100, starterCode: `def max_subarray(nums):\n    # Write your solution here\n    pass\n\nprint(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))  # 6 (subarray [4,-1,2,1])\nprint(max_subarray([1]))                         # 1\nprint(max_subarray([-1,-2,-3]))                  # -1\nprint(max_subarray([5,4,-1,7,8]))                # 23`, expectedOutput: "MANUAL_REVIEW_REQUIRED", hint:"Track current_sum and max_sum. For each element, current_sum = max(element, current_sum + element). Update max_sum if current_sum is larger." },
];

// ── Seed function ─────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding Python expansion content...\n");

  // Update course total lesson count
  await setDoc(doc(db, "courses", "python"), {
    id: "python", title: "Python Programming", emoji: "🐍", color: "green",
    tagline: "From your first print() to advanced algorithms",
    description: "Learn Python from scratch through 30 comprehensive lessons covering beginner to advanced topics.",
    level: "Beginner → Advanced", totalLessons: 30, xpReward: 50, order: 1,
  });
  console.log("✅ Updated Python course (30 lessons)\n");

  // Seed lessons
  console.log("📖 Adding lessons...");
  for (const lesson of newLessons) {
    await setDoc(doc(db, "courses", "python", "lessons", lesson.id), lesson);
    console.log(`  ✅ Lesson ${lesson.order}: ${lesson.title}`);
  }

  // Seed challenges
  console.log("\n⚔️  Adding daily challenges...");
  for (let i = 0; i < newChallenges.length; i++) {
    const date = dateStr(i - 7);  // spread from 7 days ago to future
    const id   = date;
    await setDoc(doc(db, "challenges", id), {
      ...newChallenges[i], date, id
    });
    console.log(`  ✅ ${date}: ${newChallenges[i].title}`);
  }

  console.log(`\n✨ Done!`);
  console.log(`   - 26 new Python lessons (beginner → advanced)`);
  console.log(`   - 30 daily challenges (Easy → Hard)`);
  process.exit(0);
}

seed().catch(e => { console.error("❌", e); process.exit(1); });
