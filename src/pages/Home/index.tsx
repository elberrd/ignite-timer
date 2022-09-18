import { HandPalm, Play } from "phosphor-react";
import { createContext, useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { FormProvider } from "react-hook-form";

import {
  HomeCountainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  StartDate: Date;
  InterruptedDate?: Date;
  FinishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setPassedSeconds: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe uma tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "Minimo 1 digito")
    .max(60, "Informe um valor entre 1 e 60"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setPassedSeconds(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            FinishedDate: new Date(),
          };
        } else {
          return cycle;
        }
      })
    );
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      StartDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);

    reset();
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            InterruptedDate: new Date(),
          };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
    // setAmountSecondsPassed(0);
  }

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeCountainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setPassedSeconds,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeCountainer>
  );
}
