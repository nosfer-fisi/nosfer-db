package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	dbutils "nosfer-db/db"
)

type AddEmployee struct {
    Db *sql.DB
}

func (handle *AddEmployee) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    var employee dbutils.Employee
    decodeErr := json.NewDecoder(r.Body).Decode(&employee)
    if decodeErr != nil {
        log.Println(decodeErr)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    dbutils.RegisterEmployee(handle.Db, employee)
    resp, err := json.Marshal(employee)
    if err != nil {
        log.Println(err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    w.Write(resp)
}

