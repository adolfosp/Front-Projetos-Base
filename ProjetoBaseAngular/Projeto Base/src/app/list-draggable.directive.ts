import {
  AnimationBuilder,
  AnimationMetadata,
  AnimationPlayer,
  animate,
  style,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

const constants = {
  direction: {
    UP: 'up',
    DOWN: 'down',
  },
  class: {
    DRAG_PLACEHOLDER: 'drag-placeholder',
    LIST_DRAG: 'list-drag',
    DRAGGING: 'dragging',
    HOST_DRAG: 'host-drag',
    HOST_RECEIVE: 'host-receive',
  },
  attribute: {
    LIST_DRAG: 'listDrag',
  },
};

@Directive({
  selector: '[listDraggable]',
  exportAs: 'listDraggable',
})
export class ListDraggableDirective implements OnInit {
  private mouseDown = false;

  private dragItem?: HTMLElement;

  private dragPlaceholder?: HTMLElement;

  private elementSize = 0;

  private previousTarget?: HTMLElement;

  private xOffset = 0;

  private yOffset = 0;

  private initialX = 0;

  private initialY = 0;

  @Input() connectedTo?: ListDraggableDirective;

  @HostListener('document:mouseup') onMouseUp() {
    const { HOST_DRAG, HOST_RECEIVE } = constants.class;
    if (this.host.nativeElement.classList.contains(HOST_RECEIVE)) {
      return;
    }

    if (this.mouseDown) {
      this.mouseDown = false;
    }

    if (!this.dragItem) {
      return;
    }

    const index = this.getDragPlaceholderIndex();

    const node = this.list[index];

    if (node) {
      const animation = this.animate(
        animate(
          '200ms',
          style({
            top: node?.offsetTop,
            left: node?.offsetLeft,
          })
        ),
        this.dragItem
      );

      animation.onDone(() => {
        animation.destroy();

        this.renderer.removeAttribute(this.dragPlaceholder, 'style');
        this.renderer.removeAttribute(this.dragPlaceholder, 'class');
        this.dragPlaceholder!.remove();

        const refChild = this.list[index];

        this.renderer.removeAttribute(this.dragItem, 'style');
        this.renderer.removeAttribute(this.dragItem, 'class');

        this.renderer.insertBefore(
          this.host.nativeElement,
          this.dragItem,
          refChild,
          true
        );

        this.list.forEach(
          (item) => (
            this.renderer.removeAttribute(item, 'class'),
            this.renderer.removeAttribute(item, 'style')
          )
        );

        this.renderer.removeAttribute(this.host.nativeElement, 'style');
        this.renderer.removeClass(this.host.nativeElement, HOST_DRAG);

        this.resetConnectedHost();
      });
    }
  }

  @HostListener('document:mousemove', ['$event']) onMove(ev: MouseEvent) {
    const { HOST_RECEIVE } = constants.class;

    if (this.host.nativeElement.classList.contains(HOST_RECEIVE)) {
      return;
    }

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

    if (!this.connectedTo?.host.nativeElement.children.length) {
      const hostReceive = this.document
        .elementsFromPoint(ev.clientX, ev.clientY)
        .filter((el) => el.classList.contains(HOST_RECEIVE))[0];

      if (hostReceive) {
        this.resetHost();
        this.initializeConnectedHost(null, true);
      }
    }

    const newTarget = document
      .elementsFromPoint(ev.clientX, ev.clientY)
      .find(
        (el) =>
          el.hasAttribute(constants.attribute.LIST_DRAG) &&
          !el.classList.contains(constants.class.DRAGGING)
      ) as HTMLDivElement;

    if (newTarget !== this.previousTarget) {
      this.previousTarget = newTarget;

      if (newTarget) {
        if (newTarget.closest('.host-receive')) {
          this.resetHost();
          this.initializeConnectedHost(newTarget);
        } else {
          const placeholderIndex = this.getDragPlaceholderIndex();
          const targetIndex = this.getIndex(newTarget);

          const direction =
            placeholderIndex > targetIndex
              ? constants.direction.UP
              : constants.direction.DOWN;

          this.dragOperation(targetIndex, placeholderIndex, direction);
        }
      }
    }
  }

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly host: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly builder: AnimationBuilder
  ) {}

  ngOnInit() {
    this.init();
  }

  private get list(): HTMLElement[] {
    return Array.from(this.host.nativeElement.children) as HTMLElement[];
  }

  private init() {
    const {
      class: { DRAG_PLACEHOLDER, LIST_DRAG, DRAGGING, HOST_DRAG, HOST_RECEIVE },
    } = constants;
    const parent = this.host.nativeElement;

    parent.addEventListener('mousedown', (ev) => {
      const target = this.document.elementFromPoint(
        ev.clientX,
        ev.clientY
      ) as HTMLElement;

      if (target.classList.contains('list') && target.children.length === 0) {
        return;
      }

      this.initialY = target.offsetTop;
      this.initialX = target.offsetLeft;

      if (this.connectedTo) {
        this.connectedTo.initialX = this.initialX;
        this.connectedTo.initialY = this.initialY;
      }

      this.mouseDown = true;
      this.elementSize = target.getBoundingClientRect().height;
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
        this.host.nativeElement.classList.add(HOST_DRAG);
        if (this.connectedTo) {
          this.connectedTo.host.nativeElement.classList.add(HOST_RECEIVE);
        }

        this.xOffset = ev.clientX - this.initialX - window.scrollX;
        this.yOffset = ev.clientY - this.initialY - window.scrollY;

        if (this.connectedTo) {
          this.connectedTo.xOffset = this.xOffset;
          this.connectedTo.yOffset = this.yOffset;
        }

        this.dragItem.style.position = 'absolute';
        this.dragItem.style.top = this.initialY + 'px';
        this.dragItem.style.left = this.initialX + 'px';
        this.dragItem.style.width = startWidth + 'px';
        this.dragItem.style.height = startHeight + 'px';
        this.renderer.appendChild(this.document.body, this.dragItem);

        this.list.forEach((item) => item.classList.add(LIST_DRAG));
      }
    });
  }

  private dragOperation(
    targetIndex: number,
    placeholderIndex: number,
    direction: string
  ) {
    const {
      class: { DRAG_PLACEHOLDER },
      direction: { UP },
    } = constants;

    const filtered = this.list.filter((item) => {
      const isDragPlaceholder = item.classList.contains(DRAG_PLACEHOLDER);

      const currentIndex = isDragPlaceholder
        ? this.getDragPlaceholderIndex()
        : this.getIndex(item);

      if (direction === UP) {
        return (
          currentIndex >= targetIndex &&
          currentIndex <= placeholderIndex &&
          !isDragPlaceholder
        );
      } else {
        return (
          currentIndex <= targetIndex &&
          currentIndex >= placeholderIndex &&
          !isDragPlaceholder
        );
      }
    });
    filtered.forEach((item) => {
      this.updateElementPosition(item, direction);
      this.updateDragPlaceholderPosition(direction);
    });
  }

  private getDragPlaceholderIndex(): number {
    const dragPlaceholderCurrentY = this.getTransform(this.dragPlaceholder!);

    let idx = this.list.indexOf(this.dragPlaceholder!);

    if (dragPlaceholderCurrentY <= -this.elementSize) {
      const translateStep =
        Math.abs(dragPlaceholderCurrentY) / this.elementSize;

      idx = idx - translateStep;
    }

    if (dragPlaceholderCurrentY >= this.elementSize) {
      idx = idx + dragPlaceholderCurrentY / this.elementSize;
    }

    return idx;
  }

  private getIndex(element: HTMLElement): number {
    const currentY = this.getTransform(element);

    let idx = this.list.indexOf(element);

    if (currentY === -this.elementSize) {
      idx--;
    }

    if (currentY === this.elementSize) {
      idx++;
    }

    return idx;
  }

  private updateElementPosition(element: HTMLElement, direction: string) {
    const currentY = this.getTransform(element);

    if (currentY === -this.elementSize) {
      element.style.transform = 'translateY(0px)';
    }

    if (currentY === 0) {
      element.style.transform = `translateY(${
        direction === 'down' ? -this.elementSize : this.elementSize
      }px)`;
    }

    if (currentY === this.elementSize) {
      element.style.transform = 'translateY(0px)';
    }
  }

  private updateDragPlaceholderPosition(direction: string) {
    const currentY = this.getTransform(this.dragPlaceholder!);

    if (Math.abs(currentY) > 0) {
      this.dragPlaceholder!.style.transform = `translateY(${
        direction === 'down'
          ? currentY + this.elementSize
          : currentY - this.elementSize
      }px)`;
    } else {
      this.dragPlaceholder!.style.transform = `translateY(${
        direction === 'down' ? this.elementSize : -this.elementSize
      }px)`;
    }
  }

  private animate(
    animationMetaData: AnimationMetadata | AnimationMetadata[],
    el: HTMLElement
  ): AnimationPlayer {
    const animation = this.builder.build(animationMetaData);
    const player = animation.create(el);
    player.play();

    return player;
  }

  private getTransform(element: HTMLElement): number {
    return Number(
      element.style.getPropertyValue('transform').replace(/[^0-9\-]/g, '')
    );
  }

  private initializeConnectedHost(
    target: HTMLElement | null = null,
    isListEmpty = false
  ) {
    const { DRAG_PLACEHOLDER, LIST_DRAG, HOST_DRAG, HOST_RECEIVE } =
      constants.class;

    const connectedParent = this.connectedTo!.host.nativeElement;
    connectedParent.style.userSelect = 'none';
    this.renderer.removeClass(connectedParent, HOST_RECEIVE);
    this.renderer.addClass(connectedParent, HOST_DRAG);
    this.connectedTo!.list.forEach((item) =>
      this.renderer.addClass(item, LIST_DRAG)
    );
    const dragItemRect = this.dragItem!.getBoundingClientRect();
    const startHeight = dragItemRect.height;
    const startWidth = dragItemRect.width;

    this.connectedTo!.dragPlaceholder = this.document.createElement('div');
    this.connectedTo!.dragPlaceholder.style.width = startWidth + 'px';
    this.connectedTo!.dragPlaceholder.style.height = startHeight + 'px';
    this.connectedTo!.dragPlaceholder.classList.add(DRAG_PLACEHOLDER);
    if (isListEmpty) {
      this.renderer.appendChild(
        connectedParent,
        this.connectedTo!.dragPlaceholder
      );
    } else {
      this.renderer.insertBefore(
        connectedParent,
        this.connectedTo!.dragPlaceholder,
        target,
        true
      );
    }

    this.connectedTo!.elementSize = this.elementSize;
    this.connectedTo!.dragItem = this.dragItem;
    this.connectedTo!.mouseDown = true;
  }

  private resetConnectedHost() {
    const connectedHost = this.connectedTo?.host?.nativeElement;
    const { HOST_RECEIVE, HOST_DRAG } = constants.class;
    if (this.connectedTo) {
      this.renderer.removeClass(connectedHost, HOST_RECEIVE);
    }

    if (this.connectedTo && this.connectedTo.mouseDown) {
      this.connectedTo.mouseDown = false;
      this.renderer.removeClass(connectedHost, HOST_RECEIVE);
      this.renderer.removeAttribute(this.connectedTo.dragPlaceholder, 'style');
      this.renderer.removeAttribute(this.connectedTo.dragPlaceholder, 'class');
      this.connectedTo.dragPlaceholder!.remove();
      this.renderer.removeAttribute(this.connectedTo.dragItem, 'style');
      this.renderer.removeAttribute(this.connectedTo.dragItem, 'class');
      this.connectedTo.list.forEach(
        (item) => (
          this.renderer.removeAttribute(item, 'class'),
          this.renderer.removeAttribute(item, 'style')
        )
      );
      this.renderer.removeAttribute(connectedHost, 'style');
      this.renderer.removeClass(connectedHost, HOST_DRAG);
      this.renderer.removeClass(connectedHost, HOST_RECEIVE);
    }
  }

  private resetHost() {
    const { HOST_RECEIVE, HOST_DRAG } = constants.class;
    this.renderer.removeAttribute(this.dragPlaceholder, 'style');
    this.renderer.removeAttribute(this.dragPlaceholder, 'class');
    this.dragPlaceholder!.remove();
    this.renderer.removeAttribute(this.host.nativeElement, 'style');
    this.renderer.removeClass(this.host.nativeElement, HOST_DRAG);
    this.renderer.addClass(this.host.nativeElement, HOST_RECEIVE);
    this.list.forEach(
      (item) => (
        this.renderer.removeAttribute(item, 'class'),
        this.renderer.removeAttribute(item, 'style')
      )
    );
  }
}
