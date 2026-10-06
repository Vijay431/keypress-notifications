export interface IKeypressService {
  initialize(): Promise<void>;
  detectKeyPress(commandId: string): void;
  getState(): { actionBufferLength: number; lastActionTime: number };
  dispose(): void;
}
