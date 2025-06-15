type Props = {
  onClick: () => void;
  className?: string;
};

export function MoveDownButton({ onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Move Down"
      className={`border-1 bg-white ${className ?? ""}`}
    >
      ⬇️
    </button>
  );
}
