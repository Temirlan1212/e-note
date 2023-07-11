import { create } from 'zustand';

export interface ConfigState {}

export const useConfigStore = create<ConfigState>()((set) => ({}));
