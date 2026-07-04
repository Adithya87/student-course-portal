import { ElementRef, Renderer2 } from '@angular/core';
import { Highlight } from './highlight';

describe('HighlightDirective', () => {
  it('should create an instance', () => {
    const mockEl = { nativeElement: document.createElement('div') } as ElementRef;
    const mockRenderer = jasmine.createSpyObj('Renderer2', ['setStyle', 'removeStyle']);
    const directive = new Highlight(mockEl, mockRenderer);
    expect(directive).toBeTruthy();
  });
});
