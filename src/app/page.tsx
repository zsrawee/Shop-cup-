import { connectToDB } from "@/lib/db";

export default async function Home() {
  await connectToDB(); // جرب يتصل أول ما تفتح الصفحة
  
  return (
    <main>
      <h1>مشروع الـ SaaS جاهز للعمل! 🚀</h1>
    </main>
  );
}