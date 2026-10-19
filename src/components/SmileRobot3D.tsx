import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type SmileEmotion =
  | 'idle'
  | 'happy'
  | 'excited'
  | 'curious'
  | 'thinking'
  | 'surprised'
  | 'slightly-sad'
  | 'winking'
  | 'speaking'
  | 'listening';

export type ProximityZone = 'near' | 'normal' | 'far';

export interface SmileRobot3DProps {
  size?: 'floating-launcher' | 'chat-header' | 'stage' | 'mini';
  emotion?: SmileEmotion;
  isThinking?: boolean;
  isSpeaking?: boolean;
  isChatOpen?: boolean;
  onClick?: () => void;
  showSpeechBubble?: boolean;
  speechText?: string;
  onProximityChange?: (zone: ProximityZone, distancePx: number) => void;
  className?: string;
}

export const SmileRobot3D: React.FC<SmileRobot3DProps> = ({
  size = 'floating-launcher',
  emotion: externalEmotion,
  isThinking = false,
  isSpeaking = false,
  isChatOpen = false,
  onClick,
  showSpeechBubble = true,
  speechText: externalSpeechText,
  onProximityChange,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fallback state if WebGL is unavailable
  const [webGLError, setWebGLError] = useState<boolean>(false);

  // Internal reactive emotion and proximity states
  const [internalEmotion, setInternalEmotion] = useState<SmileEmotion>('idle');
  const [proximityZone, setProximityZone] = useState<ProximityZone>('normal');
  const [speechBubbleText, setSpeechBubbleText] = useState<string>('');
  const [bubbleVisible, setBubbleVisible] = useState<boolean>(false);

  // References for render loop data (avoiding React re-renders on mousemove)
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    cursorDistance: 300,
    isHovered: false,
    isWindowFocused: true,
    lastBlinkTime: 0,
    blinkDuration: 0.18,
    isBlinking: false,
    currentEmotion: 'idle' as SmileEmotion,
    eyeBlinkFactor: 1.0,
    pupilOffsetX: 0,
    pupilOffsetY: 0,
    time: 0,
    waveAmount: 0,
    prefersReducedMotion: false,
    activeZone: 'normal' as ProximityZone,
    farTimer: null as any,
  });

  // Calculate dimensions based on requested size
  const getDimensions = useCallback(() => {
    switch (size) {
      case 'floating-launcher':
        return { width: 88, height: 88, fov: 38, cameraZ: 2.25 };
      case 'chat-header':
        return { width: 48, height: 48, fov: 38, cameraZ: 2.25 };
      case 'stage':
        return { width: 220, height: 220, fov: 38, cameraZ: 2.25 };
      case 'mini':
      default:
        return { width: 64, height: 64, fov: 38, cameraZ: 2.25 };
    }
  }, [size]);

  // Determine effective emotion based on props and proximity
  const effectiveEmotion: SmileEmotion =
    isThinking
      ? 'thinking'
      : isSpeaking
      ? 'speaking'
      : externalEmotion
      ? externalEmotion
      : internalEmotion;

  useEffect(() => {
    stateRef.current.currentEmotion = effectiveEmotion;
  }, [effectiveEmotion]);

  // Handle Proximity speech bubble updates
  useEffect(() => {
    if (externalSpeechText) {
      setSpeechBubbleText(externalSpeechText);
      setBubbleVisible(true);
      return;
    }

    if (isThinking) {
      setSpeechBubbleText('Checking the best travel routes for you... ✈️');
      setBubbleVisible(true);
      return;
    }

    if (isSpeaking) {
      setSpeechBubbleText("Here's what I found! ✨");
      setBubbleVisible(true);
      return;
    }

    if (proximityZone === 'near' && !isChatOpen) {
      setSpeechBubbleText('Hey! Need help planning a trip? 👋');
      setBubbleVisible(true);
    } else if (proximityZone === 'far' && !isChatOpen) {
      // Show subtle speech bubble after lingering far away
      const timer = setTimeout(() => {
        setSpeechBubbleText("I'm here whenever you need me! 💙");
        setBubbleVisible(true);
      }, 4000);
      return () => clearTimeout(timer);
    } else if (proximityZone === 'normal') {
      const hideTimer = setTimeout(() => setBubbleVisible(false), 2500);
      return () => clearTimeout(hideTimer);
    }
  }, [proximityZone, isThinking, isSpeaking, externalSpeechText, isChatOpen]);

  // THREE.JS SETUP & 60FPS ANIMATION LOOP
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      stateRef.current.prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
    }

    const { width, height, fov, cameraZ } = getDimensions();

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
    camera.position.set(0, 0, cameraZ);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
      canvasRef.current = renderer.domElement;
    } catch (err) {
      console.warn('WebGL initialization failed for SMILE 3D robot:', err);
      setWebGLError(true);
      return;
    }

    // Studio Environment lighting for realistic metallic/clearcoat reflections
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
      pmremGenerator.dispose();
    } catch {}

    // Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x082b59, 0.7);
    hemiLight.position.set(0, 5, 0);
    scene.add(hemiLight);

    // Warm Key Directional Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);

    // Vibrant Cyan Rim/Accent Light (TripYehh Brand Glow)
    const cyanRimLight = new THREE.DirectionalLight(0x00f2fe, 1.6);
    cyanRimLight.position.set(-2.5, 1, -2);
    scene.add(cyanRimLight);

    // -------------------------------------------------------------
    // PROCEDURAL DIGITAL VISOR TEXTURE (High-Res 512x256 HTML5 Canvas)
    // -------------------------------------------------------------
    const eyeCanvas = document.createElement('canvas');
    eyeCanvas.width = 512;
    eyeCanvas.height = 256;
    const eyeCtx = eyeCanvas.getContext('2d')!;

    const eyeTexture = new THREE.CanvasTexture(eyeCanvas);
    eyeTexture.colorSpace = THREE.SRGBColorSpace;
    eyeTexture.generateMipmaps = false;
    eyeTexture.minFilter = THREE.LinearFilter;

    // Shared PBR Materials
    // Body: Ultra-Glossy Pearl Ceramic White
    const whiteBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fbff,
      roughness: 0.12,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.7,
    });

    // Trim: Metallic Navy Blue (#082B59 TripYehh Brand Accent)
    const navyTrimMat = new THREE.MeshStandardMaterial({
      color: 0x082b59,
      roughness: 0.25,
      metalness: 0.6,
    });

    // Glowing Neon Cyan (#00F2FE / #08A9F7)
    const cyanAccentMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.3,
    });

    // Deep Obsidian Glossy Visor Faceplate
    const visorGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x030712,
      roughness: 0.06,
      metalness: 0.95,
      transmission: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    // Emissive Visor Screen for the glowing digital face
    const eyeScreenMat = new THREE.MeshBasicMaterial({
      map: eyeTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // -------------------------------------------------------------
    // 3D CHIBI-FUTURISTIC COMPANION FACE MODEL
    // -------------------------------------------------------------
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0, 0);
    scene.add(headPivot);

    // 1. Floating Magnetic Levitation Collar (Underneath Head)
    const neckGeo = new THREE.CylinderGeometry(0.25, 0.29, 0.1, 24);
    const neckMesh = new THREE.Mesh(neckGeo, navyTrimMat);
    neckMesh.position.y = -0.52;
    headPivot.add(neckMesh);

    const neckRingGeo = new THREE.TorusGeometry(0.28, 0.02, 8, 24);
    neckRingGeo.rotateX(Math.PI / 2);
    const neckRingMesh = new THREE.Mesh(neckRingGeo, cyanAccentMat);
    neckRingMesh.position.y = -0.48;
    headPivot.add(neckRingMesh);

    // 2. Sculpted Ceramic Helmet Shell (Smooth cute squircle dome)
    const headShellGeo = new THREE.SphereGeometry(0.6, 32, 28);
    headShellGeo.scale(1.15, 1.04, 1.08);
    const headShellMesh = new THREE.Mesh(headShellGeo, whiteBodyMat);
    headPivot.add(headShellMesh);

    // 3. Polished Metallic Visor Bezel (Inset frame defining the face screen)
    const visorBezelGeo = new THREE.TorusGeometry(0.53, 0.035, 12, 36);
    visorBezelGeo.scale(0.98, 0.86, 1.0);
    const visorBezelMesh = new THREE.Mesh(visorBezelGeo, navyTrimMat);
    visorBezelMesh.position.set(0, 0.02, 0.22);
    headPivot.add(visorBezelMesh);

    // 4. Deep Obsidian Curved Visor Faceplate
    const visorGeo = new THREE.SphereGeometry(0.53, 32, 24, 0, Math.PI, 0, Math.PI * 0.68);
    visorGeo.rotateY(-Math.PI / 2);
    visorGeo.scale(0.96, 0.85, 1.02);
    const visorMesh = new THREE.Mesh(visorGeo, visorGlassMat);
    visorMesh.position.set(0, 0.02, 0.06);
    headPivot.add(visorMesh);

    // 5. Emissive Eye/Mouth Screen mesh sitting on visor face
    const eyeScreenGeo = new THREE.PlaneGeometry(0.72, 0.38);
    const eyeScreenMesh = new THREE.Mesh(eyeScreenGeo, eyeScreenMat);
    eyeScreenMesh.position.set(0, 0.02, 0.56);
    headPivot.add(eyeScreenMesh);

    // 6. Top Aerodynamic Brow & Crown
    const crownGeo = new THREE.BoxGeometry(0.12, 0.12, 0.65);
    const crownMesh = new THREE.Mesh(crownGeo, navyTrimMat);
    crownMesh.position.set(0, 0.55, -0.05);
    headPivot.add(crownMesh);

    // Glowing Forehead Diamond Crest (TripYehh Brand Insignia)
    const foreheadBadgeGeo = new THREE.OctahedronGeometry(0.055);
    const foreheadBadgeMesh = new THREE.Mesh(foreheadBadgeGeo, cyanAccentMat);
    foreheadBadgeMesh.position.set(0, 0.44, 0.54);
    headPivot.add(foreheadBadgeMesh);

    // 7. Floating Magnetic Cyan Halo Ring (Hovers gracefully above head)
    const haloGeo = new THREE.TorusGeometry(0.36, 0.02, 12, 36);
    haloGeo.rotateX(Math.PI / 2.3);
    const haloMesh = new THREE.Mesh(haloGeo, cyanAccentMat);
    haloMesh.position.set(0, 0.68, -0.06);
    headPivot.add(haloMesh);

    // 8. Futuristic Headphone Ear Pods with Orbit Rings
    const earGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.09, 24);
    earGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earGeo, navyTrimMat);
    leftEar.position.set(0.64, 0.02, 0);
    headPivot.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, navyTrimMat);
    rightEar.position.set(-0.64, 0.02, 0);
    headPivot.add(rightEar);

    // Pulsing Cyan Center Audio Nodes
    const earCoreGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const leftEarCore = new THREE.Mesh(earCoreGeo, cyanAccentMat);
    leftEarCore.position.set(0.7, 0.02, 0);
    headPivot.add(leftEarCore);

    const rightEarCore = new THREE.Mesh(earCoreGeo, cyanAccentMat);
    rightEarCore.position.set(-0.7, 0.02, 0);
    headPivot.add(rightEarCore);

    // Rotating Outer Magnetic Orbit Rings
    const orbitRingGeo = new THREE.TorusGeometry(0.18, 0.016, 8, 24);
    orbitRingGeo.rotateY(Math.PI / 2);

    const leftOrbitRing = new THREE.Mesh(orbitRingGeo, cyanAccentMat);
    leftOrbitRing.position.set(0.7, 0.02, 0);
    headPivot.add(leftOrbitRing);

    const rightOrbitRing = new THREE.Mesh(orbitRingGeo, cyanAccentMat);
    rightOrbitRing.position.set(-0.7, 0.02, 0);
    headPivot.add(rightOrbitRing);

    // -------------------------------------------------------------
    // PROCEDURAL HIGH-DEFINITION EXPRESSIVE EYES & SMILE ENGINE
    // -------------------------------------------------------------
    const updateDigitalEyes = (
      emotion: SmileEmotion,
      blinkFactor: number,
      pupilX: number,
      pupilY: number,
      timeVal: number
    ) => {
      eyeCtx.clearRect(0, 0, eyeCanvas.width, eyeCanvas.height);

      const leftX = 152;
      const rightX = 360;
      const eyeY = 108;
      const mouthX = 256;
      const mouthY = 195;

      const cyanMain = '#00F2FE';
      const cyanGlow = 'rgba(0, 242, 254, 0.85)';
      const cyanBlush = 'rgba(0, 242, 254, 0.45)';

      eyeCtx.shadowColor = cyanGlow;
      eyeCtx.shadowBlur = 18;
      eyeCtx.lineCap = 'round';
      eyeCtx.lineJoin = 'round';

      // 1. Soft Glowing Cheek Blush Dots (Always present for adorable charm)
      eyeCtx.fillStyle = cyanBlush;
      eyeCtx.beginPath();
      eyeCtx.arc(95, 175, 14, 0, Math.PI * 2);
      eyeCtx.arc(417, 175, 14, 0, Math.PI * 2);
      eyeCtx.fill();

      // 2. Emotion-Specific Render Logic
      switch (emotion) {
        case 'happy':
        case 'excited': {
          // Joyous Arched Eyes (^ ^) with playful bounce
          const bounce = Math.sin(timeVal * 12) * 4;
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 14;

          [leftX, rightX].forEach((cx) => {
            eyeCtx.beginPath();
            eyeCtx.arc(cx, eyeY + 12 - bounce, 36, Math.PI * 1.15, Math.PI * 1.85);
            eyeCtx.stroke();
          });

          // Cheerful Eyebrows lifted high
          eyeCtx.lineWidth = 7;
          eyeCtx.beginPath();
          eyeCtx.arc(leftX, eyeY - 42, 30, Math.PI * 1.2, Math.PI * 1.8);
          eyeCtx.arc(rightX, eyeY - 42, 30, Math.PI * 1.2, Math.PI * 1.8);
          eyeCtx.stroke();

          // Big Radiant Glowing Smile ‿
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 10;
          eyeCtx.beginPath();
          eyeCtx.arc(mouthX, mouthY - 14, 38, Math.PI * 0.18, Math.PI * 0.82);
          eyeCtx.stroke();
          break;
        }

        case 'winking': {
          // Left Eye: Happy wink arch (-)
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 14;
          eyeCtx.beginPath();
          eyeCtx.arc(leftX, eyeY + 10, 36, Math.PI * 1.15, Math.PI * 1.85);
          eyeCtx.stroke();

          // Right Eye: Open bright soulful eye with double sparkle
          const rH = Math.max(3, 48 * blinkFactor);
          const grad = eyeCtx.createLinearGradient(0, eyeY - rH, 0, eyeY + rH);
          grad.addColorStop(0, '#00FFFF');
          grad.addColorStop(1, '#0099FF');
          eyeCtx.fillStyle = grad;

          eyeCtx.beginPath();
          eyeCtx.ellipse(rightX + pupilX * 18, eyeY + pupilY * 12, 28, rH, 0, 0, Math.PI * 2);
          eyeCtx.fill();

          // Twin Sparkle Glints
          if (blinkFactor > 0.4) {
            eyeCtx.fillStyle = '#FFFFFF';
            eyeCtx.beginPath();
            eyeCtx.arc(rightX + pupilX * 18 + 9, eyeY + pupilY * 12 - 12, 7, 0, Math.PI * 2);
            eyeCtx.arc(rightX + pupilX * 18 - 8, eyeY + pupilY * 12 + 10, 3.5, 0, Math.PI * 2);
            eyeCtx.fill();
          }

          // Playful side smirk
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 8;
          eyeCtx.beginPath();
          eyeCtx.arc(mouthX + 6, mouthY - 10, 26, Math.PI * 0.15, Math.PI * 0.75);
          eyeCtx.stroke();
          break;
        }

        case 'thinking': {
          // Left Eye: Inquisitive squint
          eyeCtx.fillStyle = cyanMain;
          eyeCtx.beginPath();
          eyeCtx.ellipse(leftX - 6, eyeY - 2, 30, 9, -0.2, 0, Math.PI * 2);
          eyeCtx.fill();

          // Right Eye: Rotating High-Tech Holographic Scanner
          eyeCtx.save();
          eyeCtx.translate(rightX, eyeY - 2);
          eyeCtx.rotate(timeVal * 5);
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 8;
          eyeCtx.beginPath();
          eyeCtx.arc(0, 0, 28, 0, Math.PI * 1.4);
          eyeCtx.stroke();
          eyeCtx.beginPath();
          eyeCtx.arc(0, 0, 9, 0, Math.PI * 2);
          eyeCtx.fillStyle = cyanMain;
          eyeCtx.fill();
          eyeCtx.restore();

          // Thoughtful eyebrows (one raised, one lowered)
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 6;
          eyeCtx.beginPath();
          eyeCtx.moveTo(leftX - 30, eyeY - 32);
          eyeCtx.lineTo(leftX + 30, eyeY - 24);
          eyeCtx.moveTo(rightX - 30, eyeY - 42);
          eyeCtx.lineTo(rightX + 30, eyeY - 48);
          eyeCtx.stroke();

          // Curious small 'o' mouth
          eyeCtx.beginPath();
          eyeCtx.arc(mouthX + 10, mouthY, 10, 0, Math.PI * 2);
          eyeCtx.stroke();
          break;
        }

        case 'speaking': {
          // Soulful open eyes
          const eyeH = Math.max(3, 44 * blinkFactor);
          [leftX, rightX].forEach((cx) => {
            const grad = eyeCtx.createLinearGradient(0, eyeY - eyeH, 0, eyeY + eyeH);
            grad.addColorStop(0, '#00FFFF');
            grad.addColorStop(1, '#0088FF');
            eyeCtx.fillStyle = grad;

            eyeCtx.beginPath();
            eyeCtx.ellipse(cx + pupilX * 16, eyeY + pupilY * 10, 26, eyeH, 0, 0, Math.PI * 2);
            eyeCtx.fill();

            if (blinkFactor > 0.4) {
              eyeCtx.fillStyle = '#FFFFFF';
              eyeCtx.beginPath();
              eyeCtx.arc(cx + pupilX * 16 + 8, eyeY + pupilY * 10 - 10, 6.5, 0, Math.PI * 2);
              eyeCtx.arc(cx + pupilX * 16 - 7, eyeY + pupilY * 10 + 9, 3, 0, Math.PI * 2);
              eyeCtx.fill();
            }
          });

          // Dynamic Animated Soundwave Bars in mouth area
          const bars = 7;
          const barWidth = 6;
          const totalW = bars * (barWidth + 5);
          const startX = mouthX - totalW / 2;
          eyeCtx.fillStyle = cyanMain;

          for (let i = 0; i < bars; i++) {
            const barH = 8 + Math.abs(Math.sin(timeVal * 12 + i * 0.9)) * 24;
            eyeCtx.fillRect(startX + i * (barWidth + 5), mouthY - barH / 2, barWidth, barH);
          }
          break;
        }

        case 'surprised': {
          // Large round eyes with wide open pupils
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 10;
          [leftX, rightX].forEach((cx) => {
            eyeCtx.beginPath();
            eyeCtx.arc(cx, eyeY, 36, 0, Math.PI * 2);
            eyeCtx.stroke();

            eyeCtx.fillStyle = cyanMain;
            eyeCtx.beginPath();
            eyeCtx.arc(cx + pupilX * 8, eyeY + pupilY * 8, 12, 0, Math.PI * 2);
            eyeCtx.fill();

            eyeCtx.fillStyle = '#FFFFFF';
            eyeCtx.beginPath();
            eyeCtx.arc(cx + pupilX * 8 + 4, eyeY + pupilY * 8 - 4, 4, 0, Math.PI * 2);
            eyeCtx.fill();
          });

          // Surprised high arched eyebrows
          eyeCtx.lineWidth = 6;
          eyeCtx.beginPath();
          eyeCtx.arc(leftX, eyeY - 48, 30, Math.PI * 1.2, Math.PI * 1.8);
          eyeCtx.arc(rightX, eyeY - 48, 30, Math.PI * 1.2, Math.PI * 1.8);
          eyeCtx.stroke();

          // Open circle mouth (O)
          eyeCtx.beginPath();
          eyeCtx.arc(mouthX, mouthY + 2, 16, 0, Math.PI * 2);
          eyeCtx.stroke();
          break;
        }

        case 'slightly-sad': {
          // Soft tilted puppy-dog robot eyes
          [leftX, rightX].forEach((cx, idx) => {
            const tilt = idx === 0 ? 0.18 : -0.18;
            const eyeH = Math.max(4, 34 * blinkFactor);
            eyeCtx.fillStyle = cyanMain;
            eyeCtx.beginPath();
            eyeCtx.ellipse(cx + pupilX * 8, eyeY + 8, 26, eyeH, tilt, 0, Math.PI * 2);
            eyeCtx.fill();

            if (blinkFactor > 0.4) {
              eyeCtx.fillStyle = '#FFFFFF';
              eyeCtx.beginPath();
              eyeCtx.arc(cx + pupilX * 8 + 6, eyeY + 2, 5, 0, Math.PI * 2);
              eyeCtx.fill();
            }
          });

          // Soft drooped eyebrows
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 5;
          eyeCtx.beginPath();
          eyeCtx.moveTo(leftX - 25, eyeY - 26);
          eyeCtx.lineTo(leftX + 25, eyeY - 34);
          eyeCtx.moveTo(rightX - 25, eyeY - 34);
          eyeCtx.lineTo(rightX + 25, eyeY - 26);
          eyeCtx.stroke();

          // Cute tiny downturned pout
          eyeCtx.lineWidth = 6;
          eyeCtx.beginPath();
          eyeCtx.arc(mouthX, mouthY + 14, 20, Math.PI * 1.2, Math.PI * 1.8);
          eyeCtx.stroke();
          break;
        }

        case 'curious': {
          // Left Eye large and inquisitive, right eye slightly tilted
          const leftH = Math.max(4, 48 * blinkFactor);
          const rightH = Math.max(4, 34 * blinkFactor);

          eyeCtx.fillStyle = cyanMain;
          eyeCtx.beginPath();
          eyeCtx.ellipse(leftX + pupilX * 16, eyeY - 4, 30, leftH, -0.08, 0, Math.PI * 2);
          eyeCtx.ellipse(rightX + pupilX * 16, eyeY + 4, 22, rightH, 0.12, 0, Math.PI * 2);
          eyeCtx.fill();

          if (blinkFactor > 0.4) {
            eyeCtx.fillStyle = '#FFFFFF';
            eyeCtx.beginPath();
            eyeCtx.arc(leftX + pupilX * 16 + 8, eyeY - 14, 7, 0, Math.PI * 2);
            eyeCtx.arc(rightX + pupilX * 16 + 6, eyeY - 4, 5, 0, Math.PI * 2);
            eyeCtx.fill();
          }

          // Raised left eyebrow
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 6;
          eyeCtx.beginPath();
          eyeCtx.arc(leftX, eyeY - 46, 30, Math.PI * 1.2, Math.PI * 1.8);
          eyeCtx.moveTo(rightX - 20, eyeY - 26);
          eyeCtx.lineTo(rightX + 20, eyeY - 26);
          eyeCtx.stroke();

          // Gentle curious mouth curve
          eyeCtx.beginPath();
          eyeCtx.arc(mouthX + 6, mouthY - 6, 24, Math.PI * 0.18, Math.PI * 0.78);
          eyeCtx.stroke();
          break;
        }

        case 'idle':
        default: {
          // Big Soulful Astro-Chibi Robot Eyes with dual gradient and twin spark glints
          const eyeH = Math.max(3, 44 * blinkFactor);

          [leftX, rightX].forEach((cx) => {
            const grad = eyeCtx.createLinearGradient(0, eyeY - eyeH, 0, eyeY + eyeH);
            grad.addColorStop(0, '#00FFFF');
            grad.addColorStop(1, '#0088FF');
            eyeCtx.fillStyle = grad;

            eyeCtx.beginPath();
            eyeCtx.ellipse(
              cx + pupilX * 16,
              eyeY + pupilY * 10,
              26,
              eyeH,
              0,
              0,
              Math.PI * 2
            );
            eyeCtx.fill();

            // Twin Specular Sparkle Highlights (Creates Disney/Pixar living eye magic)
            if (blinkFactor > 0.35) {
              eyeCtx.fillStyle = '#FFFFFF';
              eyeCtx.beginPath();
              // Top-right major highlight
              eyeCtx.arc(
                cx + pupilX * 16 + 8,
                eyeY + pupilY * 10 - 10,
                6.5,
                0,
                Math.PI * 2
              );
              // Bottom-left secondary glint
              eyeCtx.arc(
                cx + pupilX * 16 - 7,
                eyeY + pupilY * 10 + 9,
                3.2,
                0,
                Math.PI * 2
              );
              eyeCtx.fill();
            }
          });

          // Gentle Eyebrows
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 5;
          eyeCtx.beginPath();
          eyeCtx.arc(leftX, eyeY - 38, 26, Math.PI * 1.2, Math.PI * 1.8);
          eyeCtx.arc(rightX, eyeY - 38, 26, Math.PI * 1.2, Math.PI * 1.8);
          eyeCtx.stroke();

          // Cute Friendly Glowing Smile ⌣
          eyeCtx.strokeStyle = cyanMain;
          eyeCtx.lineWidth = 8;
          eyeCtx.beginPath();
          eyeCtx.arc(mouthX, mouthY - 8, 28, Math.PI * 0.2, Math.PI * 0.8);
          eyeCtx.stroke();
          break;
        }
      }

      eyeTexture.needsUpdate = true;
    };

    // -------------------------------------------------------------
    // CURSOR TRACKING & PROXIMITY CALCULATOR
    // -------------------------------------------------------------
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const diffX = clientX - centerX;
      const diffY = clientY - centerY;
      const distance = Math.hypot(diffX, diffY);

      stateRef.current.cursorDistance = distance;

      // Normalized target cursor [-1 to 1] clamped
      const maxRange = Math.max(window.innerWidth / 2, 300);
      stateRef.current.targetMouseX = THREE.MathUtils.clamp(diffX / maxRange, -1, 1);
      stateRef.current.targetMouseY = THREE.MathUtils.clamp(-diffY / maxRange, -1, 1);

      // Evaluate Proximity Zones:
      // NEAR: < 170px (Happy, Excited, Waving)
      // NORMAL: 170px to 450px (Friendly, Idle, Breathing)
      // FAR: > 450px (Slightly sad, curious)
      let currentZone: ProximityZone = 'normal';
      if (distance < 170) {
        currentZone = 'near';
      } else if (distance > 450) {
        currentZone = 'far';
      }

      if (currentZone !== stateRef.current.activeZone) {
        stateRef.current.activeZone = currentZone;
        setProximityZone(currentZone);

        // Map proximity directly to internal emotion if not overridden by parent
        if (!isThinking && !isSpeaking && !externalEmotion) {
          if (currentZone === 'near') {
            setInternalEmotion('excited');
          } else if (currentZone === 'far') {
            setInternalEmotion('slightly-sad');
          } else {
            setInternalEmotion('idle');
          }
        }

        onProximityChange?.(currentZone, distance);
      }
    };

    const handleWindowBlur = () => {
      stateRef.current.isWindowFocused = false;
      stateRef.current.targetMouseX = 0;
      stateRef.current.targetMouseY = 0;
    };

    const handleWindowFocus = () => {
      stateRef.current.isWindowFocused = true;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    // -------------------------------------------------------------
    // RENDER ANIMATION LOOP
    // -------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      stateRef.current.time = time;

      const state = stateRef.current;
      const isReduced = state.prefersReducedMotion;

      // 1. Smooth Exponential Damping for Mouse Coordinates
      const dampSpeed = 7.5;
      state.mouseX = THREE.MathUtils.damp(state.mouseX, state.targetMouseX, dampSpeed, delta);
      state.mouseY = THREE.MathUtils.damp(state.mouseY, state.targetMouseY, dampSpeed, delta);

      // 2. Natural Blinking Loop (Varied random intervals every 3.5 - 6s)
      if (time - state.lastBlinkTime > 3.8 + Math.sin(time * 0.5) * 1.5) {
        state.isBlinking = true;
        state.lastBlinkTime = time;
      }

      if (state.isBlinking) {
        const blinkProgress = (time - state.lastBlinkTime) / state.blinkDuration;
        if (blinkProgress >= 1.0) {
          state.isBlinking = false;
          state.eyeBlinkFactor = 1.0;
        } else {
          // Half-cosine blink curve
          state.eyeBlinkFactor = Math.sin(blinkProgress * Math.PI) < 0.5 ? 0.08 : 0.9;
        }
      } else {
        state.eyeBlinkFactor = 1.0;
      }

      // 3. Dynamic Eye Visor Update
      const emotionToRender = state.currentEmotion;
      updateDigitalEyes(
        emotionToRender,
        state.eyeBlinkFactor,
        state.mouseX,
        -state.mouseY,
        time
      );

      // 4. Kinematic Movements
      // Head Pan & Tilt following cursor (clamped within realistic anatomical bounds)
      const maxHeadYaw = 0.55; // ~31 degrees
      const maxHeadPitch = 0.38; // ~22 degrees
      const targetHeadYaw = state.mouseX * maxHeadYaw;
      const targetHeadPitch = -state.mouseY * maxHeadPitch;

      // Add cute head tilt based on emotion
      let targetHeadRoll = 0;
      if (emotionToRender === 'curious' || emotionToRender === 'slightly-sad') {
        targetHeadRoll = 0.18; // Inquisitive 10 deg tilt
      } else if (emotionToRender === 'thinking') {
        targetHeadRoll = -0.15;
      }

      headPivot.rotation.y = THREE.MathUtils.damp(headPivot.rotation.y, targetHeadYaw, 8, delta);
      headPivot.rotation.x = THREE.MathUtils.damp(headPivot.rotation.x, targetHeadPitch, 8, delta);
      headPivot.rotation.z = THREE.MathUtils.damp(headPivot.rotation.z, targetHeadRoll, 6, delta);

      // 5. Breathing & Excited Hovering Suspension for Face
      const hoverSpeed = emotionToRender === 'excited' ? 6.5 : 2.4;
      const hoverAmplitude = emotionToRender === 'excited' ? 0.08 : 0.035;
      const hoverY = isReduced ? 0 : Math.sin(time * hoverSpeed) * hoverAmplitude;
      headPivot.position.y = THREE.MathUtils.damp(headPivot.position.y, hoverY, 6, delta);

      // 6. Rotating Magnetic Orbit Rings & Floating Halo Hover
      leftOrbitRing.rotation.y += delta * 1.6;
      rightOrbitRing.rotation.y -= delta * 1.6;
      haloMesh.position.y = 0.68 + (isReduced ? 0 : Math.sin(time * 3.0) * 0.02);

      // 7. Pulsing Ear Antenna & Forehead Glow Lighting
      const pulseSpeed = emotionToRender === 'excited' ? 12 : 3;
      const emissiveGlow = 0.9 + Math.sin(time * pulseSpeed) * 0.35;
      cyanAccentMat.emissiveIntensity = emissiveGlow;

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------
    // CLEANUP & DISPOSAL TO PREVENT MEMORY LEAKS
    // -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);

      // Dispose Three.js objects
      try {
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material?.dispose();
            }
          }
        });
        eyeTexture.dispose();
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      } catch (cleanErr) {
        console.warn('Error during Three.js cleanup:', cleanErr);
      }
    };
  }, [getDimensions, onProximityChange, isThinking, isSpeaking, externalEmotion]);

  return (
    <div
      className={`relative select-none ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={onClick ? 'Click to chat with SMILE AI' : 'SMILE AI Travel Companion'}
    >
      {/* Speech Bubble Tooltip */}
      {showSpeechBubble && bubbleVisible && speechBubbleText && (
        <div
          className={`absolute pointer-events-none z-30 transition-all duration-300 animate-in fade-in zoom-in-95 ${
            size === 'floating-launcher'
              ? 'bottom-full right-0 mb-3 w-52 sm:w-60'
              : size === 'stage'
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-3 w-64'
              : 'bottom-full right-0 mb-2 w-48'
          }`}
        >
          <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold py-2 px-3 rounded-2xl shadow-xl border border-cyan-400/40 relative flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 animate-ping" />
            <p className="leading-snug text-[11px] sm:text-xs text-cyan-50">
              {speechBubbleText}
            </p>
            {/* Triangular Speech Pointer */}
            <div className="absolute top-full right-6 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-slate-900/95" />
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="flex items-center justify-center relative touch-none"
        style={{
          width: getDimensions().width,
          height: getDimensions().height,
        }}
      >
        {/* WebGL Fallback if device does not support WebGL */}
        {webGLError && (
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#082B59] to-[#08A9F7] flex items-center justify-center text-white font-bold text-xs p-2 text-center shadow-lg">
            <span>SMILE 🤖</span>
          </div>
        )}
      </div>

      {/* Proximity / Status Glow Underneath */}
      <div
        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full blur-md transition-all duration-500 pointer-events-none ${
          proximityZone === 'near'
            ? 'bg-cyan-400/60 scale-125'
            : proximityZone === 'far'
            ? 'bg-blue-600/20 scale-90'
            : 'bg-cyan-400/35'
        }`}
      />
    </div>
  );
};
