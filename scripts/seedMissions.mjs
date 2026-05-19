// scripts/seedMissions.mjs
// Run with: node scripts/seedMissions.mjs

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

const seedPythonFrom = process.env.SEED_PY_FROM
  ? Number.parseInt(process.env.SEED_PY_FROM.replace("py-", ""), 10)
  : null;
const seedPythonTo = process.env.SEED_PY_TO
  ? Number.parseInt(process.env.SEED_PY_TO.replace("py-", ""), 10)
  : null;

const shouldSeedMission = (mission) => {
  if (seedPythonFrom === null && seedPythonTo === null) {
    return true;
  }

  if (mission.courseId !== "python" || !mission.lessonId.startsWith("py-")) {
    return false;
  }

  const lessonNumber = Number.parseInt(mission.lessonId.replace("py-", ""), 10);
  if (Number.isNaN(lessonNumber)) {
    return false;
  }

  if (seedPythonFrom !== null && lessonNumber < seedPythonFrom) {
    return false;
  }

  if (seedPythonTo !== null && lessonNumber > seedPythonTo) {
    return false;
  }

  return true;
};

const missions = [
  {
    courseId: "python",
    lessonId: "py-01",
    missionId: "hello-mission",
    concept: "Variables & Output",
    storyTitle: "The Lost Traveller",
    storyText:
      "You arrive at the walled village of Syntaxia. The enchanted gate won't open without the visitor's name. The gatekeeper's spell runs on Python — it needs a variable.",
    language: "python",
    challenge:
      "Create a variable called visitor_name storing 'Mira'. Then print: Hello, Mira!",
    starterCode: "# Store the visitor name and print a greeting\n",
    solution: "visitor_name = 'Mira'\nprint(f'Hello, {visitor_name}!')",
    expectedOutput: "Hello, Mira!",
    hint: "Use an f-string: print(f'Hello, {visitor_name}!')",
    xpBonus: 30,
  },
  {
    courseId: "python",
    lessonId: "py-02",
    missionId: "vars-mission",
    concept: "Variables & Data Types",
    storyTitle: "The Merchant's Ledger",
    storyText:
      "The town merchant needs his inventory recorded. He has 42 gold coins, a 3.5kg bag of spice, and a shop named 'The Golden Key'. Help him log all three types.",
    language: "python",
    challenge:
      "Create three variables: coins (int 42), weight (float 3.5), shop_name (string 'The Golden Key'). Print all three on separate lines.",
    starterCode: "# Create and print the merchant's inventory\n",
    solution:
      "coins = 42\nweight = 3.5\nshop_name = 'The Golden Key'\nprint(coins)\nprint(weight)\nprint(shop_name)",
    expectedOutput: "42\n3.5\nThe Golden Key",
    hint: "Create each variable on its own line, then print each one.",
    xpBonus: 30,
  },
  {
    courseId: "python",
    lessonId: "py-03",
    missionId: "if-mission",
    concept: "Conditions",
    storyTitle: "The Bridge of Choices",
    storyText:
      "A troll guards the bridge. His rules: those with gold pass freely, those with silver pay a toll, everyone else turns back.",
    language: "python",
    challenge:
      "treasure is already set to 'silver'. Write if/elif/else that prints exactly: Pass freely OR Pay the toll OR Turn back",
    starterCode: "treasure = 'silver'\n\n# Write your if/elif/else below\n",
    solution:
      "treasure = 'silver'\nif treasure == 'gold':\n    print('Pass freely')\nelif treasure == 'silver':\n    print('Pay the toll')\nelse:\n    print('Turn back')",
    expectedOutput: "Pay the toll",
    hint: "Use if treasure == 'gold': then elif treasure == 'silver': then else:",
    xpBonus: 35,
  },
  {
    courseId: "python",
    lessonId: "py-04",
    missionId: "loops-mission",
    concept: "Loops",
    storyTitle: "The Enchanted Mill",
    storyText:
      "The enchanted mill must grind grain exactly 5 times to produce magic flour. Each grind must be announced.",
    language: "python",
    challenge: "Write a for loop that prints 'Grinding...' exactly 5 times.",
    starterCode: "# Loop exactly 5 times and print 'Grinding...' each time\n",
    solution: "for i in range(5):\n    print('Grinding...')",
    expectedOutput:
      "Grinding...\nGrinding...\nGrinding...\nGrinding...\nGrinding...",
    hint: "Use for i in range(5): and indent the print statement with 4 spaces.",
    xpBonus: 35,
  },
  {
    courseId: "python",
    lessonId: "py-05",
    missionId: "py05-mission",
    concept: "Functions",
    storyTitle: "The Wizard's Workshop",
    storyText:
      "The wizard needs a reusable greeting charm. A function will let the spell be cast for any name.",
    language: "python",
    challenge:
      'Define a function called greet(name) that returns "Hello, [name]!". Call it with "Aria" and print the result.',
    starterCode: "# Define and call greet(name)\n",
    solution:
      "def greet(name):\n    return f'Hello, {name}!'\nprint(greet('Aria'))",
    expectedOutput: "Hello, Aria!",
    hint: "def greet(name): return f'Hello, {name}!'",
    xpBonus: 35,
  },
  {
    courseId: "python",
    lessonId: "py-06",
    missionId: "py06-mission",
    concept: "Lists & Tuples",
    storyTitle: "The Market Stall",
    storyText:
      "A vendor keeps a short list of goods. You must reference the right item and count the stock.",
    language: "python",
    challenge:
      "Create a list called items with 'apple', 'bread', 'potion'. Print the second item and the total count.",
    starterCode: "# Create items list, print second item and count\n",
    solution:
      "items = ['apple', 'bread', 'potion']\nprint(items[1])\nprint(len(items))",
    expectedOutput: "bread\n3",
    hint: "Lists are zero-indexed. items[1] is the second item. Use len() for count.",
    xpBonus: 35,
  },
  {
    courseId: "python",
    lessonId: "py-07",
    missionId: "py07-mission",
    concept: "Dictionaries & Sets",
    storyTitle: "The Royal Registry",
    storyText:
      "The royal clerk records heroes in a registry. You must store and read the hero's details.",
    language: "python",
    challenge:
      "Create a dict called hero with keys 'name' (value 'Kael') and 'level' (value 5). Print both values on separate lines.",
    starterCode: "# Create hero dict and print name and level\n",
    solution:
      "hero = {'name': 'Kael', 'level': 5}\nprint(hero['name'])\nprint(hero['level'])",
    expectedOutput: "Kael\n5",
    hint: "Access dict values with hero['key']",
    xpBonus: 35,
  },
  {
    courseId: "python",
    lessonId: "py-08",
    missionId: "py08-mission",
    concept: "String Methods",
    storyTitle: "The Cipher Stone",
    storyText:
      "A rune on the stone is padded with extra spaces. Clean it and amplify its power.",
    language: "python",
    challenge:
      'Given spell = "  fireball  ", print it stripped of whitespace and in uppercase.',
    starterCode: "spell = '  fireball  '\n# Print stripped and uppercased\n",
    solution: "spell = '  fireball  '\nprint(spell.strip().upper())",
    expectedOutput: "FIREBALL",
    hint: "Chain .strip() and .upper() methods",
    xpBonus: 35,
  },
  {
    courseId: "python",
    lessonId: "py-09",
    missionId: "py09-mission",
    concept: "File Handling",
    storyTitle: "The Scribe's Archive",
    storyText:
      "A scribe needs a quick log entry written and read back to verify the ink.",
    language: "python",
    challenge:
      "Write 'Quest log entry 1' to a file called log.txt, then read it back and print it.",
    starterCode: "# Write to log.txt then read and print\n",
    solution:
      "with open('log.txt', 'w') as f:\n    f.write('Quest log entry 1')\nwith open('log.txt', 'r') as f:\n    print(f.read())",
    expectedOutput: "Quest log entry 1",
    hint: "Use with open('log.txt', 'w') as f: then with open('log.txt', 'r') as f:",
    xpBonus: 35,
  },
  {
    courseId: "python",
    lessonId: "py-10",
    missionId: "py10-mission",
    concept: "Error Handling",
    storyTitle: "The Trap Door",
    storyText:
      "A faulty glyph could open a trap. Catch the error before it springs.",
    language: "python",
    challenge:
      "Wrap int('abc') in a try/except block. Print 'Caught an error!' if a ValueError occurs.",
    starterCode: "# Try to convert 'abc' to int, catch the error\n",
    solution:
      "try:\n    int('abc')\nexcept ValueError:\n    print('Caught an error!')",
    expectedOutput: "Caught an error!",
    hint: "try: ... except ValueError: print('Caught an error!')",
    xpBonus: 35,
  },
  {
    courseId: "python",
    lessonId: "py-11",
    missionId: "py11-mission",
    concept: "List Comprehensions",
    storyTitle: "The Alchemist's Filter",
    storyText:
      "The alchemist refines ingredients by transforming each in a single pass.",
    language: "python",
    challenge:
      "Using a list comprehension, create a list of squares of numbers 1 to 5 and print it.",
    starterCode: "# Use list comprehension for squares of 1-5\n",
    solution: "squares = [x**2 for x in range(1, 6)]\nprint(squares)",
    expectedOutput: "[1, 4, 9, 16, 25]",
    hint: "[x**2 for x in range(1, 6)]",
    xpBonus: 40,
  },
  {
    courseId: "python",
    lessonId: "py-12",
    missionId: "py12-mission",
    concept: "Advanced Functions",
    storyTitle: "The Enchanted Forge",
    storyText: "The forge expects a default power level when none is supplied.",
    language: "python",
    challenge:
      "Write a function power(base, exp=2) with a default argument. Call it with just 3 and print the result.",
    starterCode: "# Define power with default exp=2, call with 3\n",
    solution:
      "def power(base, exp=2):\n    return base ** exp\nprint(power(3))",
    expectedOutput: "9",
    hint: "def power(base, exp=2): return base ** exp",
    xpBonus: 40,
  },
  {
    courseId: "python",
    lessonId: "py-13",
    missionId: "py13-mission",
    concept: "OOP I",
    storyTitle: "The Blacksmith's Blueprint",
    storyText:
      "The blacksmith wants a template for heroes with names and health.",
    language: "python",
    challenge:
      "Define a class Hero with __init__(self, name, hp). Create an instance with name='Kael' and hp=100. Print name and hp on separate lines.",
    starterCode: "# Define Hero class and create an instance\n",
    solution:
      "class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\nhero = Hero('Kael', 100)\nprint(hero.name)\nprint(hero.hp)",
    expectedOutput: "Kael\n100",
    hint: "class Hero: def __init__(self, name, hp): self.name = name; self.hp = hp",
    xpBonus: 40,
  },
  {
    courseId: "python",
    lessonId: "py-14",
    missionId: "py14-mission",
    concept: "OOP II - Inheritance",
    storyTitle: "The Guild of Heroes",
    storyText:
      "The guild promotes apprentices into mages who inherit their core traits.",
    language: "python",
    challenge:
      "Create a class Mage that inherits from Hero (which has name, hp). Add a spell attribute in __init__. Print the mage's name and spell.",
    starterCode:
      "class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\n# Define Mage inheriting Hero, add spell attribute\n",
    solution:
      "class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\nclass Mage(Hero):\n    def __init__(self, name, hp, spell):\n        super().__init__(name, hp)\n        self.spell = spell\nm = Mage('Aria', 80, 'Fireball')\nprint(m.name)\nprint(m.spell)",
    expectedOutput: "Aria\nFireball",
    hint: "class Mage(Hero): def __init__(self, name, hp, spell): super().__init__(name, hp); self.spell = spell",
    xpBonus: 40,
  },
  {
    courseId: "python",
    lessonId: "py-15",
    missionId: "py15-mission",
    concept: "Modules & Standard Library",
    storyTitle: "The Cartographer's Tools",
    storyText: "The cartographer depends on math tools to measure the realm.",
    language: "python",
    challenge:
      "Import the math module. Print the floor of 7.8 and the value of math.pi rounded to 2 decimal places.",
    starterCode: "# Import math and use floor and pi\n",
    solution: "import math\nprint(math.floor(7.8))\nprint(round(math.pi, 2))",
    expectedOutput: "7\n3.14",
    hint: "math.floor() and round(math.pi, 2)",
    xpBonus: 40,
  },
  {
    courseId: "python",
    lessonId: "py-16",
    missionId: "py16-mission",
    concept: "Iterators & Generators",
    storyTitle: "The Endless Spring",
    storyText:
      "The spring flows in a steady sequence. A generator will release it step by step.",
    language: "python",
    challenge:
      "Write a generator function count_up(n) that yields numbers 1 to n. Print all values for n=4 using a for loop.",
    starterCode: "# Define count_up generator and print values for n=4\n",
    solution:
      "def count_up(n):\n    for i in range(1, n+1):\n        yield i\nfor val in count_up(4):\n    print(val)",
    expectedOutput: "1\n2\n3\n4",
    hint: "Use yield inside the function instead of return",
    xpBonus: 40,
  },
  {
    courseId: "python",
    lessonId: "py-17",
    missionId: "py17-mission",
    concept: "Decorators",
    storyTitle: "The Enchantment Seal",
    storyText:
      "A seal boosts any spell it wraps. You need a decorator to apply it.",
    language: "python",
    challenge:
      "Write a decorator called shout that wraps a function's string return value in upper case. Apply it to a function greet() that returns 'hello'.",
    starterCode: "# Write shout decorator and apply to greet()\n",
    solution:
      "def shout(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n@shout\ndef greet():\n    return 'hello'\nprint(greet())",
    expectedOutput: "HELLO",
    hint: "def shout(func): def wrapper(): return func().upper() return wrapper",
    xpBonus: 40,
  },
  {
    courseId: "python",
    lessonId: "py-18",
    missionId: "py18-mission",
    concept: "Regular Expressions",
    storyTitle: "The Rune Decoder",
    storyText:
      "Runes must be split into words to reveal the count of elements.",
    language: "python",
    challenge:
      "Use the re module to find all words in 'fire water earth air' and print the count.",
    starterCode: "import re\n# Find all words and print the count\n",
    solution:
      "import re\nwords = re.findall(r'\\w+', 'fire water earth air')\nprint(len(words))",
    expectedOutput: "4",
    hint: "re.findall(r'\\w+', text) returns a list of words",
    xpBonus: 40,
  },
  {
    courseId: "python",
    lessonId: "py-19",
    missionId: "py19-mission",
    concept: "Working with JSON",
    storyTitle: "The Messenger Scroll",
    storyText:
      "The messenger uses JSON to package hero details and decode them on arrival.",
    language: "python",
    challenge:
      "Convert the dict {'hero': 'Kael', 'level': 5} to a JSON string and print it. Then parse it back and print the hero's name.",
    starterCode: "import json\n# Convert dict to JSON string and back\n",
    solution:
      "import json\ndata = {'hero': 'Kael', 'level': 5}\njson_str = json.dumps(data)\nprint(json_str)\nparsed = json.loads(json_str)\nprint(parsed['hero'])",
    expectedOutput: '{"hero": "Kael", "level": 5}\nKael',
    hint: "json.dumps() converts to string, json.loads() parses it back",
    xpBonus: 40,
  },
  {
    courseId: "python",
    lessonId: "py-20",
    missionId: "py20-mission",
    concept: "Sorting & Searching",
    storyTitle: "The Tournament Ranking",
    storyText:
      "Rankings must be sorted and indexed to confirm a champion's position.",
    language: "python",
    challenge:
      "Sort the list [42, 7, 19, 3, 88] in ascending order and print it. Then print the index of value 19.",
    starterCode:
      "scores = [42, 7, 19, 3, 88]\n# Sort and print, then print index of 19\n",
    solution:
      "scores = [42, 7, 19, 3, 88]\nscores.sort()\nprint(scores)\nprint(scores.index(19))",
    expectedOutput: "[3, 7, 19, 42, 88]\n2",
    hint: "list.sort() sorts in place. list.index(val) finds the position.",
    xpBonus: 40,
  },
  {
    courseId: "python",
    lessonId: "py-21",
    missionId: "py21-mission",
    concept: "Recursion",
    storyTitle: "The Mirror Dungeon",
    storyText:
      "Every door reflects into the next. Only recursion can reach the exit.",
    language: "python",
    challenge:
      "Write a recursive function factorial(n) that returns n!. Print factorial(5).",
    starterCode: "# Define recursive factorial and print factorial(5)\n",
    solution:
      "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\nprint(factorial(5))",
    expectedOutput: "120",
    hint: "Base case: if n <= 1: return 1. Recursive case: return n * factorial(n-1)",
    xpBonus: 50,
  },
  {
    courseId: "python",
    lessonId: "py-22",
    missionId: "py22-mission",
    concept: "Stacks & Queues",
    storyTitle: "The Dungeon Stack",
    storyText:
      "Rooms are explored in last-in, first-out order. Use a stack to track them.",
    language: "python",
    challenge:
      "Use a list as a stack. Push 'room1', 'room2', 'room3'. Pop the last item and print it. Then print the remaining stack.",
    starterCode: "# Use a list as a stack\n",
    solution:
      "stack = []\nstack.append('room1')\nstack.append('room2')\nstack.append('room3')\nprint(stack.pop())\nprint(stack)",
    expectedOutput: "room3\n['room1', 'room2']",
    hint: "Use .append() to push and .pop() to pop",
    xpBonus: 50,
  },
  {
    courseId: "python",
    lessonId: "py-23",
    missionId: "py23-mission",
    concept: "Linked Lists",
    storyTitle: "The Chain of Relics",
    storyText:
      "Ancient relics are linked in order. Build a chain and traverse it.",
    language: "python",
    challenge:
      "Define a Node class with value and next attributes. Create a chain of 3 nodes (1→2→3) and print their values by traversing from head.",
    starterCode: "# Define Node and create a 3-node linked list\n",
    solution:
      "class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\nn1 = Node(1)\nn2 = Node(2)\nn3 = Node(3)\nn1.next = n2\nn2.next = n3\ncurrent = n1\nwhile current:\n    print(current.value)\n    current = current.next",
    expectedOutput: "1\n2\n3",
    hint: "Traverse with: current = head; while current: print(current.value); current = current.next",
    xpBonus: 50,
  },
  {
    courseId: "python",
    lessonId: "py-24",
    missionId: "py24-mission",
    concept: "Binary Trees",
    storyTitle: "The Ancient Tree of Knowledge",
    storyText: "A small tree holds three truths. Build it and speak each one.",
    language: "python",
    challenge:
      "Define a TreeNode class with value, left, right. Build a tree with root=1, left=2, right=3. Print root, left, right values.",
    starterCode: "# Define TreeNode and build a 3-node tree\n",
    solution:
      "class TreeNode:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None\nroot = TreeNode(1)\nroot.left = TreeNode(2)\nroot.right = TreeNode(3)\nprint(root.value)\nprint(root.left.value)\nprint(root.right.value)",
    expectedOutput: "1\n2\n3",
    hint: "root.left = TreeNode(2); root.right = TreeNode(3)",
    xpBonus: 50,
  },
  {
    courseId: "python",
    lessonId: "py-25",
    missionId: "py25-mission",
    concept: "Big O Notation",
    storyTitle: "The Complexity Vault",
    storyText:
      "Two paths lead to the same answer. Measure their effort with simple checks.",
    language: "python",
    challenge:
      "Write two functions: linear_search(lst, target) using a for loop, and use the in operator for O(n) membership check. Search for 7 in [1,3,5,7,9] both ways and print True for each.",
    starterCode: "# Implement linear_search and use 'in' operator\n",
    solution:
      "def linear_search(lst, target):\n    for item in lst:\n        if item == target:\n            return True\n    return False\nnums = [1, 3, 5, 7, 9]\nprint(linear_search(nums, 7))\nprint(7 in nums)",
    expectedOutput: "True\nTrue",
    hint: "for item in lst: if item == target: return True",
    xpBonus: 50,
  },
  {
    courseId: "python",
    lessonId: "py-26",
    missionId: "py26-mission",
    concept: "Functional Programming",
    storyTitle: "The Lambda Forge",
    storyText:
      "The forge doubles each ingot with a single transformation step.",
    language: "python",
    challenge:
      "Use map() with a lambda to double every number in [1, 2, 3, 4]. Print the result as a list.",
    starterCode: "# Use map and lambda to double numbers\n",
    solution:
      "nums = [1, 2, 3, 4]\nresult = list(map(lambda x: x * 2, nums))\nprint(result)",
    expectedOutput: "[2, 4, 6, 8]",
    hint: "list(map(lambda x: x * 2, nums))",
    xpBonus: 50,
  },
  {
    courseId: "python",
    lessonId: "py-27",
    missionId: "py27-mission",
    concept: "Context Managers",
    storyTitle: "The Sealed Vault",
    storyText:
      "Sealing the vault requires careful opening and closing. A context manager ensures it.",
    language: "python",
    challenge:
      "Use a with statement to write 'Vault sealed' to vault.txt, then open it and print the content.",
    starterCode: "# Write and read vault.txt using with statements\n",
    solution:
      "with open('vault.txt', 'w') as f:\n    f.write('Vault sealed')\nwith open('vault.txt', 'r') as f:\n    print(f.read())",
    expectedOutput: "Vault sealed",
    hint: "with open('vault.txt', 'w') as f: f.write(...)",
    xpBonus: 50,
  },
  {
    courseId: "python",
    lessonId: "py-28",
    missionId: "py28-mission",
    concept: "Threading",
    storyTitle: "The Parallel Siege",
    storyText: "Two teams act at once. A thread will run the task in parallel.",
    language: "python",
    challenge:
      "Create a function print_task(name) that prints 'Task: [name]'. Run it in a thread with name='siege'. Join and let it complete.",
    starterCode: "import threading\n# Create and run a thread\n",
    solution:
      "import threading\ndef print_task(name):\n    print(f'Task: {name}')\nt = threading.Thread(target=print_task, args=('siege',))\nt.start()\nt.join()",
    expectedOutput: "Task: siege",
    hint: "threading.Thread(target=fn, args=('siege',)).start()",
    xpBonus: 50,
  },
  {
    courseId: "python",
    lessonId: "py-29",
    missionId: "py29-mission",
    concept: "Async Programming",
    storyTitle: "The Async Oracle",
    storyText:
      "The oracle answers when awaited. Use async and await to hear it.",
    language: "python",
    challenge:
      "Define an async function fetch_data() that returns 'data received'. Run it with asyncio.run() and print the result.",
    starterCode: "import asyncio\n# Define async function and run it\n",
    solution:
      "import asyncio\nasync def fetch_data():\n    return 'data received'\nresult = asyncio.run(fetch_data())\nprint(result)",
    expectedOutput: "data received",
    hint: "async def fetch_data(): return 'data received' then asyncio.run(fetch_data())",
    xpBonus: 50,
  },
  {
    courseId: "python",
    lessonId: "py-30",
    missionId: "py30-mission",
    concept: "Testing with pytest",
    storyTitle: "The Proof of the Realm",
    storyText:
      "The realm demands proof. A test confirms the spell behaves correctly.",
    language: "python",
    challenge:
      "Write a function add(a, b) that returns a + b. Write a test function test_add() using assert that checks add(2, 3) == 5. Call test_add() and print 'All tests passed!'",
    starterCode: "# Write add() and test_add() using assert\n",
    solution:
      "def add(a, b):\n    return a + b\ndef test_add():\n    assert add(2, 3) == 5\ntest_add()\nprint('All tests passed!')",
    expectedOutput: "All tests passed!",
    hint: "assert add(2, 3) == 5 inside test_add()",
    xpBonus: 50,
  },
  {
    courseId: "c",
    lessonId: "c-01",
    missionId: "c-vars-mission",
    concept: "Variables & Output",
    storyTitle: "The Lost Traveller",
    storyText: "Same village, same gate. But this time the spell runs in C.",
    language: "c",
    challenge:
      'Declare a char array called visitor_name storing "Mira". Print: Hello, Mira!',
    starterCode:
      "#include <stdio.h>\n\nint main() {\n    // Store the name and print a greeting\n    \n    return 0;\n}\n",
    solution:
      '#include <stdio.h>\nint main() {\n    char visitor_name[] = "Mira";\n    printf("Hello, %s!", visitor_name);\n    return 0;\n}',
    expectedOutput: "Hello, Mira!",
    hint: 'Use char visitor_name[] = "Mira"; then printf("Hello, %s!", visitor_name);',
    xpBonus: 40,
  },
  {
    courseId: "c",
    lessonId: "c-02",
    missionId: "c-loops-mission",
    concept: "Loops",
    storyTitle: "The Enchanted Mill",
    storyText: "The mill needs 5 grinds. Make it happen in C.",
    language: "c",
    challenge: "Write a for loop that prints 'Grinding...' exactly 5 times.",
    starterCode:
      "#include <stdio.h>\n\nint main() {\n    // Loop 5 times\n    \n    return 0;\n}\n",
    solution:
      '#include <stdio.h>\nint main() {\n    for(int i = 0; i < 5; i++) {\n        printf("Grinding...\\n");\n    }\n    return 0;\n}',
    expectedOutput:
      "Grinding...\nGrinding...\nGrinding...\nGrinding...\nGrinding...",
    hint: 'Use for(int i = 0; i < 5; i++) { printf("Grinding...\\n"); }',
    xpBonus: 40,
  },
  {
    courseId: "c",
    lessonId: "c-03",
    missionId: "c-func-mission",
    concept: "Functions",
    storyTitle: "The Wizard's Workshop",
    storyText: "The wizard needs a reusable fire-lighting function in C.",
    language: "c",
    challenge:
      "Define a void function light_fire(char* size) that prints 'Lighting a [size] fire!'. Call it with 'large'.",
    starterCode:
      '#include <stdio.h>\n\n// Define light_fire here\n\nint main() {\n    // Call it with "large"\n    return 0;\n}\n',
    solution:
      '#include <stdio.h>\nvoid light_fire(char* size) {\n    printf("Lighting a %s fire!", size);\n}\nint main() {\n    light_fire("large");\n    return 0;\n}',
    expectedOutput: "Lighting a large fire!",
    hint: 'void light_fire(char* size) { printf("Lighting a %s fire!", size); }',
    xpBonus: 45,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-01",
    missionId: "cpp-vars-mission",
    concept: "Variables & Output",
    storyTitle: "The Lost Traveller",
    storyText: "The gate spell now runs in C++. Use std::string.",
    language: "cpp",
    challenge:
      'Declare a std::string called visitor_name = "Mira". Print: Hello, Mira!',
    starterCode:
      "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    // Declare visitor_name and print the greeting\n    \n    return 0;\n}\n",
    solution:
      '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string visitor_name = "Mira";\n    cout << "Hello, " << visitor_name << "!";\n    return 0;\n}',
    expectedOutput: "Hello, Mira!",
    hint: 'Use string visitor_name = "Mira"; then cout << "Hello, " << visitor_name << "!";',
    xpBonus: 40,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-02",
    missionId: "cpp-loops-mission",
    concept: "Loops",
    storyTitle: "The Enchanted Mill",
    storyText: "Five grinds needed. C++ style.",
    language: "cpp",
    challenge: "Write a for loop that prints 'Grinding...' exactly 5 times.",
    starterCode:
      "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Loop 5 times\n    \n    return 0;\n}\n",
    solution:
      '#include <iostream>\nusing namespace std;\nint main() {\n    for(int i = 0; i < 5; i++) {\n        cout << "Grinding..." << endl;\n    }\n    return 0;\n}',
    expectedOutput:
      "Grinding...\nGrinding...\nGrinding...\nGrinding...\nGrinding...",
    hint: 'for(int i = 0; i < 5; i++) { cout << "Grinding..." << endl; }',
    xpBonus: 40,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-03",
    missionId: "cpp-class-mission",
    concept: "Classes",
    storyTitle: "The Blacksmith's Blueprint",
    storyText:
      "The royal blacksmith needs a blueprint for weapons. He wants a class he can use to stamp out swords, axes, and bows.",
    language: "cpp",
    challenge:
      "Define a class Weapon with public string name and int damage. Create an instance with name='Sword' and damage=50. Print: Sword deals 50 damage.",
    starterCode:
      "#include <iostream>\n#include <string>\nusing namespace std;\n\n// Define Weapon class here\n\nint main() {\n    // Create a Weapon and print it\n    return 0;\n}\n",
    solution:
      '#include <iostream>\n#include <string>\nusing namespace std;\nclass Weapon {\npublic:\n    string name;\n    int damage;\n};\nint main() {\n    Weapon w;\n    w.name = "Sword";\n    w.damage = 50;\n    cout << w.name << " deals " << w.damage << " damage.";\n    return 0;\n}',
    expectedOutput: "Sword deals 50 damage.",
    hint: "class Weapon { public: string name; int damage; };",
    xpBonus: 50,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-04",
    missionId: "cpp04-mission",
    concept: "Loops",
    storyTitle: "The Enchanted Mill",
    storyText: "Count each turn of the mill to keep the rhythm steady.",
    language: "cpp",
    challenge: "Use a for loop to print numbers 1 to 5, one per line.",
    starterCode:
      "#include <iostream>\nusing namespace std;\nint main() {\n    // Loop 1 to 5\n    return 0;\n}\n",
    solution:
      "#include <iostream>\nusing namespace std;\nint main() {\n    for(int i=1; i<=5; i++) cout << i << endl;\n    return 0;\n}",
    expectedOutput: "1\n2\n3\n4\n5",
    hint: "for(int i=1; i<=5; i++) cout << i << endl;",
    xpBonus: 40,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-05",
    missionId: "cpp05-mission",
    concept: "Functions",
    storyTitle: "The Wizard's Workshop",
    storyText: "A simple spell must be reusable at any time.",
    language: "cpp",
    challenge: "Define int square(int n) returning n*n. Call with 6 and print.",
    starterCode:
      "#include <iostream>\nusing namespace std;\n// Define square\nint main() {\n    // Call and print\n    return 0;\n}\n",
    solution:
      "#include <iostream>\nusing namespace std;\nint square(int n) { return n*n; }\nint main() { cout << square(6); return 0; }",
    expectedOutput: "36",
    hint: "int square(int n) { return n * n; }",
    xpBonus: 40,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-06",
    missionId: "cpp06-mission",
    concept: "Arrays & Strings",
    storyTitle: "The Armoury Roster",
    storyText: "Tally the gear list before the patrol departs.",
    language: "cpp",
    challenge: "Create vector<int> scores = {10, 20, 30}. Print the sum.",
    starterCode:
      "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> scores = {10, 20, 30};\n    // Print sum\n    return 0;\n}\n",
    solution:
      "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> scores = {10,20,30};\n    int sum=0;\n    for(int s: scores) sum+=s;\n    cout << sum;\n    return 0;\n}",
    expectedOutput: "60",
    hint: "for(int s : scores) sum += s;",
    xpBonus: 40,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-07",
    missionId: "cpp07-mission",
    concept: "Pointers & References",
    storyTitle: "The Memory Maze",
    storyText: "A single change in the maze must echo through its source.",
    language: "cpp",
    challenge:
      "Declare int x = 10. Create a reference int& ref = x. Modify ref to 99 and print x.",
    starterCode:
      "#include <iostream>\nusing namespace std;\nint main() {\n    int x = 10;\n    // Create reference, modify, print x\n    return 0;\n}\n",
    solution:
      "#include <iostream>\nusing namespace std;\nint main() {\n    int x = 10;\n    int& ref = x;\n    ref = 99;\n    cout << x;\n    return 0;\n}",
    expectedOutput: "99",
    hint: "int& ref = x; ref = 99; — modifying ref changes x",
    xpBonus: 40,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-08",
    missionId: "cpp08-mission",
    concept: "OOP I — Classes",
    storyTitle: "The Blacksmith's Blueprint",
    storyText: "Forge a hero template with name and health.",
    language: "cpp",
    challenge:
      "Define class Hero with public string name and int hp. Create instance with name='Kael' hp=100. Print both.",
    starterCode:
      "#include <iostream>\n#include <string>\nusing namespace std;\n// Define Hero class\nint main() {\n    // Create and print\n    return 0;\n}\n",
    solution:
      '#include <iostream>\n#include <string>\nusing namespace std;\nclass Hero { public: string name; int hp; };\nint main() {\n    Hero h;\n    h.name="Kael"; h.hp=100;\n    cout << h.name << endl << h.hp;\n    return 0;\n}',
    expectedOutput: "Kael\n100",
    hint: "class Hero { public: string name; int hp; };",
    xpBonus: 40,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-09",
    missionId: "cpp09-mission",
    concept: "OOP II — Inheritance",
    storyTitle: "The Guild of Heroes",
    storyText: "Pass a name down the lineage and add a bark of power.",
    language: "cpp",
    challenge:
      "Define base class Animal with string name. Derive class Dog that adds void bark() printing 'Woof!'. Create Dog, set name='Rex', call bark().",
    starterCode:
      "#include <iostream>\n#include <string>\nusing namespace std;\n// Define Animal and Dog\nint main() {\n    // Create Dog and call bark\n    return 0;\n}\n",
    solution:
      '#include <iostream>\n#include <string>\nusing namespace std;\nclass Animal { public: string name; };\nclass Dog : public Animal { public: void bark() { cout << "Woof!"; } };\nint main() {\n    Dog d; d.name="Rex"; d.bark();\n    return 0;\n}',
    expectedOutput: "Woof!",
    hint: 'class Dog : public Animal { public: void bark() { cout << "Woof!"; } };',
    xpBonus: 40,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-10",
    missionId: "cpp10-mission",
    concept: "OOP III — Operator Overloading",
    storyTitle: "The Arcane Calculator",
    storyText: "Combine vectors with a single enchanted symbol.",
    language: "cpp",
    challenge:
      "Define class Vec2 with int x, y. Overload operator+ to add two Vec2 objects. Create Vec2(1,2) + Vec2(3,4) and print x and y of result.",
    starterCode:
      "#include <iostream>\nusing namespace std;\n// Define Vec2 with operator+\nint main() {\n    // Add and print\n    return 0;\n}\n",
    solution:
      "#include <iostream>\nusing namespace std;\nclass Vec2 {\npublic:\n    int x,y;\n    Vec2(int x,int y):x(x),y(y){}\n    Vec2 operator+(Vec2 o){ return Vec2(x+o.x,y+o.y); }\n};\nint main() {\n    Vec2 r = Vec2(1,2)+Vec2(3,4);\n    cout << r.x << endl << r.y;\n    return 0;\n}",
    expectedOutput: "4\n6",
    hint: "Vec2 operator+(Vec2 o) { return Vec2(x+o.x, y+o.y); }",
    xpBonus: 40,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-11",
    missionId: "cpp11-mission",
    concept: "Memory Management",
    storyTitle: "The Conjured Storage",
    storyText: "Summon memory, use it, and then release it.",
    language: "cpp",
    challenge:
      "Use new to allocate an int with value 42. Print it. Then delete it.",
    starterCode:
      "#include <iostream>\nusing namespace std;\nint main() {\n    // new, print, delete\n    return 0;\n}\n",
    solution:
      "#include <iostream>\nusing namespace std;\nint main() {\n    int* p = new int(42);\n    cout << *p;\n    delete p;\n    return 0;\n}",
    expectedOutput: "42",
    hint: "int* p = new int(42); cout << *p; delete p;",
    xpBonus: 45,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-12",
    missionId: "cpp12-mission",
    concept: "STL Vectors",
    storyTitle: "The Archive of Ancients",
    storyText: "Count the relics and recall the last one.",
    language: "cpp",
    challenge:
      "Create vector<string> items with 'sword', 'shield', 'potion'. Print the size and the last element.",
    starterCode:
      '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    vector<string> items = {"sword","shield","potion"};\n    // Print size and last element\n    return 0;\n}\n',
    solution:
      '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    vector<string> items={"sword","shield","potion"};\n    cout << items.size() << endl << items.back();\n    return 0;\n}',
    expectedOutput: "3\npotion",
    hint: "items.size() and items.back()",
    xpBonus: 45,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-13",
    missionId: "cpp13-mission",
    concept: "STL Maps & Sets",
    storyTitle: "The Royal Registry",
    storyText: "Record scores in the royal ledger and read them back.",
    language: "cpp",
    challenge:
      "Create map<string,int> scores. Add 'Kael'->95 and 'Aria'->87. Print Kael's score.",
    starterCode:
      "#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\nint main() {\n    map<string,int> scores;\n    // Add entries and print Kael's score\n    return 0;\n}\n",
    solution:
      '#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\nint main() {\n    map<string,int> scores;\n    scores["Kael"]=95; scores["Aria"]=87;\n    cout << scores["Kael"];\n    return 0;\n}',
    expectedOutput: "95",
    hint: 'scores["Kael"] = 95; cout << scores["Kael"];',
    xpBonus: 45,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-14",
    missionId: "cpp14-mission",
    concept: "STL Algorithms",
    storyTitle: "The Tournament Ranking",
    storyText: "Sort the contenders and read the champions.",
    language: "cpp",
    challenge:
      "Sort vector<int> {5,2,8,1,9} using std::sort and print the first and last elements.",
    starterCode:
      "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    vector<int> v = {5,2,8,1,9};\n    // Sort and print first and last\n    return 0;\n}\n",
    solution:
      "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    vector<int> v={5,2,8,1,9};\n    sort(v.begin(),v.end());\n    cout << v.front() << endl << v.back();\n    return 0;\n}",
    expectedOutput: "1\n9",
    hint: "sort(v.begin(), v.end()); then v.front() and v.back()",
    xpBonus: 45,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-15",
    missionId: "cpp15-mission",
    concept: "Templates",
    storyTitle: "The Universal Forge",
    storyText: "Craft a single tool that fits every material.",
    language: "cpp",
    challenge:
      "Write a template function maxOf(a, b) that returns the larger of two values. Test with ints 3 and 7, print the result.",
    starterCode:
      "#include <iostream>\nusing namespace std;\n// Define template maxOf\nint main() {\n    // Test with 3 and 7\n    return 0;\n}\n",
    solution:
      "#include <iostream>\nusing namespace std;\ntemplate<typename T>\nT maxOf(T a, T b) { return a > b ? a : b; }\nint main() { cout << maxOf(3,7); return 0; }",
    expectedOutput: "7",
    hint: "template<typename T> T maxOf(T a, T b) { return a > b ? a : b; }",
    xpBonus: 45,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-16",
    missionId: "cpp16-mission",
    concept: "Exception Handling",
    storyTitle: "The Trap Door",
    storyText: "Catch the trap before it snaps shut.",
    language: "cpp",
    challenge:
      "Throw a runtime_error inside a try block. Catch it and print 'Caught: ' followed by the error message.",
    starterCode:
      "#include <iostream>\n#include <stdexcept>\nusing namespace std;\nint main() {\n    // try/throw/catch\n    return 0;\n}\n",
    solution:
      '#include <iostream>\n#include <stdexcept>\nusing namespace std;\nint main() {\n    try { throw runtime_error("trap sprung"); }\n    catch(exception& e) { cout << "Caught: " << e.what(); }\n    return 0;\n}',
    expectedOutput: "Caught: trap sprung",
    hint: 'throw runtime_error("trap sprung"); catch(exception& e) { cout << e.what(); }',
    xpBonus: 45,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-17",
    missionId: "cpp17-mission",
    concept: "Smart Pointers",
    storyTitle: "The Guarded Vault",
    storyText: "Let a guardian manage the key automatically.",
    language: "cpp",
    challenge:
      "Use unique_ptr<int> to allocate int value 77. Print the value via the pointer.",
    starterCode:
      "#include <iostream>\n#include <memory>\nusing namespace std;\nint main() {\n    // unique_ptr, assign 77, print\n    return 0;\n}\n",
    solution:
      "#include <iostream>\n#include <memory>\nusing namespace std;\nint main() {\n    auto p = make_unique<int>(77);\n    cout << *p;\n    return 0;\n}",
    expectedOutput: "77",
    hint: "auto p = make_unique<int>(77); cout << *p;",
    xpBonus: 45,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-18",
    missionId: "cpp18-mission",
    concept: "Move Semantics",
    storyTitle: "The Transfer Ritual",
    storyText: "Shift ownership without copying the essence.",
    language: "cpp",
    challenge:
      "Create string s1 = 'Syntaxia'. Move it into s2 using std::move. Print s2.",
    starterCode:
      '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s1 = "Syntaxia";\n    // Move into s2 and print s2\n    return 0;\n}\n',
    solution:
      '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s1="Syntaxia";\n    string s2=move(s1);\n    cout << s2;\n    return 0;\n}',
    expectedOutput: "Syntaxia",
    hint: "string s2 = move(s1); cout << s2;",
    xpBonus: 45,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-19",
    missionId: "cpp19-mission",
    concept: "Lambda Expressions",
    storyTitle: "The Lambda Forge",
    storyText: "Shape a quick spell without naming it.",
    language: "cpp",
    challenge:
      "Define a lambda multiply that takes two ints and returns their product. Print multiply(4, 5).",
    starterCode:
      "#include <iostream>\nusing namespace std;\nint main() {\n    // Define lambda and print result\n    return 0;\n}\n",
    solution:
      "#include <iostream>\nusing namespace std;\nint main() {\n    auto multiply = [](int a, int b){ return a*b; };\n    cout << multiply(4,5);\n    return 0;\n}",
    expectedOutput: "20",
    hint: "auto multiply = [](int a, int b){ return a * b; };",
    xpBonus: 50,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-20",
    missionId: "cpp20-mission",
    concept: "File I/O",
    storyTitle: "The Scribe's Archive",
    storyText: "Write the record and read it back to confirm the seal.",
    language: "cpp",
    challenge:
      "Write 'Archive entry' to archive.txt using ofstream. Read it back with ifstream and print.",
    starterCode:
      "#include <iostream>\n#include <fstream>\n#include <string>\nusing namespace std;\nint main() {\n    // Write then read archive.txt\n    return 0;\n}\n",
    solution:
      '#include <iostream>\n#include <fstream>\n#include <string>\nusing namespace std;\nint main() {\n    ofstream out("archive.txt");\n    out << "Archive entry";\n    out.close();\n    ifstream in("archive.txt");\n    string line;\n    getline(in,line);\n    cout << line;\n    return 0;\n}',
    expectedOutput: "Archive entry",
    hint: 'ofstream out("archive.txt"); out << "text"; then ifstream in; getline(in, line);',
    xpBonus: 50,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-21",
    missionId: "cpp21-mission",
    concept: "Multithreading",
    storyTitle: "The Parallel Siege",
    storyText: "Let a second team act while you hold the line.",
    language: "cpp",
    challenge:
      "Create a thread that prints 'Thread running'. Join it and let it complete.",
    starterCode:
      "#include <iostream>\n#include <thread>\nusing namespace std;\nint main() {\n    // Create thread, join\n    return 0;\n}\n",
    solution:
      '#include <iostream>\n#include <thread>\nusing namespace std;\nvoid task() { cout << "Thread running"; }\nint main() {\n    thread t(task);\n    t.join();\n    return 0;\n}',
    expectedOutput: "Thread running",
    hint: "thread t(task); t.join();",
    xpBonus: 50,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-22",
    missionId: "cpp22-mission",
    concept: "Linked List",
    storyTitle: "The Chain of Relics",
    storyText: "Link the relics and walk the chain.",
    language: "cpp",
    challenge:
      "Define struct Node with int val and Node* next. Build a 3-node list (1→2→3). Print each value by traversing from head.",
    starterCode:
      "#include <iostream>\nusing namespace std;\n// Define Node struct\nint main() {\n    // Build list and traverse\n    return 0;\n}\n",
    solution:
      "#include <iostream>\nusing namespace std;\nstruct Node { int val; Node* next; };\nint main() {\n    Node* n1=new Node{1,nullptr};\n    Node* n2=new Node{2,nullptr};\n    Node* n3=new Node{3,nullptr};\n    n1->next=n2; n2->next=n3;\n    Node* cur=n1;\n    while(cur){ cout<<cur->val<<endl; cur=cur->next; }\n    return 0;\n}",
    expectedOutput: "1\n2\n3",
    hint: "while(cur) { cout << cur->val << endl; cur = cur->next; }",
    xpBonus: 50,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-23",
    missionId: "cpp23-mission",
    concept: "Stack & Queue",
    storyTitle: "The Dungeon Stack",
    storyText: "Track the last room explored and the next one to enter.",
    language: "cpp",
    challenge:
      "Use std::stack<int>. Push 1, 2, 3. Pop the top and print it. Then print the new top.",
    starterCode:
      "#include <iostream>\n#include <stack>\nusing namespace std;\nint main() {\n    stack<int> s;\n    // Push 1,2,3 then pop and print\n    return 0;\n}\n",
    solution:
      "#include <iostream>\n#include <stack>\nusing namespace std;\nint main() {\n    stack<int> s;\n    s.push(1); s.push(2); s.push(3);\n    cout << s.top() << endl;\n    s.pop();\n    cout << s.top();\n    return 0;\n}",
    expectedOutput: "3\n2",
    hint: "s.top() reads top without removing. s.pop() removes it.",
    xpBonus: 50,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-24",
    missionId: "cpp24-mission",
    concept: "Modern C++ Best Practices",
    storyTitle: "The Master Codex",
    storyText: "Let the codex guide you with concise modern form.",
    language: "cpp",
    challenge:
      "Use auto and range-based for to iterate vector<int> {1,2,3,4,5} and print each value.",
    starterCode:
      "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> nums = {1,2,3,4,5};\n    // Use auto and range-based for\n    return 0;\n}\n",
    solution:
      "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> nums={1,2,3,4,5};\n    for(auto n: nums) cout << n << endl;\n    return 0;\n}",
    expectedOutput: "1\n2\n3\n4\n5",
    hint: "for(auto n : nums) cout << n << endl;",
    xpBonus: 50,
  },
  {
    courseId: "cpp",
    lessonId: "cpp-25",
    missionId: "cpp25-mission",
    concept: "Reverse a String",
    storyTitle: "The Mirror Rune",
    storyText: "Flip the rune to reveal its mirrored form.",
    language: "cpp",
    challenge:
      "Use std::reverse to reverse the string 'Syntaxia' and print it.",
    starterCode:
      '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s = "Syntaxia";\n    // Reverse and print\n    return 0;\n}\n',
    solution:
      '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s="Syntaxia";\n    reverse(s.begin(),s.end());\n    cout << s;\n    return 0;\n}',
    expectedOutput: "aixatnyS",
    hint: "reverse(s.begin(), s.end());",
    xpBonus: 50,
  },
];

async function seedMissions() {
  try {
    for (const mission of missions.filter(shouldSeedMission)) {
      const missionRef = doc(
        db,
        "courses",
        mission.courseId,
        "lessons",
        mission.lessonId,
        "missions",
        mission.missionId,
      );

      await setDoc(missionRef, {
        missionId: mission.missionId,
        lessonId: mission.lessonId,
        courseId: mission.courseId,
        concept: mission.concept,
        storyTitle: mission.storyTitle,
        storyText: mission.storyText,
        language: mission.language,
        challenge: mission.challenge,
        starterCode: mission.starterCode,
        solution: mission.solution,
        expectedOutput: mission.expectedOutput,
        hint: mission.hint,
        xpBonus: mission.xpBonus,
      });

      const lessonRef = doc(
        db,
        "courses",
        mission.courseId,
        "lessons",
        mission.lessonId,
      );

      await setDoc(
        lessonRef,
        { missionId: mission.missionId, missionXp: mission.xpBonus },
        { merge: true },
      );

      console.log(`✅ Seeded mission: ${mission.missionId}`);
    }

    console.log("🎉 All missions seeded!");
  } catch (error) {
    console.error("❌ Failed to seed missions:", error);
    process.exit(1);
  }
}

seedMissions();
