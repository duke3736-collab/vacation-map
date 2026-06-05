import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Category, Place, places } from "@/data/places";

interface MapState {
  activeCategories: Category[];
  toggleCategory: (category: Category) => void;
  filteredPlaces: Place[];
  selectedPlaceForReport: Place | null;
  setPlaceForReport: (place: Place | null) => void;
  savedPlaceIds: string[];
  toggleSavePlace: (id: string) => void;
  setActiveCategory: (category: Category | null) => void;
  focusedPlaceId: string | null;
  setFocusedPlaceId: (id: string | null) => void;
  schedules: Record<number, string[]>;
  addPlaceToSchedule: (day: number, placeId: string) => void;
  removePlaceFromSchedule: (day: number, placeId: string) => void;
  movePlaceInSchedule: (day: number, oldIndex: number, newIndex: number) => void;
  draftReports: Record<string, string>;
  setDraftReport: (placeId: string, content: string) => void;
  center: { lat: number; lng: number };
  level: number;
  setCenter: (center: { lat: number; lng: number }) => void;
  setLevel: (level: number) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      center: { lat: 37.0542, lng: 127.1022 },
      level: 12,
      setCenter: (center) => set({ center }),
      setLevel: (level) => set({ level }),
      activeCategories: [],
      filteredPlaces: places,
      selectedPlaceForReport: null,
      savedPlaceIds: [],
      focusedPlaceId: null,
      schedules: { 1: [], 2: [], 3: [] },
      addPlaceToSchedule: (day, placeId) => set((state) => {
        const daySchedule = state.schedules[day] || [];
        if (daySchedule.includes(placeId)) return state;
        return { schedules: { ...state.schedules, [day]: [...daySchedule, placeId] } };
      }),
      removePlaceFromSchedule: (day, placeId) => set((state) => {
        const daySchedule = state.schedules[day] || [];
        return { schedules: { ...state.schedules, [day]: daySchedule.filter(id => id !== placeId) } };
      }),
      movePlaceInSchedule: (day, oldIndex, newIndex) => set((state) => {
        const daySchedule = [...(state.schedules[day] || [])];
        if (oldIndex < 0 || oldIndex >= daySchedule.length || newIndex < 0 || newIndex >= daySchedule.length) return state;
        const [item] = daySchedule.splice(oldIndex, 1);
        daySchedule.splice(newIndex, 0, item);
        return { schedules: { ...state.schedules, [day]: daySchedule } };
      }),
      draftReports: {},
      setDraftReport: (placeId, content) => set((state) => ({
        draftReports: { ...state.draftReports, [placeId]: content }
      })),
      setFocusedPlaceId: (id) => set({ focusedPlaceId: id }),
      setPlaceForReport: (place) => set({ selectedPlaceForReport: place }),
      toggleSavePlace: (id) => set((state) => ({
        savedPlaceIds: state.savedPlaceIds.includes(id)
          ? state.savedPlaceIds.filter(savedId => savedId !== id)
          : [...state.savedPlaceIds, id]
      })),
      setActiveCategory: (category) => set(() => {
        const newCategories = category ? [category] : [];
        const newFilteredPlaces = newCategories.length === 0
          ? places
          : places.filter((p) => newCategories.includes(p.category));
        return {
          activeCategories: newCategories,
          filteredPlaces: newFilteredPlaces,
        };
      }),
      toggleCategory: (category) =>
        set((state) => {
          const isActive = state.activeCategories.includes(category);
          const newCategories = isActive
            ? state.activeCategories.filter((c) => c !== category)
            : [...state.activeCategories, category];
          
          const newFilteredPlaces = newCategories.length === 0
            ? places
            : places.filter((p) => newCategories.includes(p.category));

          return {
            activeCategories: newCategories,
            filteredPlaces: newFilteredPlaces,
          };
        }),
    }),
    {
      name: 'vacation-map-storage',
      partialize: (state) => ({ 
        savedPlaceIds: state.savedPlaceIds, 
        schedules: state.schedules,
        draftReports: state.draftReports
      }),
    }
  )
);
