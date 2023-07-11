import { create } from 'zustand';

export const GuestRouteList = [
  {
    title: 'About us',
    link: '/about',
  },
  {
    title: 'Notaries',
    link: '/notaries',
  },
];

export const UserRouteList = [];

export const NotaryRouteList = [];

export interface RouteState {
  items: typeof GuestRouteList | typeof UserRouteList | typeof NotaryRouteList;
  setItems: (type: 'guest' | 'user' | 'notary') => void;
}

export const useRouteStore = create<RouteState>()((set) => ({
  items: GuestRouteList,
  setItems: (type) =>
    set((state) => {
      let items = GuestRouteList;
      switch (type) {
        case 'user':
          items = UserRouteList;
          break;
        case 'notary':
          items = NotaryRouteList;
          break;
      }

      return {
        ...state,
        items,
      };
    }),
}));
