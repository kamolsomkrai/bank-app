"use client";

import Link from "next/link";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">ธนาคารหมู่บ้านเพื่อความมั่นคงของคุณ</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          เรามุ่งมั่นที่จะสนับสนุนชุมชน สร้างโอกาสทางการเงินที่ยั่งยืน ปลอดภัย และเชื่อถือได้
        </p>
        <Link href="/register" className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition">
          เปิดบัญชีวันนี้
        </Link>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">เกี่ยวกับเรา</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          ธนาคารหมู่บ้านของเราก่อตั้งขึ้นเพื่อส่งเสริมการออม การเข้าถึงสินเชื่อ และการสนับสนุนเศรษฐกิจภายในชุมชนอย่างยั่งยืน
          เราเชื่อว่าทุกคนควรมีโอกาสเข้าถึงบริการทางการเงินที่ปลอดภัยและเป็นธรรม
        </p>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-200 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard title="บัญชีออมทรัพย์" description="เปิดบัญชีเพื่อการออมของคุณ ด้วยดอกเบี้ยที่น่าสนใจและปลอดภัยสูงสุด" />
          <ServiceCard title="สินเชื่อเพื่อชุมชน" description="ให้สินเชื่อด้วยเงื่อนไขที่เป็นธรรม เพื่อเสริมสร้างโอกาสและความเจริญให้ชุมชน" />
          <ServiceCard title="ดอกเบี้ยพิเศษ" description="รับดอกเบี้ยพิเศษสำหรับสมาชิกที่ทำการฝากเงินประจำ หรือสะสมคะแนนการออม" />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-6 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">เริ่มต้นการออมกับเราได้แล้ววันนี้</h2>
        <Link href="/register" className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition">
          สมัครสมาชิก
        </Link>
      </section>

    </div>
  );
}

function ServiceCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
