// import React, { useState, useRef } from "react";

// const destinations = [
//   "Goa", "Jaipur", "Manali", "Mysuru", "Darjeeling", "Varanasi", "Udaipur", "Shimla",
//   "Kodaikanal", "Rishikesh", "Andaman", "Ladakh", "Ooty", "Coorg", "Agra", "Delhi",
//   "Chennai", "Kolkata", "Mumbai", "Amritsar"
// ];

// const WIDTH = 420;
// const RADIUS = WIDTH / 2;
// const DURATION = 5000;

// function polar(cx, cy, r, deg) {
//   const rad = (deg - 90) * Math.PI / 180;
//   return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
// }

// function arcPath(cx, cy, r, start, end) {
//   const startP = polar(cx, cy, r, end);
//   const endP = polar(cx, cy, r, start);
//   const large = end - start <= 180 ? "0" : "1";
//   return `M ${cx} ${cy} L ${startP.x} ${startP.y} A ${r} ${r} 0 ${large} 0 ${endP.x} ${endP.y} Z`;
// }

// export default function SpinWheel() {
//   const [spinning, setSpinning] = useState(false);
//   const [result, setResult] = useState(null);
//   const [rotation, setRotation] = useState(0);
//   const sliceAngle = 360 / destinations.length;

//   const brightColors = [
//     "#F87171","#FBBF24","#34D399","#60A5FA","#A78BFA","#F472B6","#FB923C",
//     "#22D3EE","#E879F9","#FCD34D","#4ADE80","#93C5FD","#C084FC","#FCA5A5",
//     "#FDBA74","#2DD4BF","#86EFAC","#A5B4FC","#F9A8D4","#FDE68A"
//   ];

//   const spin = () => {
//     if (spinning) return;
//     setSpinning(true);
//     setResult(null);

//     const chosen = Math.floor(Math.random() * destinations.length);
//     const chosenMid = chosen * sliceAngle + sliceAngle / 2;
//     const spins = 7;
//     const finalRot = spins * 360 + (360 - chosenMid) + Math.random() * (sliceAngle - 2);

//     setRotation(r => r + finalRot);

//     setTimeout(() => {
//       setSpinning(false);
//       setResult(destinations[chosen]);
//       setRotation(prev => prev % 360);
//     }, DURATION + 100);
//   };

//   return (
//     <div className="flex flex-col items-center mt-10 select-none">
//       <div className="relative">
//         {/* Pointer */}
//         <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
//           <div style={{
//             width: 0, height: 0,
//             borderLeft: "18px solid transparent",
//             borderRight: "18px solid transparent",
//             borderBottom: "32px solid #ef4444"
//           }} />
//         </div>

//         {/* Wheel */}
//         <svg
//           viewBox={`0 0 ${WIDTH} ${WIDTH}`}
//           width={WIDTH}
//           height={WIDTH}
//           className="shadow-2xl rounded-full"
//           style={{
//             transform: `rotate(${rotation}deg)`,
//             transition: spinning ? `transform ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)` : "transform 500ms ease-out"
//           }}
//         >
//           {destinations.map((name, i) => {
//             const start = i * sliceAngle;
//             const end = start + sliceAngle;
//             const d = arcPath(RADIUS, RADIUS, RADIUS - 4, start, end);
//             const mid = start + sliceAngle / 2;
//             const pos = polar(RADIUS, RADIUS, RADIUS * 0.7, mid);

//             return (
//               <g key={i}>
//                 <path d={d} fill={brightColors[i % brightColors.length]} stroke="#fff" strokeWidth="2" />
//                 <text
//                   x={pos.x} y={pos.y}
//                   textAnchor="middle" alignmentBaseline="middle"
//                   transform={`rotate(${mid}, ${pos.x}, ${pos.y})`}
//                   style={{ fill: "#1e293b", fontWeight: 700, fontSize: 12, pointerEvents: "none" }}
//                 >
//                   {name}
//                 </text>
//               </g>
//             );
//           })}
//           <circle cx={RADIUS} cy={RADIUS} r={RADIUS * 0.17} fill="#2563eb" />
//           <text x={RADIUS} y={RADIUS + 4} textAnchor="middle"
//             style={{ fill: "#fff", fontWeight: 700, fontSize: 16 }}>SPIN</text>
//         </svg>
//       </div>

//       <button
//         onClick={spin}
//         disabled={spinning}
//         className={`mt-8 px-8 py-3 rounded-full text-white font-semibold text-lg shadow-lg ${
//           spinning ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//         }`}
//       >
//         {spinning ? "Spinning..." : "Spin Now 🎡"}
//       </button>

//       {result && !spinning && (
//         <p className="mt-6 text-2xl font-bold text-green-700 animate-bounce">
//           🎉 You got: {result}!
//         </p>
//       )}
//     </div>
//   );
// }


// import React, { useState } from "react";

// const DESTINATIONS = [
//   "Goa", "Jaipur", "Manali", "Mysuru", "Darjeeling",
//   "Varanasi", "Udaipur", "Shimla", "Kodaikanal", "Rishikesh",
//   "Andaman", "Ladakh", "Ooty", "Coorg", "Agra",
//   "Delhi", "Chennai", "Kolkata", "Mumbai", "Amritsar"
// ];

// const WIDTH = 350;
// const RADIUS = WIDTH / 2;
// const DURATION = 5000;

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

// export default function SpinWheel() {
//   const [rotation, setRotation] = useState(0);
//   const [spinning, setSpinning] = useState(false);
//   const [result, setResult] = useState(null);

