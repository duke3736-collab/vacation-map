import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Category, Place, places, GradeGroup, SubjectType } from "@/data/places";

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
  myLocation: { lat: number; lng: number } | null;
  setMyLocation: (myLocation: { lat: number; lng: number } | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  gradeFilter: GradeGroup | null;
  setGradeFilter: (grade: GradeGroup | null) => void;
  subjectFilter: SubjectType | null;
  setSubjectFilter: (subject: SubjectType | null) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

const computeFilteredPlaces = (
  query: string,
  categories: Category[],
  grade: GradeGroup | null,
  subject: SubjectType | null,
  tag: string | null
) => {
  return places.filter((p) => {
    const matchCat = categories.length === 0 || categories.includes(p.category);
    const matchQuery = !query || p.name.includes(query) || p.address.includes(query);
    const matchGrade = !grade || (p.targetGrades && p.targetGrades.includes(grade));
    const matchSubject = !subject || (p.curriculumLinks && p.curriculumLinks.some(link => link.subject === subject));
    const matchTag = !tag || (p.tags && p.tags.includes(tag));
    return matchCat && matchQuery && matchGrade && matchSubject && matchTag;
  });
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      center: { lat: 37.0542, lng: 127.1022 },
      level: 12,
      setCenter: (center) => set({ center }),
      setLevel: (level) => set({ level }),
      myLocation: null,
      setMyLocation: (myLocation) => set({ myLocation }),
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
      searchQuery: "",
      gradeFilter: null,
      subjectFilter: null,
      showFilters: false,
      selectedTag: null,
      setShowFilters: (show) => set({ showFilters: show }),
      setSelectedTag: (tag) => set((state) => {
        if (tag === "궁투어") {
          return {
            selectedTag: tag,
            activeCategories: [],
            gradeFilter: null,
            subjectFilter: null,
            center: { lat: 37.5796, lng: 126.9770 },
            level: 7,
            filteredPlaces: computeFilteredPlaces(state.searchQuery, [], null, null, tag)
          };
        }
        return {
          selectedTag: tag,
          filteredPlaces: computeFilteredPlaces(state.searchQuery, state.activeCategories, state.gradeFilter, state.subjectFilter, tag)
        };
      }),
      setGradeFilter: (grade) => set((state) => ({
        gradeFilter: grade,
        activeCategories: [], // Reset category filter
        selectedTag: null,
        filteredPlaces: computeFilteredPlaces(state.searchQuery, [], grade, state.subjectFilter, null)
      })),
      setSubjectFilter: (subject) => set((state) => ({
        subjectFilter: subject,
        activeCategories: [], // Reset category filter
        selectedTag: null,
        filteredPlaces: computeFilteredPlaces(state.searchQuery, [], state.gradeFilter, subject, null)
      })),
      setSearchQuery: (query) => set((state) => ({
        searchQuery: query, 
        filteredPlaces: computeFilteredPlaces(query, state.activeCategories, state.gradeFilter, state.subjectFilter, state.selectedTag)
      })),
      setActiveCategory: (category) => set((state) => {
        const newCategories = category ? [category] : [];
        const extraState = category === "궁투어" ? {
          center: { lat: 37.5796, lng: 126.9770 },
          level: 7
        } : {};
        return {
          activeCategories: newCategories,
          gradeFilter: null, // Reset grade filter
          subjectFilter: null, // Reset subject filter
          selectedTag: null,
          filteredPlaces: computeFilteredPlaces(state.searchQuery, newCategories, null, null, null),
          ...extraState
        };
      }),
      toggleCategory: (category) =>
        set((state) => {
          const isActive = state.activeCategories.includes(category);
          const newCategories = isActive
            ? state.activeCategories.filter((c) => c !== category)
            : [...state.activeCategories, category];
          
          const extraState = !isActive && category === "궁투어" ? {
            center: { lat: 37.5796, lng: 126.9770 },
            level: 7
          } : {};

          return {
            activeCategories: newCategories,
            gradeFilter: null, // Reset grade filter
            subjectFilter: null, // Reset subject filter
            selectedTag: null,
            filteredPlaces: computeFilteredPlaces(state.searchQuery, newCategories, null, null, null),
            ...extraState
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
