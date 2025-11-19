import { ref } from 'vue';
import type { PanelType } from '@/types/flight';

const activePanel = ref<PanelType>(null);

export function useActivePanel() {
  const setActivePanel = (panel: PanelType) => {
    activePanel.value = panel;
  };

  const isActive = (panel: PanelType) => {
    return activePanel.value === panel;
  };

  const closePanel = () => {
    activePanel.value = null;
  };

  return {
    activePanel,
    setActivePanel,
    isActive,
    closePanel,
  };
}
