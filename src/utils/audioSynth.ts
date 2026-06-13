// offline-first nature sound audio synthesizers using Web Audio API
let audioCtx: AudioContext | null = null;
let noiseSource: AudioBufferSourceNode | null = null;
let waveLfo: OscillatorNode | null = null;
let mainGainNode: GainNode | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function startAmbientSound(type: 'rain' | 'waves', volume: number = 0.4) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Always stop current sound before starting a new one
    stopAmbientSound();

    // Create main gain node for user volume slider
    mainGainNode = ctx.createGain();
    mainGainNode.gain.setValueAtTime(volume, ctx.currentTime);
    mainGainNode.connect(ctx.destination);

    // Create a 2-second looped noise buffer
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const channelData = noiseBuffer.getChannelData(0);

    // Fill buffer with brownian-like noise (softer for nature relaxation)
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      channelData[i] = (lastOut + (0.05 * white)) / 1.05;
      lastOut = channelData[i];
      channelData[i] *= 3.5; // Compensate for loss of level
    }

    noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    if (type === 'rain') {
      // Gentle forest rain: highpass filter to cut rumble, bandpass/lowpass for rain droplets pitter patter
      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(2200, ctx.currentTime);

      const hpFilter = ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.setValueAtTime(350, ctx.currentTime);

      const peakFilter = ctx.createBiquadFilter();
      peakFilter.type = 'peaking';
      peakFilter.frequency.setValueAtTime(1200, ctx.currentTime);
      peakFilter.Q.setValueAtTime(1.5, ctx.currentTime);
      peakFilter.gain.setValueAtTime(3, ctx.currentTime);

      // Connections: source -> hp -> lp -> peak -> mainGain
      noiseSource.connect(hpFilter);
      hpFilter.connect(lpFilter);
      lpFilter.connect(peakFilter);
      peakFilter.connect(mainGainNode);

      noiseSource.start(0);
    } else if (type === 'waves') {
      // Distant rolling waves: lowpass filter swept periodically by a slow LFO
      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(350, ctx.currentTime);

      // Local waves internal volume swell gain
      const waveVolumeNode = ctx.createGain();
      waveVolumeNode.gain.setValueAtTime(0.12, ctx.currentTime);

      // Low frequency oscillator for wave timing (6-second frequency cycle)
      waveLfo = ctx.createOscillator();
      waveLfo.type = 'sine';
      waveLfo.frequency.setValueAtTime(0.16, ctx.currentTime); // ~6.2s period

      const lfoGainVolume = ctx.createGain();
      lfoGainVolume.gain.setValueAtTime(0.18, ctx.currentTime); // modulate volume by up to 18%

      const lfoGainFilter = ctx.createGain();
      lfoGainFilter.gain.setValueAtTime(220, ctx.currentTime); // sweep filter cutoff by up to 220Hz

      // Connect LFO modulator
      waveLfo.connect(lfoGainVolume);
      lfoGainVolume.connect(waveVolumeNode.gain);

      waveLfo.connect(lfoGainFilter);
      lfoGainFilter.connect(lpFilter.frequency);

      // Connections: source -> lp -> waveVolumeNode -> mainGain
      noiseSource.connect(lpFilter);
      lpFilter.connect(waveVolumeNode);
      waveVolumeNode.connect(mainGainNode);

      waveLfo.start(0);
      noiseSource.start(0);
    }
  } catch (e) {
    console.warn('Web Audio API nature sound synthesis failed:', e);
  }
}

export function stopAmbientSound() {
  try {
    if (noiseSource) {
      noiseSource.stop();
      noiseSource.disconnect();
      noiseSource = null;
    }
    if (waveLfo) {
      waveLfo.stop();
      waveLfo.disconnect();
      waveLfo = null;
    }
    if (mainGainNode) {
      mainGainNode.disconnect();
      mainGainNode = null;
    }
  } catch (e) {
    // Suppress clean closure errors
  }
}

export function setAmbientVolume(volume: number) {
  if (mainGainNode && audioCtx) {
    mainGainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  }
}
