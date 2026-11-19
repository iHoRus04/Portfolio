export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto w-full max-w-3xl px-4 py-20"
    >
      <div className="space-y-8 rounded-2xl border px-6 py-10 md:px-12">
        <div className="space-y-4">
          <p className="font-medium">GET IN TOUCH</p>

          <h2 id="contact-title" className="text-4xl font-bold md:text-5xl">
            Let&apos;s Work Together
          </h2>

          <p className="text-gray-600">
            Bạn có ý tưởng hoặc dự án muốn trao đổi? Hãy liên hệ với tôi qua
            email hoặc các mạng xã hội bên dưới.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-medium">Email</p>
            <a
              className="text-gray-600 hover:text-blue-600"
              href="mailto:your-email@gmail.com"
            >
              your-email@gmail.com
            </a>
          </div>

          <div>
            <p className="font-medium">Location</p>
            <p className="text-gray-600">Ho Chi Minh City, Vietnam</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Follow me</h3>

          <div className="flex flex-wrap gap-3">
            <a
              className="rounded-full border px-4 py-2 hover:bg-gray-100"
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>

            <a
              className="rounded-full border px-4 py-2 hover:bg-gray-100"
              href="https://linkedin.com/in/your-username"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>

            <a
              className="rounded-full border px-4 py-2 hover:bg-gray-100"
              href="https://instagram.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
