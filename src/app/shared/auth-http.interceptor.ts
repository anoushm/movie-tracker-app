import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../enviroments/enviroments';

export const authHttpInterceptor: HttpInterceptorFn = (req, next) => {

    if (req.url.startsWith(environment.themoviedbBaseUrl)) {
        const modifiedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${environment.themoviedbApiReadAccessKey}`),
        });

        return next(modifiedReq);
    }

    return next(req);
};
