export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="muted container py-8 text-center text-sm">
        <div>© {new Date().getFullYear()} Site</div>
      </div>
    </footer>
  );
}
