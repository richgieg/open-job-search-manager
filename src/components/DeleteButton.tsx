type Props = {
  onClick: () => void;
  className?: string;
};

export function DeleteButton({ onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Delete"
      className={`border-1 bg-white ${className ?? ""}`}
    >
      ❌
    </button>
  );
}
