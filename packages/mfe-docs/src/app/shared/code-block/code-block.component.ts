import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-code-block',
  standalone: true,
  template: `
    <div class="code-block">
      <div class="code-block-header">
        @if (filename) {
          <span class="code-filename">{{ filename }}</span>
        } @else {
          <span class="code-language">{{ language }}</span>
        }
        <button class="copy-btn" (click)="copy()">
          {{ copied() ? '✓ Copiado' : 'Copiar' }}
        </button>
      </div>
      <pre><code>{{ code }}</code></pre>
    </div>
  `,
  styleUrl: './code-block.component.scss',
})
export class CodeBlockComponent {
  @Input() code = '';
  @Input() filename = '';
  @Input() language = 'typescript';

  readonly copied = signal(false);

  copy(): void {
    navigator.clipboard.writeText(this.code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
