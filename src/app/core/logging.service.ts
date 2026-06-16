import { Service } from '@angular/core';

@Service()
export class LoggingService {
  error(err: unknown): void {
    // Basic safe logging: attempt to stringify without exposing common secrets
    try {
      if (err && typeof err === 'object') {
        const copy = JSON.parse(JSON.stringify(err));
        // Mask common sensitive fields if present
        if (copy && typeof copy === 'object') {
          if ('password' in copy) (copy as any).password = '***';
          if ('token' in copy) (copy as any).token = '***';
        }
        console.error(copy);
        return;
      }
    } catch (e) {
      // fallthrough to default logging
    }

    console.error(err);
  }
}
