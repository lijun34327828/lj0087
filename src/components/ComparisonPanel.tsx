import { useGameStore } from '@/store/useGameStore';
import { Check, X, AlertTriangle, Minus } from 'lucide-react';

export default function ComparisonPanel() {
  const { comparison, ingredients } = useGameStore();

  const getIngredient = (id: string) => ingredients.find((i) => i.id === id);

  if (comparison.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-violet-100">
        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          配比差异对比
        </h3>
        <div className="text-center text-slate-400 py-8">
          <div className="text-4xl mb-2 opacity-50">⚖️</div>
          <div className="font-medium">提交配比后查看对比结果</div>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'correct':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          icon: <Check size={16} className="text-green-500" />,
          label: '正确',
        };
      case 'missing':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: <AlertTriangle size={16} className="text-amber-500" />,
          label: '缺失',
        };
      case 'extra':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-700',
          icon: <X size={16} className="text-rose-500" />,
          label: '多余',
        };
      case 'incorrect':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-700',
          icon: <AlertTriangle size={16} className="text-orange-500" />,
          label: '偏差',
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-700',
          icon: <Minus size={16} />,
          label: '',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-violet-100">
      <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        配比差异对比
      </h3>

      <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 px-3 pb-2 border-b border-slate-100">
        <div className="col-span-4">原料</div>
        <div className="col-span-2 text-center">标准</div>
        <div className="col-span-2 text-center">当前</div>
        <div className="col-span-2 text-center">差值</div>
        <div className="col-span-2 text-center">状态</div>
      </div>

      <div className="space-y-2 mt-3">
        {comparison.map((item) => {
          const ing = getIngredient(item.ingredientId);
          const config = getStatusConfig(item.status);
          return (
            <div
              key={item.ingredientId}
              className={`grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-xl border ${config.bg} ${config.border}`}
            >
              <div className="col-span-4 flex items-center gap-2">
                <span className="text-xl">{ing?.icon}</span>
                <span className={`font-medium text-sm ${config.text}`}>
                  {ing?.name}
                </span>
              </div>
              <div className="col-span-2 text-center font-mono text-sm text-slate-600">
                {item.expected !== null ? `${item.expected}g` : '-'}
              </div>
              <div className="col-span-2 text-center font-mono text-sm text-slate-600">
                {item.actual !== null ? `${item.actual}g` : '-'}
              </div>
              <div className="col-span-2 text-center font-mono text-sm">
                {item.diff !== undefined ? (
                  <span className={item.diff > 0 ? 'text-rose-600' : item.diff < 0 ? 'text-amber-600' : 'text-green-600'}>
                    {item.diff > 0 ? `+${item.diff}` : item.diff}g
                  </span>
                ) : (
                  '-'
                )}
              </div>
              <div className="col-span-2 flex items-center justify-center gap-1">
                {config.icon}
                <span className={`text-xs font-semibold ${config.text}`}>
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
