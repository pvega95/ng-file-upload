import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ],
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() progress;
  onChange: Function;
  private file: File | File[] = null;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    if (event.length > 1) {
      const files = [];
      for (const key of Object.keys(event)) {
        const value = event[key];
        files.push(event[key]);
      }
      this.onChange(files);
      this.file = files;
    } else {
      const file = event && event.item(0);
      this.onChange(file);
      this.file = file;
    }

  }

  constructor(private host: ElementRef<HTMLInputElement>) {
  }

  writeValue(value: null) {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
  }

}
