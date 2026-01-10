import type { Ref } from 'vue';

export function usePopupPosition() {
  const updatePosition = (
    buttonRef: HTMLElement | null,
    positionRef: Ref<{ top: string; left: string }>,
    popupWidth: number
  ) => {
    if (!buttonRef) return;

    const rect = buttonRef.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const padding = 16;

    let top = rect.bottom + 8;
    let left = rect.left;

    if (top + 400 > viewportHeight) {
      top = rect.top - 408;
    }

    if (left + popupWidth > viewportWidth - padding) {
      left = Math.max(padding, viewportWidth - popupWidth - padding);
    }

    positionRef.value = { top: `${top}px`, left: `${left}px` };
  };

  return { updatePosition };
}
