"use client";
import { useState } from "react";
import Navigation from "./Navigation";

export default function Header() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  return (
    <header className="">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-2">
        <a className="text-2xl" href="#home">
          <h1>Logo</h1>
        </a>

        <Navigation
          onItemClick={() => setIsOpenMenu(false)}
          className="hidden md:block"
        />
        <div className="flex gap-2">
          <button
            type="button"
            className={`md:hidden z-50 p-2 border rounded-full ${isOpenMenu ? "fixed bottom-6 left-1/2 -translate-x-1/2 text-white w-[calc(100%-24px)]  cursor-pointer" : ""}`}
            onClick={() => setIsOpenMenu((pre) => !pre)}
            aria-label={isOpenMenu ? "Close menu" : "Open menu"}
          >
            {isOpenMenu ? "X" : "Menu"}
          </button>

          <Navigation
            aria-hidden={!isOpenMenu}
            
            className={`fixed inset-0 z-40 h-screen w-screen flex items-center justify-center bg-gray-600 p-4 shadow-2xl transition-transform duration-500 ${isOpenMenu ? "translate-x-0" : "translate-x-full pointer-events-none"} `}
            onItemClick={() => setIsOpenMenu(false)}
          />

          <a
            className="btn-primary"
            download
            href="/TongThoiDuyHung_Fullstack_CV.pdf"
          >
            Download CV
          </a>
        </div>
      </div>
    </header>
  );
}
