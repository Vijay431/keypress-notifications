/**
 * Minimal VS Code API mock for Vitest unit tests.
 * Only stubs what the extension services actually use.
 * No real filesystem, network, or child_process access.
 */

export const workspace = {
  getConfiguration: () => ({
    get: (_key: string, defaultValue?: unknown) => defaultValue,
    update: async () => {},
    has: () => false,
    inspect: () => undefined,
  }),
  onDidChangeConfiguration: () => ({ dispose: () => {} }),
};

export const commands = {
  executeCommand: async () => undefined,
  registerCommand: () => ({ dispose: () => {} }),
};

export const window = {
  showWarningMessage: async () => undefined,
  showErrorMessage: async () => undefined,
  showInformationMessage: async () => undefined,
  activeTextEditor: undefined as unknown,
  createOutputChannel: () => ({
    appendLine: () => {},
    append: () => {},
    show: () => {},
    dispose: () => {},
    clear: () => {},
  }),
};

export const accessibility = {
  announce: async () => {},
};

export const env = {
  clipboard: {
    readText: async () => '',
    writeText: async () => {},
  },
};

export const Uri = {
  file: (path: string) => ({ fsPath: path, scheme: 'file', path }),
};

export enum ConfigurationTarget {
  Global = 1,
  Workspace = 2,
  WorkspaceFolder = 3,
}

export class EventEmitter<T = void> {
  private listeners: ((e: T) => unknown)[] = [];
  event = (listener: (e: T) => unknown) => {
    this.listeners.push(listener);
    return {
      dispose: () => {
        this.listeners = this.listeners.filter((l) => l !== listener);
      },
    };
  };
  fire(data: T) {
    this.listeners.forEach((l) => l(data));
  }
  dispose() {
    this.listeners = [];
  }
}

export class Disposable {
  constructor(private callOnDispose: () => void) {}
  dispose() {
    this.callOnDispose();
  }
  static from(...disposables: { dispose(): void }[]) {
    return new Disposable(() => disposables.forEach((d) => d.dispose()));
  }
}
