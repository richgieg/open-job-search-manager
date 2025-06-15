type Props = {
  text: string;
};

export function InputLabelText({ text }: Props) {
  return <div className="text-sm mb-0.5">{text}</div>;
}
