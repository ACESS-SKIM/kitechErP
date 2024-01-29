import { create } from 'zustand';
import { persist } from "zustand/middleware";

let appStore = (set) => ({
  dopen: true,
  rows: [],
  selectedMaterialId: null, // 선택된 Material ID를 저장하는 상태 추가
  setRows: (rows) => set((state) => ({ rows: rows })),
  updateDopen: (dopen) => set((state) => ({ dopen: dopen })),
  setSelectedMaterialId: (id) => {
    console.log("Setting selected material id: ", id);
    set((state) => ({ selectedMaterialId: id }));
  },
});

appStore = persist(appStore, { name: "cdot_store_api" });
export const useAppStore = create(appStore);



// 코드설명
// Zustand 및 Zustand의 미들웨어인 persist를 사용하여 로컬 스토리지에 상태를 영구적으로 저장하는 방법이며, 이렇게 하면 사용자가 앱을 닫았다가 다시 열어도 상태가 유지됨.
// useAppStore를 사용하여 setRows 함수와 rows 상태를 가져온 후 handleEdit 함수에서 rows 배열을 업데이트하고, 그 결과를 setRows를 사용하여 Zustand 상태에 반영함으로써
// Zustand를 사용하여 상태가 실시간으로 업데이트 되는 것을 확인할 수 있음.

// 다만, 이 코드는 rows 배열이 모든 재료를 포함하고 있어야 하며, editMaterial.id 값이 해당 재료의 고유 id와 일치해야 한다는 점을 주의해야 함.
// 이 값이 일치하지 않으면 업데이트가 되지 않음.

// 또한, 배열 내의 객체를 직접 수정하지 않고 대신 새 배열을 생성하여 상태를 업데이트하므로 불변성을 유지함. (React 및 Zustand와 같은 라이브러리에서는 중요한 개념임)