/**
 * Utility functions for audio playback
 */

/**
 * Plays an audio file from a URL
 * @param audioUrl - The URL of the audio file to play
 */
export const playAudio = (audioUrl: string | undefined | null): void => {
  if (!audioUrl) return;
  const audio = new Audio(audioUrl);
  audio.play().catch((error) => {
    console.error('Error playing audio:', error);
  });
};

