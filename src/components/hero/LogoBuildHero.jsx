import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { business } from "../../data/business";
import useTheme from "../../hooks/useTheme";
import FallbackLogo from "./FallbackLogo";
import { CENTER, DISC_RADIUS, HERO_THEME, PIECES, SCALE } from "./logoPieces";
import useScrollProgress from "./useScrollProgress";

const TRACK_HEIGHT = "var(--topg-hero-track-height)";
const CAMERA_FOV = 32;
const STAGES = ["DRAFT 01 — SKETCH", "DRAFT 02 — ASSEMBLY", "DRAFT 03 — FLIP", "TOP-G / COMPLETE"];

const clamp = (value) => Math.min(1, Math.max(0, value));
const ease = (value) => {
  const bounded = clamp(value);
  return bounded * bounded * (3 - 2 * bounded);
};
const segment = (progress, start, end) => ease((progress - start) / (end - start));

function getStage(progress) {
  if (progress < 0.3) return STAGES[0];
  if (progress < 0.74) return STAGES[1];
  if (progress < 0.94) return STAGES[2];
  return STAGES[3];
}

function disposeMaterial(material, disposed) {
  if (!material || disposed.has(material)) return;
  disposed.add(material);
  Object.values(material).forEach((value) => {
    if (value?.isTexture && !disposed.has(value)) {
      disposed.add(value);
      value.dispose();
    }
  });
  material.dispose();
}

function disposeScene(scene) {
  const disposed = new Set();
  scene.traverse((object) => {
    if (object.geometry && !disposed.has(object.geometry)) {
      disposed.add(object.geometry);
      object.geometry.dispose();
    }
    if (object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => disposeMaterial(material, disposed));
    }
  });
  scene.clear();
}

function createRadialTexture(innerColor) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(64, 64, 10, 64, 64, 64);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPiece(points, index, root) {
  const worldPoints = points.map(([x, y]) => new THREE.Vector2((x - CENTER.x) / SCALE, -(y - CENTER.y) / SCALE));
  const centroid = worldPoints.reduce((sum, point) => sum.add(point), new THREE.Vector2()).multiplyScalar(1 / worldPoints.length);
  const shape = new THREE.Shape();
  worldPoints.forEach((point, pointIndex) => {
    const x = point.x - centroid.x;
    const y = point.y - centroid.y;
    if (pointIndex === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.45, bevelEnabled: false });
  geometry.translate(0, 0, -0.225);
  const fill = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: HERO_THEME.dark.pieceFill, roughness: 0.4, metalness: 0.2, transparent: true, opacity: 0 }));
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: HERO_THEME.dark.wireframeEdge, transparent: true, opacity: 0.9 }));
  const mesh = new THREE.Group();
  mesh.add(fill, edge);
  mesh.position.set(centroid.x, centroid.y, 0);
  root.add(mesh);

  const ghost = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(worldPoints.map((point) => new THREE.Vector3(point.x, point.y, 0))), new THREE.LineDashedMaterial({ color: HERO_THEME.dark.ghostOutline, dashSize: 0.12, gapSize: 0.1, transparent: true }));
  ghost.computeLineDistances();
  root.add(ghost);

  const angle = index * 2.1 + 0.7;
  return { mesh, fill, edge, ghost, home: new THREE.Vector3(centroid.x, centroid.y, 0), from: new THREE.Vector3(Math.cos(angle) * 9, Math.sin(angle) * 6, -6 - index * 2), rotation: new THREE.Vector3(Math.sin(angle) * 2.2, Math.cos(angle) * 2.2, Math.sin(angle * 2) * 1.5) };
}

function applySceneTheme(sceneState, theme, progress = sceneState.progress) {
  const values = HERO_THEME[theme];
  const discProgress = segment(progress, 0.6, 0.76);
  sceneState.colors.edge.setHex(values.wireframeEdge);
  sceneState.colors.fill.setHex(values.pieceFill);
  sceneState.items.forEach((item) => {
    item.fill.material.color.setHex(values.pieceFill);
    item.ghost.material.color.setHex(values.ghostOutline);
  });
  sceneState.ring.material.color.setHex(values.ghostOutline);
  sceneState.disc.material.emissive.setHex(values.discEmissive);
  sceneState.discEdge.material.color.setHex(values.discEdge);
  sceneState.discEdge.material.opacity = discProgress * values.discEdgeOpacity;
  sceneState.redGlow.material.opacity = discProgress * values.redGlowOpacity;
  sceneState.shadow.material.opacity = discProgress * values.shadowOpacity;
  sceneState.ambient.intensity = values.ambientIntensity;
  sceneState.keyLight.intensity = values.keyIntensity;
  sceneState.rimLight.intensity = values.rimIntensity;
  sceneState.theme = theme;
}

