// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { AlreadyReportedError } from '@rushstack/node-core-library';
import { Colorize, type ITerminal } from '@rushstack/terminal';
import {
  type ILogMessageCallbackOptions,
  LogMessageIdentifier,
  type LogMessageDetails,
  LogMessageKind
} from 'pnpm-sync-lib';

export function processLogMessage(options: ILogMessageCallbackOptions, terminal: ITerminal): void {
  const message: string = options.message;
  const details: LogMessageDetails = options.details;

  // Special formatting for interested messages
  switch (details.messageIdentifier) {
    case LogMessageIdentifier.PREPARE_FINISHING:
      terminal.writeVerboseLine(
        Colorize.cyan(`pnpm-sync: `) +
          `Regenerated .pnpm-sync.json in ${Math.round(details.executionTimeInMs)} ms`
      );
      return;

    case LogMessageIdentifier.COPY_FINISHING:
      {
        const customMessage: string =
          `Synced ${details.fileCount} ` +
          (details.fileCount === 1 ? 'file' : 'files') +
          ` in ${Math.round(details.executionTimeInMs)} ms`;

        terminal.writeVerboseLine(Colorize.cyan(`pnpm-sync: `) + customMessage);
      }
      return;
  }

  // Default handling for other messages
  switch (options.messageKind) {
    case LogMessageKind.ERROR:
      terminal.writeErrorLine(Colorize.red('ERROR: pnpm-sync: ' + message));
      throw new AlreadyReportedError();

    case LogMessageKind.WARNING:
      terminal.writeWarningLine(Colorize.yellow('pnpm-sync: ' + message));
      return;

    case LogMessageKind.INFO:
    case LogMessageKind.VERBOSE:
      terminal.writeDebugLine(Colorize.cyan(`pnpm-sync: `) + message);
      return;
  }
}
