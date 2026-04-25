// scripts/seedLinuxExpansion.mjs
// Run with: node scripts/seedLinuxExpansion.mjs

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

const newLinuxLessons = [
    {
        id: "linux-06",
        courseId: "linux",
        order: 6,
        title: "File Permissions & Ownership",
        duration: "15 min",
        xpReward: 40,
        language: "terminal",
        theory: `# File Permissions

Linux is a multi-user system. Every file has an **owner**, a **group**, and a set of **permissions**.

## Reading Permissions
When you run \`ls -l\`, you see something like:
\`-rwxr-xr-- 1 user group 4096 Jan 1 file.txt\`

The first 10 characters \`-rwxr-xr--\` represent the permissions:
* \`-\`: File type (\`-\` for file, \`d\` for directory)
* \`rwx\`: **User** (Owner) permissions (Read, Write, eXecute)
* \`r-x\`: **Group** permissions (Read, eXecute)
* \`r--\`: **Others** (Everyone else) (Read only)

## chmod (Change Mode)
Used to change permissions.
* **Symbolic:** \`chmod u+x file.txt\` (give user execute permission)
* **Numeric:** \`chmod 755 file.txt\`
  * 4 = Read, 2 = Write, 1 = Execute
  * 7 (4+2+1) = rwx, 5 (4+1) = r-x

## chown (Change Owner)
Used to change the owner of a file (requires superuser/sudo).
\`chown root file.txt\``,
        starterCode: `# Let's practice checking and changing permissions
ls -l
# Try adding execute permissions to a file using chmod +x`,
        quiz: [
            {
                id: "q1",
                question: "What does the permission '777' mean in chmod?",
                options: ["Read-only for everyone", "Full read, write, execute permissions for everyone", "Execute only", "Hidden file"],
                correct: 1,
                explanation: "7 is 4(read) + 2(write) + 1(execute). 777 gives these full permissions to User, Group, and Others.",
            },
            {
                id: "q2",
                question: "Which command changes the owner of a file?",
                options: ["chmod", "chown", "chgrp", "sudo"],
                correct: 1,
                explanation: "chown stands for 'change owner'. chmod is for permissions.",
            }
        ],
    },
    {
        id: "linux-07",
        courseId: "linux",
        order: 7,
        title: "Process Management",
        duration: "18 min",
        xpReward: 45,
        language: "terminal",
        theory: `# Process Management

Everything running on Linux is a process. 

## Viewing Processes
* **\`ps\`**: Snapshot of current processes.
  * \`ps aux\`: Detailed list of ALL processes.
* **\`top\`** / **\`htop\`**: Real-time, dynamic view of running processes and system resources (CPU/RAM).

## Background & Foreground
* Add **\`&\`** to the end of a command to run it in the background: \`sleep 100 &\`
* **\`jobs\`**: Lists background jobs.
* **\`fg\`**: Brings a background job to the foreground.

## Killing Processes
If a program freezes, you can terminate it using its Process ID (PID).
* **\`kill <PID>\`**: Sends a polite termination signal (SIGTERM).
* **\`kill -9 <PID>\`**: Forcefully kills the process instantly (SIGKILL).
* **\`killall <name>\`**: Kills all processes with a specific name.`,
        starterCode: `# Check running processes
ps
# To see all processes running on the system, try ps aux`,
        quiz: [
            {
                id: "q1",
                question: "Which command forcefully kills a process without waiting for it to clean up?",
                options: ["kill -1", "kill -9", "kill -15", "terminate"],
                correct: 1,
                explanation: "kill -9 sends the SIGKILL signal, which the operating system handles immediately by terminating the process.",
            }
        ],
    },
    {
        id: "linux-08",
        courseId: "linux",
        order: 8,
        title: "Networking & Downloading",
        duration: "15 min",
        xpReward: 40,
        language: "terminal",
        theory: `# Networking Commands

The terminal is powerful for interacting with the internet and local networks.

## Checking Connectivity
* **\`ping <domain>\`**: Sends packets to a server to see if it is online and measures response time. 
  * Example: \`ping google.com\` (Press Ctrl+C to stop).

## Downloading Files
* **\`wget <url>\`**: Downloads a file directly from the internet to your current directory.
* **\`curl <url>\`**: Outputs the raw HTML/data of a webpage to your terminal. 
  * Use \`curl -O <url>\` to save it to a file.

## Network Information
* **\`ip a\`** or **\`ifconfig\`**: Shows your local IP address and network interfaces.
* **\`netstat\`**: Shows active network connections.`,
        starterCode: `# Try pinging a website to check connectivity
ping -c 4 1.1.1.1
# (The -c 4 flag tells it to only ping 4 times)`,
        quiz: [
            {
                id: "q1",
                question: "Which command is primarily used to download files from the terminal?",
                options: ["ping", "netstat", "wget", "ip a"],
                correct: 2,
                explanation: "wget (Web Get) is a utility for non-interactive download of files from the Web.",
            }
        ],
    },
    {
        id: "linux-09",
        courseId: "linux",
        order: 9,
        title: "Advanced Text Processing",
        duration: "20 min",
        xpReward: 50,
        language: "terminal",
        theory: `# Advanced Text Processing

Linux shines at manipulating text files using built-in utilities.

## grep (Global Regular Expression Print)
Searches for patterns inside text.
* \`grep "error" log.txt\`: Finds all lines containing "error".
* \`grep -i "error" log.txt\`: Case-insensitive search.
* \`grep -r "TODO" .\`: Recursively searches all files in current directory.

## awk
A powerful language for column-based data.
* \`awk '{print $1}' data.txt\`: Prints only the first column of a file.

## sed (Stream Editor)
Used for find-and-replace text manipulations.
* \`sed 's/apple/orange/g' file.txt\`: Replaces all instances of "apple" with "orange".`,
        starterCode: `# Echo some data into a file
echo -e "apple 10\\norange 20\\napple 30" > fruits.txt
# Now try using grep to find 'apple'
grep "apple" fruits.txt`,
        quiz: [
            {
                id: "q1",
                question: "Which command is best suited to print ONLY the 3rd column of a space-separated text file?",
                options: ["grep", "awk", "sed", "cat"],
                correct: 1,
                explanation: "awk is designed specifically for column-oriented text processing. `awk '{print $3}'` extracts the 3rd column.",
            }
        ],
    },
    {
        id: "linux-10",
        courseId: "linux",
        order: 10,
        title: "Basic Shell Scripting",
        duration: "20 min",
        xpReward: 50,
        language: "terminal",
        theory: `# Shell Scripting

A shell script is simply a text file containing a sequence of terminal commands.

## The Shebang
Scripts usually start with a **shebang** (\`#!\`) to tell the OS which interpreter to use:
\`\`\`bash
#!/bin/bash
\`\`\`

## Variables
No spaces around the equals sign!
\`\`\`bash
NAME="Alice"
echo "Hello $NAME"
\`\`\`

## Making it Executable
To run a script, you must first give it execute permissions:
1. \`chmod +x myscript.sh\`
2. Execute it using: \`./myscript.sh\`

## Simple Loop
\`\`\`bash
for i in 1 2 3; do
  echo "Number $i"
done
\`\`\``,
        starterCode: `# Let's create a tiny script!
echo '#!/bin/bash' > script.sh
echo 'echo "Hello from my first script!"' >> script.sh
chmod +x script.sh
./script.sh`,
        quiz: [
            {
                id: "q1",
                question: "What must you do to a newly created bash script before you can run it with ./script.sh?",
                options: ["Compile it", "Zip it", "Make it executable using chmod +x", "Run it as root"],
                correct: 2,
                explanation: "Scripts require execute permissions to run. Use `chmod +x` to grant this permission.",
            }
        ],
    }
];

async function seed() {
    console.log("🌱 Expanding Linux course...\n");

    await setDoc(doc(db, "courses", "linux"), {
        totalLessons: 10,
    }, { merge: true });

    for (const lesson of newLinuxLessons) {
        await setDoc(doc(db, "courses", "linux", "lessons", lesson.id), lesson);
        console.log(`  ✅ Added Lesson ${lesson.order}: ${lesson.title}`);
    }

    console.log(`\n✨ Linux Expansion Done! Added lessons 6 through 10.`);
    process.exit(0);
}

seed().catch((e) => {
    console.error("❌", e);
    process.exit(1);
});