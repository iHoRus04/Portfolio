"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { timelineMilestones, TimelineMilestone } from "@/app/data/timeline";
import {
  ArrowLeft,
  ArrowRight,
  MoveVertical,
  CheckCircle2,
  Building2,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import ScrollRevealHeading from "@/app/components/ui/ScrollRevealHeading";

const STEP_ANGLE = 28; // Góc chia giữa 3 mốc tháng trên đĩa quay
const TOTAL_MILESTONES = timelineMilestones.length; // 3 tháng thực tập
const MILESTONE_FRACTIONS = [0.0, 0.5, 1.0]; // Tỉ lệ cuộn tương ứng với 3 mốc

export default function Experiences() {
  const [activeIndex, setActiveIndex] = useState(0); // 0: Tháng 01, 1: Tháng 02, 2: Tháng 03
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragRotation, setDragRotation] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dialSize, setDialSize] = useState(1150);

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const isPointerDownRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartRotRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Tính toán kích thước đĩa quay responsive theo viewport chiều cao & rộng
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const usableH = Math.max(480, h - 210);

      if (w < 640) {
        setDialSize(Math.max(520, Math.min(680, w * 1.3)));
      } else if (w < 1024) {
        setDialSize(Math.max(680, Math.min(880, usableH * 1.15)));
      } else {
        // Desktop: Đĩa mở rộng cân bằng với chiều cao màn hình để tạo đường cong tự nhiên
        const targetSize = Math.max(860, Math.min(1320, usableH * 1.42));
        setDialSize(targetSize);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Lắng nghe sự kiện scroll của trang để điều khiển đĩa xoay và mốc thời gian
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const maxScroll = trackRef.current.offsetHeight - windowHeight;
        if (maxScroll <= 0) return;

        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
        setScrollProgress(progress);

        // Xác định mốc activeIndex theo tiến trình cuộn
        let newIdx = 0;
        if (progress < 0.33) {
          newIdx = 0;
        } else if (progress < 0.67) {
          newIdx = 1;
        } else {
          newIdx = 2;
        }
        setActiveIndex(newIdx);

        // Góc xoay tỷ lệ trực tiếp theo tiến trình cuộn (Scrubbing liên tục mượt mà, không giật khấc)
        if (!isPointerDownRef.current) {
          const computedRot = -progress * (TOTAL_MILESTONES - 1) * STEP_ANGLE;
          setRotation(computedRot);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Cuộn trang mượt mà đến vị trí mốc thời gian mong muốn
  const scrollToMilestone = useCallback((index: number) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(TOTAL_MILESTONES - 1, index));
    const rect = trackRef.current.getBoundingClientRect();
    const trackTopY = window.scrollY + rect.top;
    const maxScroll = trackRef.current.offsetHeight - window.innerHeight;
    const targetFrac = MILESTONE_FRACTIONS[clamped];
    const targetY = trackTopY + targetFrac * maxScroll;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }, []);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      scrollToMilestone(activeIndex - 1);
    } else {
      // Nếu đang ở mốc 0 mà bấm lùi, cuộn mượt lên section Projects
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackTopY = window.scrollY + rect.top;
      window.scrollTo({
        top: Math.max(0, trackTopY - 120),
        behavior: "smooth",
      });
    }
  }, [activeIndex, scrollToMilestone]);

  const handleNext = useCallback(() => {
    if (activeIndex < TOTAL_MILESTONES - 1) {
      scrollToMilestone(activeIndex + 1);
    } else {
      // Nếu đang ở mốc cuối (tháng 3) mà bấm tiếp, cuộn mượt xuống section Skills
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackTopY = window.scrollY + rect.top;
      const maxScroll = trackRef.current.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: trackTopY + maxScroll + 80,
        behavior: "smooth",
      });
    }
  }, [activeIndex, scrollToMilestone]);

  // Kéo thả chuột hoặc vuốt cảm ứng trên đĩa quay
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartRotRef.current = rotation;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const deltaY = e.clientY - dragStartYRef.current;
    const newRot = dragStartRotRef.current - deltaY * 0.15;
    const minRot = -2 * STEP_ANGLE;
    const maxRot = 0;
    const clamped = Math.max(minRot, Math.min(maxRot, newRot));
    setDragRotation(clamped);
  };

  const handlePointerUp = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);
    const estimatedIndex = Math.round(-dragRotation / STEP_ANGLE);
    const clampedIndex = Math.max(0, Math.min(TOTAL_MILESTONES - 1, estimatedIndex));
    scrollToMilestone(clampedIndex);
  };

  // Điều hướng bằng phím mũi tên khi section đang hiển thị
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const activeMilestone: TimelineMilestone = timelineMilestones[activeIndex];
  const activeRotation = isDragging ? dragRotation : rotation;

  // Tính toán hình học cho SVG đĩa quay
  const cx = dialSize / 2;
  const cy = dialSize / 2;
  const outerR = dialSize / 2 - 8;
  const innerR = outerR - 26;
  const labelR = outerR + 24;

  // Vạch chia độ (tick marks) quanh chu vi
  const ticks: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isMajor: boolean;
    isQuarter: boolean;
  }[] = [];

  for (let a = -90; a <= 90; a += 1.5) {
    const rad = (a * Math.PI) / 180;
    const isMajor = Math.abs(a % (STEP_ANGLE / 2)) < 0.8;
    const isQuarter = Math.abs(a % STEP_ANGLE) < 0.8;
    const tickLen = isQuarter ? 22 : isMajor ? 13 : 7;
    ticks.push({
      x1: cx + outerR * Math.cos(rad),
      y1: cy + outerR * Math.sin(rad),
      x2: cx + (outerR - tickLen) * Math.cos(rad),
      y2: cy + (outerR - tickLen) * Math.sin(rad),
      isMajor,
      isQuarter,
    });
  }

  return (
    /* TRACK CUỘN TOÀN TRANG: Chiều cao 220vh tối ưu vừa vặn, xoay mượt theo từng pixel cuộn */
    <div ref={trackRef} id="experiences" className="relative h-[220vh] w-full">
      {/* SECTION STICKY CỐ ĐỊNH TRỌN VẸN 1 MÀN HÌNH (100dvh) */}
      <section
        ref={containerRef}
        className="sticky top-0 flex h-dvh max-h-screen w-full flex-col justify-between overflow-hidden bg-[#000000] text-white select-none pt-12 sm:pt-20 pb-16 sm:pb-5"
        aria-labelledby="timeline-heading"
      >
        {/* Vệt sáng ambient nền đồng bộ Dark Luxury / Red */}
        <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-187.5 w-187.5 rounded-full bg-[#830000]/15 blur-[150px]" />
        <div className="pointer-events-none absolute right-10 bottom-10 h-125 w-125 rounded-full bg-[#bc0202]/[0.05] blur-[120px]" />

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* HEADER SECTION: Đặt dưới Header toàn cục, gọn gàng trong viewport */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-10 lg:px-14 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-6 sm:w-8 bg-[#bc0202] rounded-full shadow-[0_0_6px_rgba(188,2,2,0.8)]" />
              <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#ff3333]">
                {"// 02 · CAREER TIMELINE"}
              </span>
            </div>
            <ScrollRevealHeading>
              <h2
                id="timeline-heading"
                className="mt-0.5 text-lg sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-white"
              >
                Work <span className=" text-[#ff2200]">Experience</span>
              </h2>
            </ScrollRevealHeading>
            {/* Role & Company tag on mobile so context is immediate */}
            <div className="flex lg:hidden items-center gap-2 text-[11px] font-mono text-gray-300 pt-0.5">
              <span className="font-bold text-white">Fullstack Intern</span>
              <span className="text-gray-500">•</span>
              <span className="text-[#ff2200] font-semibold">TechVanguard</span>
            </div>
          </div>

          {/* Progress badge for 3-month internship */}
          <div className="text-right">
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#ff2200]">
              MONTH 0{activeIndex + 1} / 0{TOTAL_MILESTONES}
            </span>
            <span className="block text-[10px] sm:text-[11px] font-mono text-gray-400 mt-0.5">
              {activeMilestone.monthBadge}
            </span>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* MOBILE VIEW: ĐĨA QUAY NẰM DƯỚI TITLE, QUAY LÊN TRÊN HIỆN NỬA ĐĨA   */}
        {/* CÁC THÔNG TIN CHI TIẾT ĐƯỢC ĐẶT TRỌN VẸN BÊN TRONG ĐĨA QUAY       */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 flex lg:hidden w-full flex-1 min-h-0 flex-col justify-between px-3 sm:px-6 pt-1 pb-1">
          {/* KHUNG ĐĨA QUAY MOBILE (Vòm cung nửa đĩa quay phía trên + Chi tiết bên trong) */}
          <div
            className="group relative flex flex-col justify-between w-full flex-1 rounded-[28px] sm:rounded-[36px] border border-white/12 bg-[#0d0d10] p-4 sm:p-5 shadow-[0_15px_45px_rgba(0,0,0,0.95)] overflow-hidden cursor-grab active:cursor-grabbing transition-shadow duration-300"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Ảnh tư liệu duotone đỏ - đen nghệ thuật nền */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <Image
                key={activeMilestone.id}
                src={activeMilestone.image}
                alt={activeMilestone.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center grayscale contrast-125 brightness-[0.24] opacity-25 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95" />
            </div>

            {/* NỬA ĐĨA QUAY PHÍA TRÊN (Vòm cung đĩa xoay quay lên trên) */}
            <div className="relative z-20 w-full pt-0.5 pb-2 border-b border-white/10 shrink-0">
              <div className="relative w-full h-11 flex items-center justify-center">
                <svg
                  className="w-full h-full select-none"
                  viewBox="0 0 320 52"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  {/* Đường cong cung đĩa kép */}
                  <path
                    d="M 18 46 Q 160 8 302 46"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 28 50 Q 160 16 292 50"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />

                  {/* Vạch chia độ dọc cung đĩa */}
                  {Array.from({ length: 25 }).map((_, i) => {
                    const t = i / 24;
                    const x = (1 - t) * (1 - t) * 18 + 2 * (1 - t) * t * 160 + t * t * 302;
                    const y = (1 - t) * (1 - t) * 46 + 2 * (1 - t) * t * 8 + t * t * 46;
                    const isMajor = i % 6 === 0;
                    const isMid = i % 3 === 0;
                    const len = isMajor ? 8 : isMid ? 5 : 3;
                    return (
                      <line
                        key={i}
                        x1={x}
                        y1={y}
                        x2={x}
                        y2={y - len}
                        stroke={isMajor ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.12)"}
                        strokeWidth={isMajor ? 1.5 : 1}
                      />
                    );
                  })}

                  {/* 3 Mốc tháng đặt trên nửa đĩa quay (t = 0.15, t = 0.5, t = 0.85) */}
                  {timelineMilestones.map((m, idx) => {
                    const t = idx === 0 ? 0.15 : idx === 1 ? 0.5 : 0.85;
                    const x = (1 - t) * (1 - t) * 18 + 2 * (1 - t) * t * 160 + t * t * 302;
                    const y = (1 - t) * (1 - t) * 46 + 2 * (1 - t) * t * 8 + t * t * 46;
                    const isActive = idx === activeIndex;

                    return (
                      <g
                        key={m.id}
                        className="cursor-pointer pointer-events-auto"
                        onClick={() => scrollToMilestone(idx)}
                      >
                        {isActive && (
                          <circle
                            cx={x}
                            cy={y}
                            r={8}
                            fill="rgba(255,0,0,0.25)"
                            className="animate-ping"
                          />
                        )}
                        <circle
                          cx={x}
                          cy={y}
                          r={isActive ? 4.5 : 3}
                          fill={isActive ? "#ff0000" : "rgba(255,255,255,0.35)"}
                          stroke={isActive ? "#ffffff" : "transparent"}
                          strokeWidth={isActive ? 1.5 : 0}
                        />
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          fill={isActive ? "#ff2200" : "rgba(255,255,255,0.55)"}
                          fontSize={isActive ? "10" : "8"}
                          fontWeight={isActive ? "800" : "600"}
                          fontFamily="monospace"
                        >
                          {m.monthBadge}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Nhãn giai đoạn & thời gian */}
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 px-1 pt-0.5">
                <span className="text-[#ff2200] font-bold uppercase tracking-wider">
                  {activeMilestone.stageBadge}
                </span>
                <span className="text-gray-400 font-medium">
                  {activeMilestone.year}
                </span>
              </div>
            </div>

            {/* NỘI DUNG CHI TIẾT TRỌN VẸN BÊN TRONG ĐĨA QUAY */}
            <div className="relative z-10 flex-1 flex flex-col justify-between py-1.5 space-y-2">
              {/* Tiêu đề & Subtitle */}
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug line-clamp-2">
                  {activeMilestone.title}
                </h4>
                <p className="text-[11px] font-semibold text-gray-400">
                  {activeMilestone.subtitle}
                </p>
              </div>

              {/* Mô tả kỹ thuật */}
              <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-2">
                {activeMilestone.description}
              </p>

              {/* Monthly Key Focus (3 bullets) */}
              <div className="space-y-1 pt-0.5 border-t border-white/5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Monthly Key Focus:
                </span>
                <ul className="space-y-1 text-[10px] text-gray-300">
                  {activeMilestone.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-[#ff0000] shrink-0 mt-0.5" strokeWidth={2.2} />
                      <span className="leading-tight line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2 Chỉ số nổi bật & Tags */}
              <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/10">
                <div className="flex items-center gap-4">
                  {activeMilestone.metrics.map((metric, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <span className="block text-base sm:text-lg font-black tracking-tight text-white leading-none">
                        {metric.value}
                      </span>
                      <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-400">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Tech tags */}
                <div className="flex flex-wrap gap-1 justify-end">
                  {activeMilestone.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* DESKTOP VIEW: KHUNG HIỂN THỊ CHÍNH (ĐĨA QUAY TO TRÁI + CHỮ PHẢI)    */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 my-auto hidden lg:flex w-full flex-1 min-h-0 flex-row items-center justify-between">
          {/* ========================================================= */}
          {/* CỘT TRÁI: ĐĨA QUAY MỞ RỘNG HƠN 1 NỬA MÀN HÌNH (~56% WIDTH) */}
          {/* ========================================================= */}
          <div className="relative flex h-[52%] sm:h-[55%] lg:h-full w-full lg:w-[56%] shrink-0 items-center">
            {/* Vòng tròn đĩa quay đặt căn mép phải chạm tự nhiên vào ranh giới giữa 2 cột */}
            <div
              className="absolute flex items-center"
              style={{
                width: dialSize,
                height: dialSize,
                right: "0px",
                top: "50%",
                transform: "translate(0, -50%)",
              }}
            >
              {/* Thân vòng tròn chứa chi tiết kỹ thuật của tháng thực tập */}
              <div
                className="group relative h-full w-full rounded-full border border-white/12 bg-[#0d0d10] shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden cursor-grab active:cursor-grabbing transition-shadow duration-500 hover:border-red-500/30"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {/* Ảnh tư liệu duotone đỏ - đen nghệ thuật */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <Image
                    key={activeMilestone.id}
                    src={activeMilestone.image}
                    alt={activeMilestone.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 1400px"
                    className="object-cover object-center grayscale contrast-125 brightness-[0.32] opacity-35 mix-blend-luminosity transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to from-black via-black/85 to-red-950/25 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/65 to-transparent" />
                </div>

                {/* NỘI DUNG CHI TIẾT TỪNG THÁNG NẰM BÊN TRONG CUNG TRÒN */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col justify-center z-10 transition-all duration-500 px-6 sm:px-10 lg:px-14"
                  style={{
                    left: "26%",
                    width: "68%",
                    maxHeight: "86%",
                  }}
                >
                  <div className="space-y-3 sm:space-y-4">


                    {/* Tiêu đề trọng tâm của tháng */}
                    <div className="space-y-1">
                      <h4
                        key={`title-${activeMilestone.id}`}
                        className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-tight"
                      >
                        {activeMilestone.title}
                      </h4>
                      <p className="text-xs sm:text-sm font-semibold text-gray-400">
                        {activeMilestone.subtitle}
                      </p>
                    </div>

                    {/* Mô tả giải pháp kỹ thuật chi tiết */}
                    <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-3">
                      {activeMilestone.description}
                    </p>

                    {/* 3 Core technical accomplishments of the month */}
                    <div className="space-y-1 pt-0.5">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Monthly Key Focus:
                      </span>
                      <ul className="space-y-1 text-xs text-gray-300">
                        {activeMilestone.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#ff0000] shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 2 Chỉ số nổi bật */}
                    <div className="flex gap-8 pt-2 border-t border-white/10">
                      {activeMilestone.metrics.map((metric, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="block text-xl sm:text-2xl font-black tracking-tight text-white">
                            {metric.value}
                          </span>
                          <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {metric.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Badges */}
                    <div className="hidden sm:flex flex-wrap gap-1.5 pt-0.5">
                      {activeMilestone.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Chú thích ở đáy */}
                  <span className="block mt-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] text-gray-500">
                    {activeMilestone.caption}
                  </span>
                </div>

                {/* SVG ĐĨA QUAY: VẠCH CHIA ĐỘ & MỐC THÁNG NHỎ VỪA ĐỦ TRÊN ĐĨA */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full select-none"
                  viewBox={`0 0 ${dialSize} ${dialSize}`}
                  aria-hidden="true"
                >
                  {/* Vòng viền kim loại kép */}
                  <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" />

                  {/* Nhóm xoay: Vạch chia và 3 mốc tháng nhỏ chạy dọc chu vi đĩa */}
                  <g
                    style={{
                      transformOrigin: `${cx}px ${cy}px`,
                      transform: `rotate(${activeRotation}deg)`,
                      transition: isDragging ? "none" : "transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {/* Vạch chia độ */}
                    {ticks.map((t, i) => (
                      <line
                        key={i}
                        x1={t.x1}
                        y1={t.y1}
                        x2={t.x2}
                        y2={t.y2}
                        stroke={
                          t.isQuarter
                            ? "rgba(255,255,255,0.4)"
                            : t.isMajor
                              ? "rgba(255,255,255,0.18)"
                              : "rgba(255,255,255,0.06)"
                        }
                        strokeWidth={t.isQuarter ? 2 : 1}
                      />
                    ))}

                    {/* THỜI GIAN 3 THÁNG HIỆN NHỎ VỪA ĐỦ TRÊN PHẦN ĐĨA QUAY */}
                    {timelineMilestones.map((milestone, idx) => {
                      const angle = idx * STEP_ANGLE;
                      const rad = (angle * Math.PI) / 180;
                      const lx = cx + labelR * Math.cos(rad);
                      const ly = cy + labelR * Math.sin(rad);
                      const isActive = idx === activeIndex;

                      return (
                        <g
                          key={milestone.id}
                          className="cursor-pointer pointer-events-auto"
                          onClick={() => scrollToMilestone(idx)}
                        >
                          {/* Chấm tròn nhỏ định vị mốc */}
                          <circle
                            cx={cx + (outerR + 9) * Math.cos(rad)}
                            cy={cy + (outerR + 9) * Math.sin(rad)}
                            r={isActive ? 4 : 2}
                            fill={isActive ? "#bc0202" : "rgba(255,255,255,0.25)"}
                            className="transition-all duration-300"
                          />
                          {/* Nhãn tháng nhỏ gọn, thanh lịch trên đĩa xoay */}
                          <text
                            x={lx}
                            y={ly}
                            textAnchor="start"
                            dominantBaseline="central"
                            fill={isActive ? "#bc0202" : "rgba(255,255,255,0.35)"}
                            fontSize={isActive ? "12" : "10"}
                            fontWeight={isActive ? "800" : "500"}
                            fontFamily="monospace"
                            letterSpacing="0.08em"
                            className="transition-colors duration-300 hover:fill-white"
                          >
                            {milestone.year}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* NÚT CHỈ BÁO HOẠT ĐỘNG TẠI ĐỈNH 3 GIỜ (Ranh giới tự nhiên giữa 2 cột) */}
              <div
                className="absolute z-30 -translate-y-1/2 flex items-center gap-3 pointer-events-auto"
                style={{ right: "-20px", top: "50%" }}
              >
                {/* Glowing red drag button */}
                <button
                  type="button"
                  onPointerDown={handlePointerDown}
                  className="group flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#bc0202] text-white shadow-[0_0_25px_rgba(188,2,2,0.7)] border-2 border-white/40 cursor-grab active:cursor-grabbing transition-transform hover:scale-110 hover:bg-[#ff0000] active:scale-95 focus:outline-none"
                  aria-label="Drag vertically to rotate timeline"
                  title="Drag to rotate dial"
                >
                  <MoveVertical className="h-4 w-4 transition-transform group-hover:scale-110" />
                </button>

                {/* Nhãn tháng nhỏ gọn ngay tại kim chỉ đĩa quay */}
                <span className="hidden xl:inline-block rounded-full border border-[#830000]/60 bg-black/80 px-3 py-1 font-mono text-xs font-bold text-[#ff0000] backdrop-blur-md shadow-lg">
                  {activeMilestone.year}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CỘT PHẢI: HOÀN TOÀN KHÔNG BORDER CHE ĐĨA QUAY (~44% WIDTH) */}
          {/* CHỮ LỚN VỀ VỊ TRÍ VÀ CÔNG TY NỔI BẬT THOÁNG ĐÃNG          */}
          {/* ========================================================= */}
          <div className="relative z-20 flex w-full lg:w-[44%] flex-col justify-center px-6 sm:px-10 lg:pl-10 lg:pr-14 py-4 lg:py-0 bg-transparent">
            <div className="space-y-4 sm:space-y-6">
              {/* Header Stage Badge & Connecting line */}
              <div className="flex items-center gap-4">
                <div className="h-px w-14 sm:w-20 bg-linear-to-r from-[#bc0202] to-transparent" />
                <span className="text-xs font-mono font-bold uppercase tracking-[0.25em]  text-[#ff2200]">
                  {activeMilestone.stageBadge}
                </span>
              </div>

              {/* CHỮ LỚN VỀ VỊ TRÍ (HUGE EDITORIAL POSITION / ROLE TYPOGRAPHY) */}
              <div className="space-y-1.5 sm:space-y-2">
                <h3
                  key={`role-${activeMilestone.id}`}
                  className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight text-white leading-tight sm:leading-[0.92] select-none transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                >
                  {activeMilestone.role}
                </h3>
              </div>

              {/* CÔNG TY TECHVANGUARD CO., LTD. & THỜI GIAN THỰC TẬP */}
              <div
                key={`company-${activeMilestone.id}`}
                className="space-y-2.5 sm:space-y-3 pt-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-center gap-2 text-lg sm:text-2xl lg:text-3xl font-extrabold text-white/95">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#ff2200] shrink-0" strokeWidth={2} />
                  <span>{activeMilestone.company}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                  <span className="inline-flex items-center gap-1.5 text-[#ff0000] font-semibold">
                    <Calendar className="h-3.5 w-3.5  text-[#ff2200]" />
                    10/2025 – 01/2026
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-600" />
                  <span className="inline-flex items-center gap-1.5 text-gray-300 font-medium">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    3-Month Enterprise Internship
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-600" />
                  <span className="inline-flex items-center gap-1.5 text-gray-400">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    {activeMilestone.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* THANH NAVIGATION BÊN DƯỚI: TỐI GIẢN & HIỆN ĐẠI (MINIMALIST PILL) */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 sm:pt-3 border-t border-white/5 shrink-0 pb-16 sm:pb-0">
          {/* Timeline progress indicator */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <span className="text-gray-400">Timeline Progress {Math.round(scrollProgress * 100)}%</span>
          </div>

          {/* Unified Modern Capsule Navigation Pill for 3-month internship */}
          <div className="flex items-center gap-4 rounded-full border border-white/10 bg-white/3 px-4 py-2 backdrop-blur-md shadow-lg shadow-black/40">
            {/* 3-Month counter */}
            <span className="font-mono text-xs font-bold text-white tracking-wider">
              Month 0{activeIndex + 1}
              <span className="text-gray-500 font-normal"> / 0{TOTAL_MILESTONES}</span>
            </span>

            {/* Segmented clickable timeline tracks */}
            <div className="flex items-center gap-2 px-1">
              {timelineMilestones.map((milestone, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={milestone.id}
                    type="button"
                    onClick={() => scrollToMilestone(idx)}
                    className={`group relative h-1.5 transition-all duration-300 rounded-full focus:outline-none ${isActive
                      ? "w-10 bg-[#bc0202] shadow-[0_0_10px_rgba(188,2,2,0.6)]"
                      : "w-3 bg-white/20 hover:bg-white/50 hover:w-5"
                      }`}
                    title={`${milestone.monthBadge} · ${milestone.title}`}
                    aria-label={`Month ${idx + 1}: ${milestone.year}`}
                  />
                );
              })}
            </div>

            {/* Compact milestone navigation buttons */}
            <div className="flex items-center gap-1 border-l border-white/10 pl-3">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-white/10 hover:text-white active:scale-90 focus:outline-none"
                aria-label="Previous month"
                title="Previous month"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-white/10 hover:text-white active:scale-90 focus:outline-none"
                aria-label="Next month"
                title="Next month"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
