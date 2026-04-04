import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-900 m-4 lg:m-12 rounded-[3xl] lg:rounded-[4rem]">
      {/* Background Gradients & Patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-slate-900 to-slate-900 z-0 opacity-80"></div>
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-emerald-500/10 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-primary/20 blur-[120px] rounded-full -translate-x-1/3 -translate-y-1/3 z-0 pointer-events-none"></div>

      <div className="relative z-10 px-6 md:px-20 mx-auto max-w-5xl text-center">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tighter drop-shadow-xl leading-[1.1]">
          Ready to hit the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-primary to-green-500">open road?</span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Join thousands of commuters saving money and making new connections
          every single day.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/find-ride"
            className="group relative w-full sm:w-auto h-[72px] flex items-center justify-center rounded-full bg-white text-slate-900 font-black text-xl px-12 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <span className="relative flex items-center gap-3">
              Find a Ride Now
              <span className="material-symbols-outlined !text-[28px] group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
            </span>
          </Link>


        </div>
      </div>
    </section>
  );
};

export default CTASection;