//   const sliceAngle = 360 / DESTINATIONS.length;
//   const colors = [
//     "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA",
//     "#F472B6", "#FB923C", "#22D3EE", "#E879F9", "#FCD34D",
//     "#4ADE80", "#93C5FD", "#C084FC", "#FCA5A5", "#FDBA74",
//     "#2DD4BF", "#86EFAC", "#A5B4FC", "#F9A8D4", "#FDE68A"
//   ];

//   const spin = () => {
//     if (spinning) return; // ⛔ prevent spin during another spin
//     setSpinning(true);
//     setResult(null);

//     // Choose a random destination
//     const chosenIndex = Math.floor(Math.random() * DESTINATIONS.length);
//     const randomOffset = Math.random() * (sliceAngle - 2);
//     const finalAngle = chosenIndex * sliceAngle + sliceAngle / 2 + randomOffset;

//     // Add full rotations for smooth spin
//     const totalRotation = 6 * 360 + finalAngle;

//     setRotation(prev => prev + totalRotation);

//     // After spin completes
//     setTimeout(() => {
//       const final = (rotation + totalRotation) % 360;
//       const landedIndex = Math.floor((360 - final) / sliceAngle) % DESTINATIONS.length;
//       setResult(DESTINATIONS[landedIndex]);
//       setSpinning(false);
//       setRotation(final); // stop exactly at final position
//     }, DURATION + 50);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center pt-8 select-none">
//       <div style={{ position: "relative", width: WIDTH }}>
//         {/* 🔻 Red Arrow on Top, Facing Downwards */}
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
//               filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))",
//             }}
//           />
//         </div>

//         {/* 🎡 Wheel */}
//         <div
//           style={{
//             width: WIDTH,
//             height: WIDTH,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <svg
//             viewBox={`0 0 ${WIDTH} ${WIDTH}`}
//             width={WIDTH}
//             height={WIDTH}
//             style={{
//               transform: `rotate(${rotation}deg)`,
//               transformOrigin: "50% 50%",
//               transition: spinning
//                 ? `transform ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
//                 : "none",
//               borderRadius: "50%",
//               overflow: "visible",
//             }}
//           >
//             {DESTINATIONS.map((label, i) => {
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
//                   <path
//                     d={d}
//                     fill={colors[i % colors.length]}
//                     stroke="#ffffff"
//                     strokeWidth="2"
//                   />
//                   <text
//                     x={textPoint.x}
//                     y={textPoint.y}
//                     textAnchor="middle"
//                     alignmentBaseline="middle"
//                     transform={`rotate(${rotateAngle + flip}, ${textPoint.x}, ${textPoint.y})`}
//                     style={{
//                       fontSize: 16,
//                       fontWeight: 700,
//                       fill: "#0f172a",
//                       pointerEvents: "none",
//                     }}
//                   >
//                     {label}
//                   </text>
//                 </g>
//               );
//             })}

//             {/* Center Button */}
//             <circle
//               cx={RADIUS}
//               cy={RADIUS}
//               r={RADIUS * 0.16}
//               fill="#0ea5e9"
//               stroke="#0369a1"
//               strokeWidth="4"
//             />
//             <text
//               x={RADIUS}
//               y={RADIUS + 6}
//               textAnchor="middle"
//               alignmentBaseline="middle"
//               style={{ fontSize: 20, fontWeight: 800, fill: "#fff" }}
//             >
//               SPIN
//             </text>
//           </svg>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div style={{ marginTop: 24, display: "flex", gap: 16 }}>
//         <button
//           onClick={spin}
//           disabled={spinning}
//           style={{
//             background: spinning ? "#9ca3af" : "#2563eb",
//             color: "#fff",
//             padding: "12px 24px",
//             borderRadius: 999,
//             fontWeight: 700,
//             fontSize: 16,
//             border: "none",
//             boxShadow: "0 6px 18px rgba(2,6,23,0.15)",
//             cursor: spinning ? "not-allowed" : "pointer",
//           }}
//         >
//           {spinning ? "Spinning..." : "Spin Now 🎡"}
//         </button>

//         <button
//           onClick={() => {
//             setRotation(0);
//             setResult(null);
//           }}
//           disabled={spinning}
//           style={{
//             background: "#e5e7eb",
//             color: "#111827",
//             padding: "12px 20px",
//             borderRadius: 999,
//             fontWeight: 600,
//             border: "none",
//             cursor: spinning ? "not-allowed" : "pointer",
//           }}
//         >
//           Reset
//         </button>
//       </div>

//       {/* Result */}
//       {result && !spinning && (
//         <div style={{ marginTop: 28, textAlign: "center" }}>
//           <div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>
//             🎉 The wheel stopped at: {result}!
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

//   const [activeTab, setActiveTab] = useState("default"); // default or custom
//   const [customCities, setCustomCities] = useState([]);
//   const [cityInput, setCityInput] = useState("");
//   const [rotation, setRotation] = useState(0);
//   const [spinning, setSpinning] = useState(false);
//   const [result, setResult] = useState(null);

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
//       setResult(destinations[landedIndex]);
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
//     if (!result) return alert("Please spin the wheel first!");
//     // Redirect or API call for creating trip
//     alert(`Trip created to: ${result}`);
//     // Example: navigate(`/create-trip?city=${result}`);
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
//         <button
//           onClick={handleCreateTrip}
//           className="px-6 py-2 rounded-full font-bold bg-green-600 text-white"
//         >
//           Create Trip
//         </button>
//       </div>

//       {/* Result */}
//       {result && !spinning && (
//         <div className="mt-6 text-center text-green-600 font-bold text-xl">
//           🎉 The wheel stopped at: {result}!
//         </div>
//       )}
//     </div>
//   );
// }



