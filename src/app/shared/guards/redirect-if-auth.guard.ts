import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {STORAGE_KEY} from '@shared/enums/storage-keys';
import {SecuredStorage} from '@shared/service/secured-storage';

export const redirectIfAuthenticated: CanActivateFn = () => {
  const storage = inject(SecuredStorage);
  const router = inject(Router);
  const token = storage.retrieve<string>(STORAGE_KEY.TOKEN);

  if (token && token.trim().length > 0) {
    return router.createUrlTree(['/admin']);
  }
  return true;
};
