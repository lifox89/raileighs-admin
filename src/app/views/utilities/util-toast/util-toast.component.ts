
import { ChangeDetectorRef, Component, ElementRef, forwardRef, Input, Renderer2 } from '@angular/core';
import { EventTypes } from "src/app/shared/constants/enum";
import { ToastComponent, ToasterService } from '@coreui/angular';

@Component({
  selector: 'app-util-toast',
  templateUrl: './util-toast.component.html',
  styleUrls: ['./util-toast.component.scss'],
  providers: [{ provide: ToastComponent, useExisting: forwardRef(() => UtilToastComponent) }]
})
export class UtilToastComponent extends ToastComponent {

  @Input() closeButton = true;
  @Input() title = '';
  @Input() message ='';

  constructor(
    public override hostElement: ElementRef,
    public override renderer: Renderer2,
    public override toasterService: ToasterService,
    public override changeDetectorRef: ChangeDetectorRef
  ) {
    super(hostElement, renderer, toasterService, changeDetectorRef);
  }


  getColor(){
    let hdr : string;
    switch (this.title) {
      case EventTypes.SUCCESS:
        hdr = 'toast-header-success';
        break;

      case EventTypes.ERROR:
        hdr = 'toast-header-error';
        break;
    }

    return hdr;
  }
}