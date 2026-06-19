import { useGameStore } from '@/store/useGameStore';

export default function StandardRecipe() {
  const { getCurrentLevel, ingredients } = useGameStore();
  const level = getCurrentLevel();

  if (!level) return null;

  const getIngredient = (id: string) => ingredients.find((i) => i.id === id);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-sky-100">
      <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span className="text-2xl">📋</span>
        标准配比
      </h3>
      <div className="space-y-2">
        {level.recipe.map((item) => {
          const ing = getIngredient(item.ingredientId);
          return (
            <div
              key={item.ingredientId}
              className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-sky-50 rounded-xl px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ing?.icon}</span>
                <span className="font-medium text-slate-700">{ing?.name}</span>
              </div>
              <span className="font-bold text-sky-600">{item.amount} 克</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
