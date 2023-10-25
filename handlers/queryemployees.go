package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	dbutils "nosfer-db/db"
)

type GetEmployees struct {
    Db *sql.DB
}

func (handle *GetEmployees) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    urlQuery := r.URL.Query()
    params := make([]dbutils.QueryParam, len(urlQuery))

    index := 0
    for key, value := range urlQuery {
        if dbutils.IsValidField(key) {
            params[index].ParamName = key
            if key == "id" {
                params[index].ParamType = dbutils.INT
            } else {
                params[index].ParamType = dbutils.STRING
            }

            params[index].ParamValue = value[0]
            index++
        }
    }

    employees, queryErr:= dbutils.QueryEmployees((*handle).Db, params)
    if queryErr != nil {
        log.Println(queryErr)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    resp, err := json.Marshal(employees)
    if err != nil {
        log.Println(err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    w.Write(resp)
    return
}

