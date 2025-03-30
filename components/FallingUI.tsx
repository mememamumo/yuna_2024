"use client";

import styles from "@/styles/falling-ui.module.css";
import {
  Bodies,
  Body,
  Engine,
  Mouse,
  MouseConstraint,
  Runner,
  World,
} from "matter-js";
import { useCallback, useEffect, useRef, useState } from "react";

const LABELS = [
  "button",
  "button",
  "button",
  "button",
  "button",
  "button",
  "button",
  "button",
  "button",
  "long-button",
  "long-button",
  "switch",
  "switch",
  "tooltip",
  "tooltip2",
  "input",
  "dropdown",
];

const COLORS = ["#4f46e5", "#10b981", "#f43f5e", "#0ea5e9", "#8b5cf6"];

export default function FallingUI() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const engineRef = useRef<Engine | null>(null);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [switchStates, setSwitchStates] = useState<boolean[]>([]); // ✅ 여러 스위치 상태
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [buttonColors, setButtonColors] = useState<string[]>([]); // ✅ 버튼별 초기 컬러

  // ✅ 위치 랜덤하게 생성
  const generateRandomPositions = (
    count: number,
    width: number,
    height: number
  ) => {
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height / 2),
    }));
  };

  // ✅ 버튼별 컬러 미리 랜덤 지정
  const generateButtonColors = (count: number) => {
    return Array.from({ length: count }).map(() => {
      const idx = Math.floor(Math.random() * COLORS.length);
      return COLORS[idx];
    });
  };

  const initializeEngine = useCallback(() => {
    if (!sceneRef.current || positions.length === 0) return;

    const scene = sceneRef.current;
    const engine = Engine.create();
    engine.gravity.y = 0.7;
    engineRef.current = engine;
    const world = engine.world;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const walls = [
      Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true }),
      Bodies.rectangle(width / 2, -200, width, 100, { isStatic: true }),
      Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true }),
      Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true }),
    ];
    World.add(world, walls);

    const bodies: Body[] = elementsRef.current
      .map((el, i) => {
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const body = Bodies.rectangle(
          positions[i].x,
          positions[i].y,
          rect.width,
          rect.height,
          {
            restitution: 0.9,
            frictionAir: 0.02,
            friction: 0.05,
            density: 0.001,
            mass: 0.3,
          }
        );
        body.el = el;
        return body;
      })
      .filter((b): b is Body => b !== null);

    World.add(world, bodies);

    const mouse = Mouse.create(document.body);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.95,
        render: { visible: false },
      },
    });
    World.add(world, mouseConstraint);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const update = () => {
      bodies.forEach((body) => {
        if (body.el) {
          body.el.style.position = "absolute";
          body.el.style.left = `${body.position.x - body.el.offsetWidth / 2}px`;
          body.el.style.top = `${body.position.y - body.el.offsetHeight / 2}px`;
          body.el.style.transform = `rotate(${body.angle}rad)`;
        }
      });
      requestAnimationFrame(update);
    };
    update();

    return () => {
      Runner.stop(runner);
      Engine.clear(engine);
      World.clear(engine.world, false);
    };
  }, [positions]);

  useEffect(() => {
    setIsClient(true);
    const w = window.innerWidth;
    const h = window.innerHeight;
    setPositions(generateRandomPositions(LABELS.length, w, h));
    setButtonColors(generateButtonColors(LABELS.length));

    // ✅ switch index 추출하여 상태 배열 만들기
    const switchIndices = LABELS.map((label, i) =>
      label === "switch" ? i : -1
    ).filter((i) => i !== -1);
    const switches = switchIndices.map((_, i) => i === 0); // 첫 번째만 true
    setSwitchStates(switches);
  }, []);

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      setIsVisible(false);
      if (engineRef.current) {
        Engine.clear(engineRef.current);
        engineRef.current = null;
      }
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setPositions(generateRandomPositions(LABELS.length, w, h));
        setButtonColors(generateButtonColors(LABELS.length));
        setIsVisible(true);
      }, 400);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    if (isClient && isVisible && positions.length > 0) {
      const cleanup = initializeEngine();
      return cleanup;
    }
  }, [initializeEngine, isClient, isVisible, positions]);

  const handleColorChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    e.currentTarget.style.backgroundColor = newColor;
  };

  const toggleSwitch = (switchIndex: number) => {
    setSwitchStates((prev) =>
      prev.map((state, i) => (i === switchIndex ? !state : state))
    );
  };

  if (!isClient || !isVisible) return null;

  let switchCount = 0;

  const SWITCH_IMAGES = [
    "https://randomuser.me/api/portraits/lego/2.jpg",
    "https://randomuser.me/api/portraits/lego/1.jpg",
  ];

  return (
    <div ref={sceneRef} className={styles.scene}>
      {LABELS.map((label, i) => {
        if (label === "switch") {
          const switchIndex = switchCount;
          switchCount++;
          const isOn = switchStates[switchIndex] ?? false;

          return (
            <div
              key={i}
              ref={(el) => {
                elementsRef.current[i] = el;
              }}
              className={styles.box}
              draggable={false}
            >
              <div
                className={`${styles.fallingSwitch} ${isOn ? styles.on : ""}`}
                onClick={() => toggleSwitch(switchIndex)}
              >
                {isOn ? (
                  <span className={`${styles.switchText} ${styles.left}`}>
                    ON
                  </span>
                ) : (
                  <span className={`${styles.switchText} ${styles.right}`}>
                    OFF
                  </span>
                )}
                <div className={styles.slider}>
                  {isOn && (
                    <img
                      src={SWITCH_IMAGES[switchIndex % SWITCH_IMAGES.length]}
                      alt="avatar"
                      className={styles.sliderImage}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={i}
            ref={(el) => {
              elementsRef.current[i] = el;
            }}
            className={styles.box}
            draggable={false}
          >
            {label === "button" && (
              <button
                className={styles.fallingButton}
                onClick={(e) => handleColorChange(e, i)}
                style={{ backgroundColor: buttonColors[i] }}
              >
                Button
              </button>
            )}
            {label === "long-button" && (
              <button
                className={`${styles.fallingButton} ${styles.large}`}
                onClick={(e) => handleColorChange(e, i)}
                style={{ backgroundColor: buttonColors[i] }}
              >
                Longer button
              </button>
            )}
            {label === "tooltip" && (
              <div className={styles.tooltipBox}>
                Tooltip
                <div className={styles.tooltipTriangle}></div>
              </div>
            )}
            {label === "tooltip2" && (
              <div className={styles.tooltipBox}>
                Tooltip me
                <div className={styles.tooltipTriangle}></div>
              </div>
            )}
            {label === "input" && (
              <input
                className={styles.fallingInput}
                placeholder="Write your name"
                aria-label="Input field"
                draggable={false}
              />
            )}
            {label === "dropdown" && (
              <div
                className={styles.fallingDropdown}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <span>D-rooooop down</span>
                <span
                  className={`${styles.arrow} ${
                    dropdownOpen ? styles.arrowUp : styles.arrowDown
                  }`}
                ></span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
