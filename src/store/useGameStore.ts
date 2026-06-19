import { create } from 'zustand';
import type {
  Ingredient,
  Level,
  ComparisonItem,
  ValidationError,
} from '../../shared/types';

export interface WorkbenchItem {
  ingredientId: string;
  amount: number;
}

interface HistoryState {
  items: WorkbenchItem[];
}

interface GameState {
  levels: Level[];
  ingredients: Ingredient[];
  currentLevelId: number;
  workbenchItems: WorkbenchItem[];
  history: HistoryState[];
  comparison: ComparisonItem[];
  lastValidationErrors: ValidationError[];
  showErrorModal: boolean;
  showSuccessModal: boolean;
  passedLevels: number[];
  isLoading: boolean;

  setLevels: (levels: Level[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
  setCurrentLevelId: (id: number) => void;
  addIngredient: (ingredientId: string) => void;
  updateAmount: (ingredientId: string, amount: number) => void;
  removeIngredient: (ingredientId: string) => void;
  undo: () => void;
  clearWorkbench: () => void;
  setComparison: (comparison: ComparisonItem[]) => void;
  setLastValidationErrors: (errors: ValidationError[]) => void;
  setShowErrorModal: (show: boolean) => void;
  setShowSuccessModal: (show: boolean) => void;
  markLevelPassed: (levelId: number) => void;
  setIsLoading: (loading: boolean) => void;
  getCurrentLevel: () => Level | undefined;
  saveHistory: () => void;
}

const DEFAULT_AMOUNT = 50;

export const useGameStore = create<GameState>((set, get) => ({
  levels: [],
  ingredients: [],
  currentLevelId: 1,
  workbenchItems: [],
  history: [],
  comparison: [],
  lastValidationErrors: [],
  showErrorModal: false,
  showSuccessModal: false,
  passedLevels: [],
  isLoading: false,

  setLevels: (levels) => set({ levels }),
  setIngredients: (ingredients) => set({ ingredients }),
  setCurrentLevelId: (id) =>
    set({
      currentLevelId: id,
      workbenchItems: [],
      history: [],
      comparison: [],
      lastValidationErrors: [],
    }),

  saveHistory: () => {
    const { workbenchItems, history } = get();
    set({ history: [...history, { items: JSON.parse(JSON.stringify(workbenchItems)) }] });
  },

  addIngredient: (ingredientId) => {
    const { workbenchItems } = get();
    const existing = workbenchItems.find((i) => i.ingredientId === ingredientId);
    if (existing) return;
    get().saveHistory();
    set({
      workbenchItems: [...workbenchItems, { ingredientId, amount: DEFAULT_AMOUNT }],
    });
  },

  updateAmount: (ingredientId, amount) => {
    const safeAmount = Math.max(0, Math.floor(amount));
    get().saveHistory();
    set((state) => ({
      workbenchItems: state.workbenchItems.map((item) =>
        item.ingredientId === ingredientId ? { ...item, amount: safeAmount } : item,
      ),
    }));
  },

  removeIngredient: (ingredientId) => {
    get().saveHistory();
    set((state) => ({
      workbenchItems: state.workbenchItems.filter(
        (item) => item.ingredientId !== ingredientId,
      ),
    }));
  },

  undo: () => {
    const { history } = get();
    if (history.length === 0) return;
    const newHistory = [...history];
    const prev = newHistory.pop()!;
    set({ workbenchItems: prev.items, history: newHistory });
  },

  clearWorkbench: () => {
    get().saveHistory();
    set({ workbenchItems: [] });
  },

  setComparison: (comparison) => set({ comparison }),
  setLastValidationErrors: (errors) => set({ lastValidationErrors: errors }),
  setShowErrorModal: (show) => set({ showErrorModal: show }),
  setShowSuccessModal: (show) => set({ showSuccessModal: show }),

  markLevelPassed: (levelId) => {
    set((state) => ({
      passedLevels: state.passedLevels.includes(levelId)
        ? state.passedLevels
        : [...state.passedLevels, levelId],
    }));
  },

  setIsLoading: (loading) => set({ isLoading: loading }),

  getCurrentLevel: () => {
    const { levels, currentLevelId } = get();
    return levels.find((l) => l.id === currentLevelId);
  },
}));
