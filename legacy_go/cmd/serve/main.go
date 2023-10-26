package main

import (
	"log"
	"net/http"

	dbutils "nosfer-db/db"
	handlers "nosfer-db/handlers"
)


func main() {
    port := "6969"

    db, errCreate := dbutils.CreateDb()
    if errCreate != nil {
        log.Println(errCreate)
        return
    }

    empHandle := &handlers.GetEmployees{
        Db: db,
    }

    regHandle := &handlers.AddEmployee{
        Db: db,
    }

    http.HandleFunc("/api/employees/register", handlers.CorsMiddleware(regHandle, "POST"))
    http.HandleFunc("/api/employees/get", handlers.CorsMiddleware(empHandle, "GET"))
    log.Println("Starting server @ " + port)
    http.ListenAndServe(":" + port, nil)
}

