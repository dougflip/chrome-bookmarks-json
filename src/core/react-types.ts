import React, { ReactChild, ReactPortal } from "react";

/**
 * Use in place of ReactFragment for a safer type that does NOT
 * include arbitrary objects which React will not be able to render.
 * see: https://changelog.com/posts/the-react-reactnode-type-is-a-black-hole
 */
export type StrictReactFragment =
  | {
      key?: string | number | null;
      ref?: null;
      props?: {
        children?: StrictReactNode;
      };
    }
  | Iterable<React.ReactNode>;

/**
 * Use in place of ReactNode for a safer type that does NOT
 * include arbitrary objects which React will not be able to render.
 * see: https://changelog.com/posts/the-react-reactnode-type-is-a-black-hole
 */
export type StrictReactNode =
  | ReactChild
  | StrictReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined;
