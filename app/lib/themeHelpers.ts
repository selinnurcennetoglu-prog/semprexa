export function getThemeBg(theme: string | null): string {
  switch (theme) {
    case "karanlik":
      return `
        radial-gradient(ellipse 500px 500px at 10% 15%, #c0c0c018 0%, transparent 70%),
        radial-gradient(ellipse 400px 400px at 85% 25%, #80808015 0%, transparent 70%),
        radial-gradient(ellipse 600px 350px at 45% 8%, #e6394612 0%, transparent 70%),
        radial-gradient(ellipse 350px 500px at 25% 75%, #c0c0c010 0%, transparent 70%),
        linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)`;
    case "lacivert":
      return `
        radial-gradient(ellipse 500px 500px at 10% 15%, #00b4d818 0%, transparent 70%),
        radial-gradient(ellipse 400px 400px at 85% 25%, #48cae415 0%, transparent 70%),
        radial-gradient(ellipse 600px 350px at 45% 8%, #0077b612 0%, transparent 70%),
        radial-gradient(ellipse 350px 500px at 25% 75%, #90e0ef10 0%, transparent 70%),
        linear-gradient(180deg, #0a1628 0%, #0f1f38 50%, #081422 100%)`;
    case "yesil":
      return `
        radial-gradient(ellipse 500px 500px at 10% 15%, #52b78818 0%, transparent 70%),
        radial-gradient(ellipse 400px 400px at 85% 25%, #74c69d15 0%, transparent 70%),
        radial-gradient(ellipse 600px 350px at 45% 8%, #2d6a4f12 0%, transparent 70%),
        radial-gradient(ellipse 350px 500px at 25% 75%, #95d5b210 0%, transparent 70%),
        linear-gradient(180deg, #0a1a12 0%, #122518 50%, #081510 100%)`;
    case "pembe":
      return `
        radial-gradient(ellipse 500px 500px at 10% 15%, #ff6b9d18 0%, transparent 70%),
        radial-gradient(ellipse 400px 400px at 85% 25%, #ffc0cb15 0%, transparent 70%),
        radial-gradient(ellipse 600px 350px at 45% 8%, #ff8fab12 0%, transparent 70%),
        radial-gradient(ellipse 350px 500px at 25% 75%, #ff6b9d10 0%, transparent 70%),
        linear-gradient(180deg, #2a1525 0%, #331a2e 50%, #1f1020 100%)`;
    case "bej":
      return `
        radial-gradient(ellipse 500px 500px at 10% 15%, #c9a96e18 0%, transparent 70%),
        radial-gradient(ellipse 400px 400px at 85% 25%, #d4b89615 0%, transparent 70%),
        radial-gradient(ellipse 600px 350px at 45% 8%, #8b735512 0%, transparent 70%),
        radial-gradient(ellipse 350px 500px at 25% 75%, #e8d5a810 0%, transparent 70%),
        linear-gradient(180deg, #2a2218 0%, #352c20 50%, #201a12 100%)`;
    default:
      return `
        radial-gradient(ellipse 600px 600px at 5% 15%, #FF5CA830 0%, transparent 70%),
        radial-gradient(ellipse 500px 500px at 92% 25%, #00F0FF25 0%, transparent 70%),
        radial-gradient(ellipse 700px 400px at 50% 8%, #BC6CFF20 0%, transparent 70%),
        radial-gradient(ellipse 400px 600px at 15% 60%, #FFB86B20 0%, transparent 70%),
        linear-gradient(180deg, #0B0F2B 0%, #0d1130 50%, #080c20 100%)`;
  }
}
