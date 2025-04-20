import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body items-center text-center">
          <h2 className="text-4xl font-bold text-error">404</h2>
          <p className="text-lg mt-2">Page not found</p>
          <p className="text-sm text-base-content/70">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="form-control mt-6 w-full">
            <Link to="/" className="btn btn-primary w-full">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
