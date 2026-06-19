import { X, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

interface Props {
  type: 'error' | 'success';
}

export default function Modal({ type }: Props) {
  const {
    lastValidationErrors,
    showErrorModal,
    showSuccessModal,
    setShowErrorModal,
    setShowSuccessModal,
    levels,
    currentLevelId,
    setCurrentLevelId,
  } = useGameStore();

  const isOpen = type === 'error' ? showErrorModal : showSuccessModal;
  const onClose =
    type === 'error'
      ? () => setShowErrorModal(false)
      : () => setShowSuccessModal(false);

  if (!isOpen) return null;

  const currentIndex = levels.findIndex((l) => l.id === currentLevelId);
  const hasNextLevel = currentIndex < levels.length - 1;

  const goToNextLevel = () => {
    if (hasNextLevel) {
      setCurrentLevelId(levels[currentIndex + 1].id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform animate-[popIn_0.3s_ease-out] ${
          type === 'error' ? 'border-4 border-rose-200' : 'border-4 border-emerald-200'
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
                : 'bg-emerald-100 text-emerald-500'
            }`}
          >
            {type === 'error' ? (
              <AlertCircle size={48} />
            ) : (
              <CheckCircle2 size={48} />
            )}
          </div>
          <h2
            className={`text-2xl font-bold ${
              type === 'error' ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {type === 'error' ? '配比不符合要求' : '🎉 通关成功！'}
          </h2>
          <p className="text-slate-500 mt-1">
            {type === 'error'
              ? '请根据以下提示调整你的配比'
              : '完美！你已精准还原这款冷饮配方'}
          </p>
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

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-full font-semibold transition-all active:scale-95 ${
              type === 'error'
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {type === 'error' ? '继续调整' : '留在本关'}
          </button>
          {type === 'success' && hasNextLevel && (
            <button
              onClick={goToNextLevel}
              className="flex-1 py-3 rounded-full font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              下一关
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
