export default function playSound(soundEffect: string) {
  const sound = new Audio(soundEffect);
  sound.play();
}
