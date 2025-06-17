type Props = {
  hasUnsavedChanges: boolean;
  className?: string;
};

export function SaveButton({ hasUnsavedChanges, className }: Props) {
  return (
    <button
      type="submit"
      title="Save"
      className={`border-1 ${hasUnsavedChanges ? "bg-amber-400" : "bg-white"} ${
        className ?? ""
      }`}
    >
      💾
    </button>
  );
}
