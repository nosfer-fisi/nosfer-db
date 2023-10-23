package employees

import (
	"encoding/json"
	"log"
	"net/http"

	dbutils "nosfer-db/db"
)

func getAllEmployees() ([]dbutils.Employee, error) {
    newDb, dbErr := dbutils.CreateDb();
    if dbErr != nil {
        return []dbutils.Employee{}, dbErr
    }

    return []dbutils.Employee{}, nil
}

func HandleEmployees(w http.ResponseWriter, r *http.Request) {
    employees, _:= getAllEmployees()
    resp, err := json.Marshal(employees)
    if err != nil {
        log.Println(err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    w.Write(resp)
}



