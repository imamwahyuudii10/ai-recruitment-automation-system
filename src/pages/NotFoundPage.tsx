import { Link } from "react-router-dom";
export function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-mono text-sm text-slate-400">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The requested workspace page does not exist.
        </p>
        <Link
          to="/admin"
          className="mt-5 inline-block text-sm font-semibold text-indigo-600"
        >
          Return to admin dashboard
        </Link>
      </div>
    </div>
  );
}
