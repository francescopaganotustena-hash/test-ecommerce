/**
 * TECHSTORE - Database Prodotti Demo
 * Catalogo completo di prodotti elettronici
 */

let products = [
  // === TELEVISORI ===
  {
    id: 1,
    name: "Samsung QLED 55\" Q80C",
    brand: "Samsung",
    category: "televisori",
    price: 1299.00,
    originalPrice: 1599.00,
    discount: 19,
    rating: 4.8,
    reviews: 127,
    image: "assets/images/products/1593359677879-a4bb92f829d1.jpg",
    images: [
      "assets/images/products/1593359677879-a4bb92f829d1.jpg",
      "assets/images/products/1517336714731-489689fd1ca8.jpg",
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Smart TV QLED 4K con Quantum HDR, processore Neo Quantum e sistema operativo Tizen. Design slim e audio Dolby Atmos.",
    specs: {
      "Dimensioni schermo": "55 pollici",
      "Risoluzione": "4K Ultra HD (3840x2160)",
      "Tecnologia": "QLED",
      "HDR": "Quantum HDR 12X",
      "Smart TV": "Sì, Tizen OS",
      "HDMI": "4 porte HDMI 2.1",
      "USB": "2 porte USB",
      "WiFi": "Wi-Fi 5",
      "Bluetooth": "Sì, 5.2",
      "Classe energetica": "G"
    },
    inStock: true,
    stock: 15,
    featured: true,
    isNew: false
  },
  {
    id: 2,
    name: "LG OLED 65\" C3",
    brand: "LG",
    category: "televisori",
    price: 1899.00,
    originalPrice: 2299.00,
    discount: 17,
    rating: 4.9,
    reviews: 89,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg",
      "assets/images/products/1593359677879-a4bb92f829d1.jpg"
    ],
    description: "TV OLED evo 4K con processore α9 Gen6 AI, Dolby Vision IQ, Dolby Atmos e webOS 23. Perfetto per gaming con NVIDIA G-Sync.",
    specs: {
      "Dimensioni schermo": "65 pollici",
      "Risoluzione": "4K Ultra HD (3840x2160)",
      "Tecnologia": "OLED evo",
      "HDR": "Dolby Vision IQ, HDR10",
      "Smart TV": "Sì, webOS 23",
      "HDMI": "4 porte HDMI 2.1",
      "USB": "3 porte USB",
      "WiFi": "Wi-Fi 6",
      "Bluetooth": "Sì, 5.0",
      "Classe energetica": "F"
    },
    inStock: true,
    stock: 8,
    featured: true,
    isNew: true
  },
  {
    id: 3,
    name: "Sony Bravia 50\" X90L",
    brand: "Sony",
    category: "televisori",
    price: 999.00,
    originalPrice: 1199.00,
    discount: 17,
    rating: 4.6,
    reviews: 64,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Full Array LED 4K con processore Cognitive Processor XR, Google TV integrato e compatibilità PS5 ottimizzata.",
    specs: {
      "Dimensioni schermo": "50 pollici",
      "Risoluzione": "4K Ultra HD (3840x2160)",
      "Tecnologia": "Full Array LED",
      "HDR": "Dolby Vision, HDR10",
      "Smart TV": "Sì, Google TV",
      "HDMI": "4 porte HDMI 2.1",
      "USB": "2 porte USB",
      "WiFi": "Wi-Fi 5",
      "Bluetooth": "Sì, 4.2",
      "Classe energetica": "G"
    },
    inStock: true,
    stock: 22,
    featured: false,
    isNew: false
  },
  {
    id: 4,
    name: "TCL 43\" C735",
    brand: "TCL",
    category: "televisori",
    price: 449.00,
    originalPrice: 549.00,
    discount: 18,
    rating: 4.3,
    reviews: 156,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "QLED 4K con Google TV, Dolby Vision, HDR10+ e design frameless. Ottimo rapporto qualità-prezzo.",
    specs: {
      "Dimensioni schermo": "43 pollici",
      "Risoluzione": "4K Ultra HD (3840x2160)",
      "Tecnologia": "QLED",
      "HDR": "Dolby Vision, HDR10+",
      "Smart TV": "Sì, Google TV",
      "HDMI": "3 porte HDMI 2.1",
      "USB": "1 porta USB",
      "WiFi": "Wi-Fi 5",
      "Bluetooth": "Sì, 5.0",
      "Classe energetica": "G"
    },
    inStock: true,
    stock: 35,
    featured: false,
    isNew: false
  },
  
  // === SMARTPHONE ===
  {
    id: 5,
    name: "iPhone 15 Pro 256GB",
    brand: "Apple",
    category: "smartphone",
    price: 1229.00,
    originalPrice: 1229.00,
    discount: 0,
    rating: 4.9,
    reviews: 342,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg",
      "assets/images/products/1695048133142-1a20484d2569.jpg"
    ],
    description: "iPhone 15 Pro in titanio con chip A17 Pro, fotocamera 48MP, Dynamic Island e USB-C. Il più potente iPhone mai creato.",
    specs: {
      "Display": "6.1\" Super Retina XDR OLED",
      "Processore": "A17 Pro 3nm",
      "RAM": "8GB",
      "Memoria": "256GB",
      "Fotocamera": "48MP + 12MP + 12MP",
      "Fotocamera frontale": "12MP TrueDepth",
      "Batteria": "3274 mAh",
      "Ricarica": "27W cablata, 15W MagSafe",
      "5G": "Sì",
      "Sistema operativo": "iOS 17"
    },
    inStock: true,
    stock: 42,
    featured: true,
    isNew: true
  },
  {
    id: 6,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "smartphone",
    price: 1459.00,
    originalPrice: 1599.00,
    discount: 9,
    rating: 4.8,
    reviews: 218,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Galaxy S24 Ultra con AI integrata, S Pen, fotocamera 200MP e display Dynamic AMOLED 2X da 6.8\". Potenza pura.",
    specs: {
      "Display": "6.8\" Dynamic AMOLED 2X, 120Hz",
      "Processore": "Snapdragon 8 Gen 3",
      "RAM": "12GB",
      "Memoria": "512GB",
      "Fotocamera": "200MP + 50MP + 12MP + 10MP",
      "Fotocamera frontale": "12MP",
      "Batteria": "5000 mAh",
      "Ricarica": "45W cablata, 15W wireless",
      "5G": "Sì",
      "Sistema operativo": "Android 14, One UI 6.1"
    },
    inStock: true,
    stock: 28,
    featured: true,
    isNew: true
  },
  {
    id: 7,
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    category: "smartphone",
    price: 1499.00,
    originalPrice: 1499.00,
    discount: 0,
    rating: 4.7,
    reviews: 94,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Flagship Xiaomi con sistema fotografico Leica quad-camera, Snapdragon 8 Gen 3 e ricarica ultra-rapida 90W.",
    specs: {
      "Display": "6.73\" LTPO AMOLED, 120Hz",
      "Processore": "Snapdragon 8 Gen 3",
      "RAM": "16GB",
      "Memoria": "512GB",
      "Fotocamera": "50MP + 50MP + 50MP + 50MP Leica",
      "Fotocamera frontale": "32MP",
      "Batteria": "5000 mAh",
      "Ricarica": "90W cablata, 80W wireless",
      "5G": "Sì",
      "Sistema operativo": "Android 14, HyperOS"
    },
    inStock: true,
    stock: 12,
    featured: false,
    isNew: true
  },
  {
    id: 8,
    name: "Google Pixel 8 Pro",
    brand: "Google",
    category: "smartphone",
    price: 1099.00,
    originalPrice: 1199.00,
    discount: 8,
    rating: 4.6,
    reviews: 167,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Pixel 8 Pro con Google AI, Magic Eraser, Best Take e 7 anni di aggiornamenti. La migliore esperienza Android pura.",
    specs: {
      "Display": "6.7\" LTPO OLED, 120Hz",
      "Processore": "Google Tensor G3",
      "RAM": "12GB",
      "Memoria": "256GB",
      "Fotocamera": "50MP + 48MP + 48MP",
      "Fotocamera frontale": "10.5MP",
      "Batteria": "5050 mAh",
      "Ricarica": "30W cablata, 23W wireless",
      "5G": "Sì",
      "Sistema operativo": "Android 14"
    },
    inStock: true,
    stock: 19,
    featured: false,
    isNew: false
  },
  {
    id: 9,
    name: "OnePlus 12",
    brand: "OnePlus",
    category: "smartphone",
    price: 969.00,
    originalPrice: 969.00,
    discount: 0,
    rating: 4.5,
    reviews: 78,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "OnePlus 12 con Snapdragon 8 Gen 3, display 2K ProXDR, ricarica 100W e Hasselblad camera system.",
    specs: {
      "Display": "6.82\" LTPO AMOLED, 120Hz",
      "Processore": "Snapdragon 8 Gen 3",
      "RAM": "16GB",
      "Memoria": "512GB",
      "Fotocamera": "50MP + 64MP + 48MP Hasselblad",
      "Fotocamera frontale": "32MP",
      "Batteria": "5400 mAh",
      "Ricarica": "100W cablata, 50W wireless",
      "5G": "Sì",
      "Sistema operativo": "Android 14, OxygenOS 14"
    },
    inStock: true,
    stock: 25,
    featured: false,
    isNew: true
  },
  
  // === TABLET ===
  {
    id: 10,
    name: "iPad Pro 12.9\" M2",
    brand: "Apple",
    category: "tablet",
    price: 1449.00,
    originalPrice: 1549.00,
    discount: 6,
    rating: 4.9,
    reviews: 256,
    image: "assets/images/products/1544244015-0df4b3ffc6b0.jpg",
    images: [
      "assets/images/products/1544244015-0df4b3ffc6b0.jpg"
    ],
    description: "iPad Pro con chip M2, display Liquid Retina XDR, ProMotion e supporto Apple Pencil 2. Potenza desktop in un tablet.",
    specs: {
      "Display": "12.9\" Liquid Retina XDR",
      "Processore": "Apple M2",
      "RAM": "8GB",
      "Memoria": "256GB",
      "Fotocamera": "12MP + 10MP",
      "Fotocamera frontale": "12MP Ultra Wide",
      "Batteria": "Fino a 10 ore",
      "Connettività": "Wi-Fi 6E, 5G opzionale",
      "Peso": "682g",
      "Sistema operativo": "iPadOS 17"
    },
    inStock: true,
    stock: 18,
    featured: true,
    isNew: false
  },
  {
    id: 11,
    name: "Samsung Galaxy Tab S9 Ultra",
    brand: "Samsung",
    category: "tablet",
    price: 1199.00,
    originalPrice: 1399.00,
    discount: 14,
    rating: 4.7,
    reviews: 142,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Il tablet Android più grande con display Dynamic AMOLED 2X da 14.6\", S Pen inclusa e resistenza IP68.",
    specs: {
      "Display": "14.6\" Dynamic AMOLED 2X, 120Hz",
      "Processore": "Snapdragon 8 Gen 2",
      "RAM": "12GB",
      "Memoria": "256GB",
      "Fotocamera": "13MP + 8MP",
      "Fotocamera frontale": "12MP + 12MP",
      "Batteria": "11200 mAh",
      "Ricarica": "45W",
      "Peso": "732g",
      "Sistema operativo": "Android 13, One UI 5.1.1"
    },
    inStock: true,
    stock: 14,
    featured: true,
    isNew: false
  },
  {
    id: 12,
    name: "iPad Air 10.9\" M1",
    brand: "Apple",
    category: "tablet",
    price: 679.00,
    originalPrice: 729.00,
    discount: 7,
    rating: 4.8,
    reviews: 389,
    image: "assets/images/products/1561154464-82e9adf32764.jpg",
    images: [
      "assets/images/products/1561154464-82e9adf32764.jpg"
    ],
    description: "iPad Air con chip M1, display Liquid Retina e supporto Magic Keyboard. Il perfetto equilibrio tra potenza e portabilità.",
    specs: {
      "Display": "10.9\" Liquid Retina",
      "Processore": "Apple M1",
      "RAM": "8GB",
      "Memoria": "64GB",
      "Fotocamera": "12MP",
      "Fotocamera frontale": "12MP Ultra Wide",
      "Batteria": "Fino a 10 ore",
      "Connettività": "Wi-Fi 6",
      "Peso": "461g",
      "Sistema operativo": "iPadOS 17"
    },
    inStock: true,
    stock: 32,
    featured: false,
    isNew: false
  },
  {
    id: 13,
    name: "Lenovo Tab P12 Pro",
    brand: "Lenovo",
    category: "tablet",
    price: 599.00,
    originalPrice: 749.00,
    discount: 20,
    rating: 4.4,
    reviews: 87,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Tablet Android premium con display AMOLED 12.6\", Snapdragon 870 e Lenovo Precision Pen 2 inclusa.",
    specs: {
      "Display": "12.6\" AMOLED, 120Hz",
      "Processore": "Snapdragon 870",
      "RAM": "8GB",
      "Memoria": "256GB",
      "Fotocamera": "13MP + 8MP",
      "Fotocamera frontale": "8MP + 8MP",
      "Batteria": "10200 mAh",
      "Ricarica": "45W",
      "Peso": "565g",
      "Sistema operativo": "Android 13"
    },
    inStock: true,
    stock: 21,
    featured: false,
    isNew: false
  },
  
  // === NOTEBOOK ===
  {
    id: 14,
    name: "MacBook Pro 14\" M3 Pro",
    brand: "Apple",
    category: "notebook",
    price: 2399.00,
    originalPrice: 2399.00,
    discount: 0,
    rating: 4.9,
    reviews: 178,
    image: "assets/images/products/1517336714731-489689fd1ca8.jpg",
    images: [
      "assets/images/products/1517336714731-489689fd1ca8.jpg"
    ],
    description: "MacBook Pro con chip M3 Pro, display Liquid Retina XDR, fino a 18 ore di autonomia. Per professionisti esigenti.",
    specs: {
      "Display": "14.2\" Liquid Retina XDR",
      "Processore": "Apple M3 Pro 12-core",
      "RAM": "18GB unificata",
      "SSD": "512GB",
      "GPU": "18-core",
      "Batteria": "Fino a 18 ore",
      "Porte": "3x Thunderbolt 4, HDMI, SDXC, MagSafe",
      "Peso": "1.61 kg",
      "Webcam": "1080p FaceTime HD",
      "Sistema operativo": "macOS Sonoma"
    },
    inStock: true,
    stock: 9,
    featured: true,
    isNew: true
  },
  {
    id: 15,
    name: "Dell XPS 15 9530",
    brand: "Dell",
    category: "notebook",
    price: 2099.00,
    originalPrice: 2399.00,
    discount: 13,
    rating: 4.6,
    reviews: 124,
    image: "assets/images/products/1593642632823-8f785ba67e45.jpg",
    images: [
      "assets/images/products/1593642632823-8f785ba67e45.jpg"
    ],
    description: "Notebook premium con display InfinityEdge OLED 3.5K, Intel Core i7 di 13a gen e design in alluminio CNC.",
    specs: {
      "Display": "15.6\" OLED 3.5K InfinityEdge",
      "Processore": "Intel Core i7-13700H",
      "RAM": "16GB DDR5",
      "SSD": "1TB NVMe",
      "GPU": "NVIDIA RTX 4060 8GB",
      "Batteria": "86 Wh",
      "Porte": "2x Thunderbolt 4, USB-C, SD",
      "Peso": "1.86 kg",
      "Webcam": "720p + IR",
      "Sistema operativo": "Windows 11 Pro"
    },
    inStock: true,
    stock: 11,
    featured: true,
    isNew: false
  },
  {
    id: 16,
    name: "HP Spectre x360 14",
    brand: "HP",
    category: "notebook",
    price: 1699.00,
    originalPrice: 1899.00,
    discount: 11,
    rating: 4.5,
    reviews: 96,
    image: "assets/images/products/1496181133206-80ce9b88a853.jpg",
    images: [
      "assets/images/products/1496181133206-80ce9b88a853.jpg"
    ],
    description: "2-in-1 convertible con design gem-cut, display OLED touchscreen e Intel Evo. Eleganza e versatilità.",
    specs: {
      "Display": "13.5\" OLED 3K2K touchscreen",
      "Processore": "Intel Core i7-1355U",
      "RAM": "16GB LPDDR4x",
      "SSD": "1TB NVMe",
      "GPU": "Intel Iris Xe",
      "Batteria": "66 Wh",
      "Porte": "2x Thunderbolt 4, USB-A, microSD",
      "Peso": "1.36 kg",
      "Webcam": "9MP con privacy shutter",
      "Sistema operativo": "Windows 11 Home"
    },
    inStock: true,
    stock: 16,
    featured: false,
    isNew: false
  },
  {
    id: 17,
    name: "Lenovo ThinkPad X1 Carbon G11",
    brand: "Lenovo",
    category: "notebook",
    price: 1899.00,
    originalPrice: 2199.00,
    discount: 14,
    rating: 4.7,
    reviews: 143,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Business ultrabook in carbonio, Intel vPro, certificazione MIL-STD e TrackPoint. Il classico aziendale.",
    specs: {
      "Display": "14\" WUXGA IPS anti-glare",
      "Processore": "Intel Core i7-1365U vPro",
      "RAM": "16GB LPDDR5",
      "SSD": "512GB NVMe",
      "GPU": "Intel Iris Xe",
      "Batteria": "57 Wh",
      "Porte": "2x Thunderbolt 4, 2x USB-A, HDMI",
      "Peso": "1.12 kg",
      "Webcam": "1080p + IR",
      "Sistema operativo": "Windows 11 Pro"
    },
    inStock: true,
    stock: 23,
    featured: false,
    isNew: false
  },
  {
    id: 18,
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    category: "notebook",
    price: 1799.00,
    originalPrice: 1999.00,
    discount: 10,
    rating: 4.8,
    reviews: 267,
    image: "assets/images/products/1603302576837-37561b2e2302.jpg",
    images: [
      "assets/images/products/1603302576837-37561b2e2302.jpg"
    ],
    description: "Gaming laptop compatto con Ryzen 9, RTX 4070 e AniMe Matrix display. Potenza gaming in 14 pollici.",
    specs: {
      "Display": "14\" QHD+ 165Hz",
      "Processore": "AMD Ryzen 9 7940HS",
      "RAM": "16GB DDR5",
      "SSD": "1TB NVMe",
      "GPU": "NVIDIA RTX 4070 8GB",
      "Batteria": "76 Wh",
      "Porte": "USB-C, USB-A, HDMI 2.1",
      "Peso": "1.65 kg",
      "Webcam": "720p",
      "Sistema operativo": "Windows 11 Home"
    },
    inStock: true,
    stock: 7,
    featured: true,
    isNew: false
  },
  
  // === AUDIO ===
  {
    id: 19,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "audio",
    price: 379.00,
    originalPrice: 429.00,
    discount: 12,
    rating: 4.8,
    reviews: 542,
    image: "assets/images/products/1618366712010-f4ae9c647dcb.jpg",
    images: [
      "assets/images/products/1618366712010-f4ae9c647dcb.jpg"
    ],
    description: "Cuffie noise cancelling premium con 8 microfoni, 30 ore di autonomia e suono Hi-Res. Le migliori ANC sul mercato.",
    specs: {
      "Tipo": "Over-ear wireless",
      "Noise Cancelling": "Attivo, automatico",
      "Driver": "30mm",
      "Batteria": "30 ore (ANC on)",
      "Ricarica": "USB-C, 3 min = 3 ore",
      "Bluetooth": "5.2, LDAC, AAC",
      "Microfoni": "8 per ANC e chiamate",
      "Peso": "250g",
      "Foldable": "Sì",
      "App": "Sony Headphones Connect"
    },
    inStock: true,
    stock: 45,
    featured: true,
    isNew: false
  },
  {
    id: 20,
    name: "AirPods Pro 2",
    brand: "Apple",
    category: "audio",
    price: 279.00,
    originalPrice: 299.00,
    discount: 7,
    rating: 4.7,
    reviews: 823,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Earbuds Apple con ANC 2x più potente, audio spaziale personalizzato e custodia MagSafe. Integrazione perfetta con Apple.",
    specs: {
      "Tipo": "In-ear wireless",
      "Noise Cancelling": "Attivo adattivo",
      "Driver": "Custom Apple",
      "Batteria": "6 ore + 24 con case",
      "Ricarica": "Lightning/MagSafe/Qi",
      "Bluetooth": "5.3",
      "Chip": "Apple H2",
      "Peso": "5.3g ciascuno",
      "Resistenza": "IPX4",
      "Features": "Audio spaziale, Find My"
    },
    inStock: true,
    stock: 67,
    featured: true,
    isNew: false
  },
  {
    id: 21,
    name: "Bose QuietComfort Ultra",
    brand: "Bose",
    category: "audio",
    price: 449.00,
    originalPrice: 449.00,
    discount: 0,
    rating: 4.6,
    reviews: 198,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Top di gamma Bose con Immersive Audio, ANC personalizzabile e comfort premium. Suono avvolgente.",
    specs: {
      "Tipo": "Over-ear wireless",
      "Noise Cancelling": "CustomTune ANC",
      "Driver": "40mm",
      "Batteria": "24 ore",
      "Ricarica": "USB-C",
      "Bluetooth": "5.3",
      "Microfoni": "6 per chiamate",
      "Peso": "252g",
      "Foldable": "Sì",
      "App": "Bose Music"
    },
    inStock: true,
    stock: 28,
    featured: false,
    isNew: true
  },
  {
    id: 22,
    name: "JBL Flip 6",
    brand: "JBL",
    category: "audio",
    price: 129.00,
    originalPrice: 149.00,
    discount: 13,
    rating: 4.5,
    reviews: 412,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Speaker Bluetooth portatile con JBL Original Pro Sound, IP67 waterproof e 12 ore di autonomia.",
    specs: {
      "Tipo": "Speaker Bluetooth portatile",
      "Potenza": "30W RMS",
      "Driver": "2 woofer + 1 tweeter",
      "Batteria": "12 ore",
      "Ricarica": "USB-C",
      "Bluetooth": "5.1",
      "Resistenza": "IP67",
      "Peso": "550g",
      "PartyBoost": "Sì",
      "App": "JBL Portable"
    },
    inStock: true,
    stock: 52,
    featured: false,
    isNew: false
  },
  
  // === SMART HOME ===
  {
    id: 23,
    name: "Amazon Echo Dot 5",
    brand: "Amazon",
    category: "smart-home",
    price: 64.99,
    originalPrice: 64.99,
    discount: 0,
    rating: 4.4,
    reviews: 1256,
    image: "assets/images/products/1628260412297-a3377e45006f.jpg",
    images: [
      "assets/images/products/1628260412297-a3377e45006f.jpg"
    ],
    description: "Smart speaker con Alexa, audio migliorato, display LED per temperatura e tap-to-snooze.",
    specs: {
      "Assistente": "Alexa",
      "Audio": "Speaker 1.73\"",
      "Display": "LED per info",
      "Connettività": "Wi-Fi, Bluetooth",
      "Smart Home": "Hub integrato Matter",
      "Privacy": "Tasto disattivazione microfono",
      "Dimensioni": "100 x 100 x 89 mm",
      "Peso": "340g",
      "Colori": "Antracite, Bianco, Blu",
      "App": "Alexa"
    },
    inStock: true,
    stock: 89,
    featured: true,
    isNew: false
  },
  {
    id: 24,
    name: "Google Nest Hub 2",
    brand: "Google",
    category: "smart-home",
    price: 99.00,
    originalPrice: 99.00,
    discount: 0,
    rating: 4.5,
    reviews: 678,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Smart display 7\" con Google Assistant, Sleep Sensing e controllo dispositivi smart home. Senza camera.",
    specs: {
      "Assistente": "Google Assistant",
      "Display": "7\" touchscreen",
      "Audio": "Speaker full-range",
      "Connettività": "Wi-Fi, Bluetooth 5.0",
      "Smart Home": "Matter, Thread",
      "Sleep Sensing": "Sì, senza camera",
      "Dimensioni": "177 x 120 x 69 mm",
      "Peso": "558g",
      "Colori": "Gesso, Carbone, Rosa",
      "App": "Google Home"
    },
    inStock: true,
    stock: 34,
    featured: false,
    isNew: false
  },
  {
    id: 25,
    name: "Philips Hue Starter Kit",
    brand: "Philips",
    category: "smart-home",
    price: 199.00,
    originalPrice: 249.00,
    discount: 20,
    rating: 4.7,
    reviews: 534,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Kit 3 lampadine E27 color + bridge. 16 milioni di colori, controllo vocale e automazioni.",
    specs: {
      "Contenuto": "3 lampadine E27 + Bridge",
      "Luminosità": "806 lumen ciascuna",
      "Colori": "16 milioni",
      "Connessione": "Zigbee via Bridge",
      "Compatibilità": "Alexa, Google, HomeKit",
      "Durata": "25.000 ore",
      "Consumo": "9W (equivalente 60W)",
      "Dimmerabile": "Sì",
      "App": "Philips Hue",
      "Garanzia": "2 anni"
    },
    inStock: true,
    stock: 41,
    featured: true,
    isNew: false
  },
  {
    id: 26,
    name: "TP-Link Tapo C200",
    brand: "TP-Link",
    category: "smart-home",
    price: 29.90,
    originalPrice: 39.90,
    discount: 25,
    rating: 4.3,
    reviews: 2341,
    image: "assets/images/products/placeholder-product.svg",
    images: [
      "assets/images/products/placeholder-product.svg"
    ],
    description: "Telecamera Wi-Fi pan/tilt 1080p con visione notturna, rilevamento movimento e audio bidirezionale.",
    specs: {
      "Risoluzione": "1080p Full HD",
      "Campo visivo": "360° orizzontale, 114° verticale",
      "Visione notturna": "Fino a 9m",
      "Audio": "Bidirezionale",
      "Connettività": "Wi-Fi 2.4GHz",
      "Archiviazione": "microSD fino a 128GB",
      "Rilevamento": "Movimento e suono",
      "Privacy": "Modalità privacy",
      "Compatibilità": "Alexa, Google",
      "App": "Tapo"
    },
    inStock: true,
    stock: 156,
    featured: false,
    isNew: false
  }
];

