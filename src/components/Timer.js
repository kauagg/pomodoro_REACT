import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f0f0;
  font-family: 'Roboto', sans-serif;

  /* Flexbox para os botões na horizontal */
  .button-container {
    display: flex;
    justify-content: center;
    gap: 10px;  /* Espaçamento entre os botões */
  }
`;

const TimerDisplay = styled.div`
  font-size: 5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const Button = styled.button`
  padding: 15px 30px;
  background-color: ${(props) => (props.active ? '#ff4c4c' : '#4caf50')};
  color: white;
  font-size: 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#ff2f2f' : '#45a049')};
    transform: scale(1.1); /* Aumenta o tamanho do botão */
  }

  &:focus {
    outline: none;
  }
`;

const Timer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);

  // Carrega o estado do localStorage quando o componente é montado
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('timerState'));

    if (savedState) {
      setMinutes(savedState.minutes);
      setSeconds(savedState.seconds);
      setIsRunning(savedState.isRunning);
      setIsWorkTime(savedState.isWorkTime);
    }
  }, []);

  // Salva o estado no localStorage sempre que algo mudar
  useEffect(() => {
    const timerState = {
      minutes,
      seconds,
      isRunning,
      isWorkTime,
    };
    localStorage.setItem('timerState', JSON.stringify(timerState));
  }, [minutes, seconds, isRunning, isWorkTime]);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            if (isWorkTime) {
              setIsWorkTime(false); // Troca para o intervalo de descanso
              setMinutes(5); // Define 5 minutos para o intervalo
            } else {
              setIsWorkTime(true); // Troca para o tempo de trabalho
              setMinutes(25); // Define 25 minutos para o trabalho
            }
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds, minutes, isWorkTime]);

  const resetTimer = () => {
    setMinutes(isWorkTime ? 25 : 5);
    setSeconds(0);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const startBreak = () => {
    setIsRunning(false);
    setIsWorkTime(false); // Define como intervalo
    setMinutes(5); // Define 5 minutos de descanso
    setSeconds(0);
  };

  const startWork = () => {
    setIsRunning(false);
    setIsWorkTime(true); // Define como tempo de trabalho
    setMinutes(25); // Define 25 minutos de trabalho
    setSeconds(0);
  };

  const formatTime = (minutes, seconds) => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <TimerWrapper>
      <TimerDisplay>{formatTime(minutes, seconds)}</TimerDisplay>

      {/* Botões alinhados horizontalmente */}
      <div className="button-container">
        <Button onClick={toggleTimer} active={isRunning}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={resetTimer}>
          Reset
        </Button>
        <Button onClick={startBreak}>
          Começar Descanso (5 min)
        </Button>
        <Button onClick={startWork}>
          Voltar para 25 min (Trabalho)
        </Button>
      </div>

      <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>
        {isWorkTime ? 'Hora de Estudar' : 'Descansar'}
      </p>
    </TimerWrapper>
  );
};

export default Timer;
