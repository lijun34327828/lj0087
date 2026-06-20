import { X, AlertCircle, CheckCircle2, ArrowRight, Clock, RefreshCw } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

interface Props {
  type: 'error' | 'success' | 'timedFail';
}

export default function Modal({ type }: Props) {
  const {
    lastValidationErrors,
    comparison,
    showErrorModal,
    showSuccessModal,
    showTimedFailModal,
    setShowErrorModal,
    setShowSuccessModal,
    setShowTimedFailModal,
    levels,
    currentLevelId,
    setCurrentLevelId,
    setGameMode,
    resetTimer,
    clearWorkbench,
    ingredients,
    gameMode,
    getElapsedTime,
    getBestTime,
  } = useGameStore();

  const isOpen =
    type === 'error'
      ? showErrorModal
      : type === 'success'
        ? showSuccessModal
        : showTimedFailModal;

  const onClose =
    type === 'error'
      ? () => setShowErrorModal(false)
      : type === 'success'
        ? () => setShowSuccessModal(false)
        : () => setShowTimedFailModal(false);

  if (!isOpen) return null;

  const currentIndex = levels.findIndex((l) => l.id === currentLevelId);
  const hasNextLevel = currentIndex < levels.length - 1;

  const goToNextLevel = () => {
    if (hasNextLevel) {
      setCurrentLevelId(levels[currentIndex + 1].id);
      onClose();
    }
  };

  const handleRetryTimed = () => {
    clearWorkbench();
    resetTimer();
    onClose();
  };

  const handleSwitchToNormal = () => {
    setGameMode('normal');
    onClose();
  };

  const getIngredient = (id: string) => ingredients.find((i) => i.id === id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform animate-[popIn_0.3s_ease-out] relative ${
          type === 'error'
            ? 'border-4 border-rose-200'
            : type === 'success'
              ? 'border-4 border-emerald-200'
              : 'border-4 border-orange-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-5">
          <div
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              type === 'error'
                ? 'bg-rose-100 text-rose-500'
                : type === 'success'
                  ? 'bg-emerald-100 text-emerald-500'
                  : 'bg-orange-100 text-orange-500'
            }`}
          >
            {type === 'error' ? (
              <AlertCircle size={48} />
            ) : type === 'success' ? (
              <CheckCircle2 size={48} />
            ) : (
              <Clock size={48} />
            )}
          </div>
          <h2
            className={`text-2xl font-bold ${
              type === 'error'
                ? 'text-rose-600'
                : type === 'success'
                  ? 'text-emerald-600'
                  : 'text-orange-600'
            }`}
          >
            {type === 'error'
              ? '配比不符合要求'
              : type === 'success'
                ? '🎉 通关成功！'
                : '⏰ 挑战失败'}
          </h2>
          <p className="text-slate-500 mt-1">
            {type === 'error'
              ? '请根据以下提示调整你的配比'
              : type === 'success'
                ? '完美！你已精准还原这款冷饮配方'
                : '时间到了，来看看你的配比与标准的差距吧'}
          </p>
          {type === 'success' && gameMode === 'timed' && (
            <div className="mt-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl px-4 py-3 inline-block">
              <div className="text-sm text-orange-600 font-medium">⏱️ 本次用时</div>
              <div className="text-3xl font-bold text-orange-600 font-mono">
                {getElapsedTime()}秒
              </div>
              {getBestTime(currentLevelId) !== null && (
                <div className="text-xs text-orange-500 mt-1">
                  最快记录: {getBestTime(currentLevelId)}秒
                </div>
              )}
            </div>
          )}
        </div>

        {type === 'error' && lastValidationErrors.length > 0 && (
          <div className="bg-rose-50 rounded-2xl p-4 mb-5 max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {lastValidationErrors.map((err, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm text-rose-700 bg-white rounded-lg px-3 py-2 border border-rose-100"
                >
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'timedFail' && comparison.length > 0 && (
          <div className="bg-orange-50 rounded-2xl p-4 mb-5 max-h-64 overflow-y-auto">
            <h3 className="text-sm font-bold text-orange-700 mb-3">配比差异对比</h3>
            <div className="space-y-2">
              {comparison.map((item) => {
                const ing = getIngredient(item.ingredientId);
                const isCorrect = item.status === 'correct';
                return (
                  <div
                    key={item.ingredientId}
                    className={`flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border ${
                      isCorrect ? 'border-green-200' : 'border-orange-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{ing?.icon}</span>
                      <span className={isCorrect ? 'text-green-700' : 'text-orange-700'}>
                        {ing?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-slate-500">
                        标准: {item.expected !== null ? `${item.expected}g` : '-'}
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className={isCorrect ? 'text-green-600' : 'text-orange-600'}>
                        当前: {item.actual !== null ? `${item.actual}g` : '-'}
                      </span>
                      {item.diff !== undefined && (
                        <span
                          className={`font-bold ${
                            item.diff > 0 ? 'text-rose-500' : 'text-amber-500'
                          }`}
                        >
                          {item.diff > 0 ? `+${item.diff}` : item.diff}g
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {type === 'success' && (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
            >
              留在本关
            </button>
            {hasNextLevel && (
              <button
                onClick={goToNextLevel}
                className="flex-1 py-3 rounded-full font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
              >
                下一关
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}

        {type === 'error' && (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-all active:scale-95"
            >
              继续调整
            </button>
          </div>
        )}

        {type === 'timedFail' && (
          <div className="flex gap-3">
            <button
              onClick={handleRetryTimed}
              className="flex-1 py-3 rounded-full font-semibold bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RefreshCw size={18} />
              重新挑战本关
            </button>
            <button
              onClick={handleSwitchToNormal}
              className="flex-1 py-3 rounded-full font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              切回普通模式
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
