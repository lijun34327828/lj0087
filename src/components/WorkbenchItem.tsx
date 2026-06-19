import { Minus, Plus, Trash2 } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import type { Ingredient } from '../../shared/types';

interface Props {
  ingredient: Ingredient;
  amount: number;
}

export default function WorkbenchItem({ ingredient, amount }: Props) {
  const { updateAmount, removeIngredient } = useGameStore();

  const handleDecrease = () => {
    if (amount > 5) {
      updateAmount(ingredient.id, amount - 5);
    } else if (amount > 0) {
      updateAmount(ingredient.id, 0);
    }
  };

  const handleIncrease = () => {
    updateAmount(ingredient.id, amount + 5);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      updateAmount(ingredient.id, val);
    }
  };

  const handleRemove = () => {
    removeIngredient(ingredient.id);
  };

  return (
    <div
      className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:shadow-md transition-all"
      style={{
        background: `linear-gradient(90deg, ${ingredient.color}44 0%, white 40%)`,
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl drop-shadow-sm">{ingredient.icon}</span>
        <div>
          <div className="font-semibold text-slate-700">{ingredient.name}</div>
          <div className="text-xs text-slate-400">单位：{ingredient.unit}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all active:scale-90"
        >
          <Minus size={16} />
        </button>

        <input
          type="number"
          value={amount}
          onChange={handleInputChange}
          className="w-16 text-center text-lg font-bold text-sky-600 bg-sky-50 rounded-lg py-1.5 border-2 border-sky-100 focus:border-sky-400 focus:outline-none"
          min={0}
          step={5}
        />

        <span className="text-slate-500 text-sm font-medium">克</span>

        <button
          onClick={handleIncrease}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all active:scale-90"
        >
          <Plus size={16} />
        </button>

        <button
          onClick={handleRemove}
          className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-500 transition-all active:scale-90 ml-1"
          title="移除原料"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
