/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  MapPin, 
  Phone, 
  Instagram, 
  Star,
  ChevronRight,
  Menu,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Mock Data ---

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Keripik Tempe RW.04",
    price: 15000,
    image: "https://drive.google.com/thumbnail?id=1QJ8HE5yIlRvbBma3vpVsmSVduee1wTOA&sz=w800",
    category: "Camilan",
    description: "Keripik tempe renyah buatan warga RW.04 dengan bumbu rahasia Tegal Parang."
  },
  {
    id: 2,
    name: "Sambal Parang Spesial",
    price: 25000,
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800&auto=format&fit=crop",
    category: "Bumbu",
    description: "Sambal ulek pedas mantap dengan terasi pilihan dari pasar lokal."
  },
  {
    id: 3,
    name: "Tas Belanja Tegal Parang",
    price: 45000,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
    category: "Aksesoris",
    description: "Tas belanja ramah lingkungan dengan motif khas Tegal Parang."
  },
  {
    id: 4,
    name: "Kopi Bubuk Warga",
    price: 35000,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop",
    category: "Minuman",
    description: "Kopi robusta pilihan yang disangrai manual oleh bapak-bapak RW.04."
  },
  {
    id: 5,
    name: "Rengginang Gurih",
    price: 20000,
    image: "https://images.unsplash.com/photo-1605666807844-78da0a09e0a0?q=80&w=800&auto=format&fit=crop",
    category: "Camilan",
    description: "Rengginang nasi pulen yang digoreng garing, cocok untuk teman minum teh."
  },
  {
    id: 6,
    name: "Kue Kering Lebaran",
    price: 65000,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop",
    category: "Kue",
    description: "Nastar dan Kastengel premium buatan ibu-ibu PKK RW.04."
  },
  {
    id: 7,
    name: "Bir Pletok",
    price: 5000,
    image: "https://drive.google.com/thumbnail?id=1utOOSdSCAwXS-92dRqUDxQHaZOEqKFyy&sz=w800",
    category: "Minuman",
    description: "Minuman rempah khas Betawi yang menghangatkan dan menyehatkan."
  },
  {
    id: 8,
    name: "Kerak Telor",
    price: 20000,
    image: "https://drive.google.com/thumbnail?id=1U4gLFtkqAImliKwtsm0Yq0vJ2_pT5p_F&sz=w800",
    category: "Makanan",
    description: "Omelet khas Betawi dengan bumbu serundeng dan bawang goreng yang melegenda."
  },
  {
    id: 9,
    name: "Candil",
    price: 7000,
    image: "https://drive.google.com/thumbnail?id=16JTDpUzHkP0DcYJToUOomMc2E2jOz3bK&sz=w800",
    category: "Makanan",
    description: "Bubur candil manis yang kenyal dengan kuah santan yang gurih."
  },
  {
    id: 10,
    name: "Nasi Uduk",
    price: 15000,
    image: "https://drive.google.com/thumbnail?id=1tC10NUBnrrJPPxMwz-ZNmFhzAMzhYdFt&sz=w800",
    category: "Makanan",
    description: "Nasi uduk lezat dengan pilihan lauk pauk khas RW.04 Tegal Parang."
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Warga Tegal Parang",
    text: "Produk-produk Lok4L4ku beneran berkualitas. Keripik tempenya langganan buat tamu kalau ke rumah.",
    rating: 5
  },
  {
    id: 2,
    name: "Siti Aminah",
    role: "Pembeli Setia",
    text: "Sambalnya pas pedasnya, bikin nafsu makan nambah. Bangga bisa support UMKM tetangga sendiri.",
    rating: 4
  }
];

