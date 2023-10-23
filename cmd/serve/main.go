package main

import (
	"log"
	"net/http"

	dbutils "nosfer-db/db"
	handlers "nosfer-db/handlers"
)


func main() {
    db, errCreate := dbutils.CreateDb()
    if errCreate != nil {
        log.Println(errCreate)
        return
    }

    empHandle := &handlers.EmployeesHandles{
        Db: db,
    }

    http.Handle("/api/employees/", empHandle)
    http.ListenAndServe(":6969", nil)
}






