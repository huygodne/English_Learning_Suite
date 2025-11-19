/**
 * Z-Index Hierarchy for English Learning Suite
 * 
 * Standardized z-index values to prevent conflicts:
 * - Background layers: 0-9
 * - Content: 10-19
 * - Headers/Navigation: 20-29
 * - Dropdowns/Modals: 30-49
 * - Floating elements: 50-69
 * - Overlays/Backdrops: 70-89
 * - Popups/Notifications: 90-99
 * - Critical overlays: 100+
 */

export const Z_INDEX = {
  // Background layers
  BACKGROUND: 0,
  SCENIC_BACKGROUND: -1,
  
  // Content layers
  CONTENT: 10,
  CONTENT_ABOVE: 15,
  
  // Navigation
  HEADER: 30,
  NAVIGATION: 35,
  MOBILE_MENU: 40,
  
  // Dropdowns and modals
  DROPDOWN: 50,
  MODAL: 60,
  MODAL_BACKDROP: 55,
  
  // Floating elements
  FLOATING_CHATBOT: 70,
  FLOATING_BUTTON: 65,
  
  // Overlays
  OVERLAY: 80,
  DRAWER: 75,
  DRAWER_BACKDROP: 74,
  
  // Notifications and popups
  NOTIFICATION: 90,
  TOAST: 95,
  POPUP: 100,
  
  // Critical (highest priority)
  CRITICAL: 120,
} as const;

