const handleGenerate = async () => {
  if (!url) return alert("Please paste a URL");
  
  // Firebase mein save karne ka logic
  try {
    const docRef = await addDoc(collection(db, "links"), {
      originalUrl: url,
      alias: alias || Math.random().toString(36).substr(2, 5),
      createdAt: new Date()
    });
    alert("Link Created!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
