import { create } from 'zustand';

export const useStore = create((set) => ({
  // Auth state
  auth: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },

  // Services state
  services: {
    list: [],
    loading: false,
    error: null,
  },

  // Orders state
  orders: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },

  // UI state
  ui: {
    showNotification: false,
    notification: {
      type: 'success', // success, error, warning, info
      message: '',
    },
  },

  // Auth actions
  setUser: (user, token) =>
    set((state) => ({
      auth: {
        ...state.auth,
        user,
        token,
        isAuthenticated: !!token,
      },
    })),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set((state) => ({
      auth: {
        ...state.auth,
        user: null,
        token: null,
        isAuthenticated: false,
      },
    }));
  },

  setAuthLoading: (loading) =>
    set((state) => ({
      auth: { ...state.auth, loading },
    })),

  setAuthError: (error) =>
    set((state) => ({
      auth: { ...state.auth, error },
    })),

  // Services actions
  setServices: (list) =>
    set((state) => ({
      services: { ...state.services, list },
    })),

  setServicesLoading: (loading) =>
    set((state) => ({
      services: { ...state.services, loading },
    })),

  setServicesError: (error) =>
    set((state) => ({
      services: { ...state.services, error },
    })),

  // Orders actions
  setOrders: (list) =>
    set((state) => ({
      orders: { ...state.orders, list },
    })),

  setCurrentOrder: (order) =>
    set((state) => ({
      orders: { ...state.orders, current: order },
    })),

  setOrdersLoading: (loading) =>
    set((state) => ({
      orders: { ...state.orders, loading },
    })),

  setOrdersError: (error) =>
    set((state) => ({
      orders: { ...state.orders, error },
    })),

  // Notification actions
  showNotification: (type, message) =>
    set((state) => ({
      ui: {
        ...state.ui,
        showNotification: true,
        notification: { type, message },
      },
    })),

  hideNotification: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        showNotification: false,
      },
    })),
}));
