type Props = {
  onClick: () => void;
  className?: string;
};

export function MoveUpButton({ onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Move Up"
      className={`border-1 bg-white ${className ?? ""}`}
    >
      ⬆️
    </button>
  );
}
