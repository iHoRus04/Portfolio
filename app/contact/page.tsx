import Header from "@/app/components/layout/Header";
import Contact from "@/app/sections/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Tong Thoi Duy Hung",
  description:
    "Get in touch with Tong Thoi Duy Hung — Fullstack & Frontend Developer based in Ho Chi Minh City, Vietnam.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-white">
      <Header />
      <div className="pt-20">
        <Contact />
      </div>
    </main>
  );
}
