import { useGameStore } from '@/store/useGameStore';
import IngredientCard from './IngredientCard';

export default function IngredientShelf() {
  const { ingredients } = useGameStore();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-emerald-100">
      <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span className="text-2xl">🧊</span>
        原料素材区
        <span className="text-xs font-normal text-slate-400 ml-2">
          拖拽或点击原料添加到操作台
        </span>
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {ingredients.map((ingredient) => (
          <IngredientCard key={ingredient.id} ingredient={ingredient} />
        ))}
      </div>
    </div>
  );
}
