// Synthesized Ambient Weather Audio Engine using Web Audio API

export class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentMode = 'rain';
    this.volume = 0.25;
    this.nodes = [];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  createNoiseBuffer() {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }

  start(mode = 'rain') {
    this.initContext();
    this.stop();
    this.currentMode = mode;
    this.isPlaying = true;

    try {
      const noiseBuffer = this.createNoiseBuffer();
      if (!noiseBuffer) return;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      if (mode.includes('rain')) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

        const highFilter = this.ctx.createBiquadFilter();
        highFilter.type = 'highpass';
        highFilter.frequency.setValueAtTime(250, this.ctx.currentTime);

        noiseSource.connect(filter);
        filter.connect(highFilter);
        highFilter.connect(masterGain);
      } else if (mode.includes('snow') || mode.includes('wind')) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);
        filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        this.nodes.push(lfo, lfoGain);

        noiseSource.connect(filter);
        filter.connect(masterGain);
      } else if (mode.includes('thunder')) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, this.ctx.currentTime);

        noiseSource.connect(filter);
        filter.connect(masterGain);
      } else {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

        noiseSource.connect(filter);
        filter.connect(masterGain);
      }

      masterGain.connect(this.ctx.destination);
      noiseSource.start();

      this.nodes.push(noiseSource, masterGain);
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  }

  stop() {
    this.isPlaying = false;
    for (let node of this.nodes) {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (err) {}
    }
    this.nodes = [];
  }

  toggle(mode) {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(mode || this.currentMode);
      return true;
    }
  }
}
