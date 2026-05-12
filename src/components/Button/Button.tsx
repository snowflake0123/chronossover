import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondaryPill" | "darkUtility" | "storeHero";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const classFor: Record<Variant, string> = {
  primary: styles.primary,
  secondaryPill: styles.secondaryPill,
  darkUtility: styles.darkUtility,
  storeHero: styles.storeHero,
};

export const Button = ({ variant = "primary", className, type = "button", ...rest }: Props) => {
  const cls = [styles.base, classFor[variant], className].filter(Boolean).join(" ");
  return <button type={type} className={cls} {...rest} />;
};
