export const VK_SEARCH_MODAL = 'VK_SEARCH_MODAL';
export const RESET_MODALS = 'RESET_MODALS';

export function openVkSearchModal() {
  return {
    type: VK_SEARCH_MODAL
  };
}

export function resetModals() {
  return {
    type: RESET_MODALS
  };
}
