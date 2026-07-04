import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class Highlight {
  @Input() appHighlight = 'rgba(234, 179, 8, 0.25)'; // default translucent yellow for dark mode compatibility

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string | null) {
    if (color) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
    }
  }
}
