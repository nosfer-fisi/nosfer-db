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

    empHandle := &handlers.GetEmployees{
        Db: db,
    }

    http.HandleFunc("/api/employees/", handlers.CorsMiddleware(empHandle, "GET"))
    http.ListenAndServe(":6969", nil)
}

