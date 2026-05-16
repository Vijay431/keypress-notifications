import Module from 'module';

interface MockOutputChannel {
  appendLine(message: string): void;
  dispose(): void;
  show(): void;
}

const createOutputChannel = (_name: string): MockOutputChannel => ({
  appendLine: () => {},
  dispose: () => {},
  show: () => {},
});

const vscodeMock = {
  ConfigurationTarget: {
    Global: 1,
    Workspace: 2,
    WorkspaceFolder: 3,
  },
  Disposable: class {
    public constructor(private readonly disposeHandler: () => void = () => {}) {}

    public dispose(): void {
      this.disposeHandler();
    }
  },
  EventEmitter: class<T> {
    private listeners: Array<(event: T) => void> = [];

    public event = (listener: (event: T) => void) => {
      this.listeners.push(listener);
      return {
        dispose: () => {
          this.listeners = this.listeners.filter((candidate) => candidate !== listener);
        },
      };
    };

    public fire(event: T): void {
      this.listeners.forEach((listener) => listener(event));
    }

    public dispose(): void {
      this.listeners = [];
    }
  },
  Uri: {
    file: (path: string) => ({ fsPath: path, path, scheme: 'file', toString: () => path }),
  },
  accessibility: {
    say: () => {},
  },
  commands: {
    executeCommand: async () => undefined,
    registerCommand: () => ({ dispose: () => {} }),
  },
  window: {
    createOutputChannel,
    showErrorMessage: async () => undefined,
    showInformationMessage: async () => undefined,
  },
  workspace: {
    getConfiguration: () => ({
      get: (_key: string, defaultValue?: unknown) => defaultValue,
      update: async () => undefined,
    }),
    onDidChangeConfiguration: () => ({ dispose: () => {} }),
  },
};

type ModuleLoader = typeof Module & {
  _load(request: string, parent: NodeModule | null, isMain: boolean): unknown;
};

const moduleLoader = Module as ModuleLoader;
const originalLoad = moduleLoader._load;

moduleLoader._load = function loadWithVscodeMock(
  request: string,
  parent: NodeModule | null,
  isMain: boolean,
) {
  if (request === 'vscode') {
    return vscodeMock;
  }

  return originalLoad.call(this, request, parent, isMain);
};
