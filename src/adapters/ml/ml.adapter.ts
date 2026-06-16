import type { MLResult } from "./ml.mapper";

export interface MLAdapter {
  analyze(review: string): Promise<MLResult>;
  health(): Promise<boolean>;
}
