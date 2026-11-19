import Image from "next/image";

export default function Hero() {
  return (
    <section className="" id="home">
      <div className="sections-2">
        <div className="flex-1 space-y-4 ">
          <h1 className="text-5xl md:text-6xl font-bold ">
            Hello, Im Tong Thoi Duy Hung
          </h1>
          <h2 className="text-2xl text-blue-600 font-semibold">
            Frontend Developer
          </h2>
          <p className="max-w-100">
            Giới thiệu ngắn về khả năng xây dựng giao diện web responsive,
            React, Next.js và TypeScript.
          </p>
          <div className="flex gap-6">
            <a
              className="btn-primary focus-ring"
              href="/TongThoiDuyHung_Fullstack_CV.pdf"
              download
            >
              Download CV
            </a>

            <a
              className="rounded-full border p-2 transition-colors hover:bg-gray-900 hover:text-white focus-ring"
              href="#projects"
            >
              View Projects
            </a>
          </div>
        </div>
        <div className="flex-1">
          <Image
            alt="My Picture"
            width={500}
            height={333}
            src={"/web-developer-la-gi.webp"}
          />
        </div>
      </div>
    </section>
  );
}
