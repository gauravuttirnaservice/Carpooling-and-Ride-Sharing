import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t-4 border-primary mt-auto relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>

      <div className="px-6 md:px-12 lg:px-20 mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand Section */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 text-white group w-fit">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-white/10 backdrop-blur-md border border-white/20 text-primary transition-transform duration-300 group-hover:scale-110 shadow-lg">
                <span className="material-symbols-outlined !text-[28px]">
                  directions_car
                </span>
              </div>
              <span className="text-2xl font-black tracking-tight">RideShare <span className="text-primary-light">Connect</span></span>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Connecting commuters for a greener, cheaper, and friendlier
              future. Built with trust and community at heart.
            </p>
            <div className="flex gap-4 mt-2">
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-slate-300 hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-slate-300 hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-slate-300 hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    clipRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 4.635c.636-.247 1.363-.416 2.427-.465C8.901 4.135 9.256 4.116 12.315 4.116h.08c2.59 0 2.917.01 3.817.05.858.038 1.32.185 1.63.304.41.158.702.346 1.009.653.307.307.495.6.653 1.01.119.31.266.772.304 1.629.041.9.051 1.227.051 3.817 0 2.59-.01 2.917-.05 3.817-.038.858-.185 1.32-.304 1.63a2.91 2.91 0 01-.653 1.009 2.91 2.91 0 01-1.01.653c-.31.119-.772.266-1.629.304-.9.041-1.227.051-3.817.051-2.59 0-2.917-.01-3.817-.05-.858-.038-1.32-.185-1.63-.304a2.91 2.91 0 01-1.009-.653 2.91 2.91 0 01-.653-1.01c-.119-.31-.266-.772-.304-1.629-.041-.9-.051-1.227-.051-3.817 0-2.59.01-2.917.05-3.817.038-.858.185-1.32.304-1.63a2.91 2.91 0 01.653-1.009 2.91 2.91 0 011.01-.653c.31-.119.772-.266 1.629-.304.85-.038 1.18-.048 3.568-.048zm0 5.338a5.338 5.338 0 100 10.676 5.338 5.338 0 000-10.676zm0 8.525a3.187 3.187 0 110-6.375 3.187 3.187 0 010 6.375zm5.338-9.87a1.436 1.436 0 100 2.871 1.436 1.436 0 000-2.871z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-black text-xl tracking-wide uppercase text-sm">Company</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="#"
                  className="text-slate-400 font-medium hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-400 font-medium hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-400 font-medium hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-400 font-medium hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-black text-xl tracking-wide uppercase text-sm">Product</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="#"
                  className="text-slate-400 font-medium hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-400 font-medium hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Safety
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-400 font-medium hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-400 font-medium hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-black text-xl tracking-wide uppercase text-sm">Contact</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-slate-400 font-medium">
                <span className="material-symbols-outlined text-[20px] text-primary-light mt-0.5">mail</span>
                <span className="hover:text-white cursor-pointer transition-colors">support@rideshareconnect.com</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 font-medium">
                <span className="material-symbols-outlined text-[20px] text-primary-light mt-0.5">phone</span>
                <span className="hover:text-white cursor-pointer transition-colors">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 font-medium">
                <span className="material-symbols-outlined text-[20px] text-primary-light mt-0.5">location_on</span>
                <span>123 Green Way, Eco City, CA<br />90210, United States</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 font-medium text-sm">
            © 2026 RideShare Connect. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-slate-500 font-medium text-sm hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="text-slate-500 font-medium text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-slate-500 font-medium text-sm hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
