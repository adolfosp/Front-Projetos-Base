import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';

const constants = {
  class: {
    DRAG_PLACEHOLDER: 'drag-placeholder',
    LIST_DRAG: 'list-drag',
    DRAGGING: 'dragging',
    HOST_DRAG: 'host-drag',
  },
};

@Directive({
  selector: '[listDraggable]',
})
export class ListDraggableDirective implements OnInit {
  private mouseDown = false;
  private dragItem?: HTMLElement;
  private dragPlaceholder?: HTMLElement;
  private initialX = 0;
  private initialY = 0;
  private xOffset = 0;
  private yOffset = 0;

  @HostListener('document:mousemove', ['$event'])
  onMove(ev: MouseEvent) {
    if (!this.mouseDown) {
      return;
    }

    if (!this.dragItem) {
      return;
    }

    const newY = ev.clientY - this.yOffset - window.scrollY;
    const newX = ev.clientX - this.xOffset - window.scrollX;
    this.dragItem.style.top = newY + 'px';
    this.dragItem.style.left = newX + 'px';
  }

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly host: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}
  ngOnInit(): void {
    this.init();
  }

  get list(): HTMLElement[] {
    return Array.from(this.host.nativeElement.children) as HTMLElement[];
  }

  private init() {
    const {
      class: { DRAG_PLACEHOLDER, LIST_DRAG, DRAGGING, HOST_DRAG },
    } = constants;

    const parent = this.host.nativeElement;
    parent.addEventListener('mousedown', ev => {
      const target = this.document.elementFromPoint(
        ev.clientX,
        ev.clientY
      ) as HTMLElement;

      if (target.classList.contains('list') && target.children.length === 0) {
        return;
      }

      this.initialY = target.offsetTop;
      this.initialX = target.offsetLeft;

      this.mouseDown = true;
      this.dragItem = target;

      if (this.dragItem) {
        parent.style.userSelect = 'none';
        this.dragItem.style.userSelect = 'none';

        const dragItemRect = this.dragItem.getBoundingClientRect();
        const startHeight = dragItemRect.height;
        const startWidth = dragItemRect.width;

        this.dragPlaceholder = this.document.createElement('div');
        this.dragPlaceholder.style.width = startWidth + 'px';
        this.dragPlaceholder.style.height = startHeight + 'px';
        this.dragPlaceholder.classList.add(DRAG_PLACEHOLDER);

        parent.insertBefore(this.dragPlaceholder, this.dragItem);
        parent.removeChild(this.dragItem);

        this.dragItem.classList.remove(LIST_DRAG);
        this.dragItem.classList.add(DRAGGING);

        this.dragItem.style.position = 'absolute';
        this.dragItem.style.top = this.initialY + 'px';
        this.dragItem.style.left = this.initialX + 'px';
        this.dragItem.style.width = startWidth + 'px';
        this.dragItem.style.height = startHeight + 'px';

        this.xOffset = ev.clientX - this.initialX - window.scrollX;
        this.yOffset = ev.clientY - this.initialY - window.scrollY;

        this.renderer.appendChild(this.document.body, this.dragItem);

        this.host.nativeElement.classList.add(HOST_DRAG);

        this.list.forEach(item => item.classList.add(LIST_DRAG));
      }
    });
  }
}
