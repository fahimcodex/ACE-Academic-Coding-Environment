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
];

async function seedMissions() {
  try {
    for (const mission of missions) {
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
