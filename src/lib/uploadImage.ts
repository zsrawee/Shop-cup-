export async function uploadImageToCloud(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  // إرسال الصورة إلى الـ API المحلي الذي أنشأناه
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  
  if (!data.url) {
    throw new Error("فشل في رفع الصورة محلياً");
  }
  
  return data.url; // سيرجع رابط مثل: /imag/123456-image.jpg
}