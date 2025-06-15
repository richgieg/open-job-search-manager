type Props = {
  text: string;
};

export function SectionHeading({ text }: Props) {
  return <div className="font-bold mt-8">{text}</div>;
}
