export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container py-8 text-center text-sm text-gray-600">
        <div>© {new Date().getFullYear()} Site</div>
      </div>
    </footer>
  )
}
