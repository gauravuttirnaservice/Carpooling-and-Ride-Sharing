const BenefitsSection = () => {
  const benefits = [
    {
      icon: 'savings',
      title: 'Save Money',
      description:
        'Cut your travel costs significantly by splitting gas, maintenance, and tolls with passengers.',
    },
    {
      icon: 'eco',
      title: 'Eco-Friendly',
      description:
        'Reduce your carbon footprint. Every shared ride takes a car off the road and helps the planet.',
    },
    {
      icon: 'groups',
      title: 'Meet People',
      description:
        'Turn boring commutes into networking opportunities. Make new friends while you travel.',
    },
    {
      icon: 'verified_user',
      title: 'Safe & Verified',
      description:
        'Safety first. We verify government IDs and provide ratings so you know exactly who you\'re riding with.',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-slate-50 to-white z-0"></div>

      <div className="px-4 md:px-12 lg:px-20 mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col gap-12 lg:gap-16">
          <div className="flex flex-col gap-4 text-center md:text-left max-w-3xl">
            <h2 className="text-slate-900 text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Why Choose RideShare <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Connect?</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              Discover the smart, sustainable way to travel. Join thousands of commuters who are already saving money and the environment.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group flex flex-col gap-6 rounded-[2.5rem] border-[3px] border-slate-50 bg-white p-8 transition-all duration-500 hover:border-primary/20 hover:bg-slate-50/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-150 group-hover:bg-primary/10"></div>

                <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-slate-50 border-2 border-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-sm relative z-10 group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:rotate-3 group-hover:scale-110">
                  <span className="material-symbols-outlined !text-[32px]">
                    {benefit.icon}
                  </span>
                </div>
                <div className="flex flex-col gap-3 relative z-10">
                  <h3 className="text-slate-900 text-2xl font-black tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
