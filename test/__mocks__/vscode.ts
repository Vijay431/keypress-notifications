export const workspace = {
  getConfiguration: (_section?: string) => ({
    get: <T>(_key: string, defaultValue?: T): T => defaultValue as T,
    update: async () => {},
    has: () => false,
    inspect: () => undefined,
  }),
  onDidChangeConfiguration: (_handler: unknown) => ({ dispose: () => {} }),
};

export const commands = {
  executeCommand: async () => undefined,
  registerCommand: (_id: string, _handler: unknown) => ({ dispose: () => {} }),
  getCommands: async (): Promise<string[]> => [],
};

export const window = {
  showInformationMessage: async (_message: string) => undefined,
  showWarningMessage: async (_message: string) => undefined,
  showErrorMessage: async (_message: string) => undefined,
  createOutputChannel: (_name: string) => ({
    appendLine: (_line: string) => {},
    append: (_text: string) => {},
    show: () => {},
    dispose: () => {},
    clear: () => {},
  }),
};

export enum ConfigurationTarget {
  Global = 1,
  Workspace = 2,
  WorkspaceFolder = 3,
}

export class Disposable {
  constructor(public readonly callOnDispose: () => void) {}
  dispose(): void { this.callOnDispose(); }
  static from(...disposables: { dispose(): void }[]): Disposable {
    return new Disposable(() => disposables.forEach(d => d.dispose()));
  }
}

export class EventEmitter<T = void> {
  private listeners: ((e: T) => unknown)[] = [];
  event = (listener: (e: T) => unknown) => {
    this.listeners.push(listener);
    return { dispose: () => { this.listeners = this.listeners.filter(l => l !== listener); } };
  };
  fire(data: T): void { this.listeners.forEach(l => l(data)); }
  dispose(): void { this.listeners = []; }
}
