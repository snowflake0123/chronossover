import type { ChangeEvent } from "react";
import styles from "./YearPicker.module.css";

type Size = "md" | "lg";

type Props = {
  value: number;
  onChange: (year: number) => void;
  min?: number;
  max?: number;
  id?: string;
  size?: Size;
  hideLabel?: boolean;
  disabled?: boolean;
  inputClassName?: string;
};

export const YearPicker = ({
  value,
  onChange,
  min = 0,
  max = 9999,
  id = "year-picker",
  size = "md",
  hideLabel = false,
  disabled = false,
  inputClassName,
}: Props) => {
  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(Number.NaN);
      return;
    }
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    const clamped = Math.min(max, Math.max(min, Math.floor(v)));
    onChange(clamped);
  };

  const displayValue = Number.isFinite(value) ? value : "";

  const wrapperCls = [styles.wrapper, size === "lg" && styles.wrapperLg].filter(Boolean).join(" ");
  const labelCls = [styles.label, size === "lg" && styles.labelLg].filter(Boolean).join(" ");
  const inputCls = [styles.input, size === "lg" && styles.inputLg, inputClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={wrapperCls} htmlFor={id}>
      {hideLabel ? null : <span className={labelCls}>Year</span>}
      <input
        id={id}
        className={inputCls}
        type="number"
        min={min}
        max={max}
        step={1}
        value={displayValue}
        onChange={handle}
        disabled={disabled}
      />
    </label>
  );
};
