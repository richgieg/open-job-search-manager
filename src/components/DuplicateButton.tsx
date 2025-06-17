type Props = {
  onClick: () => void;
  className?: string;
};

export function DuplicateButton({ onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Duplicate"
      className={`border-1 bg-white ${className ?? ""}`}
    >
      🧬
    </button>
  );
}
