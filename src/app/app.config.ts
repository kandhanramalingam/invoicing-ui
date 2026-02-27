import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideFormlyCore } from '@ngx-formly/core';
import {withFormlyPrimeNG} from '@ngx-formly/primeng';
import {RadioGroupComponent} from '@shared/formly/radio-group/radio-group';
import {CheckboxGroupComponent} from '@shared/formly/checkbox-group/checkbox-group';
import {RatingComponent} from '@shared/formly/rating/rating';
import {DatePickerComponent} from '@shared/formly/datepicker/datepicker';
import {LatLongInputComponent} from '@shared/formly/lat-long-input/lat-long-input';
import {KeyValueWrapper} from '@shared/formly/key-value-wrapper/key-value-wrapper';
import {HeaderWrapper} from '@shared/formly/header-wrapper/header-wrapper';
import { ToggleInputComponent } from '@shared/formly/toggle-input/toggle-input';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig, withSessionStorage} from 'ngx-webstorage';
import {auth401Interceptor, tokenInterceptor} from '@shared/interceptors/auth-interceptors';
import {MessageService} from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideFormlyCore([
      ...withFormlyPrimeNG(),
      {
        types: [
          { name: 'radioGroup', component: RadioGroupComponent },
          { name: 'checkboxGroup', component: CheckboxGroupComponent },
          { name: 'rating', component: RatingComponent },
          { name: 'datepicker', component: DatePickerComponent },
          { name: 'lat-long', component: LatLongInputComponent },
          { name: 'toggle-input', component: ToggleInputComponent },
        ],
        wrappers: [
          { name: 'key-value', component: KeyValueWrapper },
          { name: 'header', component: HeaderWrapper },
        ],
      }
    ]),
    provideHttpClient(
      withInterceptors([auth401Interceptor, tokenInterceptor])
    ),
    provideNgxWebstorage(
      withNgxWebstorageConfig({prefix: 'sa', caseSensitive: true}),
      withLocalStorage(),
      withSessionStorage()
    ),
    MessageService
  ]
};
