const HowItWorksSection = () => {
  const steps = [
    {
      icon: 'search',
      stepNumber: 1,
      title: 'Find a Ride',
      description:
        'Enter your destination and date to see available rides going your way.',
    },
    {
      icon: 'event_seat',
      stepNumber: 2,
      title: 'Book Your Seat',
      description:
        'Check driver profiles and ratings, then book your seat instantly online.',
    },
    {
      icon: 'directions_car',
      stepNumber: 3,
      title: 'Travel Together',
      description:
        'Meet at the designated spot and enjoy a comfortable, cost-effective ride.',
    },
  ];

  return (
    <section
      className="py-24 bg-slate-50 relative overflow-hidden isolate"
      id="how-it-works"
    >
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="px-4 md:px-12 lg:px-20 mx-auto max-w-7xl">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            Start your shared journey in three simple steps. It's never been easier to connect with fellow travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 relative lg:mt-12">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-1.5 bg-slate-100 rounded-full z-0">
            <div className="w-full h-full bg-gradient-to-r from-primary-light via-primary to-green-500 rounded-full opacity-30"></div>
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center gap-6 z-10 group"
            >
              {/* Giant background number overlay */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[12rem] font-black text-slate-900 opacity-[0.02] pointer-events-none -z-10 transition-transform duration-500 group-hover:scale-110">
                {step.stepNumber}
              </div>

              <div className="w-[120px] h-[120px] rounded-[2rem] bg-white border-4 border-slate-50 flex items-center justify-center shadow-xl shadow-slate-200/50 group-hover:-translate-y-2 group-hover:shadow-primary/20 group-hover:border-primary/10 transition-all duration-500 relative">
                <span className="material-symbols-outlined !text-[48px] text-primary transition-transform duration-500 group-hover:scale-110">
                  {step.icon}
                </span>

                {/* Step indicator pill */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                  Step {step.stepNumber}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
