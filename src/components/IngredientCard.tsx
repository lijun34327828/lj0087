import type { Ingredient } from '../../shared/types';
import { useGameStore } from '@/store/useGameStore';

interface Props {
  ingredient: Ingredient;
}

export default function IngredientCard({ ingredient }: Props) {
  const { addIngredient, workbenchItems } = useGameStore();
  const isAdded = workbenchItems.some((i) => i.ingredientId === ingredient.id);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('ingredientId', ingredient.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClick = () => {
    if (!isAdded) {
      addIngredient(ingredient.id);
    }
  };

  return (
    <div
      draggable={!isAdded}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`flex flex-col items-center p-3 rounded-2xl cursor-pointer transition-all duration-200 select-none min-w-[88px] ${
        isAdded
          ? 'bg-slate-100 opacity-50 cursor-not-allowed'
          : 'bg-white hover:shadow-lg hover:-translate-y-1 border-2 border-slate-100 hover:border-sky-300 active:scale-95'
      }`}
      style={{
        background: isAdded ? undefined : `linear-gradient(180deg, ${ingredient.color}33 0%, white 100%)`,
      }}
    >
      <span className="text-4xl mb-1.5 drop-shadow-sm">{ingredient.icon}</span>
      <span className="text-sm font-semibold text-slate-700">{ingredient.name}</span>
      <span className="text-xs text-slate-400">单位：{ingredient.unit}</span>
      {isAdded && <span className="text-xs text-slate-400 mt-1">已添加</span>}
    </div>
  );
}