function ReducedMotionHero({ themeValues }) {
  return (
    <section className="topg-hero mt-20 grid min-h-[calc(100svh-5rem)] place-items-center overflow-hidden px-5 text-center sm:px-6" style={{ "--hero-background": themeValues.background, "--hero-grid-line": themeValues.gridLine, "--hero-label": themeValues.label, "--hero-headline": themeValues.headline, "--hero-paragraph": themeValues.paragraph }}>
      <div className="max-w-xl"><FallbackLogo className="mx-auto w-52 sm:w-72" /><p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-[#e31b23]">TOP-G / Complete</p><h1 className="topg-hero-headline mt-4 text-[clamp(2rem,9vw,3.75rem)] font-black uppercase leading-[0.92] tracking-[-0.05em]">Your car. Your style. <span className="text-[#e31b23]">Your seat.</span></h1><p className="topg-hero-paragraph mx-auto mt-5 max-w-xl text-sm leading-7 sm:text-base">{business.description}</p><Link to="/quote" className="mt-7 inline-flex min-h-12 items-center gap-2 bg-[#e31b23] px-5 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-red-600">Get a Quote <ArrowRight size={17} /></Link></div>
    </section>
  );
}

function LogoBuildHero() {
  const { theme } = useTheme();
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const blueprintRef = useRef(null);
  const percentageRef = useRef(null);
  const scrollHintRef = useRef(null);
  const progressBarRef = useRef(null);
  const copyRef = useRef(null);
  const sceneStateRef = useRef(null);
  const themeRef = useRef(theme);
  const [stage, setStage] = useState(STAGES[0]);
  const [webglFailed, setWebglFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const progressRef = useScrollProgress(trackRef, !reducedMotion && !webglFailed);
  const themeValues = HERO_THEME[theme];
  const heroStyle = { "--hero-background": themeValues.background, "--hero-grid-line": themeValues.gridLine, "--hero-label": themeValues.label, "--hero-headline": themeValues.headline, "--hero-paragraph": themeValues.paragraph };

  useEffect(() => {
    themeRef.current = theme;
    if (blueprintRef.current) blueprintRef.current.dataset.theme = theme;
    if (sceneStateRef.current) applySceneTheme(sceneStateRef.current, theme, sceneStateRef.current.progress);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreferenceChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", onPreferenceChange);
    return () => mediaQuery.removeEventListener("change", onPreferenceChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || webglFailed || !canvasRef.current || !stageRef.current) return undefined;

    const canvas = canvasRef.current;
    const stageElement = stageRef.current;
    let renderer;
    let scene;
    let frameId;
    let isDisposed = false;
    let fallbackTimer;
    let previousStage = STAGES[0];

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      if (!renderer.getContext()) throw new Error("WebGL context unavailable");
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.setClearColor(0x000000, 0);
      renderer.setClearAlpha(0);

      scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
      const ambient = new THREE.AmbientLight(0xffffff, 1.73);
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.83);
      keyLight.position.set(-4, 6, 8);
      const rimLight = new THREE.DirectionalLight(0xff3040, 1.88);
      rimLight.position.set(6, -3, -4);
      scene.add(ambient, keyLight, rimLight);

      const root = new THREE.Group();
      scene.add(root);
      const items = PIECES.map((points, index) => createPiece(points, index, root));
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(DISC_RADIUS, DISC_RADIUS, 0.3, 96).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: HERO_THEME.dark.discEmissive, roughness: 0.55, transparent: true, opacity: 0 }));
      disc.position.z = -0.45;
      root.add(disc);

      const ringPoints = [];
      for (let index = 0; index <= 128; index += 1) {
        const angle = (index / 128) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(Math.cos(angle) * DISC_RADIUS, Math.sin(angle) * DISC_RADIUS, 0));
      }
      const ringGeometry = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ring = new THREE.Line(ringGeometry, new THREE.LineDashedMaterial({ color: HERO_THEME.dark.ghostOutline, dashSize: 0.2, gapSize: 0.15, transparent: true }));
      ring.computeLineDistances();
      root.add(ring);
      const discEdge = new THREE.LineLoop(ringGeometry.clone(), new THREE.LineBasicMaterial({ color: HERO_THEME.dark.discEdge, transparent: true, opacity: 0 }));
      discEdge.position.z = -0.29;
      root.add(discEdge);

      const redGlow = new THREE.Mesh(new THREE.PlaneGeometry(DISC_RADIUS * 3, DISC_RADIUS * 3), new THREE.MeshBasicMaterial({ map: createRadialTexture("rgba(227, 27, 35, .55)"), transparent: true, opacity: 0, depthWrite: false }));
      redGlow.position.z = -2;
      root.add(redGlow);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(DISC_RADIUS * 3, DISC_RADIUS * 3), new THREE.MeshBasicMaterial({ map: createRadialTexture("rgba(0, 0, 0, .35)"), transparent: true, opacity: 0, depthWrite: false }));
      shadow.position.set(0.55, -0.65, -2.1);
      root.add(shadow);

      const sceneState = { items, ring, disc, discEdge, redGlow, shadow, ambient, keyLight, rimLight, colors: { edge: new THREE.Color(), fill: new THREE.Color() }, progress: progressRef.current, theme: themeRef.current };
      sceneStateRef.current = sceneState;
      applySceneTheme(sceneState, themeRef.current, progressRef.current);

      const resize = () => {
        const width = stageElement.clientWidth;
        const height = stageElement.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        const fov = (camera.fov * Math.PI) / 180;
        const distance = Math.max(21 / 2 / Math.tan(fov / 2), 21 / 2 / (Math.tan(fov / 2) * camera.aspect));
        camera.position.set(0, 0, distance);
        camera.updateProjectionMatrix();
      };

      const renderFrame = () => {
        if (isDisposed) return;
        const progress = progressRef.current;
        sceneState.progress = progress;
        const activeTheme = HERO_THEME[themeRef.current];
        items.forEach((item, index) => {
          const assemble = segment(progress, 0.04 + index * 0.14, 0.38 + index * 0.14);
          item.mesh.position.lerpVectors(item.from, item.home, assemble);
          item.mesh.rotation.set(item.rotation.x * (1 - assemble), item.rotation.y * (1 - assemble), item.rotation.z * (1 - assemble));
          item.edge.material.opacity = 0.15 + 0.85 * segment(progress, 0.02 + index * 0.14, 0.2 + index * 0.14);
          const fill = segment(progress, 0.62, 0.88);
          item.fill.material.opacity = fill;
          item.edge.material.color.lerpColors(sceneState.colors.edge, sceneState.colors.fill, fill);
        });

        const flatten = 1 - segment(progress, 0.1, 0.72);
        const discProgress = segment(progress, 0.6, 0.76);
        const flip = segment(progress, 0.74, 0.94);
        const moveUp = segment(progress, 0.9, 1);
        const copyProgress = segment(progress, 0.92, 1);
        root.rotation.set(-0.4 * flatten, 0.55 * flatten + Math.sin(progress * 6) * 0.04 * flatten + flip * Math.PI * 2, 0);
        root.position.set(0, moveUp * 3.4, Math.sin(flip * Math.PI) * 4);
        root.scale.setScalar(1 - moveUp * 0.4);
        disc.material.opacity = discProgress;
        disc.scale.setScalar(0.6 + 0.4 * discProgress);
        ring.material.opacity = 1 - discProgress;
        discEdge.material.opacity = discProgress * activeTheme.discEdgeOpacity;
        redGlow.material.opacity = discProgress * activeTheme.redGlowOpacity;
        shadow.material.opacity = discProgress * activeTheme.shadowOpacity;

        const nextStage = getStage(progress);
        if (nextStage !== previousStage) {
          previousStage = nextStage;
          setStage(nextStage);
        }
        if (blueprintRef.current) blueprintRef.current.style.opacity = String(1 - segment(progress, 0.58, 0.78));
        if (percentageRef.current) percentageRef.current.textContent = progress >= .99 ? "" : `${Math.round(progress * 100)}%`;
        if (scrollHintRef.current) scrollHintRef.current.textContent = progress >= .99 ? "SCROLL" : "SCROLL TO BUILD";
        if (progressBarRef.current) progressBarRef.current.style.width = `${progress * 100}%`;
        if (copyRef.current) {
          copyRef.current.style.opacity = String(copyProgress);
          copyRef.current.style.transform = `translateY(${(1 - copyProgress) * 20}px)`;
        }
        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(renderFrame);
      };

      resize();
      window.addEventListener("resize", resize);
      frameId = window.requestAnimationFrame(renderFrame);

      return () => {
        isDisposed = true;
        sceneStateRef.current = null;
        window.cancelAnimationFrame(frameId);
        window.removeEventListener("resize", resize);
        disposeScene(scene);
        renderer.renderLists.dispose();
        renderer.dispose();
      };
    } catch {
      fallbackTimer = window.setTimeout(() => {
        if (!isDisposed) setWebglFailed(true);
      }, 0);
      return () => {
        isDisposed = true;
        window.clearTimeout(fallbackTimer);
        if (renderer) renderer.dispose();
      };
    }
  }, [progressRef, reducedMotion, webglFailed]);

  if (reducedMotion || webglFailed) return <ReducedMotionHero themeValues={themeValues} />;

  return (
    <section ref={trackRef} className="topg-hero relative pt-20" style={{ height: TRACK_HEIGHT, ...heroStyle }}>
      <div ref={stageRef} className="sticky top-20 h-[calc(100svh-5rem)] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div ref={blueprintRef} className="topg-hero-grid pointer-events-none absolute inset-0" data-theme={theme}>
          <div className="absolute left-4 top-4 h-4 w-4 sm:left-6 sm:top-6 border-l border-t border-[#e31b23]" /><div className="absolute right-4 top-4 h-4 w-4 sm:right-6 sm:top-6 border-r border-t border-[#e31b23]" /><div className="absolute bottom-4 left-4 h-4 w-4 sm:bottom-6 sm:left-6 border-b border-l border-[#e31b23]" /><div className="absolute bottom-4 right-4 h-4 w-4 sm:bottom-6 sm:right-6 border-b border-r border-[#e31b23]" />
        </div>
        <div className="topg-hero-label pointer-events-none absolute left-4 top-4 z-10 sm:left-6 sm:top-6 font-mono text-[10px] font-semibold uppercase leading-5 tracking-[0.3em] sm:left-6 sm:top-6">TOP-G / Mark Study<br /><span className="text-[#e31b23]">{stage}</span></div>
        <div className="topg-hero-label pointer-events-none absolute left-1/2 top-4 z-10 hidden sm:block sm:top-6 -translate-x-1/2 text-center font-mono text-[10px] font-semibold uppercase leading-5 tracking-[0.3em]">Blueprint / Technical Sketch</div>
        <div className="topg-hero-label pointer-events-none absolute bottom-4 right-4 z-10 sm:bottom-6 sm:right-6 text-right font-mono text-[10px] font-semibold uppercase leading-5 tracking-[0.3em]"><span ref={scrollHintRef}>Scroll to build</span><br /><span ref={percentageRef}>0%</span></div>
        <div ref={copyRef} className="pointer-events-none absolute inset-x-0 bottom-8 z-10 px-5 text-center sm:bottom-[7vh]" style={{ opacity: 0 }}><h1 className="topg-hero-headline text-[clamp(2rem,9vw,3.75rem)] font-black uppercase leading-none tracking-[-0.02em]">Your car. Your style. <span className="text-[#e31b23]">Your seat.</span></h1><p className="topg-hero-paragraph mx-auto mt-4 max-w-xl text-sm sm:text-base">{business.description}</p><Link to="/quote" className="pointer-events-auto mt-5 inline-flex min-h-12 items-center gap-2 bg-[#e31b23] px-5 py-3 text-sm font-black uppercase tracking-[0.06em] text-white hover:bg-red-600">Get a Quote <ArrowRight size={17} /></Link></div>
        <div ref={progressBarRef} className="absolute bottom-0 left-0 z-20 h-0.5 bg-[#e31b23]" style={{ width: 0 }} />
      </div>
    </section>
  );
}

export default LogoBuildHero;