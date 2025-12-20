import { ref } from 'vue';

const showNewTripModal = ref(false);

export function useNewTripModal() {
  const openModal = () => {
    showNewTripModal.value = true;
  };

  const closeModal = () => {
    showNewTripModal.value = false;
  };

  return {
    showNewTripModal,
    openModal,
    closeModal,
  };
}

