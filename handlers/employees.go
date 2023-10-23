package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	dbutils "nosfer-db/db"
)

type EmployeesHandles struct {
    Db *sql.DB
}

func (handle *EmployeesHandles) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    employees, _:= dbutils.GetAllEmployees((*handle).Db)
    resp, err := json.Marshal(employees)
    if err != nil {
        log.Println(err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    w.Write(resp)
}



