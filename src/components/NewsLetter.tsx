// Newsletter.tsx
import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle, Bell, Gift, Percent, Leaf, Users } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    setTimeout(() => {
      setStatus("success");
      setMessage("Successfully subscribed! Check your inbox.");
      setEmail("");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    }, 1000);
  };

  const colors = [
    "bg-orange-50",
    "bg-green-50",
    "bg-orange-100",
    "bg-pink-50",
    "bg-yellow-50",
    "bg-blue-50",
    "bg-emerald-50",
    "bg-purple-50",
    "bg-red-50",
    "bg-amber-50",
  ];

  const offers = [
    {
      id: 1,
      title: "20% OFF",
      description: "on your first purchase",
      code: "WELCOME20",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=400&fit=crop",
      tag: "Limited Time",
      icon: Percent,
      color: colors[0],
      textColor: "text-orange-700",
    },
    {
      id: 2,
      title: "Free Sample",
      description: "with every order above ₹500",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
      tag: "Fresh Harvest",
      icon: Leaf,
      color: colors[1],
      textColor: "text-green-700",
    },
    {
      id: 3,
      title: "₹100 Credit",
      description: "for every friend you refer",
      code: "FARM100",
      image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=600&h=400&fit=crop",
      tag: "Refer & Earn",
      icon: Users,
      color: colors[3],
      textColor: "text-pink-700",
    },
  ];

  // Helper function to render icons
  const renderIcon = (IconComponent: any, className: string) => {
    return <IconComponent className={className} />;
  };

  return (
    <section className="pb-16 bg-white">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SECTION - 3 Offers */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column - Offer 1 and Offer 2 stacked */}
              <div className="flex flex-col gap-4">
                {/* Offer 1 */}
                <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group h-64">
                  <img
                    src={offers[0].image}
                    alt={offers[0].title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${offers[0].color} opacity-50`} />
                  <div className="relative z-10 p-5 text-gray-800 h-full flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full mb-2 w-fit shadow-sm">
                        {renderIcon(offers[0].icon, `w-3 h-3 ${offers[0].textColor}`)}
                        <span className={`text-xs font-medium ${offers[0].textColor}`}>{offers[0].tag}</span>
                      </div>
                      <h3 className={`text-2xl font-bold ${offers[0].textColor} mb-1`}>{offers[0].title}</h3>
                      <p className="text-gray-700 text-xs">{offers[0].description}</p>
                    </div>
                    {offers[0].code && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          Use code: <span className="font-mono font-bold text-gray-800">{offers[0].code}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Offer 2 */}
                <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group h-64">
                  <img
                    src={offers[1].image}
                    alt={offers[1].title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${offers[1].color} opacity-90`} />
                  <div className="relative z-10 p-5 text-gray-800 h-full flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full mb-2 w-fit shadow-sm">
                        {renderIcon(offers[1].icon, `w-3 h-3 ${offers[1].textColor}`)}
                        <span className={`text-xs font-medium ${offers[1].textColor}`}>{offers[1].tag}</span>
                      </div>
                      <h3 className={`text-2xl font-bold ${offers[1].textColor} mb-1`}>{offers[1].title}</h3>
                      <p className="text-gray-700 text-xs">{offers[1].description}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">Auto-applied at checkout</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Offer 3 Full Height */}
              <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group">
                <img
                  src={offers[2].image}
                  alt={offers[2].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 ${offers[2].color} opacity-90`} />
                <div className="relative z-10 p-5 text-gray-800 h-full min-h-[536px] flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full mb-2 w-fit shadow-sm">
                      {renderIcon(offers[2].icon, `w-3 h-3 ${offers[2].textColor}`)}
                      <span className={`text-xs font-medium ${offers[2].textColor}`}>{offers[2].tag}</span>
                    </div>
                    <h3 className={`text-3xl font-bold ${offers[2].textColor} mb-2`}>{offers[2].title}</h3>
                    <p className="text-gray-700 text-sm">{offers[2].description}</p>
                  </div>
                  {offers[2].code && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 inline-block shadow-sm">
                        <p className="text-xs text-gray-600">Your Code</p>
                        <p className="text-lg font-mono font-bold text-gray-800">{offers[2].code}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - Newsletter Form */}
          <div className="lg:w-1/2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 shadow-sm border border-green-100 flex items-center">
            <div className="w-full">
              <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full mb-4">
                <Bell className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-medium text-green-700">Never miss an update</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Get the freshest updates about new products, special offers, and farming tips delivered to your inbox.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Weekly updates</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Exclusive deals</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Unsubscribe anytime</span>
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition bg-white ${
                      status === "error" && message
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-200 focus:ring-green-200 focus:border-green-400"
                    }`}
                    disabled={status === "loading"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe Now
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
                {message && (
                  <div className={`text-xs flex items-center gap-1 justify-center ${status === "success" ? "text-green-600" : "text-red-500"}`}>
                    {status === "success" ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {message}
                  </div>
                )}
                <p className="text-xs text-gray-400 text-center">
                  No spam, only fresh content. Promise!
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;