import React from "react";
import logoUrl from "./icon.svg";
import { createStyles, MantineNumberSize, MantineSize } from "@mantine/core";

const sizeLookup: Record<MantineSize, number> = {
  xs: 10,
  sm: 20,
  md: 30,
  lg: 40,
  xl: 50,
};

type StyleProps = {
  size: number;
};

const useStyles = createStyles((_theme, { size }: StyleProps) => ({
  image: {
    width: size,
  },
}));

type LogoProps = {
  className?: string;
  size?: MantineNumberSize;
};

export function Logo({ className, size = "md" }: LogoProps): JSX.Element {
  const numberSize = typeof size === "number" ? size : sizeLookup[size];
  const { classes, cx } = useStyles({ size: numberSize });
  return (
    <img
      className={cx(className, classes.image)}
      src={logoUrl}
      alt="Bookmarks JSON"
    />
  );
}
