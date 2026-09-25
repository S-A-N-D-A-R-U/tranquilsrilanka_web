type Props = {
  value: string;
  onChange: (value: string) => void;
};

/** Spam trap: hidden from people and screen readers, but bots tend to fill it in. */
export default function Honeypot({ value, onChange }: Props) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
