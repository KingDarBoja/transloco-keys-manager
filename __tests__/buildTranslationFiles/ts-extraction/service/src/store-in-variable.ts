import { TranslocoService } from '@jsverse/transloco';
import { inject } from '@angular/core';
import { Observable, zip, switchMap, tap, map, of } from 'rxjs';
import { PermissionService } from './permission.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export function hasPermissionFactory(): Observable<string> {
  const permission = inject(PermissionService);
  const translate = inject(TranslocoService);
  const snackBarManager = inject(MatSnackBar);

  return permission.hasPermissions().pipe(
    switchMap((hasPermission) => {
      if (!hasPermission) {
        return zip([
          translate.selectTranslate('permission.snackbar.no-permission'),
          translate.selectTranslate('permission.snackbar.close'),
        ]).pipe(
          tap(([message, close]) => {
            snackBarManager.open(message, close, {
              duration: 3000,
              horizontalPosition: 'right',
            });
          }),
          map(() => false),
        );
      }
      return of(true);
    }),
  );
}
