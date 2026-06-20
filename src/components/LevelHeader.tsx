import { useGameStore, type GameMode } from '@/store/useGameStore';
import { Check, ChevronLeft, ChevronRight, Clock, Zap } from 'lucide-react';

export default function LevelHeader() {
  const {
    levels,
    currentLevelId,
    passedLevels,
    setCurrentLevelId,
    gameMode,
    setGameMode,
    getBestTime,
    getLevelTimeLimit,
  } = useGameStore();
  const currentLevel = levels.find((l) => l.id === currentLevelId);
  const totalLevels = levels.length;
  const currentIndex = levels.findIndex((l) => l.id === currentLevelId);

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentLevelId(levels[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentIndex < levels.length - 1 && passedLevels.includes(currentLevelId)) {
      setCurrentLevelId(levels[currentIndex + 1].id);
    }
  };

  const handleModeChange = (mode: GameMode) => {
    if (mode !== gameMode) {
      setGameMode(mode);
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 rounded-3xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium opacity-90">游戏模式:</span>
          <div className="flex bg-white/20 rounded-full p-1">
            <button
              onClick={() => handleModeChange('normal')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                gameMode === 'normal'
                  ? 'bg-white text-sky-600 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Clock size={16} />
              普通模式
            </button>
            <button
              onClick={() => handleModeChange('timed')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                gameMode === 'timed'
                  ? 'bg-white text-orange-500 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Zap size={16} />
              限时挑战
            </button>
          </div>
        </div>
        {gameMode === 'timed' && (
          <div className="text-sm bg-orange-500/80 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
            <Zap size={14} />
            第{currentIndex + 1}关限时 {getLevelTimeLimit(currentLevelId)} 秒
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="text-center flex-1 px-4">
          <div className="text-sm opacity-90 mb-1">
            第 {currentIndex + 1} / {totalLevels} 关
          </div>
          <h1 className="text-3xl font-bold tracking-wide flex items-center justify-center gap-2">
            {currentLevel?.name || '加载中...'}
            {passedLevels.includes(currentLevelId) && (
              <span className="bg-green-500 text-white rounded-full p-1">
                <Check size={16} />
              </span>
            )}
          </h1>
          <p className="text-sm mt-1 opacity-90">{currentLevel?.description}</p>
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === totalLevels - 1 || !passedLevels.includes(currentLevelId)}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {levels.map((level, idx) => {
          const bestTime = getBestTime(level.id);
          return (
            <div key={level.id} className="flex flex-col items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  level.id === currentLevelId
                    ? 'bg-white scale-125'
                    : passedLevels.includes(level.id)
                      ? 'bg-green-300'
                      : 'bg-white/40'
                }`}
              />
              {gameMode === 'timed' && bestTime !== null && (
                <span className="text-[10px] text-white/90 font-mono bg-white/20 px-1.5 py-0.5 rounded">
                  {bestTime}s
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
