import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>
        Go to the home page
        <Link to="/dashboard" className="mx-3">
          <span>Homepage</span>
        </Link>
      </p>
    </div>
  );
}
