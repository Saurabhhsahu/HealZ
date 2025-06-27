export default function BenefitsSection() {
  const benefits = [
    { title: "More Energy", text: "Greet the day with increased energy and focus.", icon: "🔋" },
    { title: "Improved Wellness", text: "Feel your best, inside and out.", icon: "💛" },
    { title: "Better Sleep", text: "Enjoy more restful sleep and brighter mornings.", icon: "🌙" },
    { title: "Healthier Diet", text: "Cut the empty sugar from those extra drinks.", icon: "🍏" },
    { title: "Save Money", text: "Spend less on drinks while still enjoying yourself.", icon: "🐷" },
    { title: "Have More Fun", text: "Make the drinks you have more enjoyable.", icon: "🥂" },
  ];

  return (
    <section className="text-center py-12 px-6 bg-white min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900">Small changes, big impact</h2>
      <p className="text-gray-600 mt-2 max-w-6xl mx-auto">
        Sunnyside provides a simple but structured approach to help you drink more mindfully. You’ll feel the difference.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 max-w-4xl mx-auto">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4  rounded-xl ">
            <div className="text-4xl mb-3">{benefit.icon}</div>
            <h3 className="text-lg font-semibold text-green-900">{benefit.title}</h3>
            <p className="text-gray-600 mt-1">{benefit.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
