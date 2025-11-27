import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket, Plus, Trash2, RotateCw, Play, PartyPopper } from "lucide-react";

// --- Constants ---
const DEFAULT_DESTINATIONS = [
  "Goa", "Jaipur", "Manali", "Mysuru", "Darjeeling", "Varanasi", "Udaipur", "Shimla", 
  "Kodaikanal", "Rishikesh", "Andaman", "Ladakh", "Ooty", "Coorg", "Agra", "Delhi", 
  "Chennai", "Kolkata", "Mumbai", "Amritsar"
];
const WHEEL_DIAMETER = 380; // The size of the wheel
const SPIN_DURATION = 5000; // 5 seconds for the spin animation
const COLORS = [
  "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6", "#FB923C", 
  "#22D3EE", "#E879F9", "#FCD34D", "#4ADE80", "#93C5FD", "#C084FC", "#FCA5A5", 
  "#FDBA74", "#2DD4BF", "#86EFAC", "#A5B4FC", "#F9A8D4", "#FDE68A"
];

// --- SVG Utility Functions ---
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return { x: centerX + (radius * Math.cos(angleInRadians)), y: centerY + (radius * Math.sin(angleInRadians)) };
};
const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${x} ${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

// --- Main Component ---
export default function SpinPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("default");
  const [customCities, setCustomCities] = useState([]);
  const [cityInput, setCityInput] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const destinations = activeTab === "default" ? DEFAULT_DESTINATIONS : customCities;
  const sliceAngle = destinations.length > 0 ? 360 / destinations.length : 360;

  const spinWheel = () => {
    if (isSpinning || destinations.length < 2) return;
    
    setIsSpinning(true);
    setResult(null);

    const chosenIndex = Math.floor(Math.random() * destinations.length);
    const randomOffset = Math.random() * (sliceAngle - 4) + 2;
    const finalAngle = chosenIndex * sliceAngle + randomOffset;
    const totalRotation = 8 * 360 + finalAngle;

    setRotation(prev => prev + totalRotation);

    setTimeout(() => {
      const currentRotation = (rotation + totalRotation) % 360;
      const invertedAngle = 360 - currentRotation;
      const landedIndex = Math.floor(invertedAngle / sliceAngle) % destinations.length;
      
      const landedCity = destinations[landedIndex];
      setResult(landedCity);
      setShowResultModal(true);
      setIsSpinning(false);
    }, SPIN_DURATION + 100);
  };

  const handleAddCity = () => {
    if (cityInput.trim() && !customCities.includes(cityInput.trim())) {
      setCustomCities(prev => [...prev, cityInput.trim()]);
      setCityInput("");
    }
  };

  const handleRemoveCity = (indexToRemove) => {
    setCustomCities(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleReset = () => {
    setRotation(0);
    setResult(null);
    setShowResultModal(false);
  };
  
  const handleCreateTrip = () => {
    setShowResultModal(false);
    navigate("/create-trip", { state: { destination: result } });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-indigo-900 flex flex-col items-center justify-center pt-8 pb-12 px-4 select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white/50 dark:bg-black/20 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white">Spin to Decide!</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Let fate choose your next adventure.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6 bg-gray-200 dark:bg-gray-800 p-1 rounded-full">
          <button onClick={() => setActiveTab("default")} className={`px-4 py-2 text-sm sm:text-base rounded-full font-bold transition ${activeTab === "default" ? "bg-blue-600 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
            Default Destinations
          </button>
          <button onClick={() => setActiveTab("custom")} className={`px-4 py-2 text-sm sm:text-base rounded-full font-bold transition ${activeTab === "custom" ? "bg-blue-600 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
            Create Your Own
          </button>
        </div>

        {/* Custom City Input & List */}
        {activeTab === "custom" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <div className="flex gap-2 max-w-md mx-auto">
              <input type="text" value={cityInput} onChange={e => setCityInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddCity()} placeholder="Enter a city name" className="flex-grow border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              <button onClick={handleAddCity} className="bg-green-500 text-white px-4 rounded-lg font-bold flex items-center gap-1"><Plus size={16}/> Add</button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-lg mx-auto">
              {customCities.map((city, index) => (
                <span key={index} className="bg-gray-200 dark:bg-gray-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                  {city}
                  <button onClick={() => handleRemoveCity(index)} className="text-gray-500 hover:text-red-500"><Trash2 size={12}/></button>
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Wheel Assembly */}
        <div className="relative w-full flex justify-center items-center my-6" style={{ height: WHEEL_DIAMETER }}>
          {/* Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20" style={{ filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.3))' }}>
            <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[30px] border-t-red-600" />
            <div className="absolute top-[28px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-red-600" />
          </div>

          {/* Wheel Stand (Static) */}
          <div className="absolute w-full h-full rounded-full bg-white dark:bg-gray-800 shadow-inner" style={{ width: WHEEL_DIAMETER, height: WHEEL_DIAMETER }} />
          <div className="absolute w-full h-full rounded-full border-8 border-white/50 dark:border-gray-700/50" style={{ width: WHEEL_DIAMETER + 20, height: WHEEL_DIAMETER + 20 }}/>

          {/* SVG Wheel (Spinning) */}
          <div className="absolute">
            <svg viewBox={`0 0 ${WHEEL_DIAMETER} ${WHEEL_DIAMETER}`} width={WHEEL_DIAMETER} height={WHEEL_DIAMETER} style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? `transform ${SPIN_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)` : 'none',
            }}>
              {destinations.map((label, i) => {
                const startAngle = i * sliceAngle;
                const endAngle = startAngle + sliceAngle;
                const pathData = describeArc(WHEEL_DIAMETER / 2, WHEEL_DIAMETER / 2, WHEEL_DIAMETER / 2 - 2, startAngle, endAngle);
                
                // --- Text Rotation Logic ---
                const midAngle = startAngle + sliceAngle / 2;
                const textPos = polarToCartesian(WHEEL_DIAMETER / 2, WHEEL_DIAMETER / 2, WHEEL_DIAMETER * 0.35, midAngle);
                const textRotation = midAngle + 90;
                const flip = (midAngle > 90 && midAngle < 270) ? 180 : 0;
                const truncatedLabel = label.length > 10 ? label.substring(0, 9) + '…' : label;
                
                return (
                  <g key={i}>
                    <path d={pathData} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth="1" />
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${textRotation + flip}, ${textPos.x}, ${textPos.y})`}
                      className="text-sm font-bold fill-slate-800"
                    >
                      {truncatedLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Spin Button */}
          <button onClick={spinWheel} disabled={isSpinning || destinations.length < 2} className="absolute w-24 h-24 bg-white dark:bg-gray-700 rounded-full z-10 flex flex-col items-center justify-center shadow-lg border-4 border-blue-500 hover:scale-105 transition-transform disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-70">
            <Play size={32} className="text-blue-500"/>
            <span className="font-extrabold text-lg text-blue-500">SPIN</span>
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={spinWheel} disabled={isSpinning || destinations.length < 2} className="px-6 py-3 rounded-full font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
            <Ticket size={20}/> {isSpinning ? "Spinning..." : "Spin the Wheel"}
          </button>
          <button onClick={handleReset} disabled={isSpinning} className="px-6 py-3 rounded-full font-bold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:bg-gray-300 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
            <RotateCw size={18}/> Reset
          </button>
        </div>
      </motion.div>

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 max-w-sm w-full text-center shadow-2xl">
            <PartyPopper size={48} className="text-yellow-500"/>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">And the winner is...</h2>
            <p className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-bold text-3xl px-6 py-3 rounded-lg">{result}</p>
            <p className="text-gray-600 dark:text-gray-300">Ready to pack your bags? Create a trip now!</p>
            <div className="flex justify-center gap-4 mt-4 w-full">
              <button onClick={() => setShowResultModal(false)} className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-bold w-1/2">Maybe Later</button>
              <button onClick={handleCreateTrip} className="px-5 py-2 bg-green-600 text-white rounded-lg font-bold w-1/2">Create Trip</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// // import React, { useState } from "react";

// // const DESTINATIONS = [
// //   "Goa", "Jaipur", "Manali", "Mysuru", "Darjeeling",
// //   "Varanasi", "Udaipur", "Shimla", "Kodaikanal", "Rishikesh",
// //   "Andaman", "Ladakh", "Ooty", "Coorg", "Agra",
// //   "Delhi", "Chennai", "Kolkata", "Mumbai", "Amritsar"
// // ];

// // const WIDTH = 350;
// // const RADIUS = WIDTH / 2;
// // const DURATION = 5000;

// // function polar(cx, cy, r, deg) {
// //   const rad = (deg - 90) * (Math.PI / 180);
// //   return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
// // }

// // function arcPath(cx, cy, r, startDeg, endDeg) {
// //   const start = polar(cx, cy, r, endDeg);
// //   const end = polar(cx, cy, r, startDeg);
// //   const largeArcFlag = endDeg - startDeg <= 180 ? "0" : "1";
// //   return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
// // }

// // export default function SpinWheel() {
// //   const [rotation, setRotation] = useState(0);
// //   const [spinning, setSpinning] = useState(false);
// //   const [result, setResult] = useState(null);

// //   const sliceAngle = 360 / DESTINATIONS.length;
// //   const colors = [
// //     "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA",
// //     "#F472B6", "#FB923C", "#22D3EE", "#E879F9", "#FCD34D",
// //     "#4ADE80", "#93C5FD", "#C084FC", "#FCA5A5", "#FDBA74",
// //     "#2DD4BF", "#86EFAC", "#A5B4FC", "#F9A8D4", "#FDE68A"
// //   ];

// //   const spin = () => {
// //     if (spinning) return; // ⛔ prevent spin during another spin
// //     setSpinning(true);
// //     setResult(null);

// //     // Choose a random destination
// //     const chosenIndex = Math.floor(Math.random() * DESTINATIONS.length);
// //     const randomOffset = Math.random() * (sliceAngle - 2);
// //     const finalAngle = chosenIndex * sliceAngle + sliceAngle / 2 + randomOffset;

// //     // Add full rotations for smooth spin
// //     const totalRotation = 6 * 360 + finalAngle;

// //     setRotation(prev => prev + totalRotation);

// //     // After spin completes
// //     setTimeout(() => {
// //       const final = (rotation + totalRotation) % 360;
// //       const landedIndex = Math.floor((360 - final) / sliceAngle) % DESTINATIONS.length;
// //       setResult(DESTINATIONS[landedIndex]);
// //       setSpinning(false);
// //       setRotation(final); // stop exactly at final position
// //     }, DURATION + 50);
// //   };

// //   return (
// //     <div className="flex flex-col items-center justify-center pt-8 select-none">
// //       <div style={{ position: "relative", width: WIDTH }}>
// //         {/* 🔻 Red Arrow on Top, Facing Downwards */}
// //         <div
// //           style={{
// //             position: "absolute",
// //             top: -40,
// //             left: "50%",
// //             transform: "translateX(-50%) rotate(0deg)",
// //             zIndex: 40,
// //           }}
// //         >
// //           <div
// //             style={{
// //               width: 0,
// //               height: 0,
// //               borderLeft: "22px solid transparent",
// //               borderRight: "22px solid transparent",
// //               borderTop: "36px solid #ef4444",
// //               filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))",
// //             }}
// //           />
// //         </div>

// //         {/* 🎡 Wheel */}
// //         <div
// //           style={{
// //             width: WIDTH,
// //             height: WIDTH,
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //           }}
// //         >
// //           <svg
// //             viewBox={`0 0 ${WIDTH} ${WIDTH}`}
// //             width={WIDTH}
// //             height={WIDTH}
// //             style={{
// //               transform: `rotate(${rotation}deg)`,
// //               transformOrigin: "50% 50%",
// //               transition: spinning
// //                 ? `transform ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
// //                 : "none",
// //               borderRadius: "50%",
// //               overflow: "visible",
// //             }}
// //           >
// //             {DESTINATIONS.map((label, i) => {
// //               const start = i * sliceAngle;
// //               const end = start + sliceAngle;
// //               const d = arcPath(RADIUS, RADIUS, RADIUS - 4, start, end);
// //               const mid = start + sliceAngle / 2;
// //               const textRadius = RADIUS * 0.65;
// //               const textPoint = polar(RADIUS, RADIUS, textRadius, mid);
// //               const rotateAngle = mid + 90;
// //               const flip = mid > 90 && mid < 270 ? 180 : 0;

// //               return (
// //                 <g key={i}>
// //                   <path
// //                     d={d}
// //                     fill={colors[i % colors.length]}
// //                     stroke="#ffffff"
// //                     strokeWidth="2"
// //                   />
// //                   <text
// //                     x={textPoint.x}
// //                     y={textPoint.y}
// //                     textAnchor="middle"
// //                     alignmentBaseline="middle"
// //                     transform={`rotate(${rotateAngle + flip}, ${textPoint.x}, ${textPoint.y})`}
// //                     style={{
// //                       fontSize: 16,
// //                       fontWeight: 700,
// //                       fill: "#0f172a",
// //                       pointerEvents: "none",
// //                     }}
// //                   >
// //                     {label}
// //                   </text>
// //                 </g>
// //               );
// //             })}

// //             {/* Center Button */}
// //             <circle
// //               cx={RADIUS}
// //               cy={RADIUS}
// //               r={RADIUS * 0.16}
// //               fill="#0ea5e9"
// //               stroke="#0369a1"
// //               strokeWidth="4"
// //             />
// //             <text
// //               x={RADIUS}
// //               y={RADIUS + 6}
// //               textAnchor="middle"
// //               alignmentBaseline="middle"
// //               style={{ fontSize: 20, fontWeight: 800, fill: "#fff" }}
// //             >
// //               SPIN
// //             </text>
// //           </svg>
// //         </div>
// //       </div>

// //       {/* Buttons */}
// //       <div style={{ marginTop: 24, display: "flex", gap: 16 }}>
// //         <button
// //           onClick={spin}
// //           disabled={spinning}
// //           style={{
// //             background: spinning ? "#9ca3af" : "#2563eb",
// //             color: "#fff",
// //             padding: "12px 24px",
// //             borderRadius: 999,
// //             fontWeight: 700,
// //             fontSize: 16,
// //             border: "none",
// //             boxShadow: "0 6px 18px rgba(2,6,23,0.15)",
// //             cursor: spinning ? "not-allowed" : "pointer",
// //           }}
// //         >
// //           {spinning ? "Spinning..." : "Spin Now 🎡"}
// //         </button>

// //         <button
// //           onClick={() => {
// //             setRotation(0);
// //             setResult(null);
// //           }}
// //           disabled={spinning}
// //           style={{
// //             background: "#e5e7eb",
// //             color: "#111827",
// //             padding: "12px 20px",
// //             borderRadius: 999,
// //             fontWeight: 600,
// //             border: "none",
// //             cursor: spinning ? "not-allowed" : "pointer",
// //           }}
// //         >
// //           Reset
// //         </button>
// //       </div>

// //       {/* Result */}
// //       {result && !spinning && (
// //         <div style={{ marginTop: 28, textAlign: "center" }}>
// //           <div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>
// //             🎉 The wheel stopped at: {result}!
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }







// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // const DEFAULT_DESTINATIONS = [
// //   "Goa", "Jaipur", "Manali", "Mysuru", "Darjeeling",
// //   "Varanasi", "Udaipur", "Shimla", "Kodaikanal", "Rishikesh",
// //   "Andaman", "Ladakh", "Ooty", "Coorg", "Agra",
// //   "Delhi", "Chennai", "Kolkata", "Mumbai", "Amritsar"
// // ];

// // const WIDTH = 350;
// // const RADIUS = WIDTH / 2;
// // const DURATION = 5000;

// // // Utility functions
// // function polar(cx, cy, r, deg) {
// //   const rad = (deg - 90) * (Math.PI / 180);
// //   return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
// // }

// // function arcPath(cx, cy, r, startDeg, endDeg) {
// //   const start = polar(cx, cy, r, endDeg);
// //   const end = polar(cx, cy, r, startDeg);
// //   const largeArcFlag = endDeg - startDeg <= 180 ? "0" : "1";
// //   return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
// // }

// // export default function SpinPage() {
// //   const navigate = useNavigate();

// //   const [activeTab, setActiveTab] = useState("default"); // default or custom
// //   const [customCities, setCustomCities] = useState([]);
// //   const [cityInput, setCityInput] = useState("");
// //   const [rotation, setRotation] = useState(0);
// //   const [spinning, setSpinning] = useState(false);
// //   const [result, setResult] = useState(null);

// //   const destinations = activeTab === "default" ? DEFAULT_DESTINATIONS : customCities;
// //   const sliceAngle = 360 / destinations.length;
// //   const colors = [
// //     "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA",
// //     "#F472B6", "#FB923C", "#22D3EE", "#E879F9", "#FCD34D",
// //     "#4ADE80", "#93C5FD", "#C084FC", "#FCA5A5", "#FDBA74",
// //     "#2DD4BF", "#86EFAC", "#A5B4FC", "#F9A8D4", "#FDE68A"
// //   ];

// //   const spin = () => {
// //     if (spinning || destinations.length === 0) return;
// //     setSpinning(true);
// //     setResult(null);

// //     const chosenIndex = Math.floor(Math.random() * destinations.length);
// //     const randomOffset = Math.random() * (sliceAngle - 2);
// //     const finalAngle = chosenIndex * sliceAngle + sliceAngle / 2 + randomOffset;
// //     const totalRotation = 6 * 360 + finalAngle;

// //     setRotation(prev => prev + totalRotation);

// //     setTimeout(() => {
// //       const final = (rotation + totalRotation) % 360;
// //       const landedIndex = Math.floor((360 - final) / sliceAngle) % destinations.length;
// //       setResult(destinations[landedIndex]);
// //       setSpinning(false);
// //       setRotation(final);
// //     }, DURATION + 50);
// //   };

// //   const handleAddCity = () => {
// //     if (cityInput.trim() !== "") {
// //       setCustomCities(prev => [...prev, cityInput.trim()]);
// //       setCityInput("");
// //     }
// //   };

// //   const handleCreateTrip = () => {
// //     if (!result) return alert("Please spin the wheel first!");
// //     // Redirect or API call for creating trip
// //     alert(`Trip created to: ${result}`);
// //     // Example: navigate(`/create-trip?city=${result}`);
// //   };

// //   return (
// //     <div className="flex flex-col items-center justify-center pt-8 select-none">
// //       {/* Tabs */}
// //       <div className="flex gap-4 mb-6">
// //         <button
// //           onClick={() => setActiveTab("default")}
// //           className={`px-4 py-2 rounded-full font-bold ${activeTab === "default" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
// //         >
// //           Default Wheel
// //         </button>
// //         <button
// //           onClick={() => setActiveTab("custom")}
// //           className={`px-4 py-2 rounded-full font-bold ${activeTab === "custom" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
// //         >
// //           Custom Wheel
// //         </button>
// //       </div>

// //       {/* Custom city input */}
// //       {activeTab === "custom" && (
// //         <div className="mb-4 flex gap-2">
// //           <input
// //             type="text"
// //             value={cityInput}
// //             onChange={e => setCityInput(e.target.value)}
// //             placeholder="Enter city"
// //             className="border p-2 rounded"
// //           />
// //           <button
// //             onClick={handleAddCity}
// //             className="bg-green-500 text-white px-4 rounded font-bold"
// //           >
// //             Add
// //           </button>
// //         </div>
// //       )}

// //       {/* Wheel */}
// //       <div style={{ position: "relative", width: WIDTH }}>
// //         {/* Arrow */}
// //         <div
// //           style={{
// //             position: "absolute",
// //             top: -40,
// //             left: "50%",
// //             transform: "translateX(-50%) rotate(0deg)",
// //             zIndex: 40,
// //           }}
// //         >
// //           <div
// //             style={{
// //               width: 0,
// //               height: 0,
// //               borderLeft: "22px solid transparent",
// //               borderRight: "22px solid transparent",
// //               borderTop: "36px solid #ef4444",
// //             }}
// //           />
// //         </div>

// //         {/* SVG Wheel */}
// //         <div style={{ width: WIDTH, height: WIDTH, display: "flex", justifyContent: "center", alignItems: "center" }}>
// //           <svg
// //             viewBox={`0 0 ${WIDTH} ${WIDTH}`}
// //             width={WIDTH}
// //             height={WIDTH}
// //             style={{
// //               transform: `rotate(${rotation}deg)`,
// //               transformOrigin: "50% 50%",
// //               transition: spinning ? `transform ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
// //               borderRadius: "50%",
// //               overflow: "visible",
// //             }}
// //           >
// //             {destinations.map((label, i) => {
// //               const start = i * sliceAngle;
// //               const end = start + sliceAngle;
// //               const d = arcPath(RADIUS, RADIUS, RADIUS - 4, start, end);
// //               const mid = start + sliceAngle / 2;
// //               const textRadius = RADIUS * 0.65;
// //               const textPoint = polar(RADIUS, RADIUS, textRadius, mid);
// //               const rotateAngle = mid + 90;
// //               const flip = mid > 90 && mid < 270 ? 180 : 0;

// //               return (
// //                 <g key={i}>
// //                   <path d={d} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="2" />
// //                   <text
// //                     x={textPoint.x}
// //                     y={textPoint.y}
// //                     textAnchor="middle"
// //                     alignmentBaseline="middle"
// //                     transform={`rotate(${rotateAngle + flip}, ${textPoint.x}, ${textPoint.y})`}
// //                     style={{ fontSize: 16, fontWeight: 700, fill: "#0f172a" }}
// //                   >
// //                     {label}
// //                   </text>
// //                 </g>
// //               );
// //             })}

// //             {/* Center Button */}
// //             <circle cx={RADIUS} cy={RADIUS} r={RADIUS * 0.16} fill="#0ea5e9" stroke="#0369a1" strokeWidth="4" />
// //             <text x={RADIUS} y={RADIUS + 6} textAnchor="middle" alignmentBaseline="middle" style={{ fontSize: 20, fontWeight: 800, fill: "#fff" }}>
// //               SPIN
// //             </text>
// //           </svg>
// //         </div>
// //       </div>

// //       {/* Buttons */}
// //       <div className="mt-6 flex gap-4">
// //         <button
// //           onClick={spin}
// //           disabled={spinning}
// //           className={`px-6 py-2 rounded-full font-bold ${spinning ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"}`}
// //         >
// //           {spinning ? "Spinning..." : "Spin Now 🎡"}
// //         </button>
// //         <button
// //           onClick={() => { setRotation(0); setResult(null); }}
// //           disabled={spinning}
// //           className="px-6 py-2 rounded-full font-bold bg-gray-200 text-gray-800"
// //         >
// //           Reset
// //         </button>
// //         <button
// //           onClick={handleCreateTrip}
// //           className="px-6 py-2 rounded-full font-bold bg-green-600 text-white"
// //         >
// //           Create Trip
// //         </button>
// //       </div>

// //       {/* Result */}
// //       {result && !spinning && (
// //         <div className="mt-6 text-center text-green-600 font-bold text-xl">
// //           🎉 The wheel stopped at: {result}!
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const DEFAULT_DESTINATIONS = [
//   "Goa", "Jaipur", "Manali", "Mysuru", "Darjeeling",
//   "Varanasi", "Udaipur", "Shimla", "Kodaikanal", "Rishikesh",
//   "Andaman", "Ladakh", "Ooty", "Coorg", "Agra",
//   "Delhi", "Chennai", "Kolkata", "Mumbai", "Amritsar"
// ];

// const WIDTH = 350;
// const RADIUS = WIDTH / 2;
// const DURATION = 5000;

// // Utility functions
// function polar(cx, cy, r, deg) {
//   const rad = (deg - 90) * (Math.PI / 180);
//   return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
// }

// function arcPath(cx, cy, r, startDeg, endDeg) {
//   const start = polar(cx, cy, r, endDeg);
//   const end = polar(cx, cy, r, startDeg);
//   const largeArcFlag = endDeg - startDeg <= 180 ? "0" : "1";
//   return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
// }

// export default function SpinPage() {
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("default");
//   const [customCities, setCustomCities] = useState([]);
//   const [cityInput, setCityInput] = useState("");
//   const [rotation, setRotation] = useState(0);
//   const [spinning, setSpinning] = useState(false);
//   const [result, setResult] = useState(null);
//   const [showModal, setShowModal] = useState(false); // modal for create trip

//   const destinations = activeTab === "default" ? DEFAULT_DESTINATIONS : customCities;
//   const sliceAngle = 360 / destinations.length;
//   const colors = [
//     "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA",
//     "#F472B6", "#FB923C", "#22D3EE", "#E879F9", "#FCD34D",
//     "#4ADE80", "#93C5FD", "#C084FC", "#FCA5A5", "#FDBA74",
//     "#2DD4BF", "#86EFAC", "#A5B4FC", "#F9A8D4", "#FDE68A"
//   ];

//   const spin = () => {
//     if (spinning || destinations.length === 0) return;
//     setSpinning(true);
//     setResult(null);

//     const chosenIndex = Math.floor(Math.random() * destinations.length);
//     const randomOffset = Math.random() * (sliceAngle - 2);
//     const finalAngle = chosenIndex * sliceAngle + sliceAngle / 2 + randomOffset;
//     const totalRotation = 6 * 360 + finalAngle;

//     setRotation(prev => prev + totalRotation);

//     setTimeout(() => {
//       const final = (rotation + totalRotation) % 360;
//       const landedIndex = Math.floor((360 - final) / sliceAngle) % destinations.length;
//       const landedCity = destinations[landedIndex];
//       setResult(landedCity);
//       setShowModal(true); // show modal for creating trip
//       setSpinning(false);
//       setRotation(final);
//     }, DURATION + 50);
//   };

//   const handleAddCity = () => {
//     if (cityInput.trim() !== "") {
//       setCustomCities(prev => [...prev, cityInput.trim()]);
//       setCityInput("");
//     }
//   };

//   const handleCreateTrip = () => {
//     setShowModal(false);
//    // navigate(`/create-trip?city=${encodeURIComponent(result)}`);
//     navigate(`/create-trip?destination=${encodeURIComponent(result)}`);

//   };

//   return (
//     <div className="flex flex-col items-center justify-center pt-8 select-none">
//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setActiveTab("default")}
//           className={`px-4 py-2 rounded-full font-bold ${activeTab === "default" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
//         >
//           Default Wheel
//         </button>
//         <button
//           onClick={() => setActiveTab("custom")}
//           className={`px-4 py-2 rounded-full font-bold ${activeTab === "custom" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
//         >
//           Custom Wheel
//         </button>
//       </div>

//       {/* Custom city input */}
//       {activeTab === "custom" && (
//         <div className="mb-4 flex gap-2">
//           <input
//             type="text"
//             value={cityInput}
//             onChange={e => setCityInput(e.target.value)}
//             placeholder="Enter city"
//             className="border p-2 rounded"
//           />
//           <button
//             onClick={handleAddCity}
//             className="bg-green-500 text-white px-4 rounded font-bold"
//           >
//             Add
//           </button>
//         </div>
//       )}

//       {/* Wheel */}
//       <div style={{ position: "relative", width: WIDTH }}>
//         {/* Arrow */}
//         <div
//           style={{
//             position: "absolute",
//             top: -40,
//             left: "50%",
//             transform: "translateX(-50%) rotate(0deg)",
//             zIndex: 40,
//           }}
//         >
//           <div
//             style={{
//               width: 0,
//               height: 0,
//               borderLeft: "22px solid transparent",
//               borderRight: "22px solid transparent",
//               borderTop: "36px solid #ef4444",
//             }}
//           />
//         </div>

//         {/* SVG Wheel */}
//         <div style={{ width: WIDTH, height: WIDTH, display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <svg
//             viewBox={`0 0 ${WIDTH} ${WIDTH}`}
//             width={WIDTH}
//             height={WIDTH}
//             style={{
//               transform: `rotate(${rotation}deg)`,
//               transformOrigin: "50% 50%",
//               transition: spinning ? `transform ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
//               borderRadius: "50%",
//               overflow: "visible",
//             }}
//           >
//             {destinations.map((label, i) => {
//               const start = i * sliceAngle;
//               const end = start + sliceAngle;
//               const d = arcPath(RADIUS, RADIUS, RADIUS - 4, start, end);
//               const mid = start + sliceAngle / 2;
//               const textRadius = RADIUS * 0.65;
//               const textPoint = polar(RADIUS, RADIUS, textRadius, mid);
//               const rotateAngle = mid + 90;
//               const flip = mid > 90 && mid < 270 ? 180 : 0;

//               return (
//                 <g key={i}>
//                   <path d={d} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="2" />
//                   <text
//                     x={textPoint.x}
//                     y={textPoint.y}
//                     textAnchor="middle"
//                     alignmentBaseline="middle"
//                     transform={`rotate(${rotateAngle + flip}, ${textPoint.x}, ${textPoint.y})`}
//                     style={{ fontSize: 16, fontWeight: 700, fill: "#0f172a" }}
//                   >
//                     {label}
//                   </text>
//                 </g>
//               );
//             })}

//             {/* Center Button */}
//             <circle cx={RADIUS} cy={RADIUS} r={RADIUS * 0.16} fill="#0ea5e9" stroke="#0369a1" strokeWidth="4" />
//             <text x={RADIUS} y={RADIUS + 6} textAnchor="middle" alignmentBaseline="middle" style={{ fontSize: 20, fontWeight: 800, fill: "#fff" }}>
//               SPIN
//             </text>
//           </svg>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="mt-6 flex gap-4">
//         <button
//           onClick={spin}
//           disabled={spinning}
//           className={`px-6 py-2 rounded-full font-bold ${spinning ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"}`}
//         >
//           {spinning ? "Spinning..." : "Spin Now 🎡"}
//         </button>
//         <button
//           onClick={() => { setRotation(0); setResult(null); }}
//           disabled={spinning}
//           className="px-6 py-2 rounded-full font-bold bg-gray-200 text-gray-800"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Modal for Create Trip */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white rounded-lg p-6 flex flex-col gap-4 max-w-sm w-full text-center">
//             <h2 className="text-xl font-bold">🎉 Wheel Stopped!</h2>
//             <p className="text-green-600 font-semibold text-lg">Destination: {result}</p>
//             <p>Do you want to create a trip to this city?</p>
//             <div className="flex justify-center gap-4 mt-4">
//               <button
//                 onClick={handleCreateTrip}
//                 className="px-4 py-2 bg-green-600 text-white rounded font-bold"
//               >
//                 Continue
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-bold"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const DEFAULT_DESTINATIONS = [
//   "Goa", "Jaipur", "Manali", "Mysuru", "Darjeeling",
//   "Varanasi", "Udaipur", "Shimla", "Kodaikanal", "Rishikesh",
//   "Andaman", "Ladakh", "Ooty", "Coorg", "Agra",
//   "Delhi", "Chennai", "Kolkata", "Mumbai", "Amritsar"
// ];

// const WIDTH = 350;
// const RADIUS = WIDTH / 2;
// const DURATION = 5000;

// // Utility functions
// function polar(cx, cy, r, deg) {
//   const rad = (deg - 90) * (Math.PI / 180);
//   return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
// }

// function arcPath(cx, cy, r, startDeg, endDeg) {
//   const start = polar(cx, cy, r, endDeg);
//   const end = polar(cx, cy, r, startDeg);
//   const largeArcFlag = endDeg - startDeg <= 180 ? "0" : "1";
//   return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
// }

// export default function SpinPage() {
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("default");
//   const [customCities, setCustomCities] = useState([]);
//   const [cityInput, setCityInput] = useState("");
//   const [rotation, setRotation] = useState(0);
//   const [spinning, setSpinning] = useState(false);
//   const [result, setResult] = useState(null);
//   const [showModal, setShowModal] = useState(false); // modal for create trip

//   const destinations = activeTab === "default" ? DEFAULT_DESTINATIONS : customCities;
//   const sliceAngle = 360 / destinations.length;
//   const colors = [
//     "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA",
//     "#F472B6", "#FB923C", "#22D3EE", "#E879F9", "#FCD34D",
//     "#4ADE80", "#93C5FD", "#C084FC", "#FCA5A5", "#FDBA74",
//     "#2DD4BF", "#86EFAC", "#A5B4FC", "#F9A8D4", "#FDE68A"
//   ];

//   const spin = () => {
//     if (spinning || destinations.length === 0) return;
//     setSpinning(true);
//     setResult(null);

//     const chosenIndex = Math.floor(Math.random() * destinations.length);
//     const randomOffset = Math.random() * (sliceAngle - 2);
//     const finalAngle = chosenIndex * sliceAngle + sliceAngle / 2 + randomOffset;
//     const totalRotation = 6 * 360 + finalAngle;

//     setRotation(prev => prev + totalRotation);

//     setTimeout(() => {
//       const final = (rotation + totalRotation) % 360;
//       const landedIndex = Math.floor((360 - final) / sliceAngle) % destinations.length;
//       const landedCity = destinations[landedIndex];
//       setResult(landedCity);
//       setShowModal(true); // show modal for creating trip
//       setSpinning(false);
//       setRotation(final);
//     }, DURATION + 50);
//   };

//   const handleAddCity = () => {
//     if (cityInput.trim() !== "") {
//       setCustomCities(prev => [...prev, cityInput.trim()]);
//       setCityInput("");
//     }
//   };

//   const handleCreateTrip = () => {
//     setShowModal(false);
//     // Pass destination via state
//     navigate("/create-trip", { state: { destination: result } });
//   };

//   return (
//     <div className="flex flex-col items-center justify-center pt-8 select-none">
//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setActiveTab("default")}
//           className={`px-4 py-2 rounded-full font-bold ${activeTab === "default" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
//         >
//           Default Wheel
//         </button>
//         <button
//           onClick={() => setActiveTab("custom")}
//           className={`px-4 py-2 rounded-full font-bold ${activeTab === "custom" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
//         >
//           Custom Wheel
//         </button>
//       </div>

//       {/* Custom city input */}
//       {activeTab === "custom" && (
//         <div className="mb-4 flex gap-2">
//           <input
//             type="text"
//             value={cityInput}
//             onChange={e => setCityInput(e.target.value)}
//             placeholder="Enter city"
//             className="border p-2 rounded"
//           />
//           <button
//             onClick={handleAddCity}
//             className="bg-green-500 text-white px-4 rounded font-bold"
//           >
//             Add
//           </button>
//         </div>
//       )}

//       {/* Wheel */}
//       <div style={{ position: "relative", width: WIDTH }}>
//         {/* Arrow */}
//         <div
//           style={{
//             position: "absolute",
//             top: -40,
//             left: "50%",
//             transform: "translateX(-50%) rotate(0deg)",
//             zIndex: 40,
//           }}
//         >
//           <div
//             style={{
//               width: 0,
//               height: 0,
//               borderLeft: "22px solid transparent",
//               borderRight: "22px solid transparent",
//               borderTop: "36px solid #ef4444",
//             }}
//           />
//         </div>

//         {/* SVG Wheel */}
//         <div style={{ width: WIDTH, height: WIDTH, display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <svg
//             viewBox={`0 0 ${WIDTH} ${WIDTH}`}
//             width={WIDTH}
//             height={WIDTH}
//             style={{
//               transform: `rotate(${rotation}deg)`,
//               transformOrigin: "50% 50%",
//               transition: spinning ? `transform ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
//               borderRadius: "50%",
//               overflow: "visible",
//             }}
//           >
//             {destinations.map((label, i) => {
//               const start = i * sliceAngle;
//               const end = start + sliceAngle;
//               const d = arcPath(RADIUS, RADIUS, RADIUS - 4, start, end);
//               const mid = start + sliceAngle / 2;
//               const textRadius = RADIUS * 0.65;
//               const textPoint = polar(RADIUS, RADIUS, textRadius, mid);
//               const rotateAngle = mid + 90;
//               const flip = mid > 90 && mid < 270 ? 180 : 0;

//               return (
//                 <g key={i}>
//                   <path d={d} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="2" />
//                   <text
//                     x={textPoint.x}
//                     y={textPoint.y}
//                     textAnchor="middle"
//                     alignmentBaseline="middle"
//                     transform={`rotate(${rotateAngle + flip}, ${textPoint.x}, ${textPoint.y})`}
//                     style={{ fontSize: 16, fontWeight: 700, fill: "#0f172a" }}
//                   >
//                     {label}
//                   </text>
//                 </g>
//               );
//             })}

//             {/* Center Button */}
//             <circle cx={RADIUS} cy={RADIUS} r={RADIUS * 0.16} fill="#0ea5e9" stroke="#0369a1" strokeWidth="4" />
//             <text x={RADIUS} y={RADIUS + 6} textAnchor="middle" alignmentBaseline="middle" style={{ fontSize: 20, fontWeight: 800, fill: "#fff" }}>
//               SPIN
//             </text>
//           </svg>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="mt-6 flex gap-4">
//         <button
//           onClick={spin}
//           disabled={spinning}
//           className={`px-6 py-2 rounded-full font-bold ${spinning ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"}`}
//         >
//           {spinning ? "Spinning..." : "Spin Now 🎡"}
//         </button>
//        <button
//   onClick={() => { setRotation(0); setResult(null); }}
//   disabled={spinning}
//   className={`px-6 py-2 rounded-full font-bold ${spinning ? "bg-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-800"}`}
// >
//   Reset
// </button>

//       </div>

//       {/* Modal for Create Trip */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white rounded-lg p-6 flex flex-col gap-4 max-w-sm w-full text-center">
//             <h2 className="text-xl font-bold">🎉 Wheel Stopped!</h2>
//             <p className="text-green-600 font-semibold text-lg">Destination: {result}</p>
//             <p>Do you want to create a trip to this city?</p>
//             <div className="flex justify-center gap-4 mt-4">
//               <button
//                 onClick={handleCreateTrip}
//                 className="px-4 py-2 bg-green-600 text-white rounded font-bold"
//               >
//                 Continue
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-bold"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
