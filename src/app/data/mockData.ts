export const rwandanDistricts = [
  "Gasabo",
  "Kicukiro",
  "Nyarugenge",
  "Bugesera",
  "Gatsibo",
  "Kayonza",
  "Kirehe",
  "Ngoma",
  "Nyagatare",
  "Rwamagana",
  "Burera",
  "Gakenke",
  "Gicumbi",
  "Musanze",
  "Rulindo",
  "Gisagara",
  "Huye",
  "Kamonyi",
  "Muhanga",
  "Nyamagabe",
  "Nyanza",
  "Nyaruguru",
  "Ruhango",
  "Karongi",
  "Ngororero",
  "Nyabihu",
  "Nyamasheke",
  "Rubavu",
  "Rusizi",
  "Rutsiro",
];

export const categories = [
  { id: "agriculture", name: "Agriculture", icon: "🚜" },
  { id: "tech", name: "Tech", icon: "📱" },
  { id: "retail", name: "Retail", icon: "🛍️" },
  { id: "hospitality", name: "Hospitality", icon: "🏨" },
];

export interface Project {
  id: string;
  name: string;
  entrepreneur: string;
  category: string;
  location: string;
  fundingGoal: number;
  raised: number;
  description: string;
  roi: string;
  image: string;
  verified: {
    nid: boolean;
    rdb: boolean;
  };
  dateCreated: string;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Smart Poultry Farm",
    entrepreneur: "Jean-Claude Mugabo",
    category: "agriculture",
    location: "Musanze",
    fundingGoal: 15000000,
    raised: 4500000,
    description: "Modern poultry farming with automated feeding and climate control systems. Capacity for 5000 chickens with expansion potential.",
    roi: "Expected 30% annual return. First dividends after 6 months. 3-year investment period.",
    image: "https://images.unsplash.com/photo-1756245994848-1eb2be3b9b63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyd2FuZGElMjBmYXJtZXIlMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NjkwNzAzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    verified: {
      nid: true,
      rdb: true,
    },
    dateCreated: "2026-01-15",
  },
  {
    id: "2",
    name: "Mobile Payment Integration",
    entrepreneur: "Grace Uwase",
    category: "tech",
    location: "Kigali - Gasabo",
    fundingGoal: 25000000,
    raised: 18000000,
    description: "API platform for seamless mobile money integration for SMEs. Connecting MTN, Airtel, and banks.",
    roi: "Projected 45% ROI in Year 1. Monthly revenue sharing model. Scalable across East Africa.",
    image: "https://images.unsplash.com/photo-1657448740120-001a2345ab81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwdGVjaG5vbG9neSUyMHN0YXJ0dXB8ZW58MXx8fHwxNzY5MDcwMzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    verified: {
      nid: true,
      rdb: true,
    },
    dateCreated: "2026-01-10",
  },
  {
    id: "3",
    name: "Community Market Hub",
    entrepreneur: "Patrick Nkusi",
    category: "retail",
    location: "Huye",
    fundingGoal: 8000000,
    raised: 2400000,
    description: "Central marketplace connecting local farmers with urban buyers. Cold storage and delivery services included.",
    roi: "25% annual returns. Quarterly profit distribution. Community impact focus.",
    image: "https://images.unsplash.com/photo-1609507315751-216f91bc8ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyd2FuZGElMjBtYXJrZXQlMjByZXRhaWx8ZW58MXx8fHwxNzY5MDcwMzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    verified: {
      nid: true,
      rdb: false,
    },
    dateCreated: "2026-01-18",
  },
  {
    id: "4",
    name: "Lake Kivu Eco-Resort",
    entrepreneur: "Divine Mutoni",
    category: "hospitality",
    location: "Rubavu",
    fundingGoal: 25000000,
    raised: 12000000,
    description: "A sustainable luxury glamping site on the shores of Lake Kivu. Solar-powered, zero-waste, and focused on high-end eco-tourism.",
    roi: "18% annual return. High seasonal dividends. Property value appreciation included in equity.",
    image: "https://images.unsplash.com/photo-1544144433-d50aff500b91?q=80&w=1080&auto=format&fit=crop",
    verified: {
      nid: true,
      rdb: true,
    },
    dateCreated: "2026-02-01",
  },
  {
    id: "5",
    name: "Smart Irrigation Systems",
    entrepreneur: "Jean-Claude Uwizeye",
    category: "agriculture",
    location: "Nyagatare",
    fundingGoal: 12000000,
    raised: 9500000,
    description: "IoT-based irrigation sensors that reduce water waste by 40%. Helping Eastern Province farmers survive dry seasons with better yields.",
    roi: "35% annual returns based on crop yield sharing. 2-year break-even point.",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=1080&auto=format&fit=crop",
    verified: {
      nid: true,
      rdb: true,
    },
    dateCreated: "2026-02-05",
  },
  {
    id: "6",
    name: "Kigali Logistics Express",
    entrepreneur: "Sonia Gakire",
    category: "tech",
    location: "Kigali",
    fundingGoal: 18000000,
    raised: 3000000,
    description: "Last-mile delivery app using electric motorbikes. Reducing carbon emissions while providing 24/7 delivery across the city.",
    roi: "Equity-based investment. Projected 5x exit in 4 years. Monthly revenue reports provided.",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=1080&auto=format&fit=crop",
    verified: {
      nid: true,
      rdb: true,
    },
    dateCreated: "2026-02-10",
  },
  {
    id: "7",
    name: "Highland Coffee Processors",
    entrepreneur: "Moses Karekezi",
    category: "agriculture",
    location: "Gicumbi",
    fundingGoal: 10000000,
    raised: 0,
    description: "New washing station and roasting facility to process specialty beans for direct export to Europe and Asia.",
    roi: "20% fixed interest on debt or 15% profit sharing. Bi-annual payouts.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1080&auto=format&fit=crop",
    verified: {
      nid: true,
      rdb: false,
    },
    dateCreated: "2026-02-12",
  },
  {
    id: "8",
    name: "Edu-Tech Rwanda",
    entrepreneur: "Alice Umutoni",
    category: "tech",
    location: "Musanze",
    fundingGoal: 6500000,
    raised: 5800000,
    description: "Offline-capable tablets for rural schools. Pre-loaded with the national curriculum and interactive STEM content.",
    roi: "Social impact investment. 10% annual return + tax incentives for education support.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1080&auto=format&fit=crop",
    verified: {
      nid: true,
      rdb: true,
    },
    dateCreated: "2026-02-13",
  }
];

export const mockUserVerification = {
  id: "user123",
  name: "Jean-Claude Mugabo",
  nidNumber: "1198880012345678",
  nidPhoto: "https://images.unsplash.com/photo-1758928807847-ed94f9ed3cad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJpZmljYXRpb24lMjBpZGVudGl0eSUyMGRvY3VtZW50fGVufDF8fHx8MTc2OTA3MDM3NHww&ixlib=rb-4.1.0&q=80&w=1080",
  selfiePhoto: null,
  verificationStatus: "pending",
};
