import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,HttpInterceptorFn,
    HttpRequest
} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {STORAGE_KEY} from "@shared/enums/storage-keys";
import {MessageService} from "primeng/api";
import {SecuredStorage} from '@shared/service/secured-storage';

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authToken: string | null = inject(SecuredStorage).retrieve(STORAGE_KEY.TOKEN);
    let request: any = req;
    if (authToken) {
        request = req.clone({
            headers: req.headers.append('authorization', `Bearer ${authToken}`),
        });
    }
    return next(request);
}

export const auth401Interceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const storageService = inject(SecuredStorage);
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                storageService.logout();
                router.navigate(['/login']);
            }
            if (error.status === 403) {
                messageService.add({
                    severity: 'error',
                    summary: 'Permission Denied',
                    detail: 'You don\'t have permission to this model'
                });
            }
            return throwError(() => error);
        })
    );
};
