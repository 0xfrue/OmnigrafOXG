export function TrustStrip() {
  const trustItems = [
    { icon: "🔒", text: "Fixed supply" },
    { icon: "📊", text: "Buy/sell caps" },
    { icon: "⏰", text: "LP lock design" },
    { icon: "⚖️", text: "Time-delayed governance" },
    { icon: "💎", text: "Claim-on-demand vesting" },
    { icon: "⚡", text: "Built on Base" },
  ];

  return (
    <div className="bg-dark-200/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {trustItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-xs text-gray-400">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
