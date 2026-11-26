// Generated on an intentional gesture only. No audio files, network, timer loop or autoplay.
let context: AudioContext | undefined;
export function paperSound(kind: 'mark' | 'win'): void {
  if (typeof AudioContext === 'undefined') return;
  try {
    const audio = context ??= new AudioContext();
    if (audio.state === 'suspended') void audio.resume().catch(() => {});
    for (const [i, pitch] of (kind === 'win' ? [523, 659, 784] : [415]).entries()) {
      const start = audio.currentTime + i * 0.095;
      const tone = audio.createOscillator();
      const volume = audio.createGain();
      tone.type = 'sine'; tone.frequency.value = pitch;
      volume.gain.setValueAtTime(0.0001, start);
      volume.gain.exponentialRampToValueAtTime(0.043, start + 0.008);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.115);
      tone.connect(volume).connect(audio.destination);
      tone.onended = () => { tone.disconnect(); volume.disconnect(); };
      tone.start(start); tone.stop(start + 0.12);
    }
  } catch { /* Audio is optional; a blocked audio context must not interrupt a turn. */ }
}
