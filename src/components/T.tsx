interface TProps { en: string; np: string; }
export function T({ en, np }: TProps) {
  return (
    <>
      <span className="en-text">{en}</span>
      <span className="np-text">{np}</span>
    </>
  );
}
