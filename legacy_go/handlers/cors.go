package handlers

import "net/http"

func CorsMiddleware(handle http.Handler, methods string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request){
        w.Header().Set("Content-Type", "application/json; charset=utf-8")
        w.Header().Set("Access-Control-Allow-Methods", methods)
        w.Header().Set("Access-Control-Allow-Origin", r.RemoteAddr)
        w.Header().Set("Access-Control-Allow-Headers", "*")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        handle.ServeHTTP(w, r)
    }
}

