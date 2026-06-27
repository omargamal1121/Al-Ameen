import { assets } from "./assets";

export const staticCategories = [
  {
    id: 1,
    name: "Power Cables",
    nameAr: "كابلات الطاقة",
    image: assets.brand_img1,
    description: "High-voltage and low-voltage electrical transmission cables.",
    subCategorySimples: [
      { id: 101, name: "Single-Core PVC Cables", nameAr: "كابلات أحادية الموصل", categoryId: 1 },
      { id: 102, name: "Multi-Core Armoured", nameAr: "كابلات متعددة الموصلات مدرّعة", categoryId: 1 },
      { id: 103, name: "Flexible Copper Cables", nameAr: "كابلات نحاسية مرنة", categoryId: 1 }
    ]
  },
  {
    id: 2,
    name: "Control Wires",
    nameAr: "كابلات التحكم والفيشة",
    image: assets.brand_img2,
    description: "Precision control & signal wiring for automation and control panels.",
    subCategorySimples: [
      { id: 201, name: "Shielded Control Wires", nameAr: "أسلاك شيلد مانعة للتشويش", categoryId: 2 },
      { id: 202, name: "Fire-Resistant Cables", nameAr: "كابلات مقاومة للحريق", categoryId: 2 },
      { id: 203, name: "Elevator & Traveling Wires", nameAr: "أسلاك مصاعد وحركة", categoryId: 2 }
    ]
  },
  {
    id: 3,
    name: "Coaxial & Communication",
    nameAr: "كابلات الاتصالات والدش",
    image: assets.brand_img3,
    description: "High-frequency coaxial RG6, Cat6 Ethernet, and fiber optic cables.",
    subCategorySimples: [
      { id: 301, name: "RG6 Coaxial Satellite Wires", nameAr: "أسلاك دش وستالايت RG6", categoryId: 3 },
      { id: 302, name: "Cat6 / Cat7 Network Cables", nameAr: "كابلات شبكات وإنترنت", categoryId: 3 },
      { id: 303, name: "Fiber Optic Cables", nameAr: "كابلات ألياف بصرية", categoryId: 3 }
    ]
  },
  {
    id: 4,
    name: "Building & Domestic Wires",
    nameAr: "أسلاك تأسيس المباني",
    image: assets.brand_img4,
    description: "Certified solid and stranded copper wires for internal building wiring.",
    subCategorySimples: [
      { id: 401, name: "Solid Copper Wires (1.5-6mm²)", nameAr: "أسلاك نحاس صلب معزولة", categoryId: 4 },
      { id: 402, name: "Flexible Extension Cord", nameAr: "كابلات مرنة وممتدة", categoryId: 4 },
      { id: 403, name: "Grounding Earth Wires", nameAr: "أسلاك تأريض وأمان", categoryId: 4 }
    ]
  }
];

export const staticSubcategories = staticCategories.flatMap(cat => cat.subCategorySimples);

