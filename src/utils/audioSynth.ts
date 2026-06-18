// Offline-first procedural nature sound audio synthesizers using Web Audio API
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

interface SoundChannel {
  nodes: any[];
  gainNode: GainNode;
  userVolume: number;
  status: 'playing' | 'stopped';
}

const activeChannels: Record<string, SoundChannel> = {};

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function getMasterGain(): GainNode {
  const ctx = getAudioContext();
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, ctx.currentTime); // High-comfort default volume
    masterGain.connect(ctx.destination);
  }
  return masterGain;
}

// Procedural brown noise buffer builder (2-second loop)
function getBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Lowpass filtration loop to create deep fractal Brownian rumble
    data[i] = (lastOut + (0.025 * white)) / 1.025;
    lastOut = data[i];
    data[i] *= 3.8; // Gain compensation
  }
  return buffer;
}

// Procedural white noise buffer builder (2-second loop)
function getWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// Start helper for individual soundscape channels
export function setSoundscapeChannel(
  channel: 'rain' | 'waves' | 'wind' | 'crickets' | 'bowl' | 'brownNoise',
  active: boolean,
  volume: number = 0.4
) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const master = getMasterGain();

    // 1. If currently playing, stop it first
    stopSoundscapeChannel(channel);

    if (!active) {
      return;
    }

    // 2. Setup channel volume gain node
    const channelGain = ctx.createGain();
    channelGain.gain.setValueAtTime(volume, ctx.currentTime);
    channelGain.connect(master);

    const nodesToStop: any[] = [];

    if (channel === 'rain') {
      // Gentle Rain
      const buffer = getBrownNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(2200, ctx.currentTime);

      const hpFilter = ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.setValueAtTime(320, ctx.currentTime);

      const peakFilter = ctx.createBiquadFilter();
      peakFilter.type = 'peaking';
      peakFilter.frequency.setValueAtTime(1200, ctx.currentTime);
      peakFilter.Q.setValueAtTime(1.5, ctx.currentTime);
      peakFilter.gain.setValueAtTime(4.0, ctx.currentTime);

      // Low frequency droplet flutter (0.35 Hz oscillation)
      const rainLfo = ctx.createOscillator();
      rainLfo.type = 'sine';
      rainLfo.frequency.setValueAtTime(0.35, ctx.currentTime);

      const rainLfoGain = ctx.createGain();
      rainLfoGain.gain.setValueAtTime(0.15, ctx.currentTime); // Up to 15% rain rustling amplitude shift

      rainLfo.connect(rainLfoGain);
      rainLfoGain.connect(channelGain.gain);

      // Connect source -> hp -> lp -> peak -> channelGain
      source.connect(hpFilter);
      hpFilter.connect(lpFilter);
      lpFilter.connect(peakFilter);
      peakFilter.connect(channelGain);

      source.start(0);
      rainLfo.start(0);

      nodesToStop.push(source, rainLfo);

    } else if (channel === 'waves') {
      // Rolling Ocean Waves (Swell swept by LFO modulation)
      const buffer = getBrownNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(320, ctx.currentTime);

      const dynamicVolume = ctx.createGain();
      dynamicVolume.gain.setValueAtTime(0.02, ctx.currentTime); // Inward swell level starts quiet

      const waveLfo = ctx.createOscillator();
      waveLfo.type = 'sine';
      waveLfo.frequency.setValueAtTime(0.14, ctx.currentTime); // ~7.1s swell period

      const lfoVolGain = ctx.createGain();
      lfoVolGain.gain.setValueAtTime(0.24, ctx.currentTime); // Wave swell amplitude depth

      const lfoFiltGain = ctx.createGain();
      lfoFiltGain.gain.setValueAtTime(230, ctx.currentTime); // Wave sweep filter amplitude

      waveLfo.connect(lfoVolGain);
      lfoVolGain.connect(dynamicVolume.gain);

      waveLfo.connect(lfoFiltGain);
      lfoFiltGain.connect(lpFilter.frequency);

      source.connect(lpFilter);
      lpFilter.connect(dynamicVolume);
      dynamicVolume.connect(channelGain);

      source.start(0);
      waveLfo.start(0);

      nodesToStop.push(source, waveLfo);

    } else if (channel === 'wind') {
      // Whispering Forest Breeze
      const buffer = getWhiteNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.Q.setValueAtTime(8.5, ctx.currentTime); // High-Q focus sweeps for airy whistletones
      bandpass.frequency.setValueAtTime(450, ctx.currentTime);

      const windLfo = ctx.createOscillator();
      windLfo.type = 'sine';
      windLfo.frequency.setValueAtTime(0.045, ctx.currentTime); // ~22s wind-gust period

      const windLfoGain = ctx.createGain();
      windLfoGain.gain.setValueAtTime(340, ctx.currentTime); // Sweeps between 110Hz and 790Hz

      windLfo.connect(windLfoGain);
      windLfoGain.connect(bandpass.frequency);

      source.connect(bandpass);
      bandpass.connect(channelGain);

      source.start(0);
      windLfo.start(0);

      nodesToStop.push(source, windLfo);

    } else if (channel === 'crickets') {
      // Night Insects & Crickets (Pulsed High-Freq shimmering pitch carrier)
      const carrier = ctx.createOscillator();
      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(3920, ctx.currentTime); // Shrill high-frequency trill

      // Rapid tremble shaker
      const Shudder = ctx.createOscillator();
      Shudder.type = 'sine';
      Shudder.frequency.setValueAtTime(50, ctx.currentTime);

      const ShudderGain = ctx.createGain();
      ShudderGain.gain.setValueAtTime(0.45, ctx.currentTime);
      Shudder.connect(ShudderGain);

      const voiceGain = ctx.createGain();
      voiceGain.gain.setValueAtTime(0.015, ctx.currentTime); // Very quiet base level so it is subtle background

      // Slow periodic chirping gating LFO
      const pulseGate = ctx.createOscillator();
      pulseGate.type = 'sine';
      pulseGate.frequency.setValueAtTime(0.9, ctx.currentTime); // approx 1 chirp frame per 1.1s

      const gateGain = ctx.createGain();
      gateGain.gain.setValueAtTime(10.0, ctx.currentTime); // Overdrive clipping simulator

      const gateOffset = ctx.createGain();
      gateOffset.gain.setValueAtTime(0.2, ctx.currentTime);

      pulseGate.connect(gateGain);

      // Connecting shimmer and gate together directly to the voice volume control
      ShudderGain.connect(voiceGain.gain);
      gateGain.connect(voiceGain.gain);

      carrier.connect(voiceGain);
      voiceGain.connect(channelGain);

      carrier.start(0);
      Shudder.start(0);
      pulseGate.start(0);

      nodesToStop.push(carrier, Shudder, pulseGate);

    } else if (channel === 'bowl') {
      // Tibetan Meditation Resonance Singing Bowl Chords
      const freqs = [172.0, 258.4, 387.2, 580.8, 871.2]; // Clean perfect harmonized partials
      const partialGains = [0.4, 0.32, 0.22, 0.12, 0.06];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const tremor = ctx.createOscillator();
        tremor.type = 'sine';
        tremor.frequency.setValueAtTime(0.08 + idx * 0.03, ctx.currentTime); // Separate vibration tremolo phase

        const tremorGain = ctx.createGain();
        tremorGain.gain.setValueAtTime(partialGains[idx] * 0.32, ctx.currentTime);

        const partialGain = ctx.createGain();
        partialGain.gain.setValueAtTime(partialGains[idx], ctx.currentTime);

        tremor.connect(tremorGain);
        tremorGain.connect(partialGain.gain);

        osc.connect(partialGain);
        partialGain.connect(channelGain);

        osc.start(0);
        tremor.start(0);

        nodesToStop.push(osc, tremor);
      });

    } else if (channel === 'brownNoise') {
      // Deep Sleep Brownian Warm Static
      const buffer = getBrownNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(160, ctx.currentTime); // Extreme warm filtration: chops highs completely

      source.connect(lpFilter);
      lpFilter.connect(channelGain);

      source.start(0);

      nodesToStop.push(source);
    }

    activeChannels[channel] = {
      nodes: nodesToStop,
      gainNode: channelGain,
      userVolume: volume,
      status: 'playing',
    };

  } catch (e) {
    console.warn(`Web Audio API compilation failed for channel ${channel}:`, e);
  }
}

