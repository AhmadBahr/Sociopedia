export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Sociopedia</span>
        <span>Built with MERN + Tailwind</span>
      </div>
    </footer>
  );
}

