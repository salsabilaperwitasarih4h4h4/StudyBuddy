// Web Audio API realistic acoustic synthesis engine for StudyBuddy
// Generates authentic acoustic piano, fingerstyle acoustic guitar, lofi Rhodes, and cello strings

class AudioService {
  private ctx: AudioContext | null = null;
  private currentInstrument: string | null = null;
  private instrumentInterval: any = null;
  private isInstrumentPlaying: boolean = false;
  private instrumentVolume: number = 0.55;
  private alarmInterval: any = null;
  private sensorBeepInterval: any = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // --- ALARM SOUNDS ---
  public playRingtone(tone: 'lonceng' | 'digital' | 'lembut', loop = false) {
    this.stopAlarm();
    const playOnce = () => {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      if (tone === 'lonceng') {
        // Melodic warm bell chime (C5, E5, G5, B5, C6)
        const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);
          
          gain.gain.setValueAtTime(0.3, now + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 1.6);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + idx * 0.18);
          osc.stop(now + idx * 0.18 + 1.7);
        });
      } else if (tone === 'digital') {
        // High pitch urgent digital beeper (beep-beep-beep-beep)
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(i % 2 === 0 ? 880 : 1046.5, now + i * 0.15);
          
          gain.gain.setValueAtTime(0.25, now + i * 0.15);
          gain.gain.setValueAtTime(0.001, now + i * 0.15 + 0.09);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.1);
        }
      } else {
        // Soft calming acoustic chime
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.25);
          
          gain.gain.setValueAtTime(0.25, now + idx * 0.25);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.25 + 2.0);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + idx * 0.25);
          osc.stop(now + idx * 0.25 + 2.1);
        });
      }
    };

    playOnce();

    if (loop) {
      this.alarmInterval = setInterval(() => {
        playOnce();
      }, tone === 'digital' ? 900 : 2000);
    }
  }

  public stopAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  // --- SENSOR DETEKSI KELUAR WEB BEEP ---
  public startSensorWarning() {
    if (this.sensorBeepInterval) return;
    const playBeep = () => {
      try {
        const ctx = this.getContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.38);
      } catch {
        // ignore audio failure if autoplay is blocked
      }
    };

    playBeep();
    this.sensorBeepInterval = setInterval(playBeep, 1200);
  }

  public stopSensorWarning() {
    if (this.sensorBeepInterval) {
      clearInterval(this.sensorBeepInterval);
      this.sensorBeepInterval = null;
    }
  }

  // --- POMODORO FINISH CELEBRATION CHIME ---
  public playPomodoroComplete() {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const freqs = [392, 493.88, 587.33, 783.99, 987.77, 1174.66];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.3, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.9);
    });
  }

  // --- INSTRUMENT MUSIC SYNTHESIZER ---
  public setVolume(vol: number) {
    this.instrumentVolume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.instrumentVolume;
  }

  public isPlaying(): boolean {
    return this.isInstrumentPlaying;
  }

  public getActiveInstrument(): string | null {
    return this.currentInstrument;
  }

  public stopInstrument() {
    this.isInstrumentPlaying = false;
    this.currentInstrument = null;
    if (this.instrumentInterval) {
      clearInterval(this.instrumentInterval);
      this.instrumentInterval = null;
    }
  }

  /**
   * Synthesize an authentic acoustic piano note:
   * Uses multi-harmonic additive synthesis with hammer strike transient
   * and dual-decay body resonance.
   */
  private playPianoNote(freq: number, startTime: number, duration = 2.4, velocity = 0.8) {
    const ctx = this.getContext();
    const harmonics = [
      { mult: 1.0, gain: 1.0 },
      { mult: 2.0, gain: 0.5 },
      { mult: 3.0, gain: 0.25 },
      { mult: 4.0, gain: 0.12 },
      { mult: 5.0, gain: 0.05 },
      { mult: 6.0, gain: 0.02 }
    ];

    const masterGain = ctx.createGain();
    const baseVol = 0.16 * velocity * this.instrumentVolume;
    
    // Initial attack and dual-stage natural piano decay
    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.linearRampToValueAtTime(baseVol, startTime + 0.015);
    masterGain.gain.exponentialRampToValueAtTime(baseVol * 0.45, startTime + 0.3);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Filter to emulate warm piano soundboard
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 5, 4500), startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 2, 1200), startTime + duration);

    harmonics.forEach((h) => {
      const osc = ctx.createOscillator();
      const hGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * h.mult, startTime);
      hGain.gain.setValueAtTime(h.gain, startTime);

      osc.connect(hGain);
      hGain.connect(filter);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
  }

  /**
   * Synthesize a fingerstyle acoustic guitar string pluck:
   * Uses plucked transient + wooden soundboard resonance + damping harmonics
   */
  private playAcousticGuitarPluck(freq: number, startTime: number, duration = 1.8, velocity = 0.85) {
    const ctx = this.getContext();
    const now = startTime;

    // String fundamental & harmonics
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Overtone to give steel string presence
    const overtone = ctx.createOscillator();
    overtone.type = 'sawtooth';
    overtone.frequency.setValueAtTime(freq * 2, now);

    // Warm wooden soundboard filter (bandpass around 180Hz - 2200Hz)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.6);

    const gain = ctx.createGain();
    const overtoneGain = ctx.createGain();
    const baseVol = 0.22 * velocity * this.instrumentVolume;

    // Pluck envelope: crisp instant attack, fast initial drop, then vibrating decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(baseVol, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(baseVol * 0.35, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    overtoneGain.gain.setValueAtTime(baseVol * 0.2, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    overtone.connect(filter);
    overtone.connect(overtoneGain);
    overtoneGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
    overtone.start(now);
    overtone.stop(now + 0.5);
  }

  public playInstrument(type: 'piano' | 'guitar' | 'lofi' | 'cello'): boolean {
    if (this.currentInstrument === type && this.isInstrumentPlaying) {
      this.stopInstrument();
      return false; // toggled off
    }

    this.stopInstrument();
    this.currentInstrument = type;
    this.isInstrumentPlaying = true;

    const ctx = this.getContext();

    if (type === 'piano') {
      // Calming classical piano piece (Gymnopédie inspired gentle arpeggiated voicings)
      // Dmaj7 -> Gmaj7 -> Bm7 -> A7sus4
      const chords = [
        // Dmaj7: Bass D3, Right hand F#4, A4, C#5, E5
        { bass: 146.83, notes: [369.99, 440.0, 554.37, 659.25] },
        // Gmaj7: Bass G2, Right hand G4, B4, D5, F#5
        { bass: 98.0,   notes: [392.0, 493.88, 587.33, 739.99] },
        // Bm7: Bass B2, Right hand F#4, A4, D5, F#5
        { bass: 123.47, notes: [369.99, 440.0, 587.33, 739.99] },
        // A7sus4: Bass A2, Right hand E4, G4, A4, D5
        { bass: 110.0,  notes: [329.63, 392.0, 440.0, 587.33] }
      ];

      let chordIdx = 0;
      let step = 0;

      const tickPiano = () => {
        if (!this.isInstrumentPlaying) return;
        const now = ctx.currentTime;
        const currentChord = chords[chordIdx];

        if (step === 0) {
          // Play deep warm piano bass
          this.playPianoNote(currentChord.bass, now, 3.2, 0.95);
          // Play first harmony note
          this.playPianoNote(currentChord.notes[0], now + 0.05, 2.5, 0.7);
        } else if (step === 1) {
          this.playPianoNote(currentChord.notes[1], now, 2.3, 0.75);
        } else if (step === 2) {
          this.playPianoNote(currentChord.notes[2], now, 2.4, 0.85);
        } else if (step === 3) {
          this.playPianoNote(currentChord.notes[3], now, 2.6, 0.8);
        } else if (step === 4) {
          this.playPianoNote(currentChord.notes[1], now, 2.0, 0.65);
        } else if (step === 5) {
          this.playPianoNote(currentChord.notes[2], now, 2.2, 0.7);
        }

        step++;
        if (step >= 6) {
          step = 0;
          chordIdx = (chordIdx + 1) % chords.length;
        }
      };

      tickPiano();
      this.instrumentInterval = setInterval(tickPiano, 650);

    } else if (type === 'guitar') {
      // Relaxing acoustic fingerstyle guitar picking (G - Em7 - Cadd9 - D)
      const guitarPatterns = [
        // G Major: G2(98), D3(146.83), G3(196), B3(246.94), D4(293.66), G4(392)
        [98.0, 196.0, 246.94, 293.66, 392.0, 293.66],
        // Em7: E2(82.41), E3(164.81), G3(196), B3(246.94), D4(293.66), G4(392)
        [82.41, 164.81, 196.0, 246.94, 293.66, 196.0],
        // Cadd9: C3(130.81), G3(196), C4(261.63), D4(293.66), G4(392), D4(293.66)
        [130.81, 196.0, 261.63, 293.66, 392.0, 293.66],
        // Dsus4/D: D3(146.83), A3(220), D4(293.66), F#4(369.99), A4(440), F#4(369.99)
        [146.83, 220.0, 293.66, 369.99, 440.0, 369.99]
      ];

      let patternIdx = 0;
      let pickStep = 0;

      const tickGuitar = () => {
        if (!this.isInstrumentPlaying) return;
        const now = ctx.currentTime;
        const chord = guitarPatterns[patternIdx];
        const freq = chord[pickStep];

        // Bass string is plucked firmer, high strings more gently
        const isBass = pickStep === 0;
        this.playAcousticGuitarPluck(freq, now, isBass ? 2.5 : 1.8, isBass ? 0.95 : 0.75);

        pickStep++;
        if (pickStep >= chord.length) {
          pickStep = 0;
          patternIdx = (patternIdx + 1) % guitarPatterns.length;
        }
      };

      tickGuitar();
      this.instrumentInterval = setInterval(tickGuitar, 420);

    } else if (type === 'lofi') {
      // Warm Rhodes electric piano chords + subtle vinyl texture
      const lofiChords = [
        [220.0, 261.63, 329.63, 392.0],   // Am7
        [174.61, 220.0, 261.63, 329.63],  // Fmaj7
        [261.63, 329.63, 392.0, 493.88],  // Cmaj7
        [196.0, 246.94, 293.66, 349.23]   // G7
      ];
      let chordStep = 0;

      const playLofiTick = () => {
        if (!this.isInstrumentPlaying) return;
        const chord = lofiChords[chordStep];
        const now = ctx.currentTime;

        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(950, now);

          const v = 0.13 * this.instrumentVolume;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(v, now + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 2.4);
        });

        chordStep = (chordStep + 1) % lofiChords.length;
      };

      playLofiTick();
      this.instrumentInterval = setInterval(playLofiTick, 2400);

    } else if (type === 'cello') {
      // Deep sustained cello with subtle 5Hz vibrato and warm acoustic string resonance
      const celloPads = [
        [130.81, 196.0, 329.63], // C3, G3, E4
        [110.0, 164.81, 261.63], // A2, E3, C4
        [87.31, 130.81, 220.0],  // F2, C3, A3
        [98.0, 146.83, 246.94]   // G2, D3, B3
      ];
      let padStep = 0;

      const playCelloTick = () => {
        if (!this.isInstrumentPlaying) return;
        const pad = celloPads[padStep];
        const now = ctx.currentTime;

        pad.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          // LFO for natural cello string vibrato
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(4.8, now); // 4.8 Hz human vibrato
          lfoGain.gain.setValueAtTime(freq * 0.012, now); // 1.2% pitch modulation
          lfo.connect(osc.frequency);
          lfo.start(now);
          lfo.stop(now + 3.4);

          osc.type = idx === 0 ? 'triangle' : 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);

          // Cello body formant filter
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(680, now);

          const v = (idx === 0 ? 0.19 : 0.09) * this.instrumentVolume;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(v, now + 0.7); // slow bow attack
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 3.3);
        });

        padStep = (padStep + 1) % celloPads.length;
      };

      playCelloTick();
      this.instrumentInterval = setInterval(playCelloTick, 3400);
    }

    return true; // started
  }
}

export const audioService = new AudioService();
