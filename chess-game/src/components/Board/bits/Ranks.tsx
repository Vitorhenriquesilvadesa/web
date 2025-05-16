import "./Ranks.css";

interface RanksProps {
  ranks: string[];
}

export default function Ranks({ ranks }: RanksProps) {
  return (
    <div className="ranks">
      {ranks.map((rank: string) => (
        <span key={rank}>{rank}</span>
      ))}
    </div>
  );
}
