import { ActionTypes } from "./../cycles/actions";
import { produce } from "immer";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  StartDate: Date;
  InterruptedDate?: Date;
  FinishedDate?: Date;
}

interface CycleState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function cyclesReducer(state: CycleState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      // return {
      //   ...state,
      //   cycles: [...state.cycles, action.payload.newCycle],
      //   activeCycleId: action.payload.newCycle.id,
      // };
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle);
        draft.activeCycleId = action.payload.newCycle.id;
      });
    case ActionTypes.INTERRUPT_CURRENT_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.forEach((cycle) => {
          if (cycle.id === state.activeCycleId) {
            cycle.InterruptedDate = new Date();
          }
        });
        draft.activeCycleId = null;
      });
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
      return produce(state, (draft) => {
        draft.cycles.forEach((cycle) => {
          if (cycle.id === state.activeCycleId) {
            cycle.FinishedDate = new Date();
          }
        });
        draft.activeCycleId = null;
      });
    default:
      return state;
  }
}
