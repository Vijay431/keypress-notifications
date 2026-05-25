export interface IKeypressService {
  initialize(): Promise<void>;
  enable(): Promise<void>;
  disable(): Promise<void>;
  detectKeyPress(commandId: string): void;
  getState(): { enabled: boolean; actionBufferLength: number; lastActionTime: number };
  dispose(): void;
}
