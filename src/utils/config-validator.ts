import { ExtensionConfig, LogLevel } from '../types/extension';
import type { ILogger } from '../types/extension';

export class ConfigValidator {
  public static validate(config: ExtensionConfig, logger: ILogger): ExtensionConfig {
    const validated = { ...config };

    // enabled: must be boolean, default true
    if (typeof validated.enabled !== 'boolean') {
      logger.warn('Invalid config: enabled must be boolean, defaulting to true');
      validated.enabled = true;
    }

    // minimumKeys: must be >= 1, default 2
    if (typeof validated.minimumKeys !== 'number' || validated.minimumKeys < 1) {
      logger.warn(`Invalid config: minimumKeys must be >= 1, defaulting to 2`);
      validated.minimumKeys = 2;
    } else {
      validated.minimumKeys = Math.floor(validated.minimumKeys); // ensure integer
    }

    // excludedCommands: must be string[], default []
    if (!Array.isArray(validated.excludedCommands)) {
      logger.warn('Invalid config: excludedCommands must be an array, defaulting to []');
      validated.excludedCommands = [];
    } else {
      validated.excludedCommands = validated.excludedCommands.filter(
        (cmd): cmd is string => typeof cmd === 'string',
      );
    }

    // showCommandName: must be boolean, default false
    if (typeof validated.showCommandName !== 'boolean') {
      logger.warn('Invalid config: showCommandName must be boolean, defaulting to false');
      validated.showCommandName = false;
    }

    // logLevel: must be valid LogLevel, default LogLevel.INFO
    const validLogLevels = Object.values(LogLevel).filter(
      (v): v is LogLevel => typeof v === 'number',
    );
    if (!validLogLevels.includes(validated.logLevel)) {
      logger.warn(`Invalid config: logLevel is invalid, defaulting to INFO`);
      validated.logLevel = LogLevel.INFO;
    }

    return validated;
  }
}
