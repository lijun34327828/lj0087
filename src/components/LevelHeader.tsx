import { useGameStore } from '@/store/useGameStore';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LevelHeader() {
  const { levels, currentLevelId, passedLevels, setCurrentLevelId } = useGameStore();
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

  return (
    <div className="bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 rounded-3xl p-6 shadow-xl text-white">
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
        {levels.map((level) => (
          <div
            key={level.id}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              level.id === currentLevelId
                ? 'bg-white scale-125'
                : passedLevels.includes(level.id)
                  ? 'bg-green-300'
                  : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
