import pc from 'picocolors';

export interface DiagnosticCheck {
  name: string;
  passed: boolean;
  message?: string;
}

export class DoctorRenderer {
  static render(checks: DiagnosticCheck[]): void {
    const passedCount = checks.filter((c) => c.passed).length;
    const total = checks.length;

    console.log(pc.bold(pc.cyan('\nCareerOS Engineering Environment Health Check\n')));
    console.log(pc.bold(`${passedCount}/${total} checks passed\n`));

    checks.forEach((check) => {
      if (check.passed) {
        console.log(`  ${pc.green('✔')} ${check.name}${check.message ? pc.dim(` (${check.message})`) : ''}`);
      } else {
        console.log(`  ${pc.red('✖')} ${check.name}${check.message ? pc.red(` — ${check.message}`) : ''}`);
      }
    });

    console.log();
  }
}
