import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pipe } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { requiredFileType } from './upload-file-validators';
import * as _ from 'lodash';

export function uploadProgress<T>(cb: (progress: number) => void) {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress) {
      cb(Math.round((100 * event.loaded) / event.total));
    }
  });
}

export function toResponseBody<T>() {
  return pipe(
    filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
    map((res: HttpResponse<T>) => res.body)
  );
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  progress = 0;

  signup = new FormGroup({
    email: new FormControl('paulmax951@gmail.com', Validators.required),
    category: new FormControl('60ff58efa8d14836ff6de739'),
    name: new FormControl(`Producto ${Math.random() * 1000}`),
    sku: new FormControl(null),
    images: new FormControl(null, [Validators.required, requiredFileType(['png','jpg'])])
  });
  success = false;

  constructor(private http: HttpClient) {
  }


  submit() {
    this.success = false;
    if (!this.signup.valid) {
      markAllAsDirty(this.signup);
      return;
    }

    this.http.post('https://ecoomerce-nostos.herokuapp.com/product-management', toFormData(this.signup.value), {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      uploadProgress(progress => (this.progress = progress)),
      toResponseBody()
    ).subscribe(res => {
      this.progress = 0;
      this.success = true;
      this.signup.reset();
    });
  }

  hasError(field: string, error: string) {
    const control = this.signup.get(field);
    return control.dirty && control.hasError(error);
  }
}

export function markAllAsDirty(form: FormGroup) {
  for (const control of Object.keys(form.controls)) {
    form.controls[control].markAsDirty();
  }
}

export function toFormData<T>(formValue: T) {
  const formData = new FormData();

  for (const key of Object.keys(formValue)) {
    if (key === 'images' && _.isArray(formValue[key])) {
      for (const f of formValue[key]) {
        formData.append(key, f);
      }
    } else {
      const value = formValue[key];
      formData.append(key, value);
    }
  }

  return formData;
}
