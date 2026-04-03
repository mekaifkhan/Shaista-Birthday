/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import ReactPlayer from 'react-player';
import { Heart, Music, Pause, Play, Volume2, Calendar, Camera, Video, MessageCircleHeart, Sparkles, ChevronDown, X } from 'lucide-react';

// --- Constants ---
const TARGET_DATE = new Date('2026-04-04T00:00:00').getTime();
const MUSIC_URL = 'https://drive.google.com/uc?id=1UgrRGiWjSa1yYc75Yo42UrBRtM4Yr62K&export=download';
const HERO_IMAGE = 'https://lh3.googleusercontent.com/d/1csV8AFM4vUwhTRMrOTCc3XUTLjKJYPfM';

// --- Components ---

const RosePetals = () => {
  const [petals, setPetals] = useState<{ id: number; left: string; size: number; duration: number; delay: number; rotation: number }[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 15,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: -50, opacity: 0, rotate: petal.rotation }}
          animate={{ 
            y: '110vh', 
            x: [0, 100, -100, 0],
            opacity: [0, 0.8, 0.8, 0],
            rotate: petal.rotation + 720
          }}
          transition={{ 
            duration: petal.duration, 
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear' 
          }}
          className="absolute text-red-300/40"
          style={{ left: petal.left }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,21C12,21 4,16 4,10C4,6 7,3 10,3C11.5,3 12,4 12,4C12,4 12.5,3 14,3C17,3 20,6 20,10C20,16 12,21 12,21Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; size: number; duration: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          left: `${Math.random() * 100}%`,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 5 + 5,
        },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: heart.duration, ease: 'linear' }}
          className="absolute text-pink-300/40"
          style={{ left: heart.left }}
        >
          <Heart size={heart.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

const Countdown = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-black to-black z-0" />
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        <motion.div
          key="ready"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="z-10 text-center px-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              filter: ["drop-shadow(0 0 0px #db2777)", "drop-shadow(0 0 20px #db2777)", "drop-shadow(0 0 0px #db2777)"]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-12"
          >
            <Heart size={80} className="text-pink-500 mx-auto mb-6" fill="currentColor" />
            <h2 className="text-4xl md:text-6xl font-cursive text-pink-200 text-glow">
              Your Surprise is Ready!
            </h2>
            <p className="mt-4 text-xl md:text-2xl font-serif italic text-pink-300/80">
              4th April 2026 ❤️
            </p>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(219,39,119,0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="bg-pink-600 text-white px-12 py-5 rounded-full text-2xl font-bold shadow-xl transition-all"
          >
            Open Your Gift ❤️
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const MainContent = () => {
  const [showLoveModal, setShowLoveModal] = useState(false);
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);
  const Player = ReactPlayer as any;

  const handleCloseAndRedirect = () => {
    setShowLoveModal(false);
    const message = encodeURIComponent("I'm already yours betuuu! ❤️ I love you so much! ✨");
    window.open(`https://wa.me/9128914453?text=${message}`, '_blank');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollPrompt(false);
      } else {
        setShowScrollPrompt(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffb6c1', '#ff69b4', '#ffffff']
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fff5f5] font-sans relative">
      <FloatingHearts />
      
      {/* Section 0: Start Our Journey (Video) */}
      <section className="pt-12 pb-12 px-4 max-w-3xl mx-auto text-center relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 md:p-6 rounded-[2.5rem] shadow-2xl border-2 border-pink-100 bg-white/80 backdrop-blur-md"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-pink-500 p-2 rounded-full text-white shadow-lg">
              <Video size={20} />
            </div>
            <h2 className="text-xl md:text-2xl font-serif text-pink-700 font-bold">click here before scrolling down Shaistuuuuu ❤️</h2>
          </div>
          
          <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-inner relative border-4 border-pink-50">
            <iframe
              src="https://drive.google.com/file/d/1UgrRGiWjSa1yYc75Yo42UrBRtM4Yr62K/preview"
              className="w-full h-full border-none"
              allow="autoplay; fullscreen"
              title="Our Journey Starts Here"
            ></iframe>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-pink-400 italic text-sm md:text-base">
            <Sparkles size={16} />
            <p>Press play to begin our story...</p>
            <Sparkles size={16} />
          </div>
        </motion.div>
      </section>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGE} 
            alt="Shaista" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-pink-50/80 via-transparent to-[#fff5f5]" />
        </div>

        <RosePetals />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="z-10"
        >
          <h1 className="text-6xl md:text-8xl font-cursive text-pink-600 mb-4 text-glow drop-shadow-lg">
            Happy Birthday Shaista ❤️
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-pink-500 bg-white/30 backdrop-blur-sm px-6 py-2 rounded-full inline-block">
            A little surprise made with love just for you
          </p>
        </motion.div>
        
        <AnimatePresence>
          {showScrollPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-10 flex flex-col items-center gap-2 z-30"
            >
              <div className="glass px-4 py-2 rounded-full text-pink-600 font-serif italic text-sm shadow-lg animate-bounce">
                Scroll down for more surprises ❤️
              </div>
              <ChevronDown className="text-pink-500 animate-bounce" size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Section 1: Love Message */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-8 md:p-12 rounded-3xl text-center"
        >
          <MessageCircleHeart className="mx-auto mb-6 text-pink-500" size={48} />
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-pink-700">To My Special Person</h2>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-700 font-serif italic">
            <p>Dearest Shaista,</p>
            <p>
              Today is a day as beautiful as your smile and as special as your heart. 
              I wanted to create something that could capture even a fraction of the love I feel for you.
            </p>
            <p>
              You are the melody in my silence, the light in my darkest days, and the most beautiful part of my life. 
              Every moment with you is a memory I treasure, and every laugh we share is a song I want to hear forever.
            </p>
            <p>
              May your day be filled with all the magic you bring into this world. 
              Happy Birthday, my love.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Section 2: Our Memories */}
      <section className="py-24 bg-pink-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12 justify-center">
            <Camera className="text-pink-500" />
            <h2 className="text-4xl font-serif text-pink-800">Our Memories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { src: 'https://lh3.googleusercontent.com/d/1fh2fXKDWIOW0adJn6AKPWkdJFMz0U1RL', caption: 'The very first moment our worlds collided. 15th March - a date etched in my heart forever. ✨❤️' },
              { src: 'https://lh3.googleusercontent.com/d/1bmNxrKak4QJTQymu2DlgAu-HSvRETzqD', caption: 'That first hug where I felt home for the very first time. Pure magic in your arms. 🤗💖' },
              { src: 'https://lh3.googleusercontent.com/d/1kwJRG96R1b95EIN0al6AmEdmHoCj0NnV', caption: 'Even a simple metro drop-off feels like a scene from a movie when it\'s with you. 🚇✨' },
              { src: 'https://lh3.googleusercontent.com/d/1uQEKXKWBqdz2repXnSuOqxSboolfjx_c', caption: 'Miles of tracks, but my heart only stayed with you. Our most unforgettable journey. 🚂💕' },
              { src: 'https://lh3.googleusercontent.com/d/1Hu32Npzgu9WRFHCI_RCXYKg8cy27aAxl', caption: 'Sharing simple meals and endless laughs. Our KFC dates are my favorite dates. 🍗😍' },
              { src: 'https://lh3.googleusercontent.com/d/1ekUrCw9Kds5hgxYb5chrXN5FP6NCXeVU', caption: '28th May - The day we reached our beautiful destination. A new chapter of us. 📍❤️' },
              { src: 'https://lh3.googleusercontent.com/d/1E-rO6-UbYn2eTmRk2nb_Aab96eTuCI7d', caption: 'Dressed up and glowing, but all I could see was you. Our special foundation day. 🎊✨' },
              { src: 'https://lh3.googleusercontent.com/d/1FuLhoyrrajneXdJy-_HGJghj-pDeCbBs', caption: 'Spices of Old Delhi and the sweetness of your company. The perfect dinner. 🍛🤤' },
              { src: 'https://lh3.googleusercontent.com/d/1nfZuclOWGCNzRkThGku3fGp0dgNfO86j', caption: 'I could get lost in your eyes forever 💖' },
              { src: 'https://lh3.googleusercontent.com/d/1_cCAEeP_FTOvMCbFIqNS4TPQVcUE7Mi_', caption: 'Time stops when I\'m with you 🕰️' },
              { src: 'https://lh3.googleusercontent.com/d/1L8q5sPnpIVqtaDb0uawlAdfS3UP1RMQx', caption: 'Your smile is the most beautiful thing I\'ve ever seen 😍' },
              { src: 'https://lh3.googleusercontent.com/d/1cHE58aihjcJhi3OM0pHzotm3GT12TOfU', caption: 'My favorite place in the world is right by your side 👫' },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[3/4] mb-4 group w-full">
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                </div>
                <div className="flex items-center gap-2 px-2">
                  <Heart size={16} className="text-pink-400 shrink-0" fill="currentColor" />
                  <p className="text-pink-800 font-serif italic text-center text-lg md:text-xl leading-relaxed">
                    {img.caption}
                  </p>
                  <Heart size={16} className="text-pink-400 shrink-0" fill="currentColor" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Our Videos */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12 justify-center">
          <Video className="text-pink-500" />
          <h2 className="text-4xl font-serif text-pink-800">Our Moments in Motion</h2>
        </div>
        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl glass p-2">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-black relative">
            <iframe
              src="https://drive.google.com/file/d/1Hxd9KSezIg-6KRZEBJVcM8puK-3dMsJP/preview"
              className="w-full h-full border-none"
              allow="autoplay; fullscreen"
              title="Kajra RE date in purani dilli"
            ></iframe>
          </div>
        </div>
        <p className="text-center mt-6 text-pink-700 font-serif italic text-xl">
          Kajra RE date in purani dilli ❤️✨
        </p>
      </section>

      {/* Section 4: Reasons I Love You */}
      <section className="py-24 bg-white/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-16 text-pink-800">Reasons I Love You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "The way your eyes light up when you laugh.",
              "How you make the simplest moments feel magical.",
              "Your kindness that touches everyone around you.",
              "The way you always know how to make me smile.",
              "Your strength and your beautiful soul.",
              "Because you are simply you, and that's enough."
            ].map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-2xl flex items-start gap-4"
              >
                <div className="bg-pink-100 p-2 rounded-full text-pink-500">
                  <Heart size={20} fill="currentColor" />
                </div>
                <p className="text-lg text-gray-700 font-serif italic">{reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Birthday Message */}
      <section className="py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Calendar className="mx-auto mb-6 text-pink-500" size={48} />
          <h2 className="text-4xl font-serif mb-8 text-pink-800 italic">Happy Birthday, My Love</h2>
          <p className="text-xl text-gray-600 leading-relaxed font-serif italic mb-12">
            "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
          </p>
          <div className="inline-block glass px-8 py-4 rounded-full text-pink-600 font-bold tracking-widest uppercase">
            April 4th, 2026
          </div>
        </motion.div>
      </section>

      {/* Final Section */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-200/50 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="z-10 text-center"
        >
          <h2 className="text-6xl md:text-8xl font-cursive text-pink-600 mb-12 text-glow">
            I Love You Shaista ❤️
          </h2>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowLoveModal(true);
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#ff69b4', '#ff1493', '#ffffff']
              });
            }}
            className="bg-pink-600 text-white px-12 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-pink-700 transition-colors"
          >
            Forever Yours
          </motion.button>
        </motion.div>

        {/* Love Note Modal */}
        <AnimatePresence>
          {showLoveModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLoveModal(false)}
                className="absolute inset-0 bg-pink-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="relative glass p-8 md:p-12 rounded-3xl border-2 border-pink-300 shadow-2xl max-w-lg w-full text-center"
              >
                <button 
                  onClick={handleCloseAndRedirect}
                  className="absolute top-4 right-4 text-pink-500 hover:text-pink-700 transition-colors"
                >
                  <X size={24} />
                </button>
                <Heart className="mx-auto mb-6 text-pink-500 animate-pulse" size={48} fill="currentColor" />
                <p className="text-pink-800 font-serif italic text-2xl md:text-3xl leading-relaxed mb-6">
                  "I'm already yours betuuu! ❤️"
                </p>
                <p className="text-pink-600 font-serif italic text-lg md:text-xl leading-relaxed">
                  You don't even need to tap a button to get me... I'm yours forever and always! ✨
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseAndRedirect}
                  className="mt-8 bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg"
                >
                  Close ❤️
                </motion.button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      <footer className="py-8 text-center text-pink-300 font-serif italic">
        Made with all my love for Shaista
      </footer>
    </div>
  );
};

