import { FormControl } from '@angular/forms';
import * as _ from 'lodash';

export function requiredFileType(type: string) {
  return function (control: FormControl) {
    console.log('control', control.value);
    const file = control.value;
    if (file) {

      if (_.isArray(file)) {

        for (const f of file) {
          const extension = f.name.split('.')[1].toLowerCase();
          if (type.toLowerCase() !== extension.toLowerCase()) {
            return {
              requiredFileType: true
            };
          }

          return null;
        }

      } else {

        const extension = file.name.split('.')[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }

    }

    return null;
  };
}
