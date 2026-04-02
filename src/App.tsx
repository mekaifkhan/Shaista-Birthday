/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import ReactPlayer from 'react-player';
import { Heart, Music, Pause, Play, Volume2, Calendar, Camera, Video, MessageCircleHeart, Sparkles } from 'lucide-react';

// --- Constants ---
const TARGET_DATE = new Date('2026-04-03T00:56:00').getTime();
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=lUPltG1hb3k';

// --- Components ---

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
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isReady, setIsReady] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const difference = TARGET_DATE - now;

    if (difference <= 0) {
      setIsReady(true);
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, []);

  useEffect(() => {
    // Initial check
    const initialTime = calculateTimeLeft();
    if (initialTime) {
      setTimeLeft(initialTime);
    }

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      if (newTime) {
        setTimeLeft(newTime);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-black to-black z-0" />
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {isReady ? (
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
        ) : (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="z-10 text-center px-4"
          >
            <h2 className="text-2xl md:text-3xl font-serif italic mb-8 text-pink-200">
              Something special is coming for you ❤️
            </h2>
            
            <div className="flex gap-4 md:gap-8 justify-center">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 glass rounded-2xl flex items-center justify-center text-3xl md:text-5xl font-bold text-pink-300 mb-2">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <span className="text-xs md:text-sm uppercase tracking-widest text-pink-400/60">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MainContent = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const Player = ReactPlayer as any;

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
      
      {/* Music Player (Hidden Video) */}
      <div className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none overflow-hidden">
        <Player
          url={YOUTUBE_URL}
          playing={isPlaying}
          loop
          volume={0.3}
          width="100%"
          height="100%"
          controls={false}
        />
      </div>

      {/* Floating Music Toggle */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-pink-500 text-white shadow-lg hover:scale-110 transition-transform active:scale-95"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="z-10"
        >
          <h1 className="text-6xl md:text-8xl font-cursive text-pink-600 mb-4 text-glow">
            Happy Birthday Shaista ❤️
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-pink-400">
            A little surprise made with love just for you
          </p>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 text-pink-300"
        >
          <Sparkles size={32} />
        </motion.div>
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
              { src: 'https://lh3.googleusercontent.com/d/1csV8AFM4vUwhTRMrOTCc3XUTLjKJYPfM', caption: 'The start of our beautiful journey together ✨' },
              { src: 'https://lh3.googleusercontent.com/d/1szy7wkVUlg_L0MtODUB11GmThuDCrNcd', caption: 'Every memory with you is my favorite memory ❤️' },
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
          <div className="w-full h-full rounded-2xl overflow-hidden bg-pink-100 flex items-center justify-center">
            {/* Placeholder for actual video if available, otherwise a romantic placeholder */}
            <div className="text-center p-8">
              <Heart className="mx-auto mb-4 text-pink-400 animate-pulse" size={64} />
              <p className="text-pink-600 font-serif italic text-xl">Our story continues here...</p>
              <p className="text-pink-400 text-sm mt-2">(Replace with your actual video link)</p>
            </div>
          </div>
        </div>
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
            April 3rd, 2026
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
            className="bg-pink-600 text-white px-12 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-pink-700 transition-colors"
          >
            Forever Yours
          </motion.button>
        </motion.div>
      </section>

      <footer className="py-8 text-center text-pink-300 font-serif italic">
        Made with all my love for Shaista
      </footer>
    </div>
  );
};

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  return (
    <main className="w-full min-h-screen">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <Countdown onComplete={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <MainContent />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
