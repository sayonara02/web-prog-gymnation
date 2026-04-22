import React, { useEffect, useRef } from 'react';
import './Minigame.css';

function Minigame() {
  const gameScreenRef = useRef(null);
  const characterRef = useRef(null);
  const gameRunningRef = useRef(false);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const speedRef = useRef(5);
  const isJumpingRef = useRef(false);
  const jumpHeightRef = useRef(0);
  const jumpVelocityRef = useRef(0);
  const gravityRef = useRef(0.5);
  const JUMP_POWER = 15;
  const CHARACTER_HEIGHT = 100;
  const GROUND_HEIGHT = 20;
  const OBSTACLE_TYPES = ['weight', 'hurdle'];
  const obstaclesRef = useRef([]);
  const gameLoopRef = useRef(null);
  const obstacleIntervalRef = useRef(null);
  const scoreElementRef = useRef(null);
  const highScoreElementRef = useRef(null);

  // Initialize high score display
  useEffect(() => {
    const savedHighScore = localStorage.getItem('fitnessRunnerHighScore');
    if (savedHighScore) {
      highScoreRef.current = parseInt(savedHighScore);
      if (highScoreElementRef.current) {
        highScoreElementRef.current.textContent = highScoreRef.current;
      }
    }
  }, []);

  // Jump function
  const jump = () => {
    if (!gameRunningRef.current) return;
    if (isJumpingRef.current) return;
    
    isJumpingRef.current = true;
    jumpVelocityRef.current = JUMP_POWER;
  };

  // Move obstacles
  const moveObstacles = () => {
    if (!gameScreenRef.current) return;
    
    obstaclesRef.current.forEach((obstacle, index) => {
      obstacle.x -= speedRef.current;
      obstacle.element.style.right = `${gameScreenRef.current.offsetWidth - obstacle.x}px`;
      
      if (obstacle.x < -100) {
        obstacle.element.remove();
        obstaclesRef.current.splice(index, 1);
      }
    });
  };

  // Check collisions
  const checkCollisions = () => {
    if (!gameScreenRef.current) return;
    
    const characterRect = {
      left: 50,
      right: 50 + 60,
      top: jumpHeightRef.current,
      bottom: jumpHeightRef.current + CHARACTER_HEIGHT
    };
    
    for (const obstacle of obstaclesRef.current) {
      const obstacleRect = {
        left: obstacle.x,
        right: obstacle.x + obstacle.width,
        top: gameScreenRef.current.offsetHeight - GROUND_HEIGHT - obstacle.height,
        bottom: gameScreenRef.current.offsetHeight - GROUND_HEIGHT
      };
      
      if (characterRect.right > obstacleRect.left && 
          characterRect.left < obstacleRect.right &&
          characterRect.bottom > obstacleRect.top &&
          characterRect.top < obstacleRect.bottom) {
        gameOver();
        break;
      }
    }
  };

  // Spawn obstacle
  const spawnObstacle = () => {
    if (!gameRunningRef.current) return;
    if (!gameScreenRef.current) return;
    
    const obstacleType = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    const obstacle = document.createElement('div');
    obstacle.className = `obstacle ${obstacleType}`;
    
    let height, width;
    if (obstacleType === 'weight') {
      height = Math.random() * 40 + 40;
      width = 40;
    } else {
      height = Math.random() * 30 + 30;
      width = 60;
    }
    
    obstacle.style.height = `${height}px`;
    obstacle.style.width = `${width}px`;
    obstacle.style.position = 'absolute';
    obstacle.style.bottom = '0px';
    obstacle.style.right = '-100px';
    
    gameScreenRef.current.appendChild(obstacle);
    
    obstaclesRef.current.push({
      element: obstacle,
      x: gameScreenRef.current.offsetWidth,
      width: width,
      height: height,
      type: obstacleType
    });
  };

  // Update game
  const updateGame = () => {
    if (!gameRunningRef.current) return;
    
    // Update score
    scoreRef.current += 1;
    if (scoreElementRef.current) {
      scoreElementRef.current.textContent = scoreRef.current;
    }
    
    // Increase speed gradually
    if (scoreRef.current % 500 === 0 && scoreRef.current !== 0) {
      speedRef.current += 0.5;
    }
    
    // Handle jumping
    if (isJumpingRef.current) {
      const newJumpHeight = jumpHeightRef.current + jumpVelocityRef.current;
      jumpVelocityRef.current -= gravityRef.current;
      
      if (newJumpHeight <= 0) {
        jumpHeightRef.current = 0;
        isJumpingRef.current = false;
        jumpVelocityRef.current = 0;
      } else {
        jumpHeightRef.current = newJumpHeight;
      }
      
      if (characterRef.current) {
        characterRef.current.style.bottom = `${jumpHeightRef.current}px`;
      }
    }
    
    moveObstacles();
    checkCollisions();
  };

  // Start game
  const startGame = () => {
    if (gameRunningRef.current) return;
    
    gameRunningRef.current = true;
    scoreRef.current = 0;
    speedRef.current = 5;
    
    if (scoreElementRef.current) {
      scoreElementRef.current.textContent = '0';
    }
    
    // Clear existing obstacles
    obstaclesRef.current.forEach(obs => {
      if (obs.element && obs.element.remove) obs.element.remove();
    });
    obstaclesRef.current = [];
    
    isJumpingRef.current = false;
    jumpHeightRef.current = 0;
    jumpVelocityRef.current = 0;
    
    if (characterRef.current) {
      characterRef.current.style.bottom = '0px';
    }
    
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(updateGame, 20);
    
    if (obstacleIntervalRef.current) clearInterval(obstacleIntervalRef.current);
    obstacleIntervalRef.current = setInterval(spawnObstacle, 1500);
    
    // Hide game over overlay if exists
    const overlay = document.querySelector('.game-overlay');
    if (overlay) overlay.style.display = 'none';
  };

  // Pause game
  const pauseGame = () => {
    gameRunningRef.current = false;
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (obstacleIntervalRef.current) clearInterval(obstacleIntervalRef.current);
  };

  // Game over
  const gameOver = () => {
    gameRunningRef.current = false;
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (obstacleIntervalRef.current) clearInterval(obstacleIntervalRef.current);
    
    if (scoreRef.current > highScoreRef.current) {
      highScoreRef.current = scoreRef.current;
      localStorage.setItem('fitnessRunnerHighScore', highScoreRef.current);
      if (highScoreElementRef.current) {
        highScoreElementRef.current.textContent = highScoreRef.current;
      }
    }
    
    // Show game over overlay
    const overlay = document.querySelector('.game-overlay');
    if (overlay) {
      const finalScoreSpan = overlay.querySelector('.final-score span');
      if (finalScoreSpan) finalScoreSpan.textContent = scoreRef.current;
      overlay.style.display = 'flex';
    } else {
      alert(`Game Over! Your score: ${scoreRef.current}`);
    }
  };

  // Restart game
  const restartGame = () => {
    gameOver();
    startGame();
  };

  // Setup event listeners
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!gameRunningRef.current) {
          startGame();
        } else {
          jump();
        }
      }
    };
    
    const handleScreenClick = () => {
      if (gameRunningRef.current) {
        jump();
      } else {
        startGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    const gameScreen = gameScreenRef.current;
    if (gameScreen) {
      gameScreen.addEventListener('click', handleScreenClick);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameScreen) {
        gameScreen.removeEventListener('click', handleScreenClick);
      }
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (obstacleIntervalRef.current) clearInterval(obstacleIntervalRef.current);
    };
  }, []);

  return (
    <div className="game-wrapper">
      <div className="game-container">
        <div className="game-header">
          <h1 className="game-title">🏃‍♂️ Fitness Runner</h1>
          <p className="game-subtitle">Jump over obstacles and stay fit! Can you beat the high score?</p>
        </div>
        
        <div className="game-screen" ref={gameScreenRef}>
          <div className="character" ref={characterRef}>
            <div className="runner">
              <div className="head"></div>
              <div className="body"></div>
              <div className="leg leg-left"></div>
              <div className="leg leg-right"></div>
              <div className="arm arm-left"></div>
              <div className="arm arm-right"></div>
            </div>
          </div>
          <div className="ground"></div>
        </div>
        
        <div className="game-controls">
          <div className="game-stats">
            <div className="stat score">Score: <span ref={scoreElementRef}>0</span></div>
            <div className="stat high-score">High Score: <span ref={highScoreElementRef}>0</span></div>
          </div>
          <button className="control-btn" id="start-btn" onClick={() => {
            if (gameRunningRef.current) {
              pauseGame();
            } else {
              startGame();
            }
          }}>
            Start Game
          </button>
        </div>
        
        <div className="game-instructions">
          <p className="instructions-text">
            Press <span className="key">SPACE</span> or <span className="key">UP ARROW</span> or <span className="key">CLICK</span> to jump.
            Avoid the weights and hurdles!
          </p>
          <p className="instructions-text">
            Jump higher by holding the key longer!
          </p>
        </div>
      </div>
      
      <div className="game-overlay" style={{ display: 'none' }}>
        <div className="game-over-content">
          <h2>Game Over!</h2>
          <div className="final-score">Score: <span>0</span></div>
          <button className="restart-btn" onClick={restartGame}>Play Again</button>
        </div>
      </div>
    </div>
  );
}

export default Minigame;