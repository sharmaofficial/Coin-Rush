"use client"
import { useEffect, useState } from 'react';

export default function Home() {
  const [coins, setCoins] = useState(0);
  const [fallingCoins, setFallingCoins] = useState([]);
  const [clickPower, setClickPower] = useState(1);
  const [comboCount, setComboCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(null);
  const [multiplier, setMultiplier] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(false);
  const [speed, setSpeed] = useState('medium');
  const [density, setDensity] = useState('medium');

  let bgMusic = null;
  if (typeof window !== 'undefined') {
    bgMusic = new Audio('/sounds/loop.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
  }

  useEffect(() => {
    const saved = localStorage.getItem('highScore');
    if (saved) setHighScore(Number(saved));
  }, []);
  
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score);
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setGameStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // useEffect(() => {
  //   if (!gameStarted || gameOver) return;

  //   const spawner = setInterval(() => {
  //     const newCoin = {
  //       id: uuidv4(),
  //       left: Math.random() * 90,
  //       duration: getFallDuration(),
  //     };
  //     setCoins((prev) => [...prev, newCoin]);
  //   }, getSpawnInterval());

  //   return () => clearInterval(spawner);
  // }, [gameStarted, gameOver, density]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCoin = {
        id: Date.now(),
        left: Math.random() * 90 + '%',
        duration: getFallDuration(),
        missed: false 
      };
      setFallingCoins((prev) => [...prev, newCoin]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setComboCount(0);
      setMultiplier(1);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [lastClickTime]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setFallingCoins((prev) =>
        prev
          .map((coin) => {
            if (now - coin.id > 2500 && !coin.missed) {
              const coinEl = document.getElementById(`coin-${coin.id}`);
              const container = document.getElementById('drop-zone');
  
              if (coinEl && container) {
  
                setTimeout(() => {
                  document.getElementById(`miss-${coin.id}`)?.remove();
                }, 1000);
              }
  
              return { ...coin, missed: true };
            }
            return coin;
          })
          .filter((coin) => now - coin.id < 3000)
      );
    }, 500);
  
    return () => clearInterval(cleanupInterval);
  }, []);

  const handleCollect = (id) => {
    const now = Date.now();

    if (lastClickTime && now - lastClickTime < 1000) {
      setComboCount((prev) => prev + 1);
      setMultiplier((prev) => Math.min(prev + 0.1, 3));
    } else {
      setComboCount(1);
      setMultiplier(1);
    }

    setLastClickTime(now);

    // Play sound
    let audio = null;
    if (typeof window !== 'undefined') {
      audio = new Audio('/sounds/coin.mp3');
      audio.play();
    }

    const coinEl = document.getElementById(`coin-${id}`);
    const container = document.getElementById('drop-zone');

    if (coinEl && container) {
      const coinRect = coinEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const left = coinRect.left - containerRect.left + coinRect.width / 2;
      const top = coinRect.top - containerRect.top + coinRect.height / 2;

      const burst = document.createElement('img');
      burst.src = '/pop.png';
      burst.className = 'absolute w-12 h-12 animate-burst pointer-events-none';
      burst.style.left = `${left - 24}px`;
      burst.style.top = `${top - 24}px`;
      burst.style.zIndex = 20;
      burst.id = `burst-${id}`;

      container.appendChild(burst);

      setTimeout(() => {
        document.getElementById(`burst-${id}`)?.remove();
      }, 1000);
    }

    const earned = Math.floor(clickPower * multiplier);
    setCoins((prev) => prev + earned);
    setFallingCoins((prev) => prev.filter((c) => c.id !== id));
    setScore((prev) => prev + 1);
  };

  const getFallDuration = () => {
    switch (speed) {
      case 'easy': return 4000;
      case 'medium': return 3000;
      case 'hard': return 1800;
      default: return 3000;
    }
  };

  const getSpawnInterval = () => {
    switch (density) {
      case 'low': return 800;
      case 'medium': return 600;
      case 'high': return 200;
      default: return 600;
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setCoins([]);
  };
  

  if(!gameStarted && !gameOver){
    return(
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white z-50 animate-fade-in">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">💸 Catch the Coins!</h1>
        <p className="text-lg text-gray-300 px-2 max-w-md mt-5" style={{textAlign: 'center'}}>
          Test your reflexes. Click as many falling coins as you can in <strong>30 seconds</strong>!
        </p>
        <div className="flex flex-col items-center space-y-2 mb-5">
          <label className="text-sm text-gray-300">Select Speed:</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2"
          >
            <option value="easy">🐢 Easy</option>
            <option value="medium">🚶 Medium</option>
            <option value="hard">🚀 Hard</option>
          </select>
        </div>
        <div className="flex flex-col items-center space-y-2 mb-8">
            <label className="text-sm text-gray-300">Select Coin Density:</label>
            <select
              value={density}
              onChange={(e) => setDensity(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2"
            >
              <option value="low">🌙 Low</option>
              <option value="medium">⭐ Medium</option>
              <option value="high">🌟 High</option>
            </select>
          </div>
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full shadow-lg text-xl transform hover:scale-105 transition-all duration-300 animate-bounce"
          onClick={() => {
            bgMusic.play();
            setGameStarted(true);
            setTimeLeft(30);
            setScore(0);
            setFallingCoins([])
          }}
        >
          ▶️ Start Game
        </button>
      </div>
    )
  }

  if(gameOver){
    return(
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white text-center space-y-6 z-50 animate-fade-in">
      <h2 className="text-5xl font-extrabold drop-shadow-lg">⏱️ Time's Up!</h2>
      <p className="text-2xl">
        You collected <span className="text-yellow-400 font-bold">{score}</span> coins! 🪙
      </p>
      <p className="text-lg text-gray-300">🏆 High Score: {highScore}</p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-xl transition-all hover:scale-105 shadow-md"
        onClick={() => {
          setGameStarted(true);
          setGameOver(false);
          setTimeLeft(30);
          setScore(0);
        }}
      >
        🔁 Play Again
      </button>
      <button
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full text-xl transition-all hover:scale-105 shadow-md"
        onClick={resetGame}
      >
        🔙 Reset
      </button>
    </div>
    )
  }
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300 text-gray-800 px-4">
      <h1 className="text-3xl font-bold mb-2">💰 Coin Collector</h1>
        <div className="text-red-500 font-bold text-lg animate-ping-fast mb-2">
          {comboCount > 1 ? `🔥 Combo x${multiplier.toFixed(1)}!` : 'No Streak'}
        </div>
      {/* {comboCount > 1 && (
      )} */}
      <p className="text-xl mb-4">Coins: {coins}</p>
      <div className="absolute top-18 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-full shadow-lg text-xl font-bold z-50">
        ⏱️ {timeLeft}
        💰 Score: {score}
      </div>

      <div
        id="drop-zone"
        className="relative w-full max-w-md h-96 border-4 border-yellow-500 bg-white rounded-md overflow-hidden shadow-xl mb-6"
      >
        {fallingCoins.map((coin) => (
          <div
            key={coin.id}
            id={`coin-${coin.id}`}
            className={`absolute w-10 h-10 bg-yellow-400 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border border-yellow-600 ${
              coin.missed ? 'animate-miss pointer-events-none' : 'animate-fall'
            }`}
            style={{
              left: coin.left,
              top: '-2rem',
              opacity: coin.missed ? 0 : 1,
              animation: `fall ${coin.duration}ms linear`,
            }}
            onClick={() => handleCollect(coin.id)}
          />
        ))}
      </div>

      <p className="text-sm text-gray-600">Click coins to collect them! 🔥</p>

      <style jsx>{`
        @keyframes fall {
          0% {
            top: -2rem;
            opacity: 1;
          }
          100% {
            top: 22rem;
            opacity: 1;
          }
        }

        .animate-fall {
          animation: fall 3s linear forwards;
        }

        @keyframes burst {
          0% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(1.5) translateY(-40px);
            opacity: 0;
          }
        }

        .animate-burst {
          animation: burst 1s ease-out;
        }

        @keyframes ping-fast {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .animate-ping-fast {
          animation: ping-fast 0.5s ease-out;
        }
        @keyframes miss {
          0% {
            transform: scale(1);
            opacity: 1;
            top: 22rem;
          }
          100% {
            transform: scale(0.5);
            opacity: 0;
            top: 23rem;
          }
        }
        
        .animate-miss {
          animation: miss 0.4s ease-out forwards;
        }
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade {
          animation: fade 1s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes fadeOut {
          from { opacity: 1 }
          to { opacity: 0 }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-out {
          animation: fadeOut 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