const WikipediaDecoy = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#3399ff] selection:text-white">
      {/* Wikipedia Header */}
      <div className="border-b border-[#a2a9b1] px-4 py-2 flex items-center justify-between bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png" 
            alt="Wikipedia" 
            className="h-10"
          />
          <div className="hidden md:block">
            <div className="text-xs text-gray-500">The Free Encyclopedia</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#0645ad]">
          <span>Not logged in</span>
          <span>Talk</span>
          <span>Contributions</span>
          <span>Create account</span>
          <span>Log in</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-40 pt-8 pr-4 text-xs text-[#0645ad] space-y-4">
          <div className="space-y-1">
            <div className="text-gray-500 font-bold border-b border-gray-200 pb-1 mb-2">Main menu</div>
            <div>Main page</div>
            <div>Contents</div>
            <div>Current events</div>
            <div>Random article</div>
            <div>About Wikipedia</div>
            <div>Contact us</div>
            <div>Donate</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500 font-bold border-b border-gray-200 pb-1 mb-2">Contribute</div>
            <div>Help</div>
            <div>Learn to edit</div>
            <div>Community portal</div>
            <div>Recent changes</div>
            <div>Upload file</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white p-4 md:p-8 border-l border-[#a2a9b1]">
          <h1 className="text-3xl font-serif border-b border-[#a2a9b1] pb-1 mb-4">
            Graduate Aptitude Test in Engineering
          </h1>
          <div className="text-sm text-gray-600 mb-6 italic">From Wikipedia, the free encyclopedia</div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4 text-[14px] leading-[1.6]">
              <p>
                The <b>Graduate Aptitude Test in Engineering</b> (<b>GATE</b>) is an entrance examination conducted in India that primarily tests the comprehensive understanding of various undergraduate subjects in engineering and science for admission into the Masters Program and Job in Public Sector Companies.
              </p>
              <p>
                GATE is conducted jointly by the Indian Institute of Science and seven Indian Institutes of Technology at Roorkee, Delhi, Guwahati, Kanpur, Kharagpur, Chennai (Madras) and Mumbai (Bombay) on behalf of the National Coordination Board – GATE, Department of Higher Education, Ministry of Education (MoE), Government of India.
              </p>
              
              <div className="bg-[#f8f9fa] border border-[#a2a9b1] p-4 w-fit min-w-[200px]">
                <div className="font-bold text-center mb-2">Contents</div>
                <ul className="text-[#0645ad] space-y-1">
                  <li>1 Eligibility</li>
                  <li>2 Disciplines</li>
                  <li>3 Examination pattern</li>
                  <li>4 Qualifying score</li>
                  <li>5 Statistics</li>
                </ul>
              </div>

              <h2 className="text-2xl font-serif border-b border-[#a2a9b1] pb-1 mt-8 mb-4">Eligibility</h2>
              <p>
                The following students are eligible to take GATE:
              </p>
              <ul className="list-disc ml-8 space-y-2">
                <li>Bachelor's degree holders in Engineering / Technology / Architecture (3 years after 10+2 or 3 years after B.Sc. / Diploma in Engineering / Technology) and those who are in the final year of such programs.</li>
                <li>Bachelor's degree holders of Four-year program in Agricultural / Horticulture / Forestry.</li>
                <li>Master's degree holders in any branch of Science / Mathematics / Statistics / Computer Applications or equivalent and those who are in the final year of such programs.</li>
              </ul>
            </div>

            {/* Infobox */}
            <div className="w-full md:w-[300px] shrink-0">
              <div className="border border-[#a2a9b1] bg-[#f8f9fa] p-2 text-xs">
                <div className="font-bold text-center text-sm mb-2 bg-[#cedff2] py-1">GATE</div>
                <div className="text-center mb-4">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/GATE_Logo.png/220px-GATE_Logo.png" 
                    alt="GATE Logo" 
                    className="mx-auto"
                  />
                </div>
                <table className="w-full">
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <th className="text-left py-1 pr-2 w-1/3">Acronym</th>
                      <td className="py-1">GATE</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <th className="text-left py-1 pr-2">Type</th>
                      <td className="py-1">Computer-based standardized test</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <th className="text-left py-1 pr-2">Developer</th>
                      <td className="py-1">IISc and seven IITs</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <th className="text-left py-1 pr-2">Purpose</th>
                      <td className="py-1">Post-graduate admissions, PSU recruitment</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <th className="text-left py-1 pr-2">Frequency</th>
                      <td className="py-1">Annual (February)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showDecoy, setShowDecoy] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDecoy(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showDecoy ? (
          <motion.div
            key="decoy"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <WikipediaDecoy />
          </motion.div>
        ) : !isUnlocked ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full"
          >
            <Countdown onComplete={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="w-full"
          >
            <MainContent />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