// Stop a single soundscape channel
export function stopSoundscapeChannel(channel: string) {
  try {
    const activeCh = activeChannels[channel];
    if (activeCh) {
      activeCh.nodes.forEach((node) => {
        try {
          node.stop();
          node.disconnect();
        } catch (err) {
          // Suppress already stopped or detached node signals
        }
      });
      activeCh.nodes = [];
      try {
        activeCh.gainNode.disconnect();
      } catch (err) {
        // Suppress detaching errors
      }
      activeCh.status = 'stopped';
      delete activeChannels[channel];
    }
  } catch (e) {
    // Suppress clean closure errors
  }
}

// Set volume slider for a single channel
export function setSoundscapeChannelVolume(channel: string, volume: number) {
  const activeCh = activeChannels[channel];
  if (activeCh && audioCtx) {
    activeCh.userVolume = volume;
    activeCh.gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  }
}

// Master Soundscape Shutdown
export function stopAllSoundscapeChannels() {
  Object.keys(activeChannels).forEach((channel) => {
    stopSoundscapeChannel(channel);
  });
}

// Master Soundscape Volume adjustment
export function setMasterSoundscapeVolume(volume: number) {
  const master = getMasterGain();
  if (audioCtx) {
    master.gain.setValueAtTime(volume, audioCtx.currentTime);
  }
}

// ============================================================================
// BACKWARD-COMPATIBILITY LAYER FOR Guidest Breathing Screen Triggers:
// ============================================================================
export function startAmbientSound(type: 'rain' | 'waves', volume: number = 0.4) {
  // Gracefully stop everything on soundscapes, start requested node
  stopAllSoundscapeChannels();
  setSoundscapeChannel(type, true, volume);
}

export function stopAmbientSound() {
  stopAllSoundscapeChannels();
}

export function setAmbientVolume(volume: number) {
  setMasterSoundscapeVolume(volume);
  // Also sync existing active channel gains if active
  Object.keys(activeChannels).forEach((channel) => {
    setSoundscapeChannelVolume(channel, volume);
  });
}
