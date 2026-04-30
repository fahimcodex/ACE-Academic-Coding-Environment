import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeCUpoOfSyEO_i7hBcoSd-pRq95TTpi9A",
  authDomain: "academic-coding-environment.firebaseapp.com",
  projectId: "academic-coding-environment",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function smartPatch() {
  console.log("🛠️ Searching for existing Linux lessons...");
  
  // Fetch ALL documents inside the linux lessons folder
  const lessonsRef = collection(db, "courses", "linux", "lessons");
  const snapshot = await getDocs(lessonsRef);
  
  if (snapshot.empty) {
    console.log("❌ No Linux lessons found in the database at all!");
    process.exit(1);
  }

  // Sort them alphabetically by ID so they stay in order
  const docs = snapshot.docs.sort((a, b) => a.id.localeCompare(b.id));

  let orderCounter = 1;
  for (const d of docs) {
    const data = d.data();
    
    // Only update if it doesn't already have an order
    if (!data.order) {
      await updateDoc(d.ref, { order: orderCounter });
      console.log(`✅ Patched ${d.id} with order: ${orderCounter}`);
    } else {
      console.log(`⚡ Skipped ${d.id} (Already has order: ${data.order})`);
    }
    orderCounter++;
  }
  
  console.log("\n✨ Smart Patch complete! Progression should be fixed.");
  process.exit(0);
}

smartPatch();