import { differenceInSeconds } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { CountdownContainer, Separator } from "./styles";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setPassedSeconds,
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.StartDate)
        );

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished();
          setPassedSeconds(totalSeconds);
          clearInterval(interval);
        } else {
          setPassedSeconds(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setPassedSeconds,
  ]);

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutesAmountString = String(minutesAmount).padStart(2, "0");
  const secondsAmountString = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutesAmountString}:${secondsAmountString} | Pomodoro`;
    }
  }, [minutesAmountString, secondsAmountString, activeCycle]);

  return (
    <CountdownContainer>
      <span>{minutesAmountString[0]}</span>
      <span>{minutesAmountString[1]}</span>
      <Separator>:</Separator>
      <span>{secondsAmountString[0]}</span>
      <span>{secondsAmountString[0]}</span>
    </CountdownContainer>
  );
}
