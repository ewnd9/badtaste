export const VK_SEARCH_MODAL = 'VK_SEARCH_MODAL';
export const VK_LINKS_MODAL = 'VK_LINKS_MODAL';
export const VK_NEW_LINK_MODAL = 'VK_NEW_LINK_MODAL';

export const RESET_MODALS = 'RESET_MODALS';

export function openVkSearchModal() {
  return {
    type: VK_SEARCH_MODAL
  };
}

export function openVkLinksModal() {
  return {
    type: VK_LINKS_MODAL
  };
}

export function openVkNewLinkModal() {
  return {
    type: VK_NEW_LINK_MODAL
  };
}

export function resetModals() {
  return {
    type: RESET_MODALS
  };
}