// Categorie prodotti
const categories = [
  { id: 'televisori', name: 'Televisori', icon: '📺', color: '#0066CC' },
  { id: 'smartphone', name: 'Smartphone', icon: '📱', color: '#FF6600' },
  { id: 'tablet', name: 'Tablet', icon: '📟', color: '#28A745' },
  { id: 'notebook', name: 'Notebook', icon: '💻', color: '#6F42C1' },
  { id: 'audio', name: 'Audio', icon: '🎧', color: '#DC3545' },
  { id: 'smart-home', name: 'Smart Home', icon: '🏠', color: '#17A2B8' }
];

function isAllowedImageSource(src) {
  const value = String(src || '').trim();
  return (
    value.startsWith('assets/') ||
    value.startsWith('./assets/') ||
    value.startsWith('../assets/') ||
    value.startsWith('data:image/')
  );
}

function normalizeProductImageFields(product) {
  const fallback = 'assets/images/products/placeholder-product.svg';
  const mainImage = isAllowedImageSource(product.image) ? product.image : fallback;
  const images = Array.isArray(product.images) ? product.images.filter(isAllowedImageSource) : [];

  return {
    ...product,
    image: mainImage,
    images: images.length > 0 ? images : [mainImage]
  };
}

// Carica prodotti da localStorage se disponibili (sync con gestione catalogo/admin)
const storedProducts = localStorage.getItem('techstore_products');
if (storedProducts) {
  try {
    const parsedProducts = JSON.parse(storedProducts);
    if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
      products = parsedProducts.map(normalizeProductImageFields);
    }
  } catch (e) {
    console.warn('Impossibile leggere techstore_products dal localStorage, uso dataset di default.', e);
  }
}

