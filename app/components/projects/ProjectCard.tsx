"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Badge from "@/app/components/ui/Badge";
import { Project } from "@/app/data/projects";
import { ArrowUpRight, Globe } from "lucide-react";
import ScrollRevealHeading from "@/app/components/ui/ScrollRevealHeading";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Desktop: Thẻ 01 ghim ở 84px, Thẻ 02 ghim ở 120px (để lộ 36px tab trên cùng của thẻ 01)
  const defaultDesktopTop = 84 + index * 36;
  const [stickyTop, setStickyTop] = useState(defaultDesktopTop);

  useEffect(() => {
    const updateOffset = () => {
      if (typeof window === "undefined") return;
      const isMobile = window.innerWidth < 1024;
      if (!isMobile) {
        setStickyTop(defaultDesktopTop);
        return;
      }

      const vh = window.innerHeight;
      const h = cardRef.current ? cardRef.current.offsetHeight : 680;
      // Khoảng cách an toàn phía dưới (chừa 76px cho floating bottom capsule navigation trên mobile)
      const bottomSafe = 76;

      // Đảm bảo Project 1 cuộn lên cho đến khi toàn bộ đáy card (hình ảnh, nút link) hiện trọn vẹn trong khung hình
      // rồi mới ghim (sticky) để Project 2 mới bắt đầu chồng lên mà không che mất bất kỳ thành phần nào
      const maxAllowedTop = vh - h - bottomSafe;
      const mobileTop = Math.min(60 + index * 16, maxAllowedTop);
      setStickyTop(mobileTop);
    };

    updateOffset();
    const timer = setTimeout(updateOffset, 150);
    window.addEventListener("resize", updateOffset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateOffset);
    };
  }, [defaultDesktopTop, index]);

  const displayUrl = project.demoUrl
    ? project.demoUrl.replace("https://", "")
    : `${project.id}.internal.app`;

  return (
    <div
      ref={cardRef}
      className="sticky mb-32 sm:mb-40 lg:mb-32 last:mb-0 transition-[top] duration-150"
      style={{
        top: `${stickyTop}px`,
        zIndex: 10 + index,
      }}
    >
      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* THẺ DỰ ÁN ĐỒNG BỘ 100% VỚI EXPERIENCES (#0d0d10 & border-white/[0.12])*/}
      {/* Nền đen tuyền sang trọng, hiệu ứng hover chuẩn glass như nút phụ  */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="group relative overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] border border-white/[0.12] bg-[#0d0d10] p-5 sm:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] interactive-glass-card">
        {/* Điểm nhấn vệt sáng đỏ nhẹ nhàng góc thẻ đồng bộ */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-[300px] w-[300px] rounded-full bg-[#830000]/15 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/[0.015] via-transparent to-red-950/[0.02]" />

        {/* ───────────────────────────────────────────────────────────── */}
        {/* HÀNG TRÊN CÙNG: CATEGORY, PROJECT NUMBER & DEPLOYMENT STATUS  */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-5 mb-5 sm:mb-7">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black tracking-widest text-[#ff0000]">
              PROJ.{project.number}
            </span>
            <span className="h-3 w-[1px] bg-white/20" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">
              {project.category}
            </span>
          </div>

          {/* Trạng thái triển khai thực tế (Understated, authentic engineering metadata) */}
          {project.badge && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                {project.badge}
              </span>
            </div>
          )}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* NỘI DUNG CHÍNH THẺ: BỐ CỤC CHUẨN THEO ẢNH MẪU (12 CỘT)       */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* ========================================================= */}
          {/* CỘT TRÁI (5 CỘT): TIÊU ĐỀ 2 DÒNG + THANH DỌC ĐỎ + SERIAL  */}
          {/* (Tái hiện trực tiếp từ bố cục Night Ambience trong ảnh)   */}
          {/* ========================================================= */}
          <div className="space-y-6 lg:col-span-5">
            {/* Cụm vạch dọc đỏ + Tiêu đề 2 dòng + Mã code định danh */}
            <div className="flex items-start gap-4 sm:gap-5">
              {/* Vạch kẻ dọc đỏ nổi bật (đặc trưng từ ảnh mẫu) */}
              <div className="h-16 w-1 sm:h-20 sm:w-1.5 rounded-full bg-[#bc0202] shrink-0 mt-1 shadow-[0_0_18px_rgba(188,2,2,0.9)]" />

              <div className="space-y-1.5">
                {/* Tiêu đề 2 dòng đậm chất Editorial Design */}
                <ScrollRevealHeading>
                  <h3 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-5xl font-black tracking-tight text-white leading-[1.1] break-words">
                    <span className="block">{project.displayTitle.line1}</span>
                    <span className="block text-white/95">{project.displayTitle.line2}</span>
                  </h3>
                </ScrollRevealHeading>
              </div>
            </div>

            {/* Mô tả giải pháp thực chiến */}
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              {project.description}
            </p>

            {/* Engineering Highlights */}
            <div className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                Engineering Highlights:
              </span>
              <ul className="space-y-1.5 text-xs text-gray-200">
                {project.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff0000] shadow-[0_0_6px_rgba(255,0,0,0.8)]" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Intersecting rings icon (◯◯) & Tech Stack */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3">

                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-300">
                  Tech Stack
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CỘT PHẢI (7 CỘT): KHUNG TRÌNH DUYỆT ĐẬM CHẤT DARK LUXURY    */}
          {/* ========================================================= */}
          <div className="space-y-5 lg:col-span-7">
            {/* Khung giao diện sản phẩm thực tế (Nền đen đặc đồng bộ #09090b) */}
            <div className="relative group/mockup overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#09090b] shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
              {/* Thanh tiêu đề trình duyệt phong cách Minimalist Dark */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="rounded-full border border-white/10 bg-black/60 px-3.5 py-0.5 font-mono text-[11px] text-gray-300">
                  {displayUrl}
                </div>
                <div className="w-10" />
              </div>

              {/* Hình ảnh Dashboard thực chiến với độ tương phản cao sắc nét */}
              {project.image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover object-top transition-transform duration-500 group-hover/mockup:scale-105"
                    priority={index === 0}
                  />
                  {/* Lớp phủ vignette điện ảnh */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                </div>
              )}
            </div>

            {/* THANH ĐÁY CỘT PHẢI: BRAND MARK ĐÁY PHẢI (TƯƠNG TỰ LOGO EKSPOSED TRONG ẢNH) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              {/* Liên kết phụ: Landing Page & GitHub */}
              <div className="flex items-center gap-3">
                {project.landingUrl && (
                  <a
                    href={project.landingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gradient-secondary px-3.5 py-1.5 text-xs"
                  >
                    <Globe className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>Landing</span>
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gradient-secondary px-3.5 py-1.5 text-xs"
                    aria-label="GitHub Repository"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                    <span>GitHub</span>
                  </a>
                )}
              </div>

              {/* BRAND INSIGNIA ĐÁY PHẢI: Tái hiện đúng phong cách chữ ký thương hiệu trong ảnh */}
              <div className="flex items-center gap-3.5 ml-auto">
                <div className="text-right">
                  <span className="block font-black uppercase tracking-[0.2em] text-white text-xs sm:text-sm">
                    {project.brandName}
                  </span>
                  <span className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400">
                    {project.brandTagline}
                  </span>
                </div>

                {/* Huy hiệu số thứ tự dự án */}
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] font-mono text-xs font-black text-[#ff0000] shadow-lg shadow-black/50">
                  {project.number}
                </div>

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gradient-primary px-4 py-2 text-xs"
                  >
                    <span>Explore</span>
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