export const staticProducts = [
  {
    _id: "prod-1",
    id: 1,
    name: "Single-Core PVC Insulated Cable 2.5mm²",
    description: "High-grade copper conductor insulated with flame-retardant PVC. Perfect for domestic electrical installations and panel wiring.",
    price: 450,
    finalPrice: 380,
    discountPercentage: 15,
    discountPrecentage: 15,
    discountName: "Special Offer",
    image: [assets.prod_new1, assets.brand_img1],
    isActive: true,
    inStock: true,
    currency: "EGP ",
    category: "Power Cables",
    categoryId: 1,
    subCategory: "Single-Core PVC Cables",
    subCategoryId: 101,
    sizes: ["100m Roll", "500m Drum"]
  },
  {
    _id: "prod-2",
    id: 2,
    name: "Multi-Core Armoured Power Cable 4x16mm²",
    description: "Steel wire armoured (SWA) heavy-duty cable suitable for underground power supply and industrial environments.",
    price: 1850,
    finalPrice: 1650,
    discountPercentage: 10,
    discountPrecentage: 10,
    discountName: "Bulk Price",
    image: [assets.prod_new2, assets.brand_hero_2],
    isActive: true,
    inStock: true,
    currency: "EGP ",
    category: "Power Cables",
    categoryId: 1,
    subCategory: "Multi-Core Armoured",
    subCategoryId: 102,
    sizes: ["50m Coil", "100m Coil"]
  },
  {
    _id: "prod-3",
    id: 3,
    name: "Flexible Industrial Extension Cable 3x4mm²",
    description: "Multi-strand heavy-duty rubberized cable engineered for mobile machinery and construction site power extension.",
    price: 980,
    finalPrice: 850,
    discountPercentage: 13,
    discountPrecentage: 13,
    discountName: "Hot Deal",
    image: [assets.prod_new3, assets.brand_img3],
    isActive: true,
    inStock: true,
    currency: "EGP ",
    category: "Power Cables",
    categoryId: 1,
    subCategory: "Flexible Copper Cables",
    subCategoryId: 103,
    sizes: ["50m Roll", "100m Roll"]
  },
  {
    _id: "prod-4",
    id: 4,
    name: "Shielded Control Cable 7x1.5mm²",
    description: "Multi-conductor flexible control cable with braided copper shield for interference-free signal transmission.",
    price: 890,
    finalPrice: 890,
    discountPercentage: 0,
    discountPrecentage: 0,
    discountName: null,
    image: [assets.brand_img3, assets.prod_new1],
    isActive: true,
    inStock: true,
    currency: "EGP ",
    category: "Control Wires",
    categoryId: 2,
    subCategory: "Shielded Control Wires",
    subCategoryId: 201,
    sizes: ["100m Roll"]
  },
  {
    _id: "prod-5",
    id: 5,
    name: "Fire-Resistant Silicone Cable 2x2.5mm²",
    description: "Halogen-free, fire-resistant cable engineered to maintain circuit integrity during fire emergency scenarios.",
    price: 1200,
    finalPrice: 1050,
    discountPercentage: 12,
    discountPrecentage: 12,
    discountName: "Safety Deal",
    image: [assets.brand_img4, assets.prod_new2],
    isActive: true,
    inStock: true,
    currency: "EGP ",
    category: "Control Wires",
    categoryId: 2,
    subCategory: "Fire-Resistant Cables",
    subCategoryId: 202,
    sizes: ["100m Roll"]
  },
  {
    _id: "prod-6",
    id: 6,
    name: "RG6 Coaxial Cable 75 Ohm (High Shielding)",
    description: "Low-loss 75 Ohm coaxial cable designed for digital satellite, CCTV, and high-definition signal distribution.",
    price: 320,
    finalPrice: 280,
    discountPercentage: 12,
    discountPrecentage: 12,
    discountName: "Best Seller",
    image: [assets.prod_new3, assets.brand_img5],
    isActive: true,
    inStock: true,
    currency: "EGP ",
    category: "Coaxial & Communication",
    categoryId: 3,
    subCategory: "RG6 Coaxial Satellite Wires",
    subCategoryId: 301,
    sizes: ["100m Roll", "305m Box"]
  },
  {
    _id: "prod-7",
    id: 7,
    name: "Cat6 FTP Outdoor Ethernet Network Cable",
    description: "Pure copper 4-pair FTP Cat6 cable with UV-resistant outer jacket for high-speed Gigabit network wiring.",
    price: 950,
    finalPrice: 850,
    discountPercentage: 10,
    discountPrecentage: 10,
    discountName: "Net Deal",
    image: [assets.prod_new1, assets.brand_img6],
    isActive: true,
    inStock: true,
    currency: "EGP ",
    category: "Coaxial & Communication",
    categoryId: 3,
    subCategory: "Cat6 / Cat7 Network Cables",
    subCategoryId: 302,
    sizes: ["305m Box"]
  },
  {
    _id: "prod-8",
    id: 8,
    name: "Solid Copper Building Wire 4mm² (Red/Black)",
    description: "Solid core pure copper building wire for main power distribution boxes and air conditioner connections.",
    price: 620,
    finalPrice: 550,
    discountPercentage: 11,
    discountPrecentage: 11,
    discountName: "Pro Choice",
    image: [assets.prod_new2, assets.brand_img4],
    isActive: true,
    inStock: true,
    currency: "EGP ",
    category: "Building & Domestic Wires",
    categoryId: 4,
    subCategory: "Solid Copper Wires (1.5-6mm²)",
    subCategoryId: 401,
    sizes: ["100m Roll"]
  }
];
