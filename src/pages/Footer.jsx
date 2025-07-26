import { Link } from "react-router";

function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 px-4 py-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Code Likho</h2>
          <p className="text-xs">
            Build your coding skills one line at a time.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-white mb-2">Quick Links</h3>
          <ul className="space-y-1 text-xs">
            <li><Link to="/explorecourses" className="hover:text-white">Courses</Link></li>
            <li><Link to="/#problems" className="hover:text-white">Problems</Link></li>
            <li><Link to="/discuss" className="hover:text-white">Discuss</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-white mb-2">Community</h3>
          <ul className="space-y-1 text-xs">
            <li><a href="#" className="hover:text-white">Discord</a></li>
            <li><a href="#" className="hover:text-white">Github</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Code Likho. All rights reserved.<br />
        Made with 💙 by Sujit
      </div>
    </footer>
  );
}

export default Footer;
