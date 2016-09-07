export const SHOW_PROMPT = 'SHOW_PROMPT';
export const RESET_PROMPTS = 'RESET_PROMPTS';

export const GM_ALBUMS_SEARCH_PROMPT = 'GM_ALBUMS_SEARCH_PROMPT';
export const VK_SEARCH_PROMPT = 'VK_SEARCH_PROMPT';
export const VK_NEW_LINK_PROMPT = 'VK_NEW_LINK_PROMPT';
export const VK_NEW_WALL_PROMPT = 'VK_NEW_WALL_PROMPT';

export function showPrompt(prompt) {
  return {
    type: SHOW_PROMPT,
    prompt
  };
}

export function resetPrompts() {
  return {
    type: RESET_PROMPTS
  };
}