// Normalizza sempre il dataset attivo, senza forzare immagini locali per ID.
products = products.map(normalizeProductImageFields);

// Brand disponibili
const brands = [...new Set(products.map(p => p.brand))].sort();

/**
 * Funzioni utility per i prodotti
 */

// Ottieni prodotto per ID
function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

// Ottieni prodotti per categoria
function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

// Ottieni prodotti in offerta
function getSaleProducts() {
  return products.filter(p => p.discount > 0);
}

// Ottieni prodotti featured
function getFeaturedProducts() {
  return products.filter(p => p.featured);
}

// Ottieni nuovi prodotti
function getNewProducts() {
  return products.filter(p => p.isNew);
}

// Cerca prodotti
function searchProducts(query) {
  const q = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

// Filtra prodotti
function filterProducts(filters = {}) {
  let result = [...products];
  
  if (filters.category) {
    result = result.filter(p => p.category === filters.category);
  }
  if (filters.brand) {
    result = result.filter(p => p.brand === filters.brand);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }
  if (filters.minPrice !== undefined) {
    result = result.filter(p => p.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter(p => p.price <= filters.maxPrice);
  }
  if (filters.inStock) {
    result = result.filter(p => p.inStock);
  }
  if (filters.onSale) {
    result = result.filter(p => p.discount > 0);
  }
  
  return result;
}

// Ordina prodotti
function sortProducts(products, sortBy) {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'bestsellers':
      sorted.sort((a, b) => b.reviews - a.reviews);
      break;
    default:
      break;
  }
  
  return sorted;
}

// Ottieni prodotti correlati
function getRelatedProducts(productId, category, limit = 4) {
  return products
    .filter(p => p.id !== productId && p.category === category)
    .slice(0, limit);
}

// Calcola prezzo scontato
function getDiscountedPrice(price, discount) {
  return discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price;
}

// Esporta funzioni globalmente
window.TechStoreProducts = {
  products,
  categories,
  brands,
  getProductById,
  getProductsByCategory,
  getSaleProducts,
  getFeaturedProducts,
  getNewProducts,
  searchProducts,
  filterProducts,
  sortProducts,
  getRelatedProducts,
  getDiscountedPrice
};
