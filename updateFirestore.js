import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./src/firebaseConfig.js"; // ✅ Ensure correct Firebase import

const batchUpdateFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "fields"));

    querySnapshot.forEach(async (document) => {
      const docRef = doc(db, "fields", document.id);
      await updateDoc(docRef, {
        category: document.data().category || ["11v11", "9v9", "7v7", "5v5"], // ✅ Default match formats
        type: document.data().type || ["indoor", "outdoor"], // ✅ Includes BOTH indoor & outdoor
        surface: document.data().surface || ["grass", "turf"], // ✅ Allows both surfaces
      });
    });

    console.log("Firestore batch update completed!");
  } catch (error) {
    console.error("Error updating documents:", error);
  }
};

batchUpdateFirestore();