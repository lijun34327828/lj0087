import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { fetchLevels, fetchTimedRecords } from '@/services/api';
import LevelHeader from '@/components/LevelHeader';
import StandardRecipe from '@/components/StandardRecipe';
import IngredientShelf from '@/components/IngredientShelf';
import Workbench from '@/components/Workbench';
import ComparisonPanel from '@/components/ComparisonPanel';
import Modal from '@/components/Modal';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { setLevels, setIngredients, isLoading, setIsLoading, setTimedRecords } = useGameStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { levels, ingredients } = await fetchLevels();
        setLevels(levels);
        setIngredients(ingredients);
        try {
          const records = await fetchTimedRecords();
          setTimedRecords(records);
        } catch (err) {
          console.error('加载限时记录失败:', err);
        }
      } catch (err) {
        console.error('加载数据失败:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [setLevels, setIngredients, setIsLoading, setTimedRecords]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-cyan-50 to-teal-100">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">正在加载游戏数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-50 to-teal-100 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            🧋 夏日冷饮配比大师
          </h1>
          <p className="text-slate-500 mt-1">拖拽原料，精准配比，成为饮品调配达人！</p>
        </div>

        <LevelHeader />

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-3 space-y-5">
            <StandardRecipe />
          </div>

          <div className="col-span-6 space-y-5">
            <Workbench />
            <IngredientShelf />
          </div>

          <div className="col-span-3 space-y-5">
            <ComparisonPanel />
          </div>
        </div>
      </div>

      <Modal type="error" />
      <Modal type="success" />
      <Modal type="timedFail" />
    </div>
  );
}
