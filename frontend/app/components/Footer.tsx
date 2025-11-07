export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container py-8 text-center text-gray-600 text-sm">
        <div>© {new Date().getFullYear()} Site</div>
      </div>
    </footer>
  );
}
