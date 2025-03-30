// types/matter-extensions.d.ts

import "matter-js";

declare module "matter-js" {
  export interface Body {
    el?: HTMLElement | null;
  }
}
