import { useEffect } from 'react';
import { Undo2, Trash2, CheckCircle2, Timer } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import WorkbenchItem from './WorkbenchItem';
import { validateSubmission, submitTimedRecord } from '@/services/api';

export default function Workbench() {
  const {
    ingredients,
    workbenchItems,
    currentLevelId,
    history,
    undo,
    clearWorkbench,
    addIngredient,
    setComparison,
    setLastValidationErrors,
    setShowErrorModal,
    setShowSuccessModal,
    markLevelPassed,
    setIsLoading,
    isLoading,
    gameMode,
    timeLeft,
    isTimerRunning,
    decrementTime,
    startTimer,
    stopTimer,
    resetTimer,
    getElapsedTime,
    updateTimedRecord,
  } = useGameStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (gameMode === 'timed' && isTimerRunning) {
      interval = setInterval(() => {
        decrementTime();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameMode, isTimerRunning, decrementTime]);

  useEffect(() => {
    if (gameMode === 'timed') {
      resetTimer();
    }
  }, [currentLevelId, gameMode, resetTimer]);

  const getIngredient = (id: string) => ingredients.find((i) => i.id === id);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const ingredientId = e.dataTransfer.getData('ingredientId');
    if (ingredientId) {
      if (gameMode === 'timed' && !isTimerRunning) {
        startTimer();
      }
      addIngredient(ingredientId);
    }
  };

  const handleSubmit = async () => {
    if (workbenchItems.length === 0) return;
    setIsLoading(true);
    try {
      const result = await validateSubmission({
        levelId: currentLevelId,
        items: workbenchItems.map((i) => ({
          ingredientId: i.ingredientId,
          amount: i.amount,
        })),
      });
      setComparison(result.comparison);
      setLastValidationErrors(result.errors);
      if (result.success) {
        if (gameMode === 'timed') {
          stopTimer();
          const elapsed = getElapsedTime();
          try {
            await submitTimedRecord(currentLevelId, elapsed);
            updateTimedRecord(currentLevelId, elapsed);
          } catch (err) {
            console.error('提交限时记录失败:', err);
          }
        }
        markLevelPassed(currentLevelId);
        setShowSuccessModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = workbenchItems.length > 0 && !isLoading;

  const isLast10Seconds = gameMode === 'timed' && timeLeft <= 10 && timeLeft > 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-white to-sky-50 rounded-3xl p-6 shadow-xl border-2 border-sky-200">
      {gameMode === 'timed' && (
        <div className="mb-4 text-center">
          <div
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold ${
              isLast10Seconds
                ? 'bg-red-100 text-red-600 animate-pulse'
                : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600'
            }`}
          >
            <Timer size={32} className={isLast10Seconds ? 'animate-bounce' : ''} />
            <span className="text-5xl font-mono tracking-wider">
              {formatTime(timeLeft)}
            </span>
          </div>
          {!isTimerRunning && timeLeft > 0 && (
            <p className="text-sm text-slate-500 mt-2">添加原料后开始计时</p>
          )}
        </div>
      )}

      <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span className="text-2xl">🥤</span>
        调配操作台
        <span className="text-xs font-normal text-slate-400 ml-2">
          将原料拖入此处，调整克数
        </span>
      </h3>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`min-h-[200px] rounded-2xl border-2 border-dashed p-4 mb-5 transition-all ${
          workbenchItems.length === 0
            ? 'border-sky-300 bg-sky-50/50 flex items-center justify-center'
            : 'border-transparent bg-white/60'
        }`}
      >
        {workbenchItems.length === 0 ? (
          <div className="text-center text-slate-400">
            <div className="text-5xl mb-2 opacity-50">🫗</div>
            <div className="font-medium">拖拽原料到这里</div>
            <div className="text-xs mt-1">或点击左侧原料卡片添加</div>
          </div>
        ) : (
          <div className="space-y-3">
            {workbenchItems.map((item) => {
              const ing = getIngredient(item.ingredientId);
              if (!ing) return null;
              return (
                <WorkbenchItem
                  key={item.ingredientId}
                  ingredient={ing}
                  amount={item.amount}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={undo}
          disabled={history.length === 0}
          className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <Undo2 size={18} />
          撤销
        </button>

        <button
          onClick={clearWorkbench}
          disabled={workbenchItems.length === 0}
          className="px-5 py-2.5 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <Trash2 size={18} />
          清空
        </button>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-8 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <CheckCircle2 size={18} />
          {isLoading ? '校验中...' : '提交配比校验'}
        </button>
      </div>
    </div>
  );
}