// --- Main Application ---

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('lok4l4ku-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);
  
  // Checkout Form State
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerZip, setCustomerZip] = useState('');

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('lok4l4ku-cart', JSON.stringify(cart));
  }, [cart]);

  // Derived Values
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  // Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    if (isSubmitting) return;

    // 1. Capture ALL data needed for Sheet & WhatsApp BEFORE resetting
    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = now.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const productNames = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const currentTotal = formatPrice(cartTotal);
    const firstName = customerFirstName;
    const lastName = customerLastName;
    const email = customerEmail;
    const address = customerAddress;
    const city = customerCity;
    const zip = customerZip;
    
    setIsSubmitting(true);
    
    // Data for Google Sheets
    const sheetData = new URLSearchParams();
    sheetData.append('Nama Depan', firstName);
    sheetData.append('Nama Belakang', lastName);
    sheetData.append('Email', email);
    sheetData.append('Alamat', address);
    sheetData.append('Kota', city);
    sheetData.append('Kode Pos', zip);
    sheetData.append('Nama Produk', productNames);
    sheetData.append('Total Harga', currentTotal);
    sheetData.append('Waktu & Tanggal', `${formattedTime}, ${formattedDate}`);

    try {
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbyrBf19MYHgUYcVd3XpwPfArsshRCAPmr1XIWD1HfMJ9ts6WbjftZwE55BSahxahYqW/exec';
      
      // Kirim ke Google Sheets dengan format form-urlencoded yang lebih kompatibel dengan Apps Script doPost
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: sheetData.toString()
      });

      // Simpan rincian untuk ditampilkan di pesan sukses
      setLastOrderDetails({
        name: `${firstName} ${lastName}`,
        products: productNames,
        total: currentTotal,
        time: formattedTime,
        date: formattedDate
      });
      
      // Reset State & Form (SEGERA agar responsif)
      setCart([]);
      localStorage.removeItem('lok4l4ku-cart');
      
      setIsCartOpen(false);
      setShowSuccess(true);
      
      setCustomerFirstName('');
      setCustomerLastName('');
      setCustomerEmail('');
      setCustomerCity('');
      setCustomerZip('');
      setCustomerAddress('');

      // WhatsApp Message
      const message = `*PESANAN BARU - LOK4L4KU RW.04*%0A` +
        `--------------------------------%0A` +
        `*Data Pemesan:*%0A` +
        `Nama: ${firstName} ${lastName}%0A` +
        `Email: ${email}%0A` +
        `Alamat: ${address}%0A` +
        `Kota: ${city}%0A` +
        `Kode Pos: ${zip}%0A%0A` +
        `*Rincian Produk:*%0A` +
        `${productNames}%0A%0A` +
        `*Total Harga: ${currentTotal}*%0A` +
        `--------------------------------%0A` +
        `*Waktu:* ${formattedTime}%0A` +
        `*Tanggal:* ${formattedDate}%0A%0A` +
        `Mohon segera diproses ya, terima kasih!`;

      const whatsappUrl = `https://wa.me/6281234567890?text=${message}`;
      
      // Berikan sedikit delay sebelum buka WhatsApp agar UI sukses terlihat dulu
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 500);
      
      // Sembunyikan notifikasi sukses setelah 10 detik
      setTimeout(() => setShowSuccess(false), 10000);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Terjadi kesalahan sistem. Silakan hubungi admin via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-olive-200 selection:text-olive-900">
      
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && lastOrderDetails && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-md bg-white rounded-3xl shadow-2xl border border-olive-200 p-6 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-serif font-bold text-olive-900 mb-1">Data Tersimpan Berhasil!</h4>
                <p className="text-sm text-olive-600 mb-4">Rincian pesanan telah dikirim ke database & diteruskan ke WA Admin.</p>
                
                <div className="bg-olive-50 rounded-2xl p-4 space-y-2 text-xs border border-olive-100">
                  <div className="flex justify-between">
                    <span className="text-olive-400">Pemesan:</span>
                    <span className="font-bold text-olive-900">{lastOrderDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-olive-400">Produk:</span>
                    <span className="font-bold text-olive-900 text-right max-w-[150px] truncate">{lastOrderDetails.products}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-olive-400">Total:</span>
                    <span className="font-bold text-olive-900 text-green-600">{lastOrderDetails.total}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="mt-4 w-full py-2 bg-olive-900 text-white rounded-xl text-sm font-medium hover:bg-olive-800 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Navbar --- */}
      <nav id="navbar" className="sticky top-0 z-40 bg-olive-50/80 backdrop-blur-md border-b border-olive-200 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-olive-500 rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg ring-4 ring-olive-100">L</div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-olive-900">Lok4L4ku</h1>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-olive-500 -mt-1">RW.04 Tegal Parang</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-olive-700">
          <a href="#hero" className="hover:text-olive-500 transition-colors">Beranda</a>
          <a href="#katalog" className="hover:text-olive-500 transition-colors">Katalog</a>
          <a href="#testimoni" className="hover:text-olive-500 transition-colors">Testimoni</a>
          <a href="#kontak" className="hover:text-olive-500 transition-colors">Kontak</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            id="cart-trigger"
            onClick={() => setIsCartOpen(true)}
            className="group relative p-2 bg-white rounded-full border border-olive-200 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <ShoppingCart className="w-5 h-5 text-olive-700 group-hover:text-olive-500" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-olive-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-olive-50 font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-olive-700"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-20 left-0 w-full bg-olive-50 border-b border-olive-200 z-30 shadow-xl p-6 space-y-4"
          >
            <a href="#hero" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif">Beranda</a>
            <a href="#katalog" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif">Katalog</a>
            <a href="#testimoni" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif">Testimoni</a>
            <a href="#kontak" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif">Kontak</a>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        
        {/* --- Hero Section --- */}
        <section id="hero" className="relative min-h-[80vh] flex items-center px-6 md:px-20 overflow-hidden bg-olive-100">
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-olive-200/30 skew-x-12 translate-x-20 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-olive-300/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 bg-olive-500/10 text-olive-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Karya Warga untuk Bangsa
              </span>
              <h2 className="text-5xl md:text-8xl font-serif font-bold text-olive-900 leading-[0.9] tracking-tighter mb-8">
                Harta Karun <br />
                <span className="italic text-olive-500 underline decoration-olive-300 underline-offset-8">Tegal Parang</span>
              </h2>
              <p className="text-lg md:text-xl text-olive-700 max-w-xl mb-10 leading-relaxed font-light">
                Membawa kearifan lokal RW.04 Tegal Parang langsung ke pintu rumah Anda. Setiap produk adalah cerita cinta dari warga kami.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#katalog" className="px-8 py-4 bg-olive-500 text-white rounded-full font-bold shadow-xl shadow-olive-500/20 hover:bg-olive-600 transition-all hover:-translate-y-1 flex items-center gap-2">
                  Lihat Produk <ChevronRight className="w-5 h-5" />
                </a>
                <a href="#kontak" className="px-8 py-4 bg-white border border-olive-200 text-olive-700 rounded-full font-bold hover:bg-olive-50 transition-all">
                  Lokasi Kami
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block absolute right-20 w-96 h-[500px] bg-white rounded-[40px] shadow-2xl p-4 overflow-hidden"
          >
            <img 
              src="https://drive.google.com/thumbnail?id=1QJ8HE5yIlRvbBma3vpVsmSVduee1wTOA&sz=w800" 
              alt="Produk Utama"
              className="w-full h-full object-cover rounded-[32px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-8 flex flex-col justify-end">
              <p className="text-white font-serif text-2xl font-bold">Keripik Tempe Legendaris</p>
              <p className="text-olive-100 text-sm italic">Produk paling dicari di RW.04</p>
            </div>
          </motion.div>
        </section>

        {/* --- Product Catalog --- */}
        <section id="katalog" className="py-24 px-6 md:px-20 bg-white">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-olive-900 mb-4">Etalase Warga</h2>
            <div className="w-24 h-1 bg-olive-500 mx-auto rounded-full" />
            <p className="mt-6 text-olive-600 max-w-lg mx-auto">
              Dukungan Anda sangat berarti bagi keberlangsungan ekonomi UMKM lokal kami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((item, idx) => (
              <motion.div 
                id={`product-${item.id}`}
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col bg-olive-50 border border-olive-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-olive-200 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-olive-600 shadow-sm">
                    {item.category}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-bold text-olive-900 group-hover:text-olive-500 transition-colors">{item.name}</h3>
                    <p className="font-bold text-olive-600 bg-olive-100 px-3 py-1 rounded-lg text-sm">{formatPrice(item.price)}</p>
                  </div>
                  <p className="text-sm text-olive-600 font-light mb-8 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <button 
                    onClick={() => addToCart(item)}
                    className="mt-auto w-full py-4 bg-white border-2 border-olive-500 text-olive-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-olive-500 hover:text-white transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Tambah ke Keranjang
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- Testimonials --- */}
        <section id="testimoni" className="py-24 px-6 md:px-20 bg-olive-100 relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-olive-900 mb-8 leading-tight">Apa Kata <br /> <span className="italic text-olive-500">Tetangga?</span></h2>
              <p className="text-olive-700 text-lg mb-12 max-w-md italic">
                "Kepercayaan pembeli adalah denyut nadi bagi perkembangan UMKM kami di Tegal Parang."
              </p>
              <div className="flex -space-x-4 mb-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-olive-100 bg-olive-300 flex items-center justify-center text-white font-bold text-xs">U{i}</div>
                ))}
              </div>
              <p className="text-sm font-semibold text-olive-600 uppercase tracking-widest">100+ Warga Puas</p>
            </div>

            <div className="space-y-6">
              {TESTIMONIALS.map((t, idx) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-white p-8 rounded-[32px] shadow-lg border border-olive-100"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({length: t.rating}).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-olive-400 text-olive-400" />
                    ))}
                  </div>
                  <p className="text-olive-900 font-serif text-lg mb-6 leading-relaxed block overflow-hidden after:content-[''] after:inline-block after:w-full">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-olive-200"></div>
                    <div>
                      <p className="font-bold text-olive-900 text-sm">{t.name}</p>
                      <p className="text-xs text-olive-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Location & Contact --- */}
        <section id="kontak" className="py-24 px-6 md:px-20 bg-white">
          <div className="bg-olive-900 rounded-[48px] p-8 md:p-20 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-olive-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-16 relative z-10 text-center lg:text-left">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Hubungi Kami</h2>
                <p className="text-olive-300 text-lg mb-12 max-w-md mx-auto lg:mx-0">
                  Ingin bertanya tentang ketersediaan produk atau mampir ke workshop kami di RW.04?
                </p>
                <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-olive-400 flex-shrink-0" />
                    <p className="text-olive-100">
                      Jl. Tegal Parang Selatan V, <br />
                      RW.04, Kec. Mampang Prapatan, <br />
                      Jakarta Selatan, DKI Jakarta 12790
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-olive-400 flex-shrink-0" />
                    <p className="text-olive-100">+62 812-3456-7890 (Admin RW.04)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Instagram className="w-6 h-6 text-olive-400 flex-shrink-0" />
                    <p className="text-olive-100">@lok4l4ku.tegalparang</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-6">
                <div className="aspect-video w-full rounded-3xl overflow-hidden bg-olive-800 border border-white/10 group shadow-2xl">
                  {/* Mock Map View */}
                  <div className="w-full h-full relative">
                    <img 
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
                      alt="Map View" 
                      className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40">
                      <MapPin className="w-12 h-12 text-olive-500 mb-4 animate-bounce" />
                      <p className="font-serif text-2xl font-bold mb-2">Basecamp Lok4L4ku</p>
                      <p className="text-sm text-olive-200">Kawasan RW.04 Tegal Parang Selatan</p>
                    </div>
                  </div>
                </div>
                <button 
                   onClick={() => window.open('https://maps.google.com/?q=Tegal+Parang+Selatan', '_blank')}
                   className="w-full py-4 bg-white text-olive-900 rounded-2xl font-bold hover:bg-olive-50 transition-colors"
                >
                  Buka di Google Maps
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-olive-50 border-t border-olive-200 py-12 px-6 md:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-olive-500 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg">L</div>
            <h2 className="text-lg font-serif font-bold tracking-tight text-olive-900">Lok4L4ku</h2>
          </div>
          <p className="text-sm text-olive-500 font-light">&copy; 2024 UMKM RW.04 Tegal Parang. Semua Hak Dilindungi.</p>
          <div className="flex gap-4">
             <div className="p-2 border border-olive-200 rounded-full text-olive-500 text-xs font-bold uppercase tracking-widest px-4">
                #WargaRW04Berdaya
             </div>
          </div>
        </div>
      </footer>

      {/* --- Cart Sidebar Drawer --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-hidden cursor-crosshair h-screen w-screen"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 w-full h-screen bg-white z-[60] shadow-f-24 flex flex-col"
            >
              <div className="p-6 md:p-10 border-b border-olive-100 flex items-center justify-between bg-olive-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-olive-500 rounded-full flex items-center justify-center text-white">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-olive-900">Detail Pesanan</h2>
                    <p className="text-xs text-olive-500 uppercase tracking-widest font-bold">UMKM RW.04 Tegal Parang</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-3 hover:bg-olive-100 rounded-full transition-all group"
                  aria-label="Tutup"
                >
                  <X className="w-8 h-8 text-olive-400 group-hover:text-olive-900" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto">
                <div className="max-w-6xl mx-auto w-full p-6 md:p-10">
                  {cart.length === 0 ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-olive-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingCart className="w-12 h-12 text-olive-200" />
                      </div>
                      <h3 className="font-serif text-3xl mb-2 text-olive-900">Keranjang Belanja Kosong</h3>
                      <p className="text-olive-500 mb-8">Anda belum menambahkan produk warga ke dalam pesanan.</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="px-8 py-4 bg-olive-500 text-white rounded-2xl font-bold font-serif hover:bg-olive-600 transition-all"
                      >
                        Mulai Belanja
                      </button>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-5 gap-12">
                      {/* Products List */}
                      <div className="lg:col-span-3 space-y-8">
                        <h3 className="text-xl font-serif font-bold text-olive-900 border-b border-olive-100 pb-4">Produk Pilihan</h3>
                        <div className="space-y-6">
                          {cart.map(item => (
                            <div key={item.id} className="flex gap-6 items-center p-4 rounded-2xl hover:bg-olive-50/50 transition-all border border-transparent hover:border-olive-100">
                              <img src={item.image} alt={item.name} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-sm" />
                              <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                  <div>
                                    <h4 className="text-lg md:text-xl font-serif font-bold text-olive-900">{item.name}</h4>
                                    <p className="text-[10px] text-olive-400 uppercase tracking-widest font-bold">{item.category}</p>
                                  </div>
                                  <span className="text-lg font-bold text-olive-600 font-serif">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center bg-white border border-olive-200 rounded-xl overflow-hidden shadow-sm">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 px-4 hover:bg-olive-50 transition-colors text-olive-500"><Minus className="w-4 h-4" /></button>
                                    <span className="px-4 text-sm font-bold text-olive-700 border-x border-olive-200 py-2 min-w-[50px] text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 px-4 hover:bg-olive-50 transition-colors text-olive-500"><Plus className="w-4 h-4" /></button>
                                  </div>
                                  <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-sm text-red-400 hover:text-red-600 transition-colors font-medium flex items-center gap-1">
                                    <X className="w-4 h-4" /> Hapus
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Checkout Form */}
                      <div className="lg:col-span-2">
                        <div className="bg-olive-50 rounded-3xl p-8 sticky top-0 border border-olive-100 shadow-sm">
                          <h3 className="text-xl font-serif font-bold text-olive-900 mb-8 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-olive-500" /> Informasi Pengiriman
                          </h3>
                          
                          <form onSubmit={handleCheckout} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-olive-400 mb-2">Nama Depan</label>
                                <input 
                                  type="text" 
                                  name="Nama Depan"
                                  required 
                                  value={customerFirstName}
                                  onChange={(e) => setCustomerFirstName(e.target.value)}
                                  placeholder="Budi"
                                  className="w-full p-4 bg-white border border-olive-200 rounded-xl text-sm focus:ring-2 focus:ring-olive-500 outline-none transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-olive-400 mb-2">Nama Belakang</label>
                                <input 
                                  type="text" 
                                  name="Nama Belakang"
                                  required 
                                  value={customerLastName}
                                  onChange={(e) => setCustomerLastName(e.target.value)}
                                  placeholder="Santoso"
                                  className="w-full p-4 bg-white border border-olive-200 rounded-xl text-sm focus:ring-2 focus:ring-olive-500 outline-none transition-all"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase tracking-widest font-bold text-olive-400 mb-2">Email</label>
                              <input 
                                type="email" 
                                name="Email"
                                required 
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                placeholder="budi@email.com"
                                className="w-full p-4 bg-white border border-olive-200 rounded-xl text-sm focus:ring-2 focus:ring-olive-500 outline-none transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase tracking-widest font-bold text-olive-400 mb-2">Alamat Pengiriman</label>
                              <textarea 
                                name="Alamat"
                                required 
                                value={customerAddress}
                                onChange={(e) => setCustomerAddress(e.target.value)}
                                placeholder="Jl. Tegal Parang Selatan V..."
                                className="w-full p-4 bg-white border border-olive-200 rounded-xl text-sm focus:ring-2 focus:ring-olive-500 outline-none h-24 resize-none transition-all"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-olive-400 mb-2">Kota</label>
                                <input 
                                  type="text" 
                                  name="Kota"
                                  required 
                                  value={customerCity}
                                  onChange={(e) => setCustomerCity(e.target.value)}
                                  placeholder="Jakarta"
                                  className="w-full p-4 bg-white border border-olive-200 rounded-xl text-sm focus:ring-2 focus:ring-olive-500 outline-none transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-olive-400 mb-2">Kode Pos</label>
                                <input 
                                  type="text" 
                                  name="Kode Pos"
                                  required 
                                  value={customerZip}
                                  onChange={(e) => setCustomerZip(e.target.value)}
                                  placeholder="12790"
                                  className="w-full p-4 bg-white border border-olive-200 rounded-xl text-sm focus:ring-2 focus:ring-olive-500 outline-none transition-all"
                                />
                              </div>
                            </div>

                            <div className="pt-6 border-t border-olive-200 mt-6">
                              <div className="flex justify-between items-center mb-6">
                                <p className="text-xs uppercase tracking-[3px] font-bold text-olive-400">Total Pembayaran</p>
                                <p className="text-3xl font-serif font-bold text-olive-900">{formatPrice(cartTotal)}</p>
                              </div>
                              <button 
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-5 rounded-2xl font-bold font-serif text-lg shadow-xl shadow-olive-500/20 transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-olive-300 cursor-not-allowed text-olive-100' : 'bg-olive-500 hover:bg-olive-600 text-white hover:scale-[1.02] active:scale-95'}`}
                              >
                                {isSubmitting ? 'Memproses...' : 'Pesan Sekarang'} <ChevronRight className="w-6 h-6" />
                              </button>
                              <p className="mt-4 text-[10px] text-center text-olive-400 font-medium">Data akan disimpan otomatis dan dikonfirmasi via WhatsApp.</p>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
